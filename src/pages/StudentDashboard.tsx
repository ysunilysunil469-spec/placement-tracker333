import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Application, ReadinessReport } from '../types';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { RoadmapInteractive } from '../components/common/RoadmapInteractive';
import {
  Sparkles,
  ArrowRight,
  Bot,
  FileCheck2,
  Award,
  Briefcase,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenCopilot: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onOpenCopilot }) => {
  const { student, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [readiness, setReadiness] = useState<ReadinessReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [student]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [apps, ready] = await Promise.all([
        api.getApplications(),
        api.getReadinessAssessment(),
      ]);
      setApplications(apps);
      setReadiness(ready);
    } catch (e) {
      console.warn('Dashboard data fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const currentScore = readiness?.score || student?.readinessScore || 78;
  const breakdown = readiness?.categoryBreakdown || student?.readinessBreakdown || {
    resume: 85,
    skills: 72,
    projects: 90,
    communication: 65,
    coding: 70,
    interview: 68,
  };

  const upcomingInterview = applications.find(a => a.interviewSchedule && a.currentStage === 'Technical Interview');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Placement Intelligence Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {student?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Suneel'} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Your placement journey is <strong className="text-indigo-400 font-semibold">{currentScore}% complete</strong>.
              You have secured 1 Tier-1 offer and have a technical interview coming up with Google.
            </p>

            {/* Quick Status Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>CGPA: <strong>{student?.cgpa.toFixed(1) || '8.4'}/10.0</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Department: <strong>{student?.department || 'Computer Science'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Level: <strong>{student?.level || 7} (Placement Warrior)</strong></span>
              </div>
            </div>
          </div>

          {/* Gamification / XP Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 text-right lg:min-w-[220px]">
            <div className="flex items-center justify-between lg:justify-end gap-2 text-xs font-mono text-slate-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-300">Level {student?.level || 7} Scholar</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white mt-1">
              {student?.xp?.toLocaleString() || '1,240'} <span className="text-xs text-slate-400 font-normal">XP</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full" style={{ width: '74%' }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              160 XP to Level 8 unlocked
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Interview Callout Banner (if present) */}
      {upcomingInterview && (
        <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-indigo-950/50">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                  Confirmed Interview
                </span>
                <span className="text-xs text-slate-400">
                  {upcomingInterview.interviewSchedule?.date} at {upcomingInterview.interviewSchedule?.time}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {upcomingInterview.companyName} — {upcomingInterview.jobTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Interviewer: {upcomingInterview.interviewSchedule?.interviewer}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('interview')}
              className="flex-1 sm:flex-none px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Practice AI Mock Interview</span>
            </button>
            {upcomingInterview.interviewSchedule?.meetingLink && (
              <a
                href={upcomingInterview.interviewSchedule.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-slate-750"
              >
                <span>Join Meet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Flagship Placement Readiness Score Widget */}
      <ScoreGauge
        score={currentScore}
        grade={readiness?.grade || 'Placement Ready'}
        breakdown={breakdown}
        size="lg"
      />

      {/* AI Diagnostic: Strengths, Weaknesses, Priority AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase font-semibold mb-3">
            <CheckCircle2 className="w-4 h-4" /> Core Profile Strengths
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(readiness?.strengths || [
              `High academic standing (CGPA ${student?.cgpa.toFixed(1) || '8.4'}) with zero active backlogs.`,
              'Strong technical portfolio with 3 verified production applications.',
              'Advanced mastery of Python, algorithms, and deep learning architectures.',
            ]).map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Gaps */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-semibold mb-3">
            <AlertCircle className="w-4 h-4" /> Priority Areas to Address
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(readiness?.weaknesses || [
              'SQL query joins and window functions need validated problem submissions.',
              'Docker & Containerized deployment pipelines are currently missing from resume.',
              'Quantifiable business metrics should be added to internship descriptions.',
            ]).map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 shrink-0 mt-0.5">⚠</span>
                <span className="leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase font-semibold mb-3">
            <Lightbulb className="w-4 h-4" /> High-Impact Next Steps
          </div>
          <ul className="space-y-2.5 text-xs text-slate-200">
            {(readiness?.recommendations || [
              'Dedicate 30 minutes to complete 10 SQL aggregation problems on LeetCode.',
              'Containerize your chest X-ray classifier with Docker & add to GitHub.',
              'Run the AI Resume Analyzer on your PDF to reach 90+ ATS compatibility.',
            ]).map((r, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold shrink-0">0{idx + 1}.</span>
                <span className="leading-relaxed text-slate-300">{r}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={onOpenCopilot}
            className="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-xs font-medium transition-colors border border-indigo-500/30 flex items-center justify-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Consult Copilot for Deep Breakdown</span>
          </button>
        </div>
      </div>

      {/* Interactive Career Roadmap */}
      <RoadmapInteractive currentSkills={student?.skills.map(s => s.name) || ['Python', 'React', 'FastAPI', 'DSA']} />

      {/* Active Applications Pipeline Snapshot */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Active Recruitment Pipeline</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracking {applications.length} submitted applications across campus drives.</p>
          </div>
          <button
            onClick={() => onNavigate('applications')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All ({applications.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {applications.slice(0, 4).map(app => {
            const isOffer = app.currentStage === 'Selected';
            const isInterview = app.currentStage.includes('Interview');
            return (
              <div
                key={app.id}
                className={`p-4 rounded-xl border transition-all ${
                  isOffer
                    ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : isInterview
                    ? 'bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-white truncate">{app.companyName}</h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium shrink-0 ${
                      isOffer
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isInterview
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {app.currentStage}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-1">{app.jobTitle}</p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-300">{app.packageLPA}</span>
                  <span className="text-[11px] font-mono text-indigo-400 font-semibold">{app.aiMatchScore}% Match</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            title: 'Career Copilot',
            desc: 'AI placement advisor',
            icon: Bot,
            action: () => onNavigate('copilot'),
            accent: 'from-indigo-600/20 to-indigo-900/10 border-indigo-500/30 hover:border-indigo-500',
          },
          {
            title: 'Resume Analyzer',
            desc: 'ATS score & rewrites',
            icon: FileCheck2,
            action: () => onNavigate('resume'),
            accent: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/30 hover:border-cyan-500',
          },
          {
            title: 'Interview Simulator',
            desc: 'AI questions & scoring',
            icon: Award,
            action: () => onNavigate('interview'),
            accent: 'from-purple-600/20 to-purple-900/10 border-purple-500/30 hover:border-purple-500',
          },
          {
            title: 'Explore Jobs',
            desc: '20+ campus opportunities',
            icon: Briefcase,
            action: () => onNavigate('jobs'),
            accent: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/30 hover:border-emerald-500',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action}
              className={`p-4 rounded-xl border bg-gradient-to-br text-left transition-all hover:scale-[1.02] shadow-lg group ${item.accent}`}
            >
              <Icon className="w-5 h-5 text-white mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-white">{item.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
