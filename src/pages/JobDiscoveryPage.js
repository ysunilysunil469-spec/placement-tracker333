import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { Briefcase, Search, Sparkles, MapPin, CheckCircle2, AlertCircle, ChevronRight, X, Building, } from 'lucide-react';
export const JobDiscoveryPage = () => {
    const { student } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    // Filter states
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [roleTypeFilter, setRoleTypeFilter] = useState('All');
    const [minSalaryFilter, setMinSalaryFilter] = useState('');
    // Selected job for AI Match breakdown modal
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobMatchReport, setJobMatchReport] = useState(null);
    const [isLoadingMatch, setIsLoadingMatch] = useState(false);
    // Applying state
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [applySuccessMsg, setApplySuccessMsg] = useState(null);
    useEffect(() => {
        loadJobsAndApplications();
    }, [search, departmentFilter, roleTypeFilter, minSalaryFilter]);
    const loadJobsAndApplications = async () => {
        setIsLoading(true);
        try {
            const [allJobs, userApps] = await Promise.all([
                api.getJobs({
                    search: search || undefined,
                    department: departmentFilter !== 'All' ? departmentFilter : undefined,
                    roleType: roleTypeFilter !== 'All' ? roleTypeFilter : undefined,
                    minSalary: minSalaryFilter ? Number(minSalaryFilter) : undefined,
                }),
                api.getApplications(),
            ]);
            setJobs(allJobs);
            const appliedIds = new Set(userApps.map(a => a.jobId));
            setAppliedJobIds(appliedIds);
        }
        catch (e) {
            console.error('Failed to load jobs:', e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleApply = async (job) => {
        setApplyingJobId(job.id);
        setApplySuccessMsg(null);
        try {
            await api.applyToJob(job.id);
            setAppliedJobIds(prev => new Set([...prev, job.id]));
            setApplySuccessMsg(`Application successfully submitted for ${job.companyName} (${job.title})! +50 Placement XP awarded.`);
            // Trigger celebratory confetti
            try {
                confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: { y: 0.7 },
                });
            }
            catch (err) { }
            setTimeout(() => setApplySuccessMsg(null), 5000);
        }
        catch (err) {
            alert(err.message || 'Failed to submit application');
        }
        finally {
            setApplyingJobId(null);
        }
    };
    const handleViewAiMatch = async (job) => {
        setSelectedJob(job);
        setIsLoadingMatch(true);
        try {
            const report = await api.getJobMatch(job.id);
            setJobMatchReport(report);
        }
        catch (err) {
            console.error('Failed to compute job match:', err);
        }
        finally {
            setIsLoadingMatch(false);
        }
    };
    // Helper to compute quick approximate match for card badge
    const calculateCardMatch = (job) => {
        const studentSkills = student?.skills.map(s => s.name.toLowerCase()) || [];
        const matched = job.requiredSkills.filter(req => studentSkills.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s)));
        const score = Math.min(96, Math.max(55, Math.round((matched.length / Math.max(1, job.requiredSkills.length)) * 50 + (student?.cgpa || 8) * 4.5)));
        return score;
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(Briefcase, { className: "w-3.5 h-3.5" }), " Campus Recruitment Drives & Openings"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Placement Opportunities" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Explore campus hiring openings tailored to your branch with automated eligibility and AI skill matching." })] }), applySuccessMsg && (_jsxs("div", { className: "p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400 shrink-0" }), _jsx("span", { children: applySuccessMsg })] }), _jsx("button", { onClick: () => setApplySuccessMsg(null), className: "text-emerald-400 hover:text-white", children: _jsx(X, { className: "w-4 h-4" }) })] })), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-500" }), _jsx("input", { type: "text", placeholder: "Search company, job role, or skill (e.g. Python, Google, Azure)...", value: search, onChange: e => setSearch(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("select", { value: departmentFilter, onChange: e => setDepartmentFilter(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500", children: [_jsx("option", { value: "All", children: "All Departments" }), _jsx("option", { value: "Computer Science", children: "Computer Science" }), _jsx("option", { value: "Information Technology", children: "Information Technology" }), _jsx("option", { value: "AI & Data Science", children: "AI & Data Science" }), _jsx("option", { value: "Electronics & Comm.", children: "Electronics & Comm." })] }), _jsxs("select", { value: roleTypeFilter, onChange: e => setRoleTypeFilter(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500", children: [_jsx("option", { value: "All", children: "All Role Types" }), _jsx("option", { value: "Full-Time", children: "Full-Time (FTE)" }), _jsx("option", { value: "Internship", children: "Summer Internship" })] }), _jsxs("select", { value: minSalaryFilter, onChange: e => setMinSalaryFilter(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500", children: [_jsx("option", { value: "", children: "Any Compensation" }), _jsx("option", { value: "10", children: "\u20B910+ LPA" }), _jsx("option", { value: "20", children: "\u20B920+ LPA (Super Dream)" }), _jsx("option", { value: "30", children: "\u20B930+ LPA (Elite Tier)" })] })] })] }), isLoading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: [1, 2, 3, 4, 5, 6].map(i => (_jsx("div", { className: "h-64 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" }, i))) })) : jobs.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-slate-900 border border-slate-800 rounded-xl", children: [_jsx(Building, { className: "w-10 h-10 text-slate-600 mx-auto mb-3" }), _jsx("h3", { className: "text-sm font-bold text-slate-300", children: "No opportunities matching criteria" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Try resetting search filters or keywords" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: jobs.map(job => {
                    const hasApplied = appliedJobIds.has(job.id);
                    const cardMatch = calculateCardMatch(job);
                    const isEligible = (student?.cgpa || 8.4) >= job.minCgpa && (student?.activeBacklogs || 0) <= job.maxBacklogs;
                    return (_jsxs("div", { className: "bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-xl flex flex-col justify-between transition-all hover:shadow-2xl relative overflow-hidden group", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: job.companyLogo, alt: job.companyName, className: "w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-slate-400", children: job.companyName }), _jsx("h3", { className: "text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1", children: job.title })] })] }), _jsxs("button", { onClick: () => handleViewAiMatch(job), className: "px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-mono font-bold flex items-center gap-1 shrink-0 transition-colors", title: "Inspect AI Match Details", children: [_jsx(Sparkles, { className: "w-3 h-3 text-indigo-400" }), _jsxs("span", { children: [cardMatch, "% Match"] })] })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs mb-3", children: [_jsx("span", { className: "font-mono font-bold text-emerald-400", children: job.packageLPA }), _jsx("span", { className: "text-slate-500", children: "\u00B7" }), _jsxs("span", { className: "text-slate-400 flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3" }), " ", job.location, " (", job.workMode, ")"] })] }), _jsx("p", { className: "text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3", children: job.description }), _jsx("div", { className: "p-2.5 rounded-lg bg-slate-950/80 border border-slate-850 text-[11px] mb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Eligibility Criteria:" }), isEligible ? (_jsxs("span", { className: "text-emerald-400 font-medium flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " Eligible (CGPA ", student?.cgpa.toFixed(1) || '8.4', ")"] })) : (_jsxs("span", { className: "text-rose-400 font-medium flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-3 h-3" }), " Min CGPA ", job.minCgpa] }))] }) }), _jsx("div", { className: "flex flex-wrap gap-1.5 mb-4", children: job.requiredSkills.slice(0, 4).map((skill, sIdx) => {
                                            const hasSkill = student?.skills.some(s => s.name.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.name.toLowerCase()));
                                            return (_jsxs("span", { className: `text-[10px] font-mono px-2 py-0.5 rounded ${hasSkill ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30' : 'bg-slate-950 text-slate-400 border border-slate-800'}`, children: [skill, " ", hasSkill && '✓'] }, sIdx));
                                        }) })] }), _jsxs("div", { className: "pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2", children: [_jsxs("button", { onClick: () => handleViewAiMatch(job), className: "text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors", children: [_jsx("span", { children: "Why I Match" }), _jsx(ChevronRight, { className: "w-3.5 h-3.5" })] }), hasApplied ? (_jsxs("span", { className: "px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Applied"] })) : (_jsx("button", { onClick: () => handleApply(job), disabled: applyingJobId === job.id, className: "px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer", children: _jsx("span", { children: applyingJobId === job.id ? 'Submitting...' : 'Apply Now' }) }))] })] }, job.id));
                }) })), selectedJob && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95", children: [_jsx("button", { onClick: () => {
                                setSelectedJob(null);
                                setJobMatchReport(null);
                            }, className: "absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("img", { src: selectedJob.companyLogo, alt: selectedJob.companyName, className: "w-12 h-12 rounded-xl object-cover" }), _jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " AI Candidate-Job Match Diagnostic"] }), _jsx("h3", { className: "text-lg font-bold text-white", children: selectedJob.title }), _jsxs("p", { className: "text-xs text-slate-400", children: [selectedJob.companyName, " \u00B7 ", selectedJob.packageLPA] })] })] }), isLoadingMatch ? (_jsxs("div", { className: "py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2", children: [_jsx(Sparkles, { className: "w-6 h-6 text-indigo-400 animate-spin" }), _jsx("span", { children: "Synthesizing ATS candidate profile against role specifications..." })] })) : jobMatchReport ? (_jsxs("div", { className: "space-y-4 text-xs", children: [_jsxs("div", { className: "p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block text-[11px]", children: "Computed Match Compatibility" }), _jsxs("span", { className: "text-2xl font-bold font-mono text-white", children: [jobMatchReport.matchScore, "% ", _jsxs("span", { className: "text-xs text-indigo-400 font-normal", children: ["(", jobMatchReport.matchTier, " Match)"] })] })] }), _jsx("div", { className: "w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full", style: { width: `${jobMatchReport.matchScore}%` } }) })] }), _jsxs("div", { className: "p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 leading-relaxed", children: [_jsx("strong", { className: "text-white block mb-1", children: "AI Recommendation Rationale:" }), jobMatchReport.rationale] }), _jsxs("div", { children: [_jsxs("h4", { className: "font-bold text-white mb-2 flex items-center gap-1 text-emerald-400", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Verified Matching Skills (", jobMatchReport.matchingSkills.length, ")"] }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: jobMatchReport.matchingSkills.map((s, idx) => (_jsxs("span", { className: "px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]", children: [s, " \u2713"] }, idx))) })] }), jobMatchReport.missingSkills.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "font-bold text-white mb-2 flex items-center gap-1 text-amber-400", children: [_jsx(AlertCircle, { className: "w-3.5 h-3.5" }), " Recommended Additional Competencies (", jobMatchReport.missingSkills.length, ")"] }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: jobMatchReport.missingSkills.map((s, idx) => (_jsx("span", { className: "px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]", children: s }, idx))) })] })), _jsxs("div", { className: "p-4 rounded-xl bg-slate-950 border border-slate-800", children: [_jsx("h4", { className: "font-bold text-white mb-2", children: "Recommended Prep Actions:" }), _jsx("ul", { className: "space-y-1.5 text-slate-300", children: jobMatchReport.recommendedPrep.map((prep, idx) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsxs("span", { className: "text-indigo-400", children: ["0", idx + 1, "."] }), _jsx("span", { children: prep })] }, idx))) })] }), _jsx("div", { className: "pt-4 flex items-center justify-end gap-3", children: appliedJobIds.has(selectedJob.id) ? (_jsx("span", { className: "px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold", children: "Already Applied" })) : (_jsx("button", { onClick: () => {
                                            handleApply(selectedJob);
                                            setSelectedJob(null);
                                        }, className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors", children: "Confirm Application Submission" })) })] })) : null] }) }))] }));
};
