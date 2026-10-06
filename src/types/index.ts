export type UserRole = 'student' | 'officer' | 'recruiter' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface StudentSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
}

export interface StudentCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface StudentInternship {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  activeBacklogs: number;
  historyOfBacklogs: number;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
  resumeText: string;
  skills: StudentSkill[];
  projects: StudentProject[];
  certifications: StudentCertification[];
  internships: StudentInternship[];
  readinessScore: number;
  readinessBreakdown: {
    resume: number;
    skills: number;
    projects: number;
    communication: number;
    coding: number;
    interview: number;
  };
  xp: number;
  level: number;
  achievements: string[];
}

export interface Company {
  id: string;
  name: string;
  website: string;
  logo: string;
  industry: string;
  tier: 'Tier 1' | 'Tier 2' | 'Super Dream' | 'Dream';
  headquarters: string;
  description: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  roleType: 'Full-Time' | 'Internship' | 'Intern + FTE';
  packageLPA: string;
  minSalary: number;
  maxSalary: number;
  location: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  departments: string[];
  minCgpa: number;
  maxBacklogs: number;
  requiredSkills: string[];
  description: string;
  deadline: string;
  openings: number;
  status: 'Active' | 'Closed' | 'Upcoming';
}

export interface PlacementDrive {
  id: string;
  jobId: string;
  companyId: string;
  companyName: string;
  role: string;
  packageLPA: string;
  location: string;
  driveDate: string;
  minCgpa: number;
  maxBacklogs: number;
  requiredSkills: string[];
  eligibleDepartments: string[];
  graduationYear: number;
  eligibleStudentCount: number;
  ineligibleStudentCount: number;
  status: 'Scheduled' | 'In-Progress' | 'Completed';
}

export interface ApplicationStageHistory {
  stage: string;
  updatedAt: string;
  remarks: string;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentCgpa: number;
  companyName: string;
  jobTitle: string;
  packageLPA: string;
  currentStage: 'Applied' | 'Assessment' | 'Shortlisted' | 'Technical Interview' | 'HR Interview' | 'Selected' | 'Rejected';
  stageHistory: ApplicationStageHistory[];
  aiMatchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  interviewSchedule?: {
    date: string;
    time: string;
    meetingLink: string;
    interviewer: string;
  };
  appliedAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'drive' | 'interview' | 'status' | 'ai' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface ReadinessReport {
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

export interface ResumeAnalysis {
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

export interface JobMatchReport {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  matchTier: 'Exceptional' | 'Strong' | 'Moderate' | 'Low';
  rationale: string;
  recommendedPrep: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'System Design' | 'DSA' | 'Behavioral' | 'Project Deep Dive';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedKeyPoints: string[];
}

export interface InterviewEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  idealAnswerSample: string;
}
