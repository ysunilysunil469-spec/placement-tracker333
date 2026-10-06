"""
Placement Tracker AI Database Seeder (Python/SQLAlchemy)
Seeds 50 students, 10 companies, 20 jobs, 10 placement drives, and 100+ applications.
"""
import os
import json
from app.database import SessionLocal, engine, Base
from app.models import User, Student, Company, Job, PlacementDrive, Application, Notification, ActivityLog

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Load from pre-generated seed json if available
    db_json_path = os.path.join(os.path.dirname(__file__), "..", "data", "db.json")
    if os.path.exists(db_json_path):
        with open(db_json_path, "r") as f:
            data = json.load(f)

        print(f"Seeding {len(data.get('users', []))} users, {len(data.get('students', []))} students, {len(data.get('jobs', []))} jobs...")

        for u in data.get("users", []):
            if not db.query(User).filter(User.id == u["id"]).first():
                db.add(User(
                    id=u["id"],
                    email=u["email"],
                    password_hash=u["passwordHash"],
                    name=u["name"],
                    role=u["role"],
                    avatar=u.get("avatar")
                ))

        for c in data.get("companies", []):
            if not db.query(Company).filter(Company.id == c["id"]).first():
                db.add(Company(
                    id=c["id"],
                    name=c["name"],
                    website=c.get("website"),
                    logo=c.get("logo"),
                    industry=c["industry"],
                    tier=c.get("tier", "Tier 1"),
                    headquarters=c.get("headquarters"),
                    description=c.get("description")
                ))

        for j in data.get("jobs", []):
            if not db.query(Job).filter(Job.id == j["id"]).first():
                db.add(Job(
                    id=j["id"],
                    company_id=j["companyId"],
                    company_name=j["companyName"],
                    title=j["title"],
                    role_type=j.get("roleType", "Full-Time"),
                    package_lpa=j["packageLPA"],
                    min_salary=j.get("minSalary", 8.0),
                    max_salary=j.get("maxSalary", 12.0),
                    location=j.get("location", "Bangalore"),
                    work_mode=j.get("workMode", "Hybrid"),
                    departments=j.get("departments", []),
                    min_cgpa=j.get("minCgpa", 7.0),
                    max_backlogs=j.get("maxBacklogs", 0),
                    required_skills=j.get("requiredSkills", []),
                    description=j.get("description")
                ))

        for s in data.get("students", []):
            if not db.query(Student).filter(Student.id == s["id"]).first():
                db.add(Student(
                    id=s["id"],
                    user_id=s["userId"],
                    roll_number=s["rollNumber"],
                    name=s["name"],
                    email=s["email"],
                    phone=s.get("phone"),
                    department=s["department"],
                    graduation_year=s.get("graduationYear", 2027),
                    cgpa=s.get("cgpa", 8.0),
                    active_backlogs=s.get("activeBacklogs", 0),
                    history_of_backlogs=s.get("historyOfBacklogs", 0),
                    bio=s.get("bio"),
                    location=s.get("location"),
                    github_url=s.get("githubUrl"),
                    linkedin_url=s.get("linkedinUrl"),
                    portfolio_url=s.get("portfolioUrl"),
                    resume_text=s.get("resumeText"),
                    skills=s.get("skills", []),
                    projects=s.get("projects", []),
                    certifications=s.get("certifications", []),
                    internships=s.get("internships", []),
                    readiness_score=s.get("readinessScore", 75),
                    readiness_breakdown=s.get("readinessBreakdown", {}),
                    xp=s.get("xp", 1000),
                    level=s.get("level", 5)
                ))

        db.commit()
        print("Database seeding completed successfully!")
    else:
        print("db.json not found, seeding default records.")

    db.close()

if __name__ == "__main__":
    seed_database()
