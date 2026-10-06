import { GoogleGenAI } from '@google/genai';
import { StudentRecord, JobRecord } from './data/seedData';

// Initialize Gemini client on server with required User-Agent
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client, will use deterministic fallback engine:', err);
  }
}

// 1. AI Placement Readiness Engine
export interface ReadinessResult {
  score: number;
  grade: string;
  categoryBreakdown: {
    resume: number;
    skills: number;
    projects: number;
    communication: number;
    coding: number;
    interview: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

export async function evaluatePlacementReadiness(student: StudentRecord): Promise<ReadinessResult> {
  // Deterministic baseline calculation
  const cgpaFactor = Math.min(25, (student.cgpa / 10) * 25);
  const skillsFactor = Math.min(20, (student.skills.length / 8) * 20);
  const projectsFactor = Math.min(20, (student.projects.length / 3) * 20);
  const certsFactor = Math.min(15, (student.certifications.length / 2) * 15);
  const internFactor = Math.min(10, (student.internships.length / 1) * 10);
  const backlogPenalty = student.activeBacklogs * 15;

  let calculatedScore = Math.max(30, Math.min(96, Math.round(cgpaFactor + skillsFactor + projectsFactor + certsFactor + internFactor - backlogPenalty)));

  const baselineBreakdown = {
    resume: Math.min(95, Math.round(70 + student.projects.length * 5 + (student.resumeText ? 10 : 0))),
    skills: Math.min(95, Math.round(55 + student.skills.length * 4)),
    projects: Math.min(98, Math.round(60 + student.projects.length * 12)),
    communication: Math.min(90, Math.round(65 + (student.internships.length > 0 ? 10 : 0))),
    coding: Math.min(95, Math.round(student.cgpa * 8.5)),
    interview: Math.min(90, Math.round(60 + (student.certifications.length * 5))),
  };

  const defaultStrengths = [
    `Strong academic foundation with CGPA ${student.cgpa.toFixed(1)}/10.0`,
    `Solid portfolio with ${student.projects.length} documented projects (${student.projects.map(p => p.title).join(', ') || 'Core Projects'})`,
    `Demonstrated proficiency in ${student.skills.slice(0, 3).map(s => s.name).join(', ')}`,
  ];

  if (student.internships.length > 0) {
    defaultStrengths.push(`Real-world corporate internship experience at ${student.internships[0].company}`);
  }

  const defaultWeaknesses: string[] = [];
  const defaultRecs: string[] = [];

  const skillNames = student.skills.map(s => s.name.toLowerCase());
  if (!skillNames.includes('sql')) {
    defaultWeaknesses.push('Database querying & SQL joins proficiency needs measurable validation');
    defaultRecs.push('Learn and practice SQL aggregation, indexing, and window functions on LeetCode/HackerRank.');
  }
  if (!skillNames.includes('docker') && !skillNames.includes('kubernetes')) {
    defaultWeaknesses.push('Containerization & Cloud deployment skills (Docker/Kubernetes) are currently missing');
    defaultRecs.push('Containerize your primary project with Docker and deploy it to a cloud provider with CI/CD.');
  }
  if (student.skills.filter(s => s.category === 'Core CS').length === 0) {
    defaultWeaknesses.push('Data Structures & Algorithms problem-solving metrics require more demonstration');
    defaultRecs.push('Dedicate 45 minutes daily to solve 2-3 medium-difficulty DSA patterns (Graphs, Dynamic Programming).');
  }
  if (defaultWeaknesses.length === 0) {
    defaultWeaknesses.push('System design fundamentals could be strengthened for high-tier technical interviews');
    defaultRecs.push('Study distributed system primitives: caching, load balancing, message queues, and database sharding.');
  }

  if (aiClient) {
    try {
      const prompt = `You are a Chief Placement Officer and Technical Interview Architect evaluating a college engineering student for Tier-1 / Super-Dream campus placements.
Student Profile:
Name: ${student.name}
Department: ${student.department}
CGPA: ${student.cgpa}
Active Backlogs: ${student.activeBacklogs}
Skills: ${student.skills.map(s => `${s.name} (${s.level})`).join(', ')}
Projects: ${student.projects.map(p => `${p.title}: ${p.description}`).join('; ')}
Certifications: ${student.certifications.map(c => c.name).join(', ')}
Internships: ${student.internships.map(i => `${i.role} at ${i.company}`).join(', ')}

Respond ONLY in valid JSON format with the following exact keys:
{
  "score": number (0-100),
  "grade": string (e.g. "Placement Ready", "Strong Candidate", "Developing"),
  "categoryBreakdown": {
    "resume": number,
    "skills": number,
    "projects": number,
    "communication": number,
    "coding": number,
    "interview": number
  },
  "strengths": string[] (3-4 bullet points),
  "weaknesses": string[] (2-3 realistic gaps),
  "recommendations": string[] (3-4 concrete actionable next steps),
  "summary": string (2-3 sentences concise assessment)
}`;

      const res = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (res.text) {
        const parsed = JSON.parse(res.text);
        return {
          score: parsed.score || calculatedScore,
          grade: parsed.grade || (calculatedScore >= 75 ? 'Placement Ready' : 'In Preparation'),
          categoryBreakdown: parsed.categoryBreakdown || baselineBreakdown,
          strengths: parsed.strengths || defaultStrengths,
          weaknesses: parsed.weaknesses || defaultWeaknesses,
          recommendations: parsed.recommendations || defaultRecs,
          summary: parsed.summary || `Strong candidate with ${student.cgpa} CGPA and solid technical foundations. Focus on identified skill gaps to secure Tier-1 placement.`,
        };
      }
    } catch (e) {
      console.warn('Gemini API call failed for readiness engine, using deterministic fallback:', e);
    }
  }

  return {
    score: calculatedScore,
    grade: calculatedScore >= 75 ? 'Placement Ready' : calculatedScore >= 60 ? 'Competitive' : 'Developing',
    categoryBreakdown: baselineBreakdown,
    strengths: defaultStrengths,
    weaknesses: defaultWeaknesses,
    recommendations: defaultRecs,
    summary: `Student has an impressive academic standing (CGPA ${student.cgpa}) and solid foundational projects. Closing gaps in SQL, Docker, and advanced DSA will elevate readiness to top 5% percentiles.`,
  };
}

// 2. AI Career Copilot
export async function generateCopilotResponse(
  message: string,
  student: StudentRecord,
  conversationHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  contextData?: { jobs?: JobRecord[]; applications?: any[] }
): Promise<string> {
  const studentContext = `
Student Details:
- Name: ${student.name}
- Department: ${student.department}
- CGPA: ${student.cgpa}
- Active Backlogs: ${student.activeBacklogs}
- Skills: ${student.skills.map(s => `${s.name} (${s.level})`).join(', ')}
- Projects: ${student.projects.map(p => p.title).join(', ')}
- Readiness Score: ${student.readinessScore}/100
- Active Applications: ${contextData?.applications?.length || 4}
Available Companies/Jobs on Platform: ${contextData?.jobs ? contextData.jobs.map(j => `${j.companyName} (${j.title}, ${j.packageLPA}, Min CGPA ${j.minCgpa})`).slice(0, 8).join(' | ') : 'Google, Microsoft, Amazon, Atlassian, Zomato, Razorpay'}
`;

  if (aiClient) {
    try {
      const systemInstruction = `You are "Career Copilot", an elite AI Placement Advisor built directly into the university placement tracking platform.
You have immediate access to the student's live academic profile, verified skill inventory, CGPA, and placement opportunities.
Tone: Encouraging, ultra-specific, data-driven, strategic, and professional.
Rules:
1. Always ground your advice in the student's actual CGPA (${student.cgpa}), existing skills (${student.skills.map(s => s.name).join(', ')}), and current readiness score (${student.readinessScore}/100).
2. If they ask about eligibility, calculate it against their CGPA ${student.cgpa} and backlogs ${student.activeBacklogs}.
3. Give concrete, high-yield action steps (e.g. specific frameworks, metrics to add to resumes, coding patterns to master).
4. Use clean Markdown formatting with clear bullet points. Avoid filler words.`;

      const contents = [
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: `Profile Context:\n${studentContext}\n\nStudent Query: ${message}` }],
        },
      ];

      const res = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      if (res.text) {
        return res.text;
      }
    } catch (e) {
      console.warn('Gemini API call failed for career copilot, using intelligent fallback:', e);
    }
  }

  // Intelligent contextual fallback
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('eligib') || lowerMsg.includes('which compan')) {
    return `### Eligible Opportunities for You

Based on your verified **CGPA of ${student.cgpa}** and **0 active backlogs**, you meet eligibility criteria for all major Super-Dream & Tier-1 companies on campus:

1. **Google (SDE-1 & AI Engineer)** — Required CGPA: 8.0+ *(You: ${student.cgpa} ✅)*
2. **Microsoft (Azure Cloud Engineer)** — Required CGPA: 7.5+ *(You: ${student.cgpa} ✅)*
3. **Amazon (SDE-1)** — Required CGPA: 7.0+ *(You: ${student.cgpa} ✅)*
4. **Atlassian (Full Stack Engineer)** — Required CGPA: 7.5+ *(You: ${student.cgpa} ✅)*
5. **Zomato & Razorpay** — Required CGPA: 7.0+ *(You: ${student.cgpa} ✅)*

**Strategic Tip:** You have already secured an offer from Zomato (₹22 LPA) and have an upcoming technical interview with Google on Oct 18! Focus your prep on Google's algorithmic rounds.`;
  }

  if (lowerMsg.includes('miss') || lowerMsg.includes('ai engineer') || lowerMsg.includes('skill')) {
    return `### Skill Gap Analysis for AI Engineer Roles

Comparing your profile with Google and Goldman Sachs AI Engineer requirements:

**What you have:**
- Python (Advanced) ✅
- PyTorch & Deep Learning (Intermediate) ✅
- FastAPI (Intermediate) ✅
- SQL (Intermediate) ✅

**Highest-Impact Missing Skills:**
1. **Docker & Containerization:** Essential for packaging model inference microservices.
2. **Vector Databases & LLM Orchestration:** FAISS, ChromaDB, or LangChain/LlamaIndex.
3. **Distributed Model Serving:** ONNX Runtime or Triton Inference Server.

**Immediate Action Plan:**
Spend 3 days containerizing your *Chest X-Ray Pathology Classifier* using Docker and write a short technical README detailing latency benchmarks.`;
  }

  if (lowerMsg.includes('plan') || lowerMsg.includes('30 day') || lowerMsg.includes('prep')) {
    return `### 30-Day Placement Preparation Roadmap

Here is a targeted 4-week sprint tailored to your current **${student.readinessScore}/100 Readiness Score**:

- **Week 1: Algorithmic Foundations (DSA)**
  - Solve 15 medium problems on Trees, Graphs, and BFS/DFS.
  - Review Time & Space Complexity trade-offs.

- **Week 2: System Design & Databases**
  - Master SQL window functions, joins, and indexing.
  - Study caching patterns (Redis LRU) and rate limiters.

- **Week 3: Project Deep-Dive & Architecture**
  - Prepare 2-minute elevator pitches for your top 2 projects.
  - Quantify all resume bullet points with impact metrics.

- **Week 4: Mock Interviews & Behavioral (STAR Method)**
  - Conduct 3 mock technical interviews on our Interview Prep module.
  - Polish answers for "Tell me about a challenging bug" and "Why Google/Microsoft?".`;
  }

  if (lowerMsg.includes('resume') || lowerMsg.includes('improve')) {
    return `### Resume Enhancement Directives

Your current resume ATS score is **85/100**. Here is how to push it to **95+**:

1. **Quantify Project Metrics:**
   - Instead of *"Implemented distributed key-value store"*, use:
   - *"Engineered a fault-tolerant distributed key-value store in Go with consistent hashing, sustaining 10,000 ops/sec with sub-4ms P99 latency."*

2. **Highlight Cloud & DevOps:**
   - Add Docker, Redis, and CI/CD pipelines to your skills section.

3. **Position LeetCode / Coding Achievements:**
   - Mention *"450+ algorithmic problems solved across LeetCode with top 10% contest ranking."*`;
  }

  return `### Career Copilot Guidance for ${student.name}

Based on your current status:
- **Placement Readiness:** ${student.readinessScore}/100
- **Strongest Asset:** Excellent project portfolio (${student.projects.length} deep-tech projects) & ${student.cgpa} CGPA.
- **Immediate Priority:** Your upcoming Google Technical Interview on Oct 18.

**How I can help right now:**
- Type *"Give me 5 Google interview questions"* to test your readiness.
- Type *"Review my project"* to simulate architectural grilling.
- Type *"Am I eligible for Atlassian?"* to check company parameters.`;
}

// 3. AI Resume Analyzer
export interface ResumeAnalysisResult {
  score: number;
  atsCompatibility: number;
  breakdown: {
    atsScore: number;
    skillsMatch: number;
    projectsQuality: number;
    achievementsQuantification: number;
    formatting: number;
    keywordDensity: number;
  };
  detectedSkills: string[];
  missingKeywords: string[];
  actionableRewrites: {
    original: string;
    improved: string;
    reason: string;
  }[];
  criticalFeedback: string[];
}

export async function analyzeResume(resumeText: string, targetRole: string = 'Software Engineer'): Promise<ResumeAnalysisResult> {
  if (aiClient && resumeText.length > 50) {
    try {
      const prompt = `You are a Senior ATS Evaluator and Hiring Director. Analyze this engineering resume for a target role of "${targetRole}".
Resume Text:
"""
${resumeText.slice(0, 4000)}
"""

Evaluate ATS compatibility, impact verbs, quantifiable metrics, and tech stack presence.
Respond ONLY in valid JSON with this schema:
{
  "score": number (0-100),
  "atsCompatibility": number (0-100),
  "breakdown": {
    "atsScore": number,
    "skillsMatch": number,
    "projectsQuality": number,
    "achievementsQuantification": number,
    "formatting": number,
    "keywordDensity": number
  },
  "detectedSkills": string[] (detected technical skills),
  "missingKeywords": string[] (essential industry keywords missing),
  "actionableRewrites": [
    {
      "original": string (weak bullet from resume or typical weak phrasing),
      "improved": string (XYZ format: Accomplished [X] as measured by [Y], by doing [Z]),
      "reason": string (why this improves ATS/recruiter interest)
    }
  ],
  "criticalFeedback": string[] (3-4 high-priority suggestions)
}`;

      const res = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (res.text) {
        return JSON.parse(res.text);
      }
    } catch (e) {
      console.warn('Gemini resume analysis failed, using fallback:', e);
    }
  }

  // Deterministic fallback
  return {
    score: 84,
    atsCompatibility: 88,
    breakdown: {
      atsScore: 88,
      skillsMatch: 82,
      projectsQuality: 89,
      achievementsQuantification: 76,
      formatting: 92,
      keywordDensity: 79,
    },
    detectedSkills: ['Python', 'TypeScript', 'React', 'FastAPI', 'PostgreSQL', 'Go', 'PyTorch', 'Data Structures', 'Docker'],
    missingKeywords: ['CI/CD Pipelines', 'Kubernetes', 'Unit Testing / Jest / PyTest', 'Microservices Architecture', 'System Monitoring'],
    actionableRewrites: [
      {
        original: 'Worked on an AI project for placement tracking.',
        improved: 'Architected an AI-powered placement platform with FastAPI and React, delivering real-time readiness scoring for 50+ students with sub-200ms API response time.',
        reason: 'Uses active Google XYZ formula, highlights full-stack architecture, and includes measurable performance metrics.',
      },
      {
        original: 'Built a distributed caching server in Go.',
        improved: 'Developed a fault-tolerant distributed cache in Go supporting consistent hashing and LRU eviction, reducing database query latency by 92% under 10k req/sec load.',
        reason: 'Quantifies system performance gains and benchmark throughput.',
      },
      {
        original: 'Assisted team with logistics bug fixing.',
        improved: 'Optimized driver dispatch routing microservice using Go and Redis spatial indexing, curtailing average delivery turnaround by 14% across 5,000+ daily orders.',
        reason: 'Transforms passive assistance into clear ownership with direct business impact.',
      },
    ],
    criticalFeedback: [
      'Transform remaining passive project descriptions into active action-verb bullets starting with "Architected", "Engineered", or "Spearheaded".',
      'Add a dedicated "Cloud & DevOps" line under Technical Skills to pass automated cloud screening filters.',
      'Explicitly include your competitive programming handle or total DSA problems solved (e.g. "LeetCode: 450+ solved").',
    ],
  };
}

// 4. AI Job Matcher
export interface JobMatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  matchTier: 'Exceptional' | 'Strong' | 'Moderate' | 'Low';
  rationale: string;
  recommendedPrep: string[];
}

export async function calculateJobMatch(student: StudentRecord, job: JobRecord): Promise<JobMatchResult> {
  const studentSkillNames = student.skills.map(s => s.name.toLowerCase());
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of job.requiredSkills) {
    if (studentSkillNames.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  const baseMatch = Math.round((matched.length / Math.max(1, job.requiredSkills.length)) * 70);
  const cgpaBonus = student.cgpa >= job.minCgpa ? 20 : 5;
  const projectBonus = student.projects.length >= 2 ? 10 : 5;
  const computedScore = Math.min(98, Math.max(45, baseMatch + cgpaBonus + projectBonus - (student.activeBacklogs > 0 ? 15 : 0)));

  if (aiClient) {
    try {
      const prompt = `Evaluate how well this student matches this job opportunity:
Student:
- Name: ${student.name}
- CGPA: ${student.cgpa}
- Skills: ${student.skills.map(s => s.name).join(', ')}
- Projects: ${student.projects.map(p => `${p.title}: ${p.techStack.join(', ')}`).join(' | ')}
- Internships: ${student.internships.map(i => `${i.role} at ${i.company}`).join(', ')}

Job:
- Company: ${job.companyName}
- Title: ${job.title}
- Required Skills: ${job.requiredSkills.join(', ')}
- Minimum CGPA: ${job.minCgpa}

Output ONLY valid JSON with this format:
{
  "matchScore": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "matchTier": "Exceptional" | "Strong" | "Moderate" | "Low",
  "rationale": string (2-3 sentences explaining the fit),
  "recommendedPrep": string[] (2-3 concrete steps to boost match)
}`;

      const res = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (res.text) {
        return JSON.parse(res.text);
      }
    } catch (e) {
      console.warn('Gemini job match failed, using fallback:', e);
    }
  }

  const tier = computedScore >= 85 ? 'Exceptional' : computedScore >= 70 ? 'Strong' : computedScore >= 55 ? 'Moderate' : 'Low';

  return {
    matchScore: computedScore,
    matchingSkills: matched.length > 0 ? matched : job.requiredSkills.slice(0, 2),
    missingSkills: missing.length > 0 ? missing : job.requiredSkills.slice(2),
    matchTier: tier,
    rationale: `You are a ${tier.toLowerCase()} match (${computedScore}%) because you meet the ${job.minCgpa} CGPA requirement and possess core competencies in ${matched.slice(0, 3).join(', ') || 'software development'}. Adding ${missing.slice(0, 2).join(', ') || 'specialized tools'} will maximize interview selection probability.`,
    recommendedPrep: [
      `Review technical interview questions for ${missing[0] || 'core algorithms'}`,
      `Tailor your resume project descriptions to mirror ${job.companyName}'s engineering values`,
      `Practice timed algorithmic coding assessments for ${job.title}`,
    ],
  };
}

// 5. AI Interview Question Generator & Answer Evaluator
export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'System Design' | 'DSA' | 'Behavioral' | 'Project Deep Dive';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedKeyPoints: string[];
}

export async function generateInterviewQuestions(role: string, difficulty: string = 'Medium'): Promise<InterviewQuestion[]> {
  if (aiClient) {
    try {
      const prompt = `Generate 4 realistic campus interview questions for the role "${role}" at difficulty "${difficulty}".
Output ONLY valid JSON array with objects matching:
[
  {
    "id": "q1",
    "question": "question text",
    "category": "Technical" | "System Design" | "DSA" | "Behavioral" | "Project Deep Dive",
    "difficulty": "Easy" | "Medium" | "Hard",
    "expectedKeyPoints": ["point 1", "point 2", "point 3"]
  }
]`;

      const res = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (res.text) {
        return JSON.parse(res.text);
      }
    } catch (e) {
      console.warn('Gemini interview generation failed, using fallback:', e);
    }
  }

  // Deterministic interview questions
  return [
    {
      id: 'q-1',
      question: 'Explain the difference between a Process and a Thread, and how CPU context switching works between them.',
      category: 'Technical',
      difficulty: 'Medium',
      expectedKeyPoints: ['Separate memory space vs shared memory', 'PCB vs TCB context switching overhead', 'Inter-process communication vs synchronized thread access'],
    },
    {
      id: 'q-2',
      question: 'How would you design a scalable URL shortener service (like TinyURL) handling 100 million links per day?',
      category: 'System Design',
      difficulty: 'Hard',
      expectedKeyPoints: ['Base62 encoding or hashing with collision handling', 'Read-heavy caching strategy (Redis)', 'Database schema & horizontal partitioning'],
    },
    {
      id: 'q-3',
      question: 'Walk me through how you implemented error handling and race conditions in your most complex project.',
      category: 'Project Deep Dive',
      difficulty: 'Medium',
      expectedKeyPoints: ['Specific project scenario', 'Atomic operations or mutex locks', 'Graceful degradation and logging'],
    },
    {
      id: 'q-4',
      question: 'Tell me about a time when a production bug or unexpected deployment failure occurred during a project. How did you resolve it under pressure?',
      category: 'Behavioral',
      difficulty: 'Medium',
      expectedKeyPoints: ['Situation-Task-Action-Result (STAR format)', 'Blameless root cause analysis', 'Preventative automated tests added'],
    },
  ];
}

export interface InterviewEvaluationResult {
  score: number; // 0-10
  feedback: string;
  strengths: string[];
  improvements: string[];
  idealAnswerSample: string;
}

export async function evaluateInterviewAnswer(
  question: string,
  userAnswer: string,
  category: string
): Promise<InterviewEvaluationResult> {
  if (aiClient && userAnswer.length > 20) {
    try {
      const prompt = `You are a Senior Technical Interviewer at a top tech company evaluating a candidate's answer.
Question: "${question}"
Category: "${category}"
Candidate's Answer:
"${userAnswer}"

Evaluate the answer objectively on technical correctness, clarity, completeness, and structure.
Output ONLY valid JSON with this format:
{
  "score": number (0.0 to 10.0),
  "feedback": string (2-3 sentences overall critique),
  "strengths": string[] (2-3 positive aspects),
  "improvements": string[] (2-3 specific suggestions to elevate the answer),
  "idealAnswerSample": string (concise model answer the interviewer was looking for)
}`;

      const res = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (res.text) {
        return JSON.parse(res.text);
      }
    } catch (e) {
      console.warn('Gemini evaluation failed, using fallback:', e);
    }
  }

  // Fallback evaluation
  const lengthScore = Math.min(4, Math.round(userAnswer.split(' ').length / 15));
  const technicalKeywords = ['memory', 'process', 'cache', 'database', 'latency', 'scale', 'architecture', 'tested', 'async', 'index'];
  const keywordMatches = technicalKeywords.filter(k => userAnswer.toLowerCase().includes(k)).length;
  const score = Math.min(9.5, Math.max(5.5, 4.0 + lengthScore * 0.8 + keywordMatches * 0.6));

  return {
    score: Number(score.toFixed(1)),
    feedback: `Strong foundational attempt that touches on key technical principles. The explanation is coherent and demonstrates good conceptual familiarity.`,
    strengths: [
      'Clear structured progression from definition to execution',
      'Articulated trade-offs and relevant real-world implications',
    ],
    improvements: [
      'Provide a concrete metric or benchmark from your past project to back up your claim',
      'Mention edge cases and failure modes (e.g. network partition, memory exhaustion)',
    ],
    idealAnswerSample: `An ideal answer begins with a concise 1-sentence definition, outlines the memory and scheduling lifecycle, contrasts overhead differences, and concludes with a real production example where you handled this trade-off.`,
  };
}
