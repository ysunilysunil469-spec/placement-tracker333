import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db';
import {
  evaluatePlacementReadiness,
  generateCopilotResponse,
  analyzeResume,
  calculateJobMatch,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
} from './server/aiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple Auth Helper
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Default to demo student if no token provided in development
    const defaultUser = db.getUserByEmail('student@placementai.com');
    (req as any).user = defaultUser;
    return next();
  }

  // Token is simply user id for seamless demo
  const user = db.getUserById(token) || db.getUserByEmail(token);
  if (user) {
    (req as any).user = user;
  } else {
    (req as any).user = db.getUserByEmail('student@placementai.com');
  }
  next();
}

// ================= API ROUTES =================

// Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'User not found with this email' });
  }

  // Check password (allows Demo@123 or matches passwordHash)
  if (password && user.passwordHash && user.passwordHash !== password && password !== 'Demo@123') {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const student = user.role === 'student' ? db.getStudentByUserId(user.id) : null;

  res.json({
    token: user.id,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
    student,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role = 'student', department = 'Computer Science', cgpa = 7.5 } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUserId = `usr-${Date.now()}`;
  const newUser = db.createUser({
    id: newUserId,
    email,
    passwordHash: password,
    role,
    name,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  });

  let newStudent = null;
  if (role === 'student') {
    const newStudentId = `std-${Date.now()}`;
    newStudent = db.createStudent({
      id: newStudentId,
      userId: newUserId,
      name,
      email,
      phone: '+91 98765 00000',
      rollNumber: `23${department.slice(0, 2).toUpperCase()}0999`,
      department,
      graduationYear: 2027,
      cgpa: Number(cgpa) || 7.5,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      bio: 'Enthusiastic engineering student preparing for campus placements.',
      location: 'Bangalore, India',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      resumeUrl: '',
      resumeText: `${name} | ${email} | ${department} | CGPA: ${cgpa}`,
      skills: [
        { name: 'Python', level: 'Intermediate', category: 'Backend' },
        { name: 'Data Structures', level: 'Intermediate', category: 'Core CS' },
        { name: 'SQL', level: 'Intermediate', category: 'Database' },
      ],
      projects: [],
      certifications: [],
      internships: [],
      readinessScore: 68,
      readinessBreakdown: {
        resume: 65,
        skills: 68,
        projects: 60,
        communication: 70,
        coding: 72,
        interview: 64,
      },
      xp: 250,
      level: 1,
      achievements: ['Welcome to Placement Tracker AI'],
      createdAt: new Date().toISOString(),
    });
  }

  db.addActivity({
    id: `act-${Date.now()}`,
    actor: name,
    action: `joined the platform as a`,
    target: role.toUpperCase(),
    timestamp: 'Just now',
  });

  res.json({
    token: newUser.id,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
    },
    student: newStudent,
  });
});

app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const student = user.role === 'student' ? db.getStudentByUserId(user.id) : null;
  res.json({ user, student });
});

// Students
app.get('/api/students', (req: Request, res: Response) => {
  const { department, search, minCgpa } = req.query;
  let students = db.getAllStudents();

  if (department && department !== 'All') {
    students = students.filter(s => s.department === department);
  }

  if (minCgpa) {
    students = students.filter(s => s.cgpa >= Number(minCgpa));
  }

  if (search) {
    const q = String(search).toLowerCase();
    students = students.filter(
      s => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }

  res.json(students);
});

app.get('/api/students/me', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const student = db.getStudentByUserId(user.id);
  if (!student) {
    return res.status(404).json({ error: 'Student record not found' });
  }
  res.json(student);
});

app.get('/api/students/:id', (req: Request, res: Response) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

app.put('/api/students/me', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const student = db.getStudentByUserId(user.id);
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  // Update profile data
  const updated = db.updateStudent(student.id, req.body);

  // Recalculate readiness score automatically upon profile update
  if (updated) {
    try {
      const newReadiness = await evaluatePlacementReadiness(updated);
      updated.readinessScore = newReadiness.score;
      updated.readinessBreakdown = newReadiness.categoryBreakdown;
      db.updateStudent(student.id, {
        readinessScore: newReadiness.score,
        readinessBreakdown: newReadiness.categoryBreakdown,
      });
    } catch (e) {
      console.warn('Could not re-evaluate readiness on update:', e);
    }
  }

  res.json(updated);
});

// Companies
app.get('/api/companies', (_req: Request, res: Response) => {
  res.json(db.getAllCompanies());
});

app.post('/api/companies', (req: Request, res: Response) => {
  const { name, industry, headquarters, description, website, tier = 'Tier 1' } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const newCompany = db.createCompany({
    id: `comp-${Date.now()}`,
    name,
    industry: industry || 'Technology',
    headquarters: headquarters || 'Bangalore, India',
    description: description || 'Pioneering technology leader hiring top campus engineering talent.',
    website: website || 'https://example.com',
    tier,
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  });

  res.json(newCompany);
});

// Jobs
app.get('/api/jobs', (req: Request, res: Response) => {
  const { department, roleType, minSalary, search } = req.query;
  let jobs = db.getAllJobs();

  if (department && department !== 'All') {
    jobs = jobs.filter(j => j.departments.includes(String(department)));
  }

  if (roleType && roleType !== 'All') {
    jobs = jobs.filter(j => j.roleType === roleType);
  }

  if (minSalary) {
    jobs = jobs.filter(j => j.minSalary >= Number(minSalary));
  }

  if (search) {
    const q = String(search).toLowerCase();
    jobs = jobs.filter(
      j => j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q) || j.requiredSkills.some(s => s.toLowerCase().includes(q))
    );
  }

  res.json(jobs);
});

app.get('/api/jobs/:id', (req: Request, res: Response) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

app.post('/api/jobs', (req: Request, res: Response) => {
  const { companyId, title, packageLPA, minSalary = 8, maxSalary = 12, location = 'Bangalore', roleType = 'Full-Time', departments = ['Computer Science'], minCgpa = 7.0, maxBacklogs = 0, requiredSkills = ['Python', 'SQL'], description = '' } = req.body;

  const company = db.getCompanyById(companyId) || db.getAllCompanies()[0];

  const newJob = db.createJob({
    id: `job-${Date.now()}`,
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.logo,
    title,
    roleType,
    packageLPA: packageLPA || `₹${minSalary}–${maxSalary} LPA`,
    minSalary: Number(minSalary),
    maxSalary: Number(maxSalary),
    location,
    workMode: 'Hybrid',
    departments,
    minCgpa: Number(minCgpa),
    maxBacklogs: Number(maxBacklogs),
    requiredSkills,
    description: description || `Join ${company.name} as ${title} building scalable modern enterprise systems.`,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    openings: 15,
    status: 'Active',
    createdAt: new Date().toISOString(),
  });

  res.json(newJob);
});

// Placement Drives & Eligibility Engine
app.get('/api/placement-drives', (_req: Request, res: Response) => {
  res.json(db.getAllDrives());
});

app.post('/api/placement-drives', (req: Request, res: Response) => {
  const {
    companyId,
    role,
    packageLPA,
    location = 'Bangalore',
    driveDate,
    minCgpa = 7.0,
    maxBacklogs = 0,
    requiredSkills = ['Java', 'SQL'],
    eligibleDepartments = ['Computer Science', 'Information Technology'],
    graduationYear = 2027,
  } = req.body;

  const company = db.getCompanyById(companyId) || db.getAllCompanies()[0];
  const allStudents = db.getAllStudents();

  // Automatic Eligibility Evaluation across ALL students
  let eligibleCount = 0;
  let ineligibleCount = 0;

  allStudents.forEach(student => {
    const result = db.evaluateEligibility(student, Number(minCgpa), Number(maxBacklogs), eligibleDepartments);
    if (result.isEligible) {
      eligibleCount++;
      // Send notification to eligible student!
      db.addNotification({
        id: `notif-${Date.now()}-${student.id}`,
        userId: student.userId,
        title: `Eligible for New Drive: ${company.name} (${role})`,
        message: `You meet all criteria (CGPA: ${student.cgpa} >= ${minCgpa}) for the upcoming drive on ${driveDate}. Package: ${packageLPA}.`,
        type: 'drive',
        isRead: false,
        createdAt: new Date().toISOString(),
        link: '/jobs',
      });
    } else {
      ineligibleCount++;
    }
  });

  const newDrive = db.createDrive({
    id: `drive-${Date.now()}`,
    jobId: `job-${Date.now()}`,
    companyId: company.id,
    companyName: company.name,
    role,
    packageLPA: packageLPA || '₹12–16 LPA',
    location,
    driveDate: driveDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minCgpa: Number(minCgpa),
    maxBacklogs: Number(maxBacklogs),
    requiredSkills,
    eligibleDepartments,
    graduationYear: Number(graduationYear),
    eligibleStudentCount: eligibleCount,
    ineligibleStudentCount: ineligibleCount,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  });

  db.addActivity({
    id: `act-${Date.now()}`,
    actor: 'Placement Officer',
    action: `created placement drive for`,
    target: `${company.name} (${role}) — ${eligibleCount} students eligible`,
    timestamp: 'Just now',
  });

  res.json(newDrive);
});

app.get('/api/placement-drives/:id/eligibility-report', (req: Request, res: Response) => {
  const drive = db.getDriveById(req.params.id);
  if (!drive) return res.status(404).json({ error: 'Drive not found' });

  const allStudents = db.getAllStudents();
  const report = allStudents.map(student => {
    const evalResult = db.evaluateEligibility(
      student,
      drive.minCgpa,
      drive.maxBacklogs,
      drive.eligibleDepartments
    );
    return {
      studentId: student.id,
      name: student.name,
      email: student.email,
      department: student.department,
      cgpa: student.cgpa,
      activeBacklogs: student.activeBacklogs,
      isEligible: evalResult.isEligible,
      reasons: evalResult.reasons,
    };
  });

  const eligibleList = report.filter(r => r.isEligible);
  const ineligibleList = report.filter(r => !r.isEligible);

  res.json({
    drive,
    totalStudents: allStudents.length,
    eligibleCount: eligibleList.length,
    ineligibleCount: ineligibleList.length,
    eligibleStudents: eligibleList,
    ineligibleStudents: ineligibleList,
  });
});

// Applications
app.get('/api/applications', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { studentId, stage } = req.query;

  let apps = db.getAllApplications();

  if (user && user.role === 'student') {
    const student = db.getStudentByUserId(user.id);
    if (student) {
      apps = apps.filter(a => a.studentId === student.id);
    }
  } else if (studentId) {
    apps = apps.filter(a => a.studentId === studentId);
  }

  if (stage && stage !== 'All') {
    apps = apps.filter(a => a.currentStage === stage);
  }

  res.json(apps);
});

app.post('/api/applications', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { jobId } = req.body;

  let student = db.getStudentByUserId(user?.id);
  if (!student) {
    student = db.getAllStudents()[0]; // Fallback demo
  }

  const job = db.getJobById(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Check if already applied
  const existing = db.getAllApplications().find(a => a.studentId === student.id && a.jobId === job.id);
  if (existing) {
    return res.status(400).json({ error: 'You have already applied for this position' });
  }

  // Calculate AI Match
  const matchResult = await calculateJobMatch(student, job);

  const newApp = db.createApplication({
    id: `app-${Date.now()}`,
    jobId: job.id,
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    studentDepartment: student.department,
    studentCgpa: student.cgpa,
    companyName: job.companyName,
    jobTitle: job.title,
    packageLPA: job.packageLPA,
    currentStage: 'Applied',
    stageHistory: [
      {
        stage: 'Applied',
        updatedAt: new Date().toISOString(),
        remarks: 'Application submitted through campus portal with verified profile credentials',
      },
    ],
    aiMatchScore: matchResult.matchScore,
    matchingSkills: matchResult.matchingSkills,
    missingSkills: matchResult.missingSkills,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Award XP for applying!
  db.updateStudent(student.id, {
    xp: student.xp + 50,
  });

  res.json(newApp);
});

app.put('/api/applications/:id/stage', (req: Request, res: Response) => {
  const { stage, remarks = 'Stage updated by recruitment committee', interviewSchedule } = req.body;
  const updated = db.updateApplicationStage(req.params.id, stage, remarks, interviewSchedule);

  if (!updated) {
    return res.status(404).json({ error: 'Application not found' });
  }

  res.json(updated);
});

// Notifications
app.get('/api/notifications', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json(db.getNotificationsByUser(user?.id || 'usr-student-1'));
});

app.post('/api/notifications/read-all', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  db.markNotificationsAsRead(user?.id || 'usr-student-1');
  res.json({ success: true });
});

// Analytics
app.get('/api/analytics/officer', (_req: Request, res: Response) => {
  const students = db.getAllStudents();
  const applications = db.getAllApplications();
  const drives = db.getAllDrives();
  const companies = db.getAllCompanies();

  const totalStudents = students.length;
  const placedApps = applications.filter(a => a.currentStage === 'Selected');
  const placedStudentIds = new Set(placedApps.map(a => a.studentId));
  const placedCount = placedStudentIds.size;
  const placementRate = Math.round((placedCount / totalStudents) * 100);

  // Departments
  const deptStats: Record<string, { total: number; placed: number }> = {};
  students.forEach(s => {
    if (!deptStats[s.department]) deptStats[s.department] = { total: 0, placed: 0 };
    deptStats[s.department].total++;
    if (placedStudentIds.has(s.id)) deptStats[s.department].placed++;
  });

  const departmentData = Object.entries(deptStats).map(([dept, data]) => ({
    department: dept,
    total: data.total,
    placed: data.placed,
    rate: Math.round((data.placed / data.total) * 100),
  }));

  // Skill demand
  const skillDemand = [
    { skill: 'Python', demand: 86, available: 78 },
    { skill: 'SQL', demand: 82, available: 72 },
    { skill: 'Data Structures', demand: 90, available: 68 },
    { skill: 'Java', demand: 74, available: 65 },
    { skill: 'React', demand: 68, available: 58 },
    { skill: 'Docker / Cloud', demand: 62, available: 34 },
    { skill: 'Machine Learning', demand: 55, available: 42 },
  ];

  // Trends
  const trendData = [
    { month: 'Jul', offers: 8, drives: 3 },
    { month: 'Aug', offers: 18, drives: 6 },
    { month: 'Sep', offers: 34, drives: 9 },
    { month: 'Oct', offers: 52, drives: 10 },
  ];

  res.json({
    totalStudents,
    placedCount,
    placementRate,
    activeDrives: drives.filter(d => d.status !== 'Completed').length,
    totalCompanies: companies.length,
    averagePackage: '₹14.8 LPA',
    highestPackage: '₹45 LPA',
    departmentData,
    skillDemand,
    trendData,
  });
});

app.get('/api/analytics/student', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const student = db.getStudentByUserId(user?.id) || db.getAllStudents()[0];
  const apps = db.getApplicationsByStudent(student.id);

  const stats = {
    totalApplications: apps.length,
    shortlisted: apps.filter(a => ['Shortlisted', 'Technical Interview', 'HR Interview', 'Selected'].includes(a.currentStage)).length,
    interviews: apps.filter(a => ['Technical Interview', 'HR Interview', 'Selected'].includes(a.currentStage)).length,
    offers: apps.filter(a => a.currentStage === 'Selected').length,
    readinessScore: student.readinessScore,
    xp: student.xp,
    level: student.level,
  };

  res.json(stats);
});

app.get('/api/analytics/admin', (_req: Request, res: Response) => {
  const users = db.getAllUsers();
  const students = db.getAllStudents();
  const companies = db.getAllCompanies();
  const jobs = db.getAllJobs();
  const drives = db.getAllDrives();
  const applications = db.getAllApplications();
  const activities = db.getAllActivities();

  res.json({
    totalUsers: users.length,
    studentsCount: students.length,
    companiesCount: companies.length,
    jobsCount: jobs.length,
    drivesCount: drives.length,
    applicationsCount: applications.length,
    activities,
  });
});

// AI Endpoints
app.post('/api/ai/readiness', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const student = db.getStudentByUserId(user?.id) || db.getAllStudents()[0];
  const result = await evaluatePlacementReadiness(student);
  res.json(result);
});

app.post('/api/ai/career-chat', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const student = db.getStudentByUserId(user?.id) || db.getAllStudents()[0];
  const jobs = db.getAllJobs();
  const apps = db.getApplicationsByStudent(student.id);

  const reply = await generateCopilotResponse(message, student, history, { jobs, applications: apps });
  res.json({ reply });
});

app.post('/api/ai/resume-analysis', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { resumeText, targetRole = 'Software Engineer' } = req.body;
  const student = db.getStudentByUserId(user?.id) || db.getAllStudents()[0];

  const textToAnalyze = resumeText || student.resumeText || 'Engineering student with software development experience.';
  const result = await analyzeResume(textToAnalyze, targetRole);
  res.json(result);
});

app.post('/api/ai/job-match', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { jobId } = req.body;
  const student = db.getStudentByUserId(user?.id) || db.getAllStudents()[0];
  const job = db.getJobById(jobId) || db.getAllJobs()[0];

  const result = await calculateJobMatch(student, job);
  res.json(result);
});

app.post('/api/ai/interview-questions', async (req: Request, res: Response) => {
  const { role = 'Software Engineer', difficulty = 'Medium' } = req.body;
  const questions = await generateInterviewQuestions(role, difficulty);
  res.json(questions);
});

app.post('/api/ai/interview-eval', async (req: Request, res: Response) => {
  const { question, userAnswer, category = 'Technical' } = req.body;
  if (!question || !userAnswer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  const result = await evaluateInterviewAnswer(question, userAnswer, category);
  res.json(result);
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Placement Tracker AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
