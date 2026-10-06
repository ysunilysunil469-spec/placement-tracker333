import fs from 'fs';
import path from 'path';
import { SEED_COMPANIES, SEED_JOBS, SEED_DRIVES, generateSeedStudents, generateSeedApplications, SEED_NOTIFICATIONS, SEED_ACTIVITIES, } from './data/seedData';
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
class Database {
    constructor() {
        this.data = this.loadOrInitialize();
    }
    loadOrInitialize() {
        try {
            if (fs.existsSync(DB_FILE)) {
                const raw = fs.readFileSync(DB_FILE, 'utf-8');
                const parsed = JSON.parse(raw);
                if (parsed.users && parsed.students && parsed.jobs) {
                    return parsed;
                }
            }
        }
        catch (e) {
            console.warn('Failed to load existing db.json, generating fresh seed data...', e);
        }
        // Initialize fresh seed data
        const { users, students } = generateSeedStudents();
        const companies = [...SEED_COMPANIES];
        const jobs = [...SEED_JOBS];
        const drives = [...SEED_DRIVES];
        const applications = generateSeedApplications(students, jobs);
        const notifications = [...SEED_NOTIFICATIONS];
        const activities = [...SEED_ACTIVITIES];
        const initialData = {
            users,
            students,
            companies,
            jobs,
            drives,
            applications,
            notifications,
            activities,
        };
        this.saveData(initialData);
        return initialData;
    }
    saveData(dataToSave) {
        try {
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true });
            }
            fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
        }
        catch (e) {
            console.error('Failed to write db.json:', e);
        }
    }
    // Users
    getUserByEmail(email) {
        return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    getUserById(id) {
        return this.data.users.find(u => u.id === id);
    }
    getAllUsers() {
        return this.data.users;
    }
    createUser(user) {
        this.data.users.push(user);
        this.saveData();
        return user;
    }
    // Students
    getStudentByUserId(userId) {
        return this.data.students.find(s => s.userId === userId);
    }
    getStudentById(id) {
        return this.data.students.find(s => s.id === id);
    }
    getAllStudents() {
        return this.data.students;
    }
    createStudent(student) {
        this.data.students.push(student);
        this.saveData();
        return student;
    }
    updateStudent(id, updates) {
        const idx = this.data.students.findIndex(s => s.id === id);
        if (idx === -1)
            return undefined;
        this.data.students[idx] = { ...this.data.students[idx], ...updates };
        this.saveData();
        return this.data.students[idx];
    }
    // Companies
    getAllCompanies() {
        return this.data.companies;
    }
    getCompanyById(id) {
        return this.data.companies.find(c => c.id === id);
    }
    createCompany(company) {
        this.data.companies.push(company);
        this.saveData();
        return company;
    }
    // Jobs
    getAllJobs() {
        return this.data.jobs;
    }
    getJobById(id) {
        return this.data.jobs.find(j => j.id === id);
    }
    createJob(job) {
        this.data.jobs.push(job);
        this.saveData();
        return job;
    }
    // Drives
    getAllDrives() {
        return this.data.drives;
    }
    getDriveById(id) {
        return this.data.drives.find(d => d.id === id);
    }
    createDrive(drive) {
        this.data.drives.push(drive);
        this.saveData();
        return drive;
    }
    // Applications
    getAllApplications() {
        return this.data.applications;
    }
    getApplicationsByStudent(studentId) {
        return this.data.applications.filter(a => a.studentId === studentId);
    }
    getApplicationById(id) {
        return this.data.applications.find(a => a.id === id);
    }
    createApplication(app) {
        this.data.applications.push(app);
        // Add activity
        this.addActivity({
            id: `act-${Date.now()}`,
            actor: app.studentName,
            action: 'applied to',
            target: `${app.companyName} (${app.jobTitle})`,
            timestamp: 'Just now',
        });
        this.saveData();
        return app;
    }
    updateApplicationStage(id, newStage, remarks, interviewSchedule) {
        const app = this.data.applications.find(a => a.id === id);
        if (!app)
            return undefined;
        app.currentStage = newStage;
        app.updatedAt = new Date().toISOString();
        if (interviewSchedule) {
            app.interviewSchedule = interviewSchedule;
        }
        app.stageHistory.push({
            stage: newStage,
            updatedAt: new Date().toISOString(),
            remarks,
        });
        // Notify student
        const student = this.getStudentById(app.studentId);
        if (student) {
            this.addNotification({
                id: `notif-${Date.now()}`,
                userId: student.userId,
                title: `Status Update: ${app.companyName}`,
                message: `Your application for ${app.jobTitle} moved to "${newStage}". Remarks: ${remarks}`,
                type: newStage.toLowerCase().includes('interview') ? 'interview' : 'status',
                isRead: false,
                createdAt: new Date().toISOString(),
                link: '/applications',
            });
        }
        this.addActivity({
            id: `act-${Date.now()}`,
            actor: 'Placement Office',
            action: `updated application stage to "${newStage}" for`,
            target: `${app.studentName} at ${app.companyName}`,
            timestamp: 'Just now',
        });
        this.saveData();
        return app;
    }
    // Notifications
    getNotificationsByUser(userId) {
        return this.data.notifications.filter(n => n.userId === userId).reverse();
    }
    addNotification(notification) {
        this.data.notifications.unshift(notification);
        this.saveData();
        return notification;
    }
    markNotificationsAsRead(userId) {
        this.data.notifications.forEach(n => {
            if (n.userId === userId) {
                n.isRead = true;
            }
        });
        this.saveData();
    }
    // Activities
    getAllActivities() {
        return this.data.activities;
    }
    addActivity(activity) {
        this.data.activities.unshift(activity);
        if (this.data.activities.length > 50) {
            this.data.activities = this.data.activities.slice(0, 50);
        }
        this.saveData();
    }
    // Eligibility evaluation engine
    evaluateEligibility(student, minCgpa, maxBacklogs, allowedDepartments) {
        const reasons = [];
        let isEligible = true;
        if (student.cgpa < minCgpa) {
            isEligible = false;
            reasons.push(`CGPA is ${student.cgpa.toFixed(1)} (minimum required is ${minCgpa.toFixed(1)})`);
        }
        if (student.activeBacklogs > maxBacklogs) {
            isEligible = false;
            reasons.push(`Active backlogs: ${student.activeBacklogs} (maximum allowed is ${maxBacklogs})`);
        }
        if (allowedDepartments.length > 0 && !allowedDepartments.includes(student.department)) {
            isEligible = false;
            reasons.push(`Department is ${student.department} (eligible: ${allowedDepartments.join(', ')})`);
        }
        return {
            isEligible,
            reasons: isEligible ? ['Meets all academic, department, and backlog prerequisites'] : reasons,
        };
    }
}
export const db = new Database();
