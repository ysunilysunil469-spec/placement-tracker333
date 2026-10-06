import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileText, Calendar, CheckCircle2, ExternalLink, Award, } from 'lucide-react';
export const ApplicationTrackerPage = ({ onNavigateToInterview }) => {
    const [applications, setApplications] = useState([]);
    const [stageFilter, setStageFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        loadApplications();
    }, [stageFilter]);
    const loadApplications = async () => {
        setIsLoading(true);
        try {
            const data = await api.getApplications({
                stage: stageFilter !== 'All' ? stageFilter : undefined,
            });
            setApplications(data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const STAGES = [
        'Applied',
        'Assessment',
        'Shortlisted',
        'Technical Interview',
        'HR Interview',
        'Selected',
    ];
    const getStageIndex = (stage) => {
        if (stage === 'Rejected')
            return -1;
        return STAGES.indexOf(stage);
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(FileText, { className: "w-3.5 h-3.5" }), " Campus Recruitment Funnel"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Application Pipeline Tracker" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Monitor your recruitment stages, online assessments, technical rounds, and formal job offers in real time." })] }), _jsx("div", { className: "flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs", children: ['All', 'Applied', 'Assessment', 'Shortlisted', 'Technical Interview', 'Selected', 'Rejected'].map(s => (_jsx("button", { onClick: () => setStageFilter(s), className: `px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${stageFilter === s
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`, children: s }, s))) }), isLoading ? (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map(i => (_jsx("div", { className: "h-44 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" }, i))) })) : applications.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-slate-900 border border-slate-800 rounded-xl", children: [_jsx(FileText, { className: "w-10 h-10 text-slate-600 mx-auto mb-3" }), _jsx("h3", { className: "text-sm font-bold text-slate-300", children: "No applications in this category" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Submit applications from the Opportunities page to track your pipeline" })] })) : (_jsx("div", { className: "space-y-5", children: applications.map(app => {
                    const currentIdx = getStageIndex(app.currentStage);
                    const isSelected = app.currentStage === 'Selected';
                    const isRejected = app.currentStage === 'Rejected';
                    return (_jsxs("div", { className: `bg-slate-900 border rounded-2xl p-6 shadow-xl transition-all ${isSelected
                            ? 'border-emerald-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20'
                            : isRejected
                                ? 'border-rose-900/40 bg-slate-900'
                                : 'border-slate-800 hover:border-slate-750'}`, children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-lg font-bold text-white tracking-tight", children: app.companyName }), _jsx("span", { className: "text-xs text-slate-500", children: "\u00B7" }), _jsx("span", { className: "text-xs font-mono font-bold text-emerald-400", children: app.packageLPA })] }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: app.jobTitle })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold", children: [app.aiMatchScore, "% AI Match"] }), _jsx("span", { className: `px-3 py-1 rounded-lg text-xs font-mono font-bold ${isSelected
                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                    : isRejected
                                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                        : 'bg-indigo-600 text-white'}`, children: app.currentStage })] })] }), !isRejected && (_jsxs("div", { className: "py-6", children: [_jsx("div", { className: "hidden md:grid grid-cols-6 gap-2 relative", children: STAGES.map((stg, idx) => {
                                            const isDone = currentIdx >= idx;
                                            const isCurrent = currentIdx === idx;
                                            return (_jsxs("div", { className: "relative text-center", children: [idx > 0 && (_jsx("div", { className: `absolute top-3.5 -left-1/2 w-full h-[2px] -z-0 ${currentIdx >= idx ? 'bg-indigo-500' : 'bg-slate-800'}` })), _jsx("div", { className: `relative z-10 w-7 h-7 mx-auto rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${isCurrent
                                                            ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/20 scale-110 shadow-lg shadow-indigo-500/50'
                                                            : isDone
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'bg-slate-800 text-slate-500'}`, children: isDone ? _jsx(CheckCircle2, { className: "w-4 h-4" }) : idx + 1 }), _jsx("span", { className: `block mt-2 text-[11px] font-medium leading-tight ${isCurrent ? 'text-white font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'}`, children: stg })] }, stg));
                                        }) }), _jsxs("div", { className: "md:hidden flex items-center justify-between text-xs py-1", children: [_jsx("span", { className: "text-slate-400", children: "Current Phase:" }), _jsxs("strong", { className: "text-indigo-400 font-bold", children: [app.currentStage, " (Step ", currentIdx + 1, " of 6)"] })] })] })), app.interviewSchedule && (_jsxs("div", { className: "mb-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400 shrink-0", children: _jsx(Calendar, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("strong", { className: "text-white block", children: "Interview Scheduled" }), _jsxs("span", { className: "text-slate-300 font-mono", children: [app.interviewSchedule.date, " at ", app.interviewSchedule.time, " \u00B7 ", app.interviewSchedule.interviewer] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [onNavigateToInterview && (_jsxs("button", { onClick: onNavigateToInterview, className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 border border-slate-750", children: [_jsx(Award, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "AI Mock Prep" })] })), _jsxs("a", { href: app.interviewSchedule.meetingLink, target: "_blank", rel: "noreferrer", className: "px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1", children: [_jsx("span", { children: "Join Meeting" }), _jsx(ExternalLink, { className: "w-3.5 h-3.5" })] })] })] })), _jsxs("div", { className: "pt-3 border-t border-slate-800/80", children: [_jsx("h4", { className: "text-xs font-mono uppercase text-slate-400 font-semibold mb-2", children: "Recruitment Stage History" }), _jsx("div", { className: "space-y-2 text-xs", children: app.stageHistory.map((hist, hIdx) => (_jsxs("div", { className: "flex items-start gap-2.5 text-slate-300", children: [_jsx("span", { className: "text-indigo-400 mt-0.5", children: "\u2022" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("strong", { className: "text-white", children: hist.stage }), _jsx("span", { className: "text-[10px] font-mono text-slate-500", children: new Date(hist.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) })] }), _jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: hist.remarks })] })] }, hIdx))) })] })] }, app.id));
                }) }))] }));
};
