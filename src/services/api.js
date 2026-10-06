const API_BASE = '/api';
function getAuthHeader() {
    const token = localStorage.getItem('token') || 'usr-student-1';
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}
export const api = {
    // Auth
    async login(email, password) {
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
    async register(data) {
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
    async getMe() {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: getAuthHeader(),
        });
        if (!res.ok)
            throw new Error('Failed to fetch user');
        return res.json();
    },
    // Students
    async getStudents(params) {
        const query = new URLSearchParams();
        if (params?.department)
            query.set('department', params.department);
        if (params?.minCgpa)
            query.set('minCgpa', String(params.minCgpa));
        if (params?.search)
            query.set('search', params.search);
        const res = await fetch(`${API_BASE}/students?${query.toString()}`, {
            headers: getAuthHeader(),
        });
        if (!res.ok)
            throw new Error('Failed to fetch students');
        return res.json();
    },
    async getMyProfile() {
        const res = await fetch(`${API_BASE}/students/me`, {
            headers: getAuthHeader(),
        });
        if (!res.ok)
            throw new Error('Failed to fetch student profile');
        return res.json();
    },
    async updateMyProfile(updates) {
        const res = await fetch(`${API_BASE}/students/me`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(updates),
        });
        if (!res.ok)
            throw new Error('Failed to update student profile');
        return res.json();
    },
    // Companies & Jobs
    async getCompanies() {
        const res = await fetch(`${API_BASE}/companies`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async createCompany(company) {
        const res = await fetch(`${API_BASE}/companies`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(company),
        });
        return res.json();
    },
    async getJobs(params) {
        const query = new URLSearchParams();
        if (params?.department)
            query.set('department', params.department);
        if (params?.roleType)
            query.set('roleType', params.roleType);
        if (params?.minSalary)
            query.set('minSalary', String(params.minSalary));
        if (params?.search)
            query.set('search', params.search);
        const res = await fetch(`${API_BASE}/jobs?${query.toString()}`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async getJobById(id) {
        const res = await fetch(`${API_BASE}/jobs/${id}`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async createJob(job) {
        const res = await fetch(`${API_BASE}/jobs`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(job),
        });
        return res.json();
    },
    // Drives
    async getDrives() {
        const res = await fetch(`${API_BASE}/placement-drives`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async createDrive(driveData) {
        const res = await fetch(`${API_BASE}/placement-drives`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(driveData),
        });
        return res.json();
    },
    async getDriveEligibilityReport(driveId) {
        const res = await fetch(`${API_BASE}/placement-drives/${driveId}/eligibility-report`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    // Applications
    async getApplications(params) {
        const query = new URLSearchParams();
        if (params?.studentId)
            query.set('studentId', params.studentId);
        if (params?.stage)
            query.set('stage', params.stage);
        const res = await fetch(`${API_BASE}/applications?${query.toString()}`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async applyToJob(jobId) {
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
    async updateApplicationStage(appId, stage, remarks, interviewSchedule) {
        const res = await fetch(`${API_BASE}/applications/${appId}/stage`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ stage, remarks, interviewSchedule }),
        });
        return res.json();
    },
    // Notifications
    async getNotifications() {
        const res = await fetch(`${API_BASE}/notifications`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async markAllNotificationsRead() {
        await fetch(`${API_BASE}/notifications/read-all`, {
            method: 'POST',
            headers: getAuthHeader(),
        });
    },
    // Analytics
    async getOfficerAnalytics() {
        const res = await fetch(`${API_BASE}/analytics/officer`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async getStudentAnalytics() {
        const res = await fetch(`${API_BASE}/analytics/student`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async getAdminAnalytics() {
        const res = await fetch(`${API_BASE}/analytics/admin`, {
            headers: getAuthHeader(),
        });
        return res.json();
    },
    // AI Services
    async getReadinessAssessment() {
        const res = await fetch(`${API_BASE}/ai/readiness`, {
            method: 'POST',
            headers: getAuthHeader(),
        });
        return res.json();
    },
    async askCareerCopilot(message, history = []) {
        const res = await fetch(`${API_BASE}/ai/career-chat`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ message, history }),
        });
        const data = await res.json();
        return data.reply;
    },
    async analyzeResume(resumeText, targetRole = 'Software Engineer') {
        const res = await fetch(`${API_BASE}/ai/resume-analysis`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ resumeText, targetRole }),
        });
        return res.json();
    },
    async getJobMatch(jobId) {
        const res = await fetch(`${API_BASE}/ai/job-match`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ jobId }),
        });
        return res.json();
    },
    async getInterviewQuestions(role = 'Software Engineer', difficulty = 'Medium') {
        const res = await fetch(`${API_BASE}/ai/interview-questions`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ role, difficulty }),
        });
        return res.json();
    },
    async evaluateInterviewAnswer(question, userAnswer, category = 'Technical') {
        const res = await fetch(`${API_BASE}/ai/interview-eval`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ question, userAnswer, category }),
        });
        return res.json();
    },
};
