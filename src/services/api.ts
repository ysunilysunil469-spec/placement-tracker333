import {
  User,
  Student,
  Company,
  Job,
  PlacementDrive,
  Application,
  NotificationItem,
  ReadinessReport,
  ResumeAnalysis,
  JobMatchReport,
  InterviewQuestion,
  InterviewEvaluation,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('token') || 'usr-student-1';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ token: string; user: User; student?: Student }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: { name: string; email: string; password?: string; role?: string; department?: string; cgpa?: number }): Promise<{ token: string; user: User; student?: Student }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User; student?: Student }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  // Students
  async getStudents(params?: { department?: string; minCgpa?: number; search?: string }): Promise<Student[]> {
    const query = new URLSearchParams();
    if (params?.department) query.set('department', params.department);
    if (params?.minCgpa) query.set('minCgpa', String(params.minCgpa));
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${API_BASE}/students?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getMyProfile(): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch student profile');
    return res.json();
  },

  async updateMyProfile(updates: Partial<Student>): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/me`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update student profile');
    return res.json();
  },

  // Companies & Jobs
  async getCompanies(): Promise<Company[]> {
    const res = await fetch(`${API_BASE}/companies`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async createCompany(company: Partial<Company>): Promise<Company> {
    const res = await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(company),
    });
    return res.json();
  },

  async getJobs(params?: { department?: string; roleType?: string; minSalary?: number; search?: string }): Promise<Job[]> {
    const query = new URLSearchParams();
    if (params?.department) query.set('department', params.department);
    if (params?.roleType) query.set('roleType', params.roleType);
    if (params?.minSalary) query.set('minSalary', String(params.minSalary));
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${API_BASE}/jobs?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getJobById(id: string): Promise<Job> {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async createJob(job: Partial<Job>): Promise<Job> {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(job),
    });
    return res.json();
  },

  // Drives
  async getDrives(): Promise<PlacementDrive[]> {
    const res = await fetch(`${API_BASE}/placement-drives`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async createDrive(driveData: any): Promise<PlacementDrive> {
    const res = await fetch(`${API_BASE}/placement-drives`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(driveData),
    });
    return res.json();
  },

  async getDriveEligibilityReport(driveId: string): Promise<{
    drive: PlacementDrive;
    totalStudents: number;
    eligibleCount: number;
    ineligibleCount: number;
    eligibleStudents: any[];
    ineligibleStudents: any[];
  }> {
    const res = await fetch(`${API_BASE}/placement-drives/${driveId}/eligibility-report`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Applications
  async getApplications(params?: { studentId?: string; stage?: string }): Promise<Application[]> {
    const query = new URLSearchParams();
    if (params?.studentId) query.set('studentId', params.studentId);
    if (params?.stage) query.set('stage', params.stage);
    const res = await fetch(`${API_BASE}/applications?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async applyToJob(jobId: string): Promise<Application> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ jobId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit application');
    }
    return res.json();
  },

  async updateApplicationStage(
    appId: string,
    stage: string,
    remarks?: string,
    interviewSchedule?: any
  ): Promise<Application> {
    const res = await fetch(`${API_BASE}/applications/${appId}/stage`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ stage, remarks, interviewSchedule }),
    });
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
  },

  // Analytics
  async getOfficerAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/officer`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getStudentAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/student`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getAdminAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/admin`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // AI Services
  async getReadinessAssessment(): Promise<ReadinessReport> {
    const res = await fetch(`${API_BASE}/ai/readiness`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async askCareerCopilot(message: string, history: any[] = []): Promise<string> {
    const res = await fetch(`${API_BASE}/ai/career-chat`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ message, history }),
    });
    const data = await res.json();
    return data.reply;
  },

  async analyzeResume(resumeText?: string, targetRole: string = 'Software Engineer'): Promise<ResumeAnalysis> {
    const res = await fetch(`${API_BASE}/ai/resume-analysis`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ resumeText, targetRole }),
    });
    return res.json();
  },

  async getJobMatch(jobId: string): Promise<JobMatchReport> {
    const res = await fetch(`${API_BASE}/ai/job-match`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ jobId }),
    });
    return res.json();
  },

  async getInterviewQuestions(role: string = 'Software Engineer', difficulty: string = 'Medium'): Promise<InterviewQuestion[]> {
    const res = await fetch(`${API_BASE}/ai/interview-questions`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ role, difficulty }),
    });
    return res.json();
  },

  async evaluateInterviewAnswer(question: string, userAnswer: string, category: string = 'Technical'): Promise<InterviewEvaluation> {
    const res = await fetch(`${API_BASE}/ai/interview-eval`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ question, userAnswer, category }),
    });
    return res.json();
  },
};
