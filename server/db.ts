import fs from 'fs';
import path from 'path';
import {
  UserRecord,
  StudentRecord,
  CompanyRecord,
  JobRecord,
  DriveRecord,
  ApplicationRecord,
  NotificationRecord,
  ActivityRecord,
  SEED_COMPANIES,
  SEED_JOBS,
  SEED_DRIVES,
  generateSeedStudents,
  generateSeedApplications,
  SEED_NOTIFICATIONS,
  SEED_ACTIVITIES,
} from './data/seedData';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  users: UserRecord[];
  students: StudentRecord[];
  companies: CompanyRecord[];
  jobs: JobRecord[];
  drives: DriveRecord[];
  applications: ApplicationRecord[];
  notifications: NotificationRecord[];
  activities: ActivityRecord[];
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.students && parsed.jobs) {
          return parsed;
        }
      }
    } catch (e) {
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

    const initialData: DatabaseSchema = {
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

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json:', e);
    }
  }

  // Users
  getUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getAllUsers(): UserRecord[] {
    return this.data.users;
  }

  createUser(user: UserRecord): UserRecord {
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  // Students
  getStudentByUserId(userId: string): StudentRecord | undefined {
    return this.data.students.find(s => s.userId === userId);
  }

  getStudentById(id: string): StudentRecord | undefined {
    return this.data.students.find(s => s.id === id);
  }

  getAllStudents(): StudentRecord[] {
    return this.data.students;
  }

  createStudent(student: StudentRecord): StudentRecord {
    this.data.students.push(student);
    this.saveData();
    return student;
  }

  updateStudent(id: string, updates: Partial<StudentRecord>): StudentRecord | undefined {
    const idx = this.data.students.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    this.data.students[idx] = { ...this.data.students[idx], ...updates };
    this.saveData();
    return this.data.students[idx];
  }

  // Companies
  getAllCompanies(): CompanyRecord[] {
    return this.data.companies;
  }

  getCompanyById(id: string): CompanyRecord | undefined {
    return this.data.companies.find(c => c.id === id);
  }

  createCompany(company: CompanyRecord): CompanyRecord {
    this.data.companies.push(company);
    this.saveData();
    return company;
  }

  // Jobs
  getAllJobs(): JobRecord[] {
    return this.data.jobs;
  }

  getJobById(id: string): JobRecord | undefined {
    return this.data.jobs.find(j => j.id === id);
  }

  createJob(job: JobRecord): JobRecord {
    this.data.jobs.push(job);
    this.saveData();
    return job;
  }

  // Drives
  getAllDrives(): DriveRecord[] {
    return this.data.drives;
  }

  getDriveById(id: string): DriveRecord | undefined {
    return this.data.drives.find(d => d.id === id);
  }

  createDrive(drive: DriveRecord): DriveRecord {
    this.data.drives.push(drive);
    this.saveData();
    return drive;
  }

  // Applications
  getAllApplications(): ApplicationRecord[] {
    return this.data.applications;
  }

  getApplicationsByStudent(studentId: string): ApplicationRecord[] {
    return this.data.applications.filter(a => a.studentId === studentId);
  }

  getApplicationById(id: string): ApplicationRecord | undefined {
    return this.data.applications.find(a => a.id === id);
  }

  createApplication(app: ApplicationRecord): ApplicationRecord {
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

  updateApplicationStage(
    id: string,
    newStage: ApplicationRecord['currentStage'],
    remarks: string,
    interviewSchedule?: ApplicationRecord['interviewSchedule']
  ): ApplicationRecord | undefined {
    const app = this.data.applications.find(a => a.id === id);
    if (!app) return undefined;
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
  getNotificationsByUser(userId: string): NotificationRecord[] {
    return this.data.notifications.filter(n => n.userId === userId).reverse();
  }

  addNotification(notification: NotificationRecord): NotificationRecord {
    this.data.notifications.unshift(notification);
    this.saveData();
    return notification;
  }

  markNotificationsAsRead(userId: string): void {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    this.saveData();
  }

  // Activities
  getAllActivities(): ActivityRecord[] {
    return this.data.activities;
  }

  addActivity(activity: ActivityRecord): void {
    this.data.activities.unshift(activity);
    if (this.data.activities.length > 50) {
      this.data.activities = this.data.activities.slice(0, 50);
    }
    this.saveData();
  }

  // Eligibility evaluation engine
  evaluateEligibility(student: StudentRecord, minCgpa: number, maxBacklogs: number, allowedDepartments: string[]) {
    const reasons: string[] = [];
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
