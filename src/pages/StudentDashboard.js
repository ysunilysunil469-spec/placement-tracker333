import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { RoadmapInteractive } from '../components/common/RoadmapInteractive';
import { Sparkles, Bot, FileCheck2, Award, Briefcase, Calendar, ExternalLink, ChevronRight, CheckCircle2, AlertCircle, Lightbulb, } from 'lucide-react';
export const StudentDashboard = ({ onNavigate, onOpenCopilot }) => {
    const { student, user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [readiness, setReadiness] = useState(null);
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
        }
        catch (e) {
            console.warn('Dashboard data fetch error:', e);
        }
        finally {
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
    return (_jsxs("div", { className: "space-y-6 pb-12", children: [_jsxs("div", { className: "bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl", children: [_jsx("div", { className: "absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider font-semibold mb-1", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " Placement Intelligence Command Center"] }), _jsxs("h1", { className: "text-2xl sm:text-3xl font-extrabold text-white tracking-tight", children: ["Good morning, ", student?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Suneel', " \uD83D\uDC4B"] }), _jsxs("p", { className: "text-sm text-slate-300 mt-1 max-w-xl", children: ["Your placement journey is ", _jsxs("strong", { className: "text-indigo-400 font-semibold", children: [currentScore, "% complete"] }), ". You have secured 1 Tier-1 offer and have a technical interview coming up with Google."] }), _jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-3 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400" }), _jsxs("span", { children: ["CGPA: ", _jsxs("strong", { children: [student?.cgpa.toFixed(1) || '8.4', "/10.0"] })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-indigo-400" }), _jsxs("span", { children: ["Department: ", _jsx("strong", { children: student?.department || 'Computer Science' })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-purple-400" }), _jsxs("span", { children: ["Level: ", _jsxs("strong", { children: [student?.level || 7, " (Placement Warrior)"] })] })] })] })] }), _jsxs("div", { className: "bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 text-right lg:min-w-[220px]", children: [_jsxs("div", { className: "flex items-center justify-between lg:justify-end gap-2 text-xs font-mono text-slate-400", children: [_jsx(Award, { className: "w-4 h-4 text-amber-400" }), _jsxs("span", { className: "font-semibold text-slate-300", children: ["Level ", student?.level || 7, " Scholar"] })] }), _jsxs("div", { className: "text-2xl font-mono font-bold text-white mt-1", children: [student?.xp?.toLocaleString() || '1,240', " ", _jsx("span", { className: "text-xs text-slate-400 font-normal", children: "XP" })] }), _jsx("div", { className: "w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full", style: { width: '74%' } }) }), _jsx("span", { className: "text-[10px] text-slate-400 mt-1 block", children: "160 XP to Level 8 unlocked" })] })] })] }), upcomingInterview && (_jsxs("div", { className: "bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-indigo-950/50", children: [_jsxs("div", { className: "flex items-start sm:items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300", children: _jsx(Calendar, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium", children: "Confirmed Interview" }), _jsxs("span", { className: "text-xs text-slate-400", children: [upcomingInterview.interviewSchedule?.date, " at ", upcomingInterview.interviewSchedule?.time] })] }), _jsxs("h3", { className: "text-sm font-bold text-white mt-0.5", children: [upcomingInterview.companyName, " \u2014 ", upcomingInterview.jobTitle] }), _jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: ["Interviewer: ", upcomingInterview.interviewSchedule?.interviewer] })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0 w-full sm:w-auto", children: [_jsxs("button", { onClick: () => onNavigate('interview'), className: "flex-1 sm:flex-none px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5", children: [_jsx(Award, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Practice AI Mock Interview" })] }), upcomingInterview.interviewSchedule?.meetingLink && (_jsxs("a", { href: upcomingInterview.interviewSchedule.meetingLink, target: "_blank", rel: "noreferrer", className: "px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-slate-750", children: [_jsx("span", { children: "Join Meet" }), _jsx(ExternalLink, { className: "w-3 h-3" })] }))] })] })), _jsx(ScoreGauge, { score: currentScore, grade: readiness?.grade || 'Placement Ready', breakdown: breakdown, size: "lg" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase font-semibold mb-3", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), " Core Profile Strengths"] }), _jsx("ul", { className: "space-y-2.5 text-xs text-slate-300", children: (readiness?.strengths || [
                                    `High academic standing (CGPA ${student?.cgpa.toFixed(1) || '8.4'}) with zero active backlogs.`,
                                    'Strong technical portfolio with 3 verified production applications.',
                                    'Advanced mastery of Python, algorithms, and deep learning architectures.',
                                ]).map((s, idx) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-emerald-400 shrink-0 mt-0.5", children: "\u2713" }), _jsx("span", { className: "leading-relaxed", children: s })] }, idx))) })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-semibold mb-3", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), " Priority Areas to Address"] }), _jsx("ul", { className: "space-y-2.5 text-xs text-slate-300", children: (readiness?.weaknesses || [
                                    'SQL query joins and window functions need validated problem submissions.',
                                    'Docker & Containerized deployment pipelines are currently missing from resume.',
                                    'Quantifiable business metrics should be added to internship descriptions.',
                                ]).map((w, idx) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-amber-400 shrink-0 mt-0.5", children: "\u26A0" }), _jsx("span", { className: "leading-relaxed", children: w })] }, idx))) })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden", children: [_jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" }), _jsxs("div", { className: "flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase font-semibold mb-3", children: [_jsx(Lightbulb, { className: "w-4 h-4" }), " High-Impact Next Steps"] }), _jsx("ul", { className: "space-y-2.5 text-xs text-slate-200", children: (readiness?.recommendations || [
                                    'Dedicate 30 minutes to complete 10 SQL aggregation problems on LeetCode.',
                                    'Containerize your chest X-ray classifier with Docker & add to GitHub.',
                                    'Run the AI Resume Analyzer on your PDF to reach 90+ ATS compatibility.',
                                ]).map((r, idx) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsxs("span", { className: "text-indigo-400 font-mono font-bold shrink-0", children: ["0", idx + 1, "."] }), _jsx("span", { className: "leading-relaxed text-slate-300", children: r })] }, idx))) }), _jsxs("button", { onClick: onOpenCopilot, className: "mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-xs font-medium transition-colors border border-indigo-500/30 flex items-center justify-center gap-1.5", children: [_jsx(Bot, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Consult Copilot for Deep Breakdown" })] })] })] }), _jsx(RoadmapInteractive, { currentSkills: student?.skills.map(s => s.name) || ['Python', 'React', 'FastAPI', 'DSA'] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-white tracking-tight", children: "Active Recruitment Pipeline" }), _jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: ["Tracking ", applications.length, " submitted applications across campus drives."] })] }), _jsxs("button", { onClick: () => onNavigate('applications'), className: "text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors", children: [_jsxs("span", { children: ["View All (", applications.length, ")"] }), _jsx(ChevronRight, { className: "w-4 h-4" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: applications.slice(0, 4).map(app => {
                            const isOffer = app.currentStage === 'Selected';
                            const isInterview = app.currentStage.includes('Interview');
                            return (_jsxs("div", { className: `p-4 rounded-xl border transition-all ${isOffer
                                    ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
                                    : isInterview
                                        ? 'bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20'
                                        : 'bg-slate-950/60 border-slate-800'}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("h4", { className: "font-bold text-sm text-white truncate", children: app.companyName }), _jsx("span", { className: `text-[10px] font-mono px-2 py-0.5 rounded font-medium shrink-0 ${isOffer
                                                    ? 'bg-emerald-500/20 text-emerald-300'
                                                    : isInterview
                                                        ? 'bg-indigo-500/20 text-indigo-300'
                                                        : 'bg-slate-800 text-slate-300'}`, children: app.currentStage })] }), _jsx("p", { className: "text-xs text-slate-400 truncate mt-1", children: app.jobTitle }), _jsxs("div", { className: "mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs", children: [_jsx("span", { className: "font-mono font-semibold text-slate-300", children: app.packageLPA }), _jsxs("span", { className: "text-[11px] font-mono text-indigo-400 font-semibold", children: [app.aiMatchScore, "% Match"] })] })] }, app.id));
                        }) })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
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
                    return (_jsxs("button", { onClick: item.action, className: `p-4 rounded-xl border bg-gradient-to-br text-left transition-all hover:scale-[1.02] shadow-lg group ${item.accent}`, children: [_jsx(Icon, { className: "w-5 h-5 text-white mb-2 group-hover:scale-110 transition-transform" }), _jsx("h4", { className: "font-bold text-sm text-white", children: item.title }), _jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: item.desc })] }, idx));
                }) })] }));
};
