# 🚀 Placement Tracker AI

> **"From College to Career — Track. Improve. Get Placed."**

An AI-powered, full-stack placement intelligence and recruitment ecosystem built for engineering students, university placement cells, and corporate recruiters.

---

## 🌟 Hackathon Highlights & Judge Walkthrough

### 1-Click Demo Accounts
The top toolbar features instant role switching with pre-configured accounts:

| Role | Email | Password | Primary Showcase |
|---|---|---|---|
| **Student (Suneel Kumar)** | `student@placementai.com` | `Demo@123` | Placement Readiness (78/100), Copilot AI, Resume ATS, 1-Click Apply |
| **Placement Officer (Dr. Ramesh)** | `officer@placementai.com` | `Demo@123` | Department Analytics, Auto-Eligibility Engine, Drive Scheduling |
| **Recruiter (Google Talent)** | `recruiter@placementai.com` | `Demo@123` | Candidate Pool Ranking, AI Match Scores, Interview Scheduling |
| **Platform Administrator** | `admin@placementai.com` | `Demo@123` | Live Activity Telemetry, User Directory, Governance Console |

---

## 🧠 Core AI Intelligence Features

1. **AI Placement Readiness Engine (`POST /api/ai/readiness`)**
   - Synthesizes candidate academic GPA, backlog history, verified projects, and competitive programming problems into an overall score out of 100.
   - Categorical breakdown across Resume ATS, Skills Depth, Projects, Communication, Coding/DSA, and Interview Readiness.
   - Generates strengths, weaknesses, and concrete high-yield next steps.

2. **Context-Aware Career Copilot (`POST /api/ai/career-chat`)**
   - Direct memory access to student's database dossier.
   - Answers questions regarding company prerequisites, missing skills for roles like AI Engineer, 30-day preparation roadmaps, and project reviews.

3. **Recruiter ATS Resume Analyzer (`POST /api/ai/resume-analysis`)**
   - Deep ATS parsing against corporate screening algorithms.
   - Identifies missing industry keywords.
   - Actionable rewrites converting weak descriptions into metric-driven Google XYZ achievements (`Accomplished [X] as measured by [Y], by doing [Z]`).

4. **Automated Eligibility Engine (`POST /api/placement-drives`)**
   - Automatically evaluates all 50+ students whenever a placement drive is scheduled.
   - Provides deterministic reasons for qualification or disqualification (e.g., `CGPA is 6.8, required is 7.5`).
   - Automatically dispatches notifications to eligible candidates.

5. **AI Interview Simulator (`POST /api/ai/interview-eval`)**
   - Generates targeted technical, system design, and behavioral questions.
   - Evaluates candidate answers with a 0.0 to 10.0 score, constructive critique, and benchmark model answers.

---

## 🏗️ Technology Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Responsive Design
- **Full-Stack Server:** Express, TypeScript, Vite Middlewares, Server-Side Gemini API SDK (`@google/genai` with `gemini-3.8-flash`)
- **Database & Persistence:** Relational file-backed database store with 50+ students, 10 companies, 20 jobs, 10 drives, and 100+ applications.
- **Python Backend & Docker:** FastAPI, SQLAlchemy, Pydantic, PostgreSQL support via `docker-compose.yml`.

---

## 🚀 Running Locally

### Development Mode (Full-Stack Express + Vite)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Compose (Multi-container with PostgreSQL & FastAPI)
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs (Swagger): `http://localhost:8000/docs`
