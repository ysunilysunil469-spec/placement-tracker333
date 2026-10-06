from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="student") # student, officer, recruiter, admin
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student_profile = relationship("Student", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    roll_number = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=False)
    graduation_year = Column(Integer, default=2027)
    cgpa = Column(Float, default=0.0)
    active_backlogs = Column(Integer, default=0)
    history_of_backlogs = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)
    skills = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    internships = Column(JSON, default=list)
    readiness_score = Column(Integer, default=60)
    readiness_breakdown = Column(JSON, default=dict)
    xp = Column(Integer, default=100)
    level = Column(Integer, default=1)
    achievements = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student")

class Company(Base):
    __tablename__ = "companies"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    website = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    industry = Column(String, nullable=False)
    tier = Column(String, default="Tier 1")
    headquarters = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("Job", back_populates="company")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, ForeignKey("companies.id"))
    company_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    role_type = Column(String, default="Full-Time")
    package_lpa = Column(String, nullable=False)
    min_salary = Column(Float, default=0.0)
    max_salary = Column(Float, default=0.0)
    location = Column(String, default="Bangalore")
    work_mode = Column(String, default="Hybrid")
    departments = Column(JSON, default=list)
    min_cgpa = Column(Float, default=7.0)
    max_backlogs = Column(Integer, default=0)
    required_skills = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    deadline = Column(String, nullable=True)
    openings = Column(Integer, default=10)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class PlacementDrive(Base):
    __tablename__ = "placement_drives"
    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=True)
    company_id = Column(String, ForeignKey("companies.id"))
    company_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    package_lpa = Column(String, nullable=False)
    location = Column(String, default="Bangalore")
    drive_date = Column(String, nullable=False)
    min_cgpa = Column(Float, default=7.0)
    max_backlogs = Column(Integer, default=0)
    required_skills = Column(JSON, default=list)
    eligible_departments = Column(JSON, default=list)
    graduation_year = Column(Integer, default=2027)
    eligible_student_count = Column(Integer, default=0)
    ineligible_student_count = Column(Integer, default=0)
    status = Column(String, default="Scheduled")
    created_at = Column(DateTime, default=datetime.utcnow)

class Application(Base):
    __tablename__ = "applications"
    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"))
    student_id = Column(String, ForeignKey("students.id"))
    student_name = Column(String, nullable=False)
    student_email = Column(String, nullable=False)
    student_department = Column(String, nullable=False)
    student_cgpa = Column(Float, default=0.0)
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    package_lpa = Column(String, nullable=False)
    current_stage = Column(String, default="Applied")
    stage_history = Column(JSON, default=list)
    ai_match_score = Column(Integer, default=75)
    matching_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    interview_schedule = Column(JSON, nullable=True)
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="system")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    link = Column(String, nullable=True)

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(String, primary_key=True, index=True)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    target = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
