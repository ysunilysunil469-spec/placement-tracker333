import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Sparkles,
  ArrowRight,
  Bot,
  FileCheck2,
  Award,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Users,
  Building,
  GraduationCap,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSelectRole }) => {
  const journeySteps = [
    { title: 'Verified Profile', desc: 'Sync CGPA, backlogs, projects, and certifications' },
    { title: 'AI Assessment', desc: 'Readiness Score (78/100) and actionable diagnostics' },
    { title: 'Skill Improvement', desc: 'Targeted roadmap bridging corporate market gaps' },
    { title: 'Job Matching', desc: '87% ATS compatibility with automatic eligibility rules' },
    { title: 'Application Funnel', desc: 'Real-time multi-stage recruitment pipeline tracking' },
    { title: 'AI Interview Prep', desc: 'Technical & architectural simulation with real grading' },
    { title: 'Campus Placement 🎯', desc: 'Securing Super-Dream offers with verified offers' },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 text-center max-w-4xl mx-auto px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Campus Placement Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Your Career. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            Tracked by Intelligence.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          The unified full-stack ecosystem connecting engineering students, college placement cells, and premier corporate recruiters with automated eligibility engines, AI readiness scoring, and real-time career copilots.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group text-sm cursor-pointer"
          >
            <span>Launch Interactive Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onSelectRole('officer')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-750 transition-colors text-sm"
          >
            Explore Placement Officer View
          </button>
        </div>

        {/* Live Demo Quick Buttons */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="text-slate-400 font-mono">1-Click Demo Logins for Judges:</span>
          {[
            { role: 'student', label: 'Student (Suneel Kumar)' },
            { role: 'officer', label: 'Placement Officer (Dr. Ramesh)' },
            { role: 'recruiter', label: 'Recruiter (Google)' },
            { role: 'admin', label: 'Administrator' },
          ].map(r => (
            <button
              key={r.role}
              onClick={() => onSelectRole(r.role as UserRole)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 transition-colors font-mono font-medium"
            >
              {r.label}
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Placement Trajectory */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase text-indigo-400 font-semibold">End-to-End Recruitment Cycle</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            The 7-Step Placement Journey
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            From initial college enrollment to signing competitive ₹20L+ LPA employment contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {journeySteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                idx === 6 ? 'border-emerald-500/40 bg-gradient-to-br from-slate-900 to-emerald-950/20' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-indigo-400">
                  0{idx + 1}
                </span>
                {idx === 6 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Goal
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core AI Capabilities */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase text-indigo-400 font-semibold">Engineered with Purpose</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Built-In Intelligence Systems
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'AI Placement Readiness Engine',
              desc: 'Calculates dynamic candidate readiness scores (0-100) using holistic evaluation of CGPA, zero-backlog records, verified project repositories, and competitive problem-solving.',
              icon: Sparkles,
              score: '78/100 Readiness',
              accent: 'text-indigo-400',
            },
            {
              title: 'Context-Aware Career Copilot',
              desc: 'Interactive chat advisor that reads directly from the student database record to deliver personalized 30-day prep sprints, company eligibility checks, and resume reviews.',
              icon: Bot,
              score: 'Real-time Dialogue',
              accent: 'text-cyan-400',
            },
            {
              title: 'Recruiter ATS Resume Analyzer',
              desc: 'Parses resume text against corporate applicant tracking systems, flagging passive phrasing and generating actionable rewrites using the Google XYZ impact formula.',
              icon: FileCheck2,
              score: '84/100 ATS Score',
              accent: 'text-emerald-400',
            },
            {
              title: 'Automated Eligibility & Matching',
              desc: 'Instantly runs batch eligibility verification across 50+ students whenever a placement drive is scheduled, computing exact academic reasons for inclusion or exclusion.',
              icon: ShieldCheck,
              score: 'Deterministic Audit',
              accent: 'text-purple-400',
            },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className={`text-xs font-mono font-bold ${feat.accent}`}>
                    {feat.score}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Value Propositions */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">For Students</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Dynamic Readiness Score out of 100</li>
                <li className="flex items-center gap-2">✓ Career Copilot with personal database memory</li>
                <li className="flex items-center gap-2">✓ 1-Click apply to Tier-1 campus drives</li>
                <li className="flex items-center gap-2">✓ AI mock interview simulations</li>
              </ul>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">For Placement Officers</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Automatic student eligibility reports</li>
                <li className="flex items-center gap-2">✓ Department-wise placement rate analytics</li>
                <li className="flex items-center gap-2">✓ Instant notification dispatch to students</li>
                <li className="flex items-center gap-2">✓ Centralized recruitment funnel triage</li>
              </ul>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 mb-4">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">For Recruiters</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Pre-vetted candidate pool with AI Match scores</li>
                <li className="flex items-center gap-2">✓ Verified project portfolios & verified CGPA</li>
                <li className="flex items-center gap-2">✓ Direct interview scheduling with Google Meet</li>
                <li className="flex items-center gap-2">✓ Zero wasted time filtering ineligible resumes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Credentials Box for Hackathon Judges */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Hackathon Evaluation Reference
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Ready to Experience the Live Platform?
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Use any of the pre-configured accounts or switch roles seamlessly via the top judge toolbar.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            {[
              { role: 'Student', email: 'student@placementai.com', pass: 'Demo@123' },
              { role: 'Officer', email: 'officer@placementai.com', pass: 'Demo@123' },
              { role: 'Recruiter', email: 'recruiter@placementai.com', pass: 'Demo@123' },
              { role: 'Admin', email: 'admin@placementai.com', pass: 'Demo@123' },
            ].map(c => (
              <div key={c.role} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left">
                <span className="font-bold text-white block">{c.role}</span>
                <span className="text-[11px] font-mono text-indigo-400 block truncate">{c.email}</span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Pass: {c.pass}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors text-xs cursor-pointer"
            >
              Enter Placement Tracker AI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
