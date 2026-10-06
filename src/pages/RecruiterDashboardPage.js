import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Building, Plus, X, } from 'lucide-react';
export const RecruiterDashboardPage = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Post Job Modal
    const [showPostJob, setShowPostJob] = useState(false);
    const [newJobTitle, setNewJobTitle] = useState('Senior Systems Associate');
    const [newJobPkg, setNewJobPkg] = useState('₹24–32 LPA');
    const [newJobCgpa, setNewJobCgpa] = useState(7.5);
    const [newJobSkills, setNewJobSkills] = useState('Go, Distributed Systems, Docker');
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allJobs, allApps] = await Promise.all([
                api.getJobs(),
                api.getApplications(),
            ]);
            setJobs(allJobs);
            setApplications(allApps);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await api.createJob({
                companyId: 'comp-1',
                title: newJobTitle,
                packageLPA: newJobPkg,
                minCgpa: Number(newJobCgpa),
                requiredSkills: newJobSkills.split(',').map(s => s.trim()),
            });
            setShowPostJob(false);
            await loadData();
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(Building, { className: "w-3.5 h-3.5" }), " Corporate Talent Acquisition Portal"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Recruiter Candidate Hub" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Review top-percentile engineering candidates pre-ranked with AI match scores and verified project portfolios." })] }), _jsxs("button", { onClick: () => setShowPostJob(true), className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Post New Campus Job" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsx("span", { className: "text-slate-400 text-xs font-medium block", children: "Active Campus Openings" }), _jsx("div", { className: "text-2xl font-bold font-mono text-white mt-1", children: jobs.length }), _jsx("span", { className: "text-[10px] text-slate-500 mt-1 block", children: "Google, Microsoft, Amazon" })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsx("span", { className: "text-slate-400 text-xs font-medium block", children: "Total Candidate Applicants" }), _jsx("div", { className: "text-2xl font-bold font-mono text-indigo-400 mt-1", children: applications.length }), _jsx("span", { className: "text-[10px] text-slate-500 mt-1 block", children: "Pre-ranked with AI ATS benchmarks" })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsx("span", { className: "text-slate-400 text-xs font-medium block", children: "Shortlisted for Interviews" }), _jsx("div", { className: "text-2xl font-bold font-mono text-emerald-400 mt-1", children: applications.filter(a => a.currentStage.includes('Interview') || a.currentStage === 'Shortlisted').length }), _jsx("span", { className: "text-[10px] text-slate-500 mt-1 block", children: "Pending technical rounds" })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-base font-bold text-white tracking-tight", children: "Candidate Pool & ATS Compatibility" }), _jsxs("span", { className: "text-xs font-mono text-slate-400", children: [applications.length, " candidates in pipeline"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-slate-800 text-slate-400 font-mono text-[11px]", children: [_jsx("th", { className: "pb-3 font-semibold", children: "Candidate" }), _jsx("th", { className: "pb-3 font-semibold", children: "Branch & CGPA" }), _jsx("th", { className: "pb-3 font-semibold", children: "Applied Role" }), _jsx("th", { className: "pb-3 font-semibold", children: "AI Match Score" }), _jsx("th", { className: "pb-3 font-semibold", children: "Pipeline Status" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-800/60", children: applications.slice(0, 12).map(app => (_jsxs("tr", { className: "hover:bg-slate-950/40 transition-colors", children: [_jsx("td", { className: "py-3 font-bold text-white", children: app.studentName }), _jsxs("td", { className: "py-3 text-slate-300 font-mono", children: [app.studentDepartment.slice(0, 16), " \u00B7 ", _jsx("strong", { className: "text-emerald-400", children: app.studentCgpa.toFixed(1) })] }), _jsxs("td", { className: "py-3 text-slate-300", children: [_jsx("span", { className: "font-semibold text-slate-200", children: app.jobTitle }), _jsx("span", { className: "block text-[11px] text-slate-500", children: app.companyName })] }), _jsx("td", { className: "py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "font-mono font-bold text-indigo-400", children: [app.aiMatchScore, "%"] }), _jsx("div", { className: "w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden", children: _jsx("div", { className: "bg-indigo-500 h-full rounded-full", style: { width: `${app.aiMatchScore}%` } }) })] }) }), _jsx("td", { className: "py-3", children: _jsx("span", { className: "px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300", children: app.currentStage }) })] }, app.id))) })] }) })] }), showPostJob && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-xs space-y-4", children: [_jsx("button", { onClick: () => setShowPostJob(false), className: "absolute top-4 right-4 text-slate-400 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-mono uppercase text-indigo-400 font-semibold", children: "Campus Drive Listing" }), _jsx("h3", { className: "text-base font-bold text-white mt-0.5", children: "Post New Opportunity" })] }), _jsxs("form", { onSubmit: handlePostJob, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1", children: "Job Designation" }), _jsx("input", { type: "text", value: newJobTitle, onChange: e => setNewJobTitle(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1", children: "Package LPA" }), _jsx("input", { type: "text", value: newJobPkg, onChange: e => setNewJobPkg(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1", children: "Min CGPA" }), _jsx("input", { type: "number", step: "0.1", value: newJobCgpa, onChange: e => setNewJobCgpa(parseFloat(e.target.value) || 7.0), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1", children: "Required Skills (CSV)" }), _jsx("input", { type: "text", value: newJobSkills, onChange: e => setNewJobSkills(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" })] }), _jsxs("div", { className: "pt-2 flex items-center justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowPostJob(false), className: "px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md", children: "Publish Listing" })] })] })] }) }))] }));
};
