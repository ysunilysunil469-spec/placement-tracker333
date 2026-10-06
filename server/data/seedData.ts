// Seed data generator for Placement Tracker AI
// Contains 50+ students, 10 companies, 20 jobs, 10 placement drives, 100+ applications, notifications

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string; // In demo simple hash / plain for verify
  role: 'student' | 'officer' | 'recruiter' | 'admin';
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface StudentRecord {
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
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; category: string }[];
  projects: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
    stars?: number;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
  }[];
  internships: {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
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
  createdAt: string;
}

export interface CompanyRecord {
  id: string;
  name: string;
  website: string;
  logo: string;
  industry: string;
  tier: 'Tier 1' | 'Tier 2' | 'Super Dream' | 'Dream';
  headquarters: string;
  description: string;
  recruiterId?: string;
  createdAt: string;
}

export interface JobRecord {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  roleType: 'Full-Time' | 'Internship' | 'Intern + FTE';
  packageLPA: string; // e.g. "8-12 LPA" or "24 LPA"
  minSalary: number; // in LPA
  maxSalary: number; // in LPA
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
  createdAt: string;
}

export interface DriveRecord {
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
  createdAt: string;
}

export interface ApplicationRecord {
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
  stageHistory: {
    stage: string;
    updatedAt: string;
    remarks: string;
  }[];
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

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'drive' | 'interview' | 'status' | 'ai' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityRecord {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

// 10 Companies
export const SEED_COMPANIES: CompanyRecord[] = [
  {
    id: 'comp-1',
    name: 'Google',
    website: 'https://careers.google.com',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    industry: 'Cloud & AI / Internet',
    tier: 'Super Dream',
    headquarters: 'Mountain View, CA / Bangalore',
    description: 'Global technology leader specializing in search engine, cloud computing, and advanced AI technologies.',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'comp-2',
    name: 'Microsoft',
    website: 'https://careers.microsoft.com',
    logo: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=100&auto=format&fit=crop&q=80',
    industry: 'Enterprise Software & Cloud',
    tier: 'Super Dream',
    headquarters: 'Redmond, WA / Hyderabad',
    description: 'Empowers every person and organization on the planet to achieve more through Azure and modern workplace software.',
    createdAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'comp-3',
    name: 'Amazon',
    website: 'https://amazon.jobs',
    logo: 'https://images.unsplash.com/photo-1523474253246-608f654b986e?w=100&auto=format&fit=crop&q=80',
    industry: 'E-Commerce & AWS',
    tier: 'Super Dream',
    headquarters: 'Seattle, WA / Bangalore',
    description: 'World-renowned customer-obsessed company driving innovation in AWS, logistics, and retail computing.',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'comp-4',
    name: 'Atlassian',
    website: 'https://atlassian.com/careers',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    industry: 'Developer Productivity',
    tier: 'Super Dream',
    headquarters: 'Sydney / Bangalore',
    description: 'Creators of Jira, Confluence, Trello, and Bitbucket powering high-performing engineering teams worldwide.',
    createdAt: '2026-01-18T08:00:00Z',
  },
  {
    id: 'comp-5',
    name: 'Goldman Sachs',
    website: 'https://goldmansachs.com/careers',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    industry: 'FinTech & Investment Banking',
    tier: 'Super Dream',
    headquarters: 'New York / Bangalore',
    description: 'Leading global financial institution with high-frequency trading platforms and quantitative systems.',
    createdAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'comp-6',
    name: 'Zomato',
    website: 'https://zomato.com/careers',
    logo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=100&auto=format&fit=crop&q=80',
    industry: 'FoodTech & Quick Commerce',
    tier: 'Dream',
    headquarters: 'Gurugram',
    description: 'Hyperlocal commerce and quick logistics delivering millions of orders daily through cutting-edge apps.',
    createdAt: '2026-01-25T08:00:00Z',
  },
  {
    id: 'comp-7',
    name: 'Razorpay',
    website: 'https://razorpay.com/jobs',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    industry: 'Payments & Neobanking',
    tier: 'Dream',
    headquarters: 'Bangalore',
    description: 'Indias first full-stack financial solutions company enabling millions of businesses to accept and disburse payments.',
    createdAt: '2026-01-28T08:00:00Z',
  },
  {
    id: 'comp-8',
    name: 'Tata Consultancy Services',
    website: 'https://tcs.com/careers',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    industry: 'IT Services & Consulting',
    tier: 'Tier 1',
    headquarters: 'Mumbai',
    description: 'Global powerhouse in IT services, consulting, and business solutions powering Fortune 500 enterprises.',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'comp-9',
    name: 'Infosys',
    website: 'https://infosys.com/careers',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&auto=format&fit=crop&q=80',
    industry: 'Digital Transformation',
    tier: 'Tier 1',
    headquarters: 'Bangalore',
    description: 'Pioneers in next-generation digital services and consulting helping clients in over 50 countries navigate digital transformation.',
    createdAt: '2026-02-05T08:00:00Z',
  },
  {
    id: 'comp-10',
    name: 'Accenture',
    website: 'https://accenture.com/careers',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop&q=80',
    industry: 'Strategy & Cloud Services',
    tier: 'Tier 1',
    headquarters: 'Dublin / Bangalore',
    description: 'Global professional services company with leading capabilities in digital, cloud, security, and AI consulting.',
    createdAt: '2026-02-10T08:00:00Z',
  },
];

// 20 Jobs across companies
export const SEED_JOBS: JobRecord[] = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    companyName: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    title: 'Software Development Engineer (SDE-1)',
    roleType: 'Full-Time',
    packageLPA: '₹32–42 LPA',
    minSalary: 32,
    maxSalary: 42,
    location: 'Bangalore / Hyderabad',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    minCgpa: 8.0,
    maxBacklogs: 0,
    requiredSkills: ['Data Structures', 'Algorithms', 'C++', 'Java', 'System Design'],
    description: 'Design and build massive-scale distributed systems powering search, YouTube, and core Google Cloud infrastructure.',
    deadline: '2026-11-20',
    openings: 15,
    status: 'Active',
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'job-2',
    companyId: 'comp-1',
    companyName: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    title: 'AI / Machine Learning Engineer',
    roleType: 'Full-Time',
    packageLPA: '₹35–45 LPA',
    minSalary: 35,
    maxSalary: 45,
    location: 'Bangalore',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'AI & Data Science'],
    minCgpa: 8.2,
    maxBacklogs: 0,
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'SQL'],
    description: 'Work on cutting-edge generative AI models and intelligent assistants integrated into Google Workspace and Android.',
    deadline: '2026-11-25',
    openings: 8,
    status: 'Active',
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'job-3',
    companyId: 'comp-2',
    companyName: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=100&auto=format&fit=crop&q=80',
    title: 'Cloud Software Engineer (Azure)',
    roleType: 'Full-Time',
    packageLPA: '₹28–38 LPA',
    minSalary: 28,
    maxSalary: 38,
    location: 'Hyderabad / Bangalore',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    minCgpa: 7.5,
    maxBacklogs: 0,
    requiredSkills: ['C#', 'Go', 'Kubernetes', 'Docker', 'Distributed Systems'],
    description: 'Architect resilient cloud microservices and serverless infrastructure on Azure with zero downtime guarantees.',
    deadline: '2026-11-18',
    openings: 20,
    status: 'Active',
    createdAt: '2026-10-01T11:00:00Z',
  },
  {
    id: 'job-4',
    companyId: 'comp-3',
    companyName: 'Amazon',
    companyLogo: 'https://images.unsplash.com/photo-1523474253246-608f654b986e?w=100&auto=format&fit=crop&q=80',
    title: 'Software Development Engineer',
    roleType: 'Full-Time',
    packageLPA: '₹30–44 LPA',
    minSalary: 30,
    maxSalary: 44,
    location: 'Bangalore / Chennai',
    workMode: 'On-site',
    departments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    minCgpa: 7.0,
    maxBacklogs: 0,
    requiredSkills: ['Java', 'Data Structures', 'Algorithms', 'AWS', 'DynamoDB'],
    description: 'Solve complex problems in e-commerce checkout pipelines, order fulfillment logistics, and high-throughput databases.',
    deadline: '2026-11-15',
    openings: 25,
    status: 'Active',
    createdAt: '2026-09-28T09:00:00Z',
  },
  {
    id: 'job-5',
    companyId: 'comp-4',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    title: 'Full Stack Engineer (React + Java)',
    roleType: 'Full-Time',
    packageLPA: '₹26–36 LPA',
    minSalary: 26,
    maxSalary: 36,
    location: 'Remote / Bangalore',
    workMode: 'Remote',
    departments: ['Computer Science', 'Information Technology'],
    minCgpa: 7.5,
    maxBacklogs: 0,
    requiredSkills: ['React', 'TypeScript', 'Java', 'GraphQL', 'PostgreSQL'],
    description: 'Build rich collaboration interfaces in Jira and Confluence used by millions of engineers daily.',
    deadline: '2026-11-30',
    openings: 10,
    status: 'Active',
    createdAt: '2026-10-03T12:00:00Z',
  },
  {
    id: 'job-6',
    companyId: 'comp-5',
    companyName: 'Goldman Sachs',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    title: 'Quantitative Analyst / Tech Associate',
    roleType: 'Full-Time',
    packageLPA: '₹28–34 LPA',
    minSalary: 28,
    maxSalary: 34,
    location: 'Bangalore',
    workMode: 'On-site',
    departments: ['Computer Science', 'AI & Data Science', 'Mathematics & Computing'],
    minCgpa: 8.0,
    maxBacklogs: 0,
    requiredSkills: ['Python', 'SQL', 'C++', 'Financial Modeling', 'Statistics'],
    description: 'Develop low-latency trade execution strategies, algorithmic risk models, and asset management platforms.',
    deadline: '2026-11-22',
    openings: 12,
    status: 'Active',
    createdAt: '2026-10-02T14:00:00Z',
  },
  {
    id: 'job-7',
    companyId: 'comp-6',
    companyName: 'Zomato',
    companyLogo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=100&auto=format&fit=crop&q=80',
    title: 'Backend Engineer (FastAPI / Go)',
    roleType: 'Full-Time',
    packageLPA: '₹18–24 LPA',
    minSalary: 18,
    maxSalary: 24,
    location: 'Gurugram / Hybrid',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    minCgpa: 7.0,
    maxBacklogs: 1,
    requiredSkills: ['Python', 'FastAPI', 'Redis', 'PostgreSQL', 'Docker'],
    description: 'Scale our quick-delivery dispatch engine to handle tens of thousands of simultaneous orders per minute.',
    deadline: '2026-11-12',
    openings: 18,
    status: 'Active',
    createdAt: '2026-10-03T08:00:00Z',
  },
  {
    id: 'job-8',
    companyId: 'comp-7',
    companyName: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    title: 'Product Engineer - Payments',
    roleType: 'Full-Time',
    packageLPA: '₹20–28 LPA',
    minSalary: 20,
    maxSalary: 28,
    location: 'Bangalore',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    minCgpa: 7.2,
    maxBacklogs: 0,
    requiredSkills: ['Node.js', 'Go', 'Kafka', 'MySQL', 'System Design'],
    description: 'Work on financial infrastructure handling billions of transactions securely with 99.999% uptime.',
    deadline: '2026-11-19',
    openings: 14,
    status: 'Active',
    createdAt: '2026-10-04T10:00:00Z',
  },
  {
    id: 'job-9',
    companyId: 'comp-8',
    companyName: 'Tata Consultancy Services',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    title: 'TCS Digital Engineer',
    roleType: 'Full-Time',
    packageLPA: '₹7.5–9 LPA',
    minSalary: 7.5,
    maxSalary: 9,
    location: 'Pan India',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical', 'Mechanical'],
    minCgpa: 6.5,
    maxBacklogs: 1,
    requiredSkills: ['Java', 'Python', 'SQL', 'Object Oriented Programming'],
    description: 'Work on cutting-edge digital enterprise applications, automation pipelines, and cloud migrations for global Fortune 500 clients.',
    deadline: '2026-12-10',
    openings: 150,
    status: 'Active',
    createdAt: '2026-09-25T10:00:00Z',
  },
  {
    id: 'job-10',
    companyId: 'comp-9',
    companyName: 'Infosys',
    companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&auto=format&fit=crop&q=80',
    title: 'Specialist Programmer (Power Programmer)',
    roleType: 'Full-Time',
    packageLPA: '₹9.5–12 LPA',
    minSalary: 9.5,
    maxSalary: 12,
    location: 'Bangalore / Pune / Hyderabad',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    minCgpa: 6.8,
    maxBacklogs: 0,
    requiredSkills: ['Algorithms', 'Java', 'Full Stack', 'Cloud', 'Microservices'],
    description: 'Elite technical team inside Infosys tackling complex architecture design, algorithmic optimizations, and AI integration.',
    deadline: '2026-12-05',
    openings: 80,
    status: 'Active',
    createdAt: '2026-09-26T11:00:00Z',
  },
  {
    id: 'job-11',
    companyId: 'comp-10',
    companyName: 'Accenture',
    companyLogo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop&q=80',
    title: 'Advanced Application Engineering Analyst',
    roleType: 'Full-Time',
    packageLPA: '₹6.5–8.5 LPA',
    minSalary: 6.5,
    maxSalary: 8.5,
    location: 'Bangalore / Mumbai / Gurgaon',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    minCgpa: 6.5,
    maxBacklogs: 1,
    requiredSkills: ['Python', 'SQL', 'Agile', 'Web Services', 'Git'],
    description: 'Build enterprise-grade software and modernize cloud infrastructure using agile development standards.',
    deadline: '2026-12-15',
    openings: 120,
    status: 'Active',
    createdAt: '2026-09-27T08:00:00Z',
  },
  {
    id: 'job-12',
    companyId: 'comp-1',
    companyName: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    title: 'Summer Technical Intern (SDE)',
    roleType: 'Internship',
    packageLPA: '₹1.1L/month',
    minSalary: 13.2,
    maxSalary: 13.2,
    location: 'Bangalore',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    minCgpa: 8.5,
    maxBacklogs: 0,
    requiredSkills: ['C++', 'Python', 'Algorithms', 'Data Structures'],
    description: '10-week summer internship working with Google engineers on real-world production systems and research initiatives.',
    deadline: '2026-11-10',
    openings: 10,
    status: 'Active',
    createdAt: '2026-10-04T12:00:00Z',
  },
  {
    id: 'job-13',
    companyId: 'comp-2',
    companyName: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=100&auto=format&fit=crop&q=80',
    title: 'Security Research Engineer',
    roleType: 'Full-Time',
    packageLPA: '₹25–35 LPA',
    minSalary: 25,
    maxSalary: 35,
    location: 'Hyderabad',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology'],
    minCgpa: 7.8,
    maxBacklogs: 0,
    requiredSkills: ['Cybersecurity', 'C++', 'Python', 'Reverse Engineering', 'Cryptography'],
    description: 'Protect hundreds of millions of Microsoft 365 customers from sophisticated state-sponsored cyber threats.',
    deadline: '2026-11-28',
    openings: 6,
    status: 'Active',
    createdAt: '2026-10-02T15:00:00Z',
  },
  {
    id: 'job-14',
    companyId: 'comp-7',
    companyName: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    title: 'Frontend Engineer (React + UI/UX)',
    roleType: 'Full-Time',
    packageLPA: '₹16–22 LPA',
    minSalary: 16,
    maxSalary: 22,
    location: 'Bangalore',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    minCgpa: 7.0,
    maxBacklogs: 0,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'State Management'],
    description: 'Design and implement seamless checkout interfaces trusted by over 8 million Indian merchants.',
    deadline: '2026-11-16',
    openings: 12,
    status: 'Active',
    createdAt: '2026-10-03T14:00:00Z',
  },
  {
    id: 'job-15',
    companyId: 'comp-3',
    companyName: 'Amazon',
    companyLogo: 'https://images.unsplash.com/photo-1523474253246-608f654b986e?w=100&auto=format&fit=crop&q=80',
    title: 'Data Engineer - AWS Analytics',
    roleType: 'Full-Time',
    packageLPA: '₹22–30 LPA',
    minSalary: 22,
    maxSalary: 30,
    location: 'Hyderabad',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'AI & Data Science', 'Information Technology'],
    minCgpa: 7.5,
    maxBacklogs: 0,
    requiredSkills: ['SQL', 'Python', 'Spark', 'AWS Redshift', 'ETL Pipelines'],
    description: 'Build enterprise-scale data pipelines extracting insights from exabytes of customer interactions.',
    deadline: '2026-11-24',
    openings: 16,
    status: 'Active',
    createdAt: '2026-10-01T16:00:00Z',
  },
  {
    id: 'job-16',
    companyId: 'comp-6',
    companyName: 'Zomato',
    companyLogo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=100&auto=format&fit=crop&q=80',
    title: 'Mobile Engineer (React Native / Flutter)',
    roleType: 'Full-Time',
    packageLPA: '₹16–22 LPA',
    minSalary: 16,
    maxSalary: 22,
    location: 'Gurugram',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology'],
    minCgpa: 6.8,
    maxBacklogs: 1,
    requiredSkills: ['React Native', 'TypeScript', 'Mobile Performance', 'Redux', 'REST APIs'],
    description: 'Develop super-smooth consumer mobile experiences with sub-second order placements and live GPS map tracking.',
    deadline: '2026-11-14',
    openings: 10,
    status: 'Active',
    createdAt: '2026-10-02T11:00:00Z',
  },
  {
    id: 'job-17',
    companyId: 'comp-4',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    title: 'Site Reliability Engineer (SRE)',
    roleType: 'Full-Time',
    packageLPA: '₹24–32 LPA',
    minSalary: 24,
    maxSalary: 32,
    location: 'Bangalore / Remote',
    workMode: 'Remote',
    departments: ['Computer Science', 'Information Technology'],
    minCgpa: 7.2,
    maxBacklogs: 0,
    requiredSkills: ['Linux', 'Kubernetes', 'Python', 'Terraform', 'Observability'],
    description: 'Ensure world-class reliability, low latency, and automated recovery for Atlassians distributed cloud ecosystem.',
    deadline: '2026-11-29',
    openings: 8,
    status: 'Active',
    createdAt: '2026-10-04T08:00:00Z',
  },
  {
    id: 'job-18',
    companyId: 'comp-5',
    companyName: 'Goldman Sachs',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    title: 'Data Scientist - NLP & LLM Applications',
    roleType: 'Full-Time',
    packageLPA: '₹30–38 LPA',
    minSalary: 30,
    maxSalary: 38,
    location: 'Bangalore',
    workMode: 'On-site',
    departments: ['Computer Science', 'AI & Data Science'],
    minCgpa: 8.0,
    maxBacklogs: 0,
    requiredSkills: ['NLP', 'Python', 'PyTorch', 'Transformers', 'FastAPI'],
    description: 'Leverage LLMs to parse global market earnings calls, regulatory filings, and complex financial prospectuses in real time.',
    deadline: '2026-11-26',
    openings: 6,
    status: 'Active',
    createdAt: '2026-10-03T16:00:00Z',
  },
  {
    id: 'job-19',
    companyId: 'comp-8',
    companyName: 'Tata Consultancy Services',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    title: 'TCS Ninja Engineer',
    roleType: 'Full-Time',
    packageLPA: '₹3.6–4.5 LPA',
    minSalary: 3.6,
    maxSalary: 4.5,
    location: 'Pan India',
    workMode: 'On-site',
    departments: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical', 'Mechanical', 'Civil'],
    minCgpa: 6.0,
    maxBacklogs: 2,
    requiredSkills: ['C', 'Java', 'Basics of Programming', 'Communication'],
    description: 'Entry-level technology role providing enterprise application maintenance, IT infrastructure support, and software testing.',
    deadline: '2026-12-20',
    openings: 300,
    status: 'Active',
    createdAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 'job-20',
    companyId: 'comp-10',
    companyName: 'Accenture',
    companyLogo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop&q=80',
    title: 'Cloud Security Associate',
    roleType: 'Full-Time',
    packageLPA: '₹8.0–11 LPA',
    minSalary: 8.0,
    maxSalary: 11,
    location: 'Bangalore / Pune',
    workMode: 'Hybrid',
    departments: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    minCgpa: 6.8,
    maxBacklogs: 0,
    requiredSkills: ['Cloud Security', 'AWS/Azure', 'Networking', 'Python', 'IAM'],
    description: 'Implement zero-trust security postures, cloud access management, and threat posture management for enterprise clients.',
    deadline: '2026-12-12',
    openings: 35,
    status: 'Active',
    createdAt: '2026-09-29T10:00:00Z',
  },
];

// 10 Placement Drives
export const SEED_DRIVES: DriveRecord[] = [
  {
    id: 'drive-1',
    jobId: 'job-1',
    companyId: 'comp-1',
    companyName: 'Google',
    role: 'Software Development Engineer (SDE-1)',
    packageLPA: '₹32–42 LPA',
    location: 'Bangalore / Hyderabad',
    driveDate: '2026-10-18',
    minCgpa: 8.0,
    maxBacklogs: 0,
    requiredSkills: ['Data Structures', 'Algorithms', 'C++', 'Java', 'System Design'],
    eligibleDepartments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    graduationYear: 2027,
    eligibleStudentCount: 28,
    ineligibleStudentCount: 22,
    status: 'Scheduled',
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'drive-2',
    jobId: 'job-2',
    companyId: 'comp-1',
    companyName: 'Google',
    role: 'AI / Machine Learning Engineer',
    packageLPA: '₹35–45 LPA',
    location: 'Bangalore',
    driveDate: '2026-10-22',
    minCgpa: 8.2,
    maxBacklogs: 0,
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'SQL'],
    eligibleDepartments: ['Computer Science', 'AI & Data Science'],
    graduationYear: 2027,
    eligibleStudentCount: 19,
    ineligibleStudentCount: 31,
    status: 'Scheduled',
    createdAt: '2026-10-02T11:00:00Z',
  },
  {
    id: 'drive-3',
    jobId: 'job-3',
    companyId: 'comp-2',
    companyName: 'Microsoft',
    role: 'Cloud Software Engineer (Azure)',
    packageLPA: '₹28–38 LPA',
    location: 'Hyderabad / Bangalore',
    driveDate: '2026-10-15',
    minCgpa: 7.5,
    maxBacklogs: 0,
    requiredSkills: ['C#', 'Go', 'Kubernetes', 'Docker', 'Distributed Systems'],
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    graduationYear: 2027,
    eligibleStudentCount: 36,
    ineligibleStudentCount: 14,
    status: 'In-Progress',
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'drive-4',
    jobId: 'job-4',
    companyId: 'comp-3',
    companyName: 'Amazon',
    role: 'Software Development Engineer',
    packageLPA: '₹30–44 LPA',
    location: 'Bangalore / Chennai',
    driveDate: '2026-10-12',
    minCgpa: 7.0,
    maxBacklogs: 0,
    requiredSkills: ['Java', 'Data Structures', 'Algorithms', 'AWS', 'DynamoDB'],
    eligibleDepartments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    graduationYear: 2027,
    eligibleStudentCount: 42,
    ineligibleStudentCount: 8,
    status: 'In-Progress',
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'drive-5',
    jobId: 'job-5',
    companyId: 'comp-4',
    companyName: 'Atlassian',
    role: 'Full Stack Engineer (React + Java)',
    packageLPA: '₹26–36 LPA',
    location: 'Remote / Bangalore',
    driveDate: '2026-10-25',
    minCgpa: 7.5,
    maxBacklogs: 0,
    requiredSkills: ['React', 'TypeScript', 'Java', 'GraphQL', 'PostgreSQL'],
    eligibleDepartments: ['Computer Science', 'Information Technology'],
    graduationYear: 2027,
    eligibleStudentCount: 32,
    ineligibleStudentCount: 18,
    status: 'Scheduled',
    createdAt: '2026-10-03T13:00:00Z',
  },
  {
    id: 'drive-6',
    jobId: 'job-6',
    companyId: 'comp-5',
    companyName: 'Goldman Sachs',
    role: 'Quantitative Analyst / Tech Associate',
    packageLPA: '₹28–34 LPA',
    location: 'Bangalore',
    driveDate: '2026-10-20',
    minCgpa: 8.0,
    maxBacklogs: 0,
    requiredSkills: ['Python', 'SQL', 'C++', 'Financial Modeling', 'Statistics'],
    eligibleDepartments: ['Computer Science', 'AI & Data Science', 'Mathematics & Computing'],
    graduationYear: 2027,
    eligibleStudentCount: 24,
    ineligibleStudentCount: 26,
    status: 'Scheduled',
    createdAt: '2026-10-02T15:00:00Z',
  },
  {
    id: 'drive-7',
    jobId: 'job-7',
    companyId: 'comp-6',
    companyName: 'Zomato',
    role: 'Backend Engineer (FastAPI / Go)',
    packageLPA: '₹18–24 LPA',
    location: 'Gurugram / Hybrid',
    driveDate: '2026-10-10',
    minCgpa: 7.0,
    maxBacklogs: 1,
    requiredSkills: ['Python', 'FastAPI', 'Redis', 'PostgreSQL', 'Docker'],
    eligibleDepartments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    graduationYear: 2027,
    eligibleStudentCount: 44,
    ineligibleStudentCount: 6,
    status: 'In-Progress',
    createdAt: '2026-10-03T09:00:00Z',
  },
  {
    id: 'drive-8',
    jobId: 'job-8',
    companyId: 'comp-7',
    companyName: 'Razorpay',
    role: 'Product Engineer - Payments',
    packageLPA: '₹20–28 LPA',
    location: 'Bangalore',
    driveDate: '2026-10-16',
    minCgpa: 7.2,
    maxBacklogs: 0,
    requiredSkills: ['Node.js', 'Go', 'Kafka', 'MySQL', 'System Design'],
    eligibleDepartments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    graduationYear: 2027,
    eligibleStudentCount: 39,
    ineligibleStudentCount: 11,
    status: 'Scheduled',
    createdAt: '2026-10-04T11:00:00Z',
  },
  {
    id: 'drive-9',
    jobId: 'job-9',
    companyId: 'comp-8',
    companyName: 'Tata Consultancy Services',
    role: 'TCS Digital Engineer',
    packageLPA: '₹7.5–9 LPA',
    location: 'Pan India',
    driveDate: '2026-10-05',
    minCgpa: 6.5,
    maxBacklogs: 1,
    requiredSkills: ['Java', 'Python', 'SQL', 'Object Oriented Programming'],
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical', 'Mechanical'],
    graduationYear: 2027,
    eligibleStudentCount: 48,
    ineligibleStudentCount: 2,
    status: 'Completed',
    createdAt: '2026-09-25T11:00:00Z',
  },
  {
    id: 'drive-10',
    jobId: 'job-10',
    companyId: 'comp-9',
    companyName: 'Infosys',
    role: 'Specialist Programmer (Power Programmer)',
    packageLPA: '₹9.5–12 LPA',
    location: 'Bangalore / Pune / Hyderabad',
    driveDate: '2026-10-08',
    minCgpa: 6.8,
    maxBacklogs: 0,
    requiredSkills: ['Algorithms', 'Java', 'Full Stack', 'Cloud', 'Microservices'],
    eligibleDepartments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    graduationYear: 2027,
    eligibleStudentCount: 45,
    ineligibleStudentCount: 5,
    status: 'In-Progress',
    createdAt: '2026-09-26T12:00:00Z',
  },
];

// Helper to generate 50 student records
export function generateSeedStudents(): { users: UserRecord[]; students: StudentRecord[] } {
  const users: UserRecord[] = [];
  const students: StudentRecord[] = [];

  const firstNames = [
    'Suneel', 'Aarav', 'Ananya', 'Rohan', 'Pooja', 'Vikram', 'Sneha', 'Arjun', 'Divya', 'Karan',
    'Neha', 'Aditya', 'Ishita', 'Rahul', 'Meera', 'Varun', 'Kavya', 'Siddharth', 'Tanvi', 'Gaurav',
    'Riya', 'Nikhil', 'Priyanka', 'Amit', 'Shreya', 'Manish', 'Simran', 'Akash', 'Bhavna', 'Harsh',
    'Deepa', 'Sanjay', 'Preeti', 'Pranav', 'Anjali', 'Kunal', 'Swati', 'Rajesh', 'Sunita', 'Vivek',
    'Rashmi', 'Abhishek', 'Pallavi', 'Yash', 'Shruti', 'Naveen', 'Ritu', 'Sameer', 'Aarti', 'Tushar',
  ];

  const lastNames = [
    'Kumar', 'Sharma', 'Verma', 'Patel', 'Reddy', 'Gupta', 'Singh', 'Iyer', 'Nair', 'Deshmukh',
    'Rao', 'Choudhury', 'Joshi', 'Mehta', 'Bhat', 'Agarwal', 'Pillai', 'Saxena', 'Kapoor', 'Chatterjee',
  ];

  const departments = [
    'Computer Science',
    'AI & Data Science',
    'Information Technology',
    'Electronics & Comm.',
    'Computer Science',
  ];

  // Prime demo student: Suneel Kumar
  const demoUserId = 'usr-student-1';
  const demoStudentId = 'std-1';

  users.push({
    id: demoUserId,
    email: 'student@placementai.com',
    passwordHash: 'Demo@123',
    role: 'student',
    name: 'Suneel Kumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  });

  students.push({
    id: demoStudentId,
    userId: demoUserId,
    name: 'Suneel Kumar',
    email: 'student@placementai.com',
    phone: '+91 98765 43210',
    rollNumber: '23CS0104',
    department: 'Computer Science',
    graduationYear: 2027,
    cgpa: 8.4,
    activeBacklogs: 0,
    historyOfBacklogs: 0,
    bio: 'Aspiring AI & Full-Stack Engineer passionate about building scalable web applications and intelligent ML systems.',
    location: 'Bangalore, India',
    githubUrl: 'https://github.com/suneel-kumar',
    linkedinUrl: 'https://linkedin.com/in/suneelkumar',
    portfolioUrl: 'https://suneel.dev',
    resumeUrl: '/resumes/suneel_kumar_resume.pdf',
    resumeText: `SUNEEL KUMAR
Bangalore, India | suneel@placementai.com | +91 9876543210 | github.com/suneel-kumar | linkedin.com/in/suneelkumar

EDUCATION
National Institute of Technology, B.Tech in Computer Science & Engineering (2023 - 2027)
CGPA: 8.4/10.0 | Relevant Coursework: Data Structures & Algorithms, Database Systems, Computer Networks, Operating Systems, Machine Learning

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, C++, Java, SQL
Frameworks & Libraries: React, Node.js, Express, FastAPI, PyTorch, Tailwind CSS
Tools & Cloud: Git, Docker, PostgreSQL, MongoDB, Redis, Linux, AWS S3
Core Competencies: Data Structures & Algorithms, Object-Oriented Design, RESTful API Design

PROJECTS
1. Smart Placement Tracker AI (React, TypeScript, FastAPI, PostgreSQL)
- Architected an AI-powered placement intelligence platform tracking readiness scores, career copilots, and recruitment workflows.
- Implemented real-time job matching engine with 87% ATS compatibility scoring and deterministic fallback algorithms.
- Integrated JWT authentication and role-based access control across students, placement officers, and recruiters.

2. Distributed Cache & Key-Value Store (Go, Docker, Redis)
- Built a fault-tolerant in-memory caching server supporting LRU eviction and consistent hashing across 5 nodes.
- Decreased query latency from 45ms to 3.2ms for high-frequency database lookups under 10,000 req/sec benchmark load.

3. Deep Learning Chest X-Ray Pathology Classifier (Python, PyTorch, Flask)
- Trained convolutional neural network on NIH ChestX-ray14 dataset achieving 91.4% AUC-ROC score across 14 thoracic diseases.
- Deployed inference API on AWS EC2 container with Grad-CAM visual interpretability heatmaps.

INTERNSHIP EXPERIENCE
Software Engineering Intern | Zomato Hyperlocal Logistics (May 2025 - July 2025)
- Enhanced dispatch routing microservice using Go and Redis, reducing average order delivery latency by 12%.
- Created automated integration test suite with 85% code coverage for driver notification pipelines.

CERTIFICATIONS
- DeepLearning.AI Deep Learning Specialization (Coursera)
- AWS Certified Cloud Practitioner (Amazon Web Services)
- Meta Front-End Developer Professional Certificate (Meta)

ACHIEVEMENTS
- Solved 450+ Data Structures & Algorithms problems across LeetCode and Codeforces.
- Finalist at National Smart India Hackathon 2025.`,
    skills: [
      { name: 'Python', level: 'Advanced', category: 'Backend & AI' },
      { name: 'React', level: 'Advanced', category: 'Frontend' },
      { name: 'TypeScript', level: 'Intermediate', category: 'Full Stack' },
      { name: 'FastAPI', level: 'Intermediate', category: 'Backend' },
      { name: 'SQL', level: 'Intermediate', category: 'Database' },
      { name: 'Data Structures', level: 'Advanced', category: 'Core CS' },
      { name: 'Machine Learning', level: 'Intermediate', category: 'AI' },
      { name: 'Docker', level: 'Beginner', category: 'DevOps' },
      { name: 'PostgreSQL', level: 'Intermediate', category: 'Database' },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Placement Tracker AI Platform',
        description: 'Engineered an AI-driven placement tracking ecosystem featuring automatic eligibility detection, career copilot, and resume ATS benchmarking.',
        techStack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
        githubUrl: 'https://github.com/suneel-kumar/placement-tracker-ai',
        liveUrl: 'https://placementai.demo.app',
        stars: 34,
      },
      {
        id: 'proj-2',
        title: 'Distributed Key-Value Engine',
        description: 'Implemented consistent hashing, persistent disk write-ahead log (WAL), and LRU memory management handling 10k ops/sec.',
        techStack: ['Go', 'Docker', 'Distributed Systems'],
        githubUrl: 'https://github.com/suneel-kumar/distributed-kv',
        stars: 19,
      },
      {
        id: 'proj-3',
        title: 'Medical Image Classifier with Grad-CAM',
        description: 'Convolutional neural network for thoracic disease diagnosis with visual interpretability heatmaps achieving 91.4% AUC.',
        techStack: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
        githubUrl: 'https://github.com/suneel-kumar/chest-xray-ai',
        stars: 28,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI / Coursera',
        issueDate: '2025-08-15',
        credentialUrl: 'https://coursera.org/verify/deeplearning-suneel',
      },
      {
        id: 'cert-2',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issueDate: '2025-11-20',
        credentialUrl: 'https://aws.amazon.com/verify/suneel-cloud',
      },
    ],
    internships: [
      {
        id: 'intern-1',
        role: 'Software Engineering Intern',
        company: 'Zomato',
        duration: 'May 2025 - Jul 2025 (3 mos)',
        description: 'Engineered driver dispatch microservice optimization, reducing routing calculation time by 14% using Redis spatial indexes.',
      },
    ],
    readinessScore: 78,
    readinessBreakdown: {
      resume: 85,
      skills: 72,
      projects: 90,
      communication: 65,
      coding: 70,
      interview: 68,
    },
    xp: 1240,
    level: 7,
    achievements: [
      'Resume Master (ATS 85+)',
      'Project Prodigy (3+ Verified Projects)',
      'Algorithmic Adventurer (400+ DSA Solved)',
      'Placement Warrior (Level 7)',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  });

  // Generate 49 other students
  for (let i = 1; i < 50; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3) % lastNames.length];
    const name = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@college.edu`;
    const uId = `usr-student-${i + 1}`;
    const sId = `std-${i + 1}`;

    const dept = departments[i % departments.length];
    const cgpa = Number((6.2 + (i % 38) * 0.09).toFixed(1));
    const backlogs = i % 11 === 0 ? 1 : i % 23 === 0 ? 2 : 0;
    const readiness = Math.min(95, Math.max(48, Math.round(cgpa * 8.5 + (i % 15) - backlogs * 12)));

    users.push({
      id: uId,
      email,
      passwordHash: 'Demo@123',
      role: 'student',
      name,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567) % 500000000}?w=150&auto=format&fit=crop&q=80`,
      createdAt: '2026-01-05T00:00:00Z',
    });

    students.push({
      id: sId,
      userId: uId,
      name,
      email,
      phone: `+91 98${(10000000 + i * 456789) % 90000000}`,
      rollNumber: `23${dept === 'Computer Science' ? 'CS' : dept === 'AI & Data Science' ? 'AI' : 'IT'}01${(10 + i).toString().padStart(2, '0')}`,
      department: dept,
      graduationYear: 2027,
      cgpa,
      activeBacklogs: backlogs,
      historyOfBacklogs: backlogs,
      bio: `Final-year ${dept} student focused on modern software architectures, algorithms, and collaborative product engineering.`,
      location: i % 2 === 0 ? 'Bangalore, India' : 'Hyderabad, India',
      githubUrl: `https://github.com/${fName.toLowerCase()}-${lName.toLowerCase()}`,
      linkedinUrl: `https://linkedin.com/in/${fName.toLowerCase()}-${lName.toLowerCase()}`,
      portfolioUrl: '',
      resumeUrl: `/resumes/${fName.toLowerCase()}_resume.pdf`,
      resumeText: `${name} | ${email} | ${dept} | CGPA: ${cgpa} | Core skills: Python, Java, C++, React, SQL, DSA`,
      skills: [
        { name: i % 2 === 0 ? 'Java' : 'Python', level: 'Advanced', category: 'Backend' },
        { name: 'Data Structures', level: cgpa > 7.5 ? 'Advanced' : 'Intermediate', category: 'Core CS' },
        { name: 'SQL', level: 'Intermediate', category: 'Database' },
        { name: i % 3 === 0 ? 'React' : 'Node.js', level: 'Intermediate', category: 'Frontend' },
        { name: cgpa > 8.0 ? 'Machine Learning' : 'C++', level: 'Intermediate', category: 'AI' },
      ],
      projects: [
        {
          id: `proj-std-${i}-1`,
          title: `${fName}s Cloud Management Suite`,
          description: 'A cloud resource orchestrator and metrics aggregator with microservices backends.',
          techStack: ['Python', 'FastAPI', 'Docker', 'PostgreSQL'],
          stars: 12 + (i % 15),
        },
      ],
      certifications: [
        {
          id: `cert-std-${i}-1`,
          name: i % 2 === 0 ? 'Oracle Certified Java Associate' : 'Google Cloud Digital Leader',
          issuer: i % 2 === 0 ? 'Oracle' : 'Google Cloud',
          issueDate: '2025-06-10',
        },
      ],
      internships: i % 2 === 0 ? [
        {
          id: `intern-std-${i}-1`,
          role: 'Backend Intern',
          company: i % 4 === 0 ? 'Wipro' : 'Infosys',
          duration: 'June 2025 - August 2025',
          description: 'Contributed to internal API gateway and performance monitoring benchmarks.',
        },
      ] : [],
      readinessScore: readiness,
      readinessBreakdown: {
        resume: Math.round(readiness * 0.95),
        skills: Math.round(readiness * 0.92),
        projects: Math.round(readiness * 1.05),
        communication: Math.round(readiness * 0.88),
        coding: Math.round(readiness * 0.9),
        interview: Math.round(readiness * 0.86),
      },
      xp: 400 + i * 45,
      level: Math.floor((400 + i * 45) / 200),
      achievements: ['Profile Verified', 'First Project Added'],
      createdAt: '2026-01-05T00:00:00Z',
    });
  }

  // Officer account
  users.push({
    id: 'usr-officer-1',
    email: 'officer@placementai.com',
    passwordHash: 'Demo@123',
    role: 'officer',
    name: 'Dr. Ramesh Ramanathan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  });

  // Recruiter account
  users.push({
    id: 'usr-recruiter-1',
    email: 'recruiter@placementai.com',
    passwordHash: 'Demo@123',
    role: 'recruiter',
    name: 'Sarah Jenkins (Google Tech Recruiting)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  });

  // Admin account
  users.push({
    id: 'usr-admin-1',
    email: 'admin@placementai.com',
    passwordHash: 'Demo@123',
    role: 'admin',
    name: 'Platform Administrator',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  });

  return { users, students };
}

// Generate 100+ Applications
export function generateSeedApplications(students: StudentRecord[], jobs: JobRecord[]): ApplicationRecord[] {
  const applications: ApplicationRecord[] = [];
  const stages: ApplicationRecord['currentStage'][] = [
    'Applied',
    'Assessment',
    'Shortlisted',
    'Technical Interview',
    'HR Interview',
    'Selected',
    'Rejected',
  ];

  // Specific applications for demo student: Suneel (std-1)
  // Suneel has 4 real applications in varying stages
  applications.push({
    id: 'app-suneel-1',
    jobId: 'job-1', // Google SDE
    studentId: 'std-1',
    studentName: 'Suneel Kumar',
    studentEmail: 'student@placementai.com',
    studentDepartment: 'Computer Science',
    studentCgpa: 8.4,
    companyName: 'Google',
    jobTitle: 'Software Development Engineer (SDE-1)',
    packageLPA: '₹32–42 LPA',
    currentStage: 'Technical Interview',
    stageHistory: [
      { stage: 'Applied', updatedAt: '2026-10-02T10:00:00Z', remarks: 'Application submitted with verified resume' },
      { stage: 'Assessment', updatedAt: '2026-10-05T14:30:00Z', remarks: 'Cleared Online Coding Assessment (Score: 94/100)' },
      { stage: 'Shortlisted', updatedAt: '2026-10-07T09:15:00Z', remarks: 'Shortlisted by Google Campus Talent Acquisition' },
      { stage: 'Technical Interview', updatedAt: '2026-10-09T11:00:00Z', remarks: 'Round 1 DSA & System Design scheduled' },
    ],
    aiMatchScore: 89,
    matchingSkills: ['Data Structures', 'Algorithms', 'C++', 'Java'],
    missingSkills: ['System Design (Advanced)'],
    interviewSchedule: {
      date: '2026-10-18',
      time: '11:00 AM IST',
      meetingLink: 'https://meet.google.com/abc-xyz-demo',
      interviewer: 'Sundar / Senior Staff Engineer',
    },
    appliedAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-09T11:00:00Z',
  });

  applications.push({
    id: 'app-suneel-2',
    jobId: 'job-2', // Google AI Engineer
    studentId: 'std-1',
    studentName: 'Suneel Kumar',
    studentEmail: 'student@placementai.com',
    studentDepartment: 'Computer Science',
    studentCgpa: 8.4,
    companyName: 'Google',
    jobTitle: 'AI / Machine Learning Engineer',
    packageLPA: '₹35–45 LPA',
    currentStage: 'Shortlisted',
    stageHistory: [
      { stage: 'Applied', updatedAt: '2026-10-03T11:20:00Z', remarks: 'Application submitted' },
      { stage: 'Assessment', updatedAt: '2026-10-06T16:00:00Z', remarks: 'ML algorithms assessment completed' },
      { stage: 'Shortlisted', updatedAt: '2026-10-08T18:00:00Z', remarks: 'Shortlisted based on Deep Learning certification and Chest X-ray project' },
    ],
    aiMatchScore: 87,
    matchingSkills: ['Python', 'SQL', 'PyTorch', 'Machine Learning'],
    missingSkills: ['TensorFlow', 'LLMs Deployment'],
    appliedAt: '2026-10-03T11:20:00Z',
    updatedAt: '2026-10-08T18:00:00Z',
  });

  applications.push({
    id: 'app-suneel-3',
    jobId: 'job-7', // Zomato Backend
    studentId: 'std-1',
    studentName: 'Suneel Kumar',
    studentEmail: 'student@placementai.com',
    studentDepartment: 'Computer Science',
    studentCgpa: 8.4,
    companyName: 'Zomato',
    jobTitle: 'Backend Engineer (FastAPI / Go)',
    packageLPA: '₹18–24 LPA',
    currentStage: 'Selected',
    stageHistory: [
      { stage: 'Applied', updatedAt: '2026-10-01T09:00:00Z', remarks: 'Application submitted' },
      { stage: 'Assessment', updatedAt: '2026-10-02T11:00:00Z', remarks: 'Cleared coding test' },
      { stage: 'Technical Interview', updatedAt: '2026-10-04T15:00:00Z', remarks: 'Cleared technical interview round' },
      { stage: 'HR Interview', updatedAt: '2026-10-05T17:00:00Z', remarks: 'Cleared HR discussion' },
      { stage: 'Selected', updatedAt: '2026-10-06T10:00:00Z', remarks: 'Formal offer extended: ₹22 LPA package' },
    ],
    aiMatchScore: 94,
    matchingSkills: ['Python', 'FastAPI', 'Redis', 'PostgreSQL'],
    missingSkills: ['Docker'],
    appliedAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-06T10:00:00Z',
  });

  applications.push({
    id: 'app-suneel-4',
    jobId: 'job-3', // Microsoft Azure
    studentId: 'std-1',
    studentName: 'Suneel Kumar',
    studentEmail: 'student@placementai.com',
    studentDepartment: 'Computer Science',
    studentCgpa: 8.4,
    companyName: 'Microsoft',
    jobTitle: 'Cloud Software Engineer (Azure)',
    packageLPA: '₹28–38 LPA',
    currentStage: 'Assessment',
    stageHistory: [
      { stage: 'Applied', updatedAt: '2026-10-04T14:00:00Z', remarks: 'Application submitted' },
      { stage: 'Assessment', updatedAt: '2026-10-06T10:00:00Z', remarks: 'Online Azure Systems test invite sent' },
    ],
    aiMatchScore: 78,
    matchingSkills: ['C++', 'Docker', 'Distributed Systems'],
    missingSkills: ['C#', 'Go', 'Kubernetes'],
    appliedAt: '2026-10-04T14:00:00Z',
    updatedAt: '2026-10-06T10:00:00Z',
  });

  // Now generate remaining ~100 applications across other students
  let count = 5;
  for (const std of students.slice(1, 45)) {
    // Each student applies to 2 or 3 jobs
    const eligibleJobs = jobs.filter(j => std.cgpa >= j.minCgpa && std.activeBacklogs <= j.maxBacklogs);
    const assignedJobs = eligibleJobs.slice(0, 2);

    for (const job of assignedJobs) {
      const stageIdx = (count * 3) % stages.length;
      const stage = stages[stageIdx];
      const match = Math.min(96, Math.max(62, Math.round(std.cgpa * 8.5 + (count % 12))));

      applications.push({
        id: `app-${count}`,
        jobId: job.id,
        studentId: std.id,
        studentName: std.name,
        studentEmail: std.email,
        studentDepartment: std.department,
        studentCgpa: std.cgpa,
        companyName: job.companyName,
        jobTitle: job.title,
        packageLPA: job.packageLPA,
        currentStage: stage,
        stageHistory: [
          { stage: 'Applied', updatedAt: '2026-10-01T10:00:00Z', remarks: 'Submitted through campus portal' },
          ...(stage !== 'Applied' ? [{ stage: 'Assessment', updatedAt: '2026-10-03T11:00:00Z', remarks: 'Assessment completed' }] : []),
          ...(stage === 'Shortlisted' || stage === 'Technical Interview' || stage === 'HR Interview' || stage === 'Selected' ? [{ stage: 'Shortlisted', updatedAt: '2026-10-05T12:00:00Z', remarks: 'Shortlisted by recruiter' }] : []),
          ...(stage === 'Technical Interview' || stage === 'HR Interview' || stage === 'Selected' ? [{ stage: 'Technical Interview', updatedAt: '2026-10-07T14:00:00Z', remarks: 'Technical round passed' }] : []),
          ...(stage === 'HR Interview' || stage === 'Selected' ? [{ stage: 'HR Interview', updatedAt: '2026-10-08T16:00:00Z', remarks: 'HR verification completed' }] : []),
          ...(stage === 'Selected' ? [{ stage: 'Selected', updatedAt: '2026-10-09T10:00:00Z', remarks: 'Offer released by HR' }] : []),
          ...(stage === 'Rejected' ? [{ stage: 'Rejected', updatedAt: '2026-10-04T12:00:00Z', remarks: 'Did not meet technical cutoff score' }] : []),
        ],
        aiMatchScore: match,
        matchingSkills: job.requiredSkills.slice(0, 3),
        missingSkills: job.requiredSkills.slice(3),
        appliedAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-08T10:00:00Z',
      });
      count++;
    }
  }

  return applications;
}

// Notifications
export const SEED_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    userId: 'usr-student-1',
    title: 'Google Technical Interview Scheduled! 🎯',
    message: 'Your Round 1 Technical Interview for Software Development Engineer (SDE-1) is scheduled for Oct 18 at 11:00 AM IST.',
    type: 'interview',
    isRead: false,
    createdAt: '2026-10-09T11:00:00Z',
    link: '/applications',
  },
  {
    id: 'notif-2',
    userId: 'usr-student-1',
    title: 'Offer Extended by Zomato! 🚀',
    message: 'Congratulations Suneel! Zomato has released a formal offer letter for Backend Engineer (₹22 LPA).',
    type: 'status',
    isRead: false,
    createdAt: '2026-10-06T10:00:00Z',
    link: '/applications',
  },
  {
    id: 'notif-3',
    userId: 'usr-student-1',
    title: 'New Placement Drive: Google AI Engineer',
    message: 'You match 87% of the criteria for Google AI / Machine Learning Engineer drive on Oct 22. Applications close soon.',
    type: 'drive',
    isRead: false,
    createdAt: '2026-10-02T11:00:00Z',
    link: '/jobs',
  },
  {
    id: 'notif-4',
    userId: 'usr-student-1',
    title: 'Placement Readiness Score Updated: 78/100',
    message: 'Your project additions boosted your Projects score to 90%. Review recommended SQL & DSA practice to hit 85+.',
    type: 'ai',
    isRead: true,
    createdAt: '2026-10-01T09:00:00Z',
    link: '/readiness',
  },
];

// Activity logs
export const SEED_ACTIVITIES: ActivityRecord[] = [
  { id: 'act-1', actor: 'Suneel Kumar', action: 'applied to', target: 'Google SDE-1 (₹32–42 LPA)', timestamp: '2 hours ago' },
  { id: 'act-2', actor: 'Placement Officer', action: 'scheduled placement drive for', target: 'Atlassian Full Stack Engineer', timestamp: '4 hours ago' },
  { id: 'act-3', actor: 'Sarah Jenkins (Google)', action: 'shortlisted 24 students for', target: 'Google AI / ML Engineer Drive', timestamp: '5 hours ago' },
  { id: 'act-4', actor: 'Aarav Patel', action: 'achieved ATS Score 88/100 on', target: 'Updated Resume Version 3', timestamp: '7 hours ago' },
  { id: 'act-5', actor: 'Zomato HR', action: 'extended offer to', target: 'Suneel Kumar (Backend Engineer ₹22 LPA)', timestamp: '1 day ago' },
  { id: 'act-6', actor: 'System AI', action: 'completed automated eligibility evaluation for', target: 'Microsoft Azure Drive (36 eligible)', timestamp: '1 day ago' },
];
