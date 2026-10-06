import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Compass, TrendingUp, Users, Briefcase, Award, ChevronRight, Plus, X, Sparkles, } from 'lucide-react';
export const OfficerDashboardPage = ({ onNavigateToDrives }) => {
    const [analytics, setAnalytics] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Quick Action Modal: Schedule Drive
    const [showCreateDrive, setShowCreateDrive] = useState(false);
    const [driveForm, setDriveForm] = useState({
        companyId: 'comp-1',
        role: 'Cloud Solutions Associate',
        packageLPA: '₹18–24 LPA',
        location: 'Bangalore / Hybrid',
        driveDate: '2026-10-28',
        minCgpa: 7.5,
        maxBacklogs: 0,
        requiredSkills: 'Python, Cloud, Docker',
        eligibleDepartments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
    });
    // Stage update modal
    const [selectedApp, setSelectedApp] = useState(null);
    const [newStage, setNewStage] = useState('Shortlisted');
    const [stageRemarks, setStageRemarks] = useState('');
    const [interviewDate, setInterviewDate] = useState('2026-10-20');
    const [interviewTime, setInterviewTime] = useState('02:00 PM IST');
    const [meetingLink, setMeetingLink] = useState('https://meet.google.com/campus-interview');
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        setIsLoading(true);
        try {
            const [anData, apps] = await Promise.all([
                api.getOfficerAnalytics(),
                api.getApplications(),
            ]);
            setAnalytics(anData);
            setApplications(apps);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCreateDrive = async (e) => {
        e.preventDefault();
        try {
            await api.createDrive({
                ...driveForm,
                requiredSkills: driveForm.requiredSkills.split(',').map(s => s.trim()),
            });
            setShowCreateDrive(false);
            await loadData();
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleUpdateStage = async () => {
        if (!selectedApp)
            return;
        try {
            const schedule = newStage.includes('Interview')
                ? {
                    date: interviewDate,
                    time: interviewTime,
                    meetingLink,
                    interviewer: 'Placement Interview Committee',
                }
                : undefined;
            await api.updateApplicationStage(selectedApp.id, newStage, stageRemarks || undefined, schedule);
            setSelectedApp(null);
            await loadData();
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(Compass, { className: "w-3.5 h-3.5" }), " University Placement Cell Command Center"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Placement Officer Analytics & Operations" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Real-time batch metrics, automated drive eligibility computation, and campus recruitment pipeline." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setShowCreateDrive(true), className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Create Placement Drive" })] }), _jsxs("button", { onClick: onNavigateToDrives, className: "flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-xl border border-slate-750 transition-colors", children: [_jsx("span", { children: "Eligibility Inspector" }), _jsx(ChevronRight, { className: "w-3.5 h-3.5" })] })] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Registered Students', val: analytics?.totalStudents || 50, sub: 'Class of 2027', icon: Users, color: 'text-indigo-400' },
                    { label: 'Batch Placement Rate', val: `${analytics?.placementRate || 74}%`, sub: `${analytics?.placedCount || 37} offers secured`, icon: TrendingUp, color: 'text-emerald-400' },
                    { label: 'Average Compensation', val: analytics?.averagePackage || '₹14.8 LPA', sub: 'Across Tier 1/2', icon: Briefcase, color: 'text-cyan-400' },
                    { label: 'Highest Package Offered', val: analytics?.highestPackage || '₹45 LPA', sub: 'Google AI Engineer', icon: Award, color: 'text-amber-400' },
                ].map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-slate-400 text-xs font-medium", children: kpi.label }), _jsx(Icon, { className: `w-4 h-4 ${kpi.color}` })] }), _jsx("div", { className: "text-2xl font-bold font-mono text-white", children: kpi.val }), _jsx("span", { className: "text-[10px] text-slate-500 mt-1 block", children: kpi.sub })] }, idx));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center justify-between", children: [_jsx("span", { children: "Department-Wise Placement Performance" }), _jsx("span", { className: "text-xs font-normal text-slate-400", children: "Class of 2027" })] }), _jsx("div", { className: "space-y-4 text-xs", children: (analytics?.departmentData || [
                                    { department: 'Computer Science', total: 22, placed: 19, rate: 86 },
                                    { department: 'AI & Data Science', total: 14, placed: 11, rate: 78 },
                                    { department: 'Information Technology', total: 10, placed: 7, rate: 70 },
                                    { department: 'Electronics & Comm.', total: 4, placed: 2, rate: 50 },
                                ]).map((d, idx) => (_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-semibold text-slate-200", children: d.department }), _jsxs("span", { className: "font-mono text-slate-400", children: [_jsx("strong", { className: "text-emerald-400", children: d.placed }), " / ", d.total, " placed (", d.rate, "%)"] })] }), _jsx("div", { className: "w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850", children: _jsx("div", { className: "h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full", style: { width: `${d.rate}%` } }) })] }, idx))) })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center justify-between", children: [_jsx("span", { children: "Market Demand vs Student Skill Availability" }), _jsx("span", { className: "text-xs font-normal text-indigo-400", children: "AI Synthesized" })] }), _jsx("div", { className: "space-y-3.5 text-xs", children: (analytics?.skillDemand || [
                                    { skill: 'Python & AI Stacks', demand: 86, available: 78 },
                                    { skill: 'SQL & Database Design', demand: 82, available: 72 },
                                    { skill: 'Data Structures / DSA', demand: 90, available: 68 },
                                    { skill: 'React & Frontend', demand: 68, available: 58 },
                                    { skill: 'Docker & Cloud Infra', demand: 64, available: 32 },
                                ]).map((s, idx) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-medium text-slate-200", children: s.skill }), _jsxs("span", { className: "text-[11px] font-mono text-slate-400", children: ["Demand: ", _jsxs("strong", { className: "text-indigo-400", children: [s.demand, "%"] }), " | Student Pool: ", s.available, "%"] })] }), _jsx("div", { className: "w-full bg-slate-950 h-2 rounded-full overflow-hidden flex gap-0.5 border border-slate-850", children: _jsx("div", { className: "bg-indigo-500 h-full rounded-l-full", style: { width: `${s.demand}%` } }) })] }, idx))) })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-white tracking-tight", children: "Recent Candidate Applications" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Advance stages, schedule interviews, or issue final placements." })] }), _jsxs("span", { className: "text-xs font-mono text-slate-400", children: [applications.length, " applications total"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-slate-800 text-slate-400 font-mono text-[11px]", children: [_jsx("th", { className: "pb-3 font-semibold", children: "Student Name" }), _jsx("th", { className: "pb-3 font-semibold", children: "Branch & CGPA" }), _jsx("th", { className: "pb-3 font-semibold", children: "Company / Role" }), _jsx("th", { className: "pb-3 font-semibold", children: "AI Match" }), _jsx("th", { className: "pb-3 font-semibold", children: "Current Stage" }), _jsx("th", { className: "pb-3 font-semibold text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-800/60", children: applications.slice(0, 10).map(app => (_jsxs("tr", { className: "hover:bg-slate-950/40 transition-colors", children: [_jsx("td", { className: "py-3 font-semibold text-white", children: app.studentName }), _jsxs("td", { className: "py-3 text-slate-300", children: [app.studentDepartment.slice(0, 15), " \u00B7 ", _jsx("span", { className: "font-mono text-indigo-400", children: app.studentCgpa.toFixed(1) })] }), _jsxs("td", { className: "py-3 text-slate-300", children: [_jsx("span", { className: "font-semibold text-slate-200", children: app.companyName }), _jsx("span", { className: "block text-[11px] text-slate-400", children: app.jobTitle })] }), _jsxs("td", { className: "py-3 font-mono font-bold text-indigo-400", children: [app.aiMatchScore, "%"] }), _jsx("td", { className: "py-3", children: _jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-mono font-bold ${app.currentStage === 'Selected'
                                                        ? 'bg-emerald-500/20 text-emerald-300'
                                                        : app.currentStage.includes('Interview')
                                                            ? 'bg-indigo-500/20 text-indigo-300'
                                                            : 'bg-slate-800 text-slate-300'}`, children: app.currentStage }) }), _jsx("td", { className: "py-3 text-right", children: _jsx("button", { onClick: () => {
                                                        setSelectedApp(app);
                                                        setNewStage(app.currentStage);
                                                    }, className: "px-3 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors", children: "Update Stage" }) })] }, app.id))) })] }) })] }), selectedApp && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 space-y-4 text-xs", children: [_jsx("button", { onClick: () => setSelectedApp(null), className: "absolute top-4 right-4 text-slate-400 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-mono uppercase text-indigo-400 font-semibold", children: "Triage Candidate Pipeline" }), _jsx("h3", { className: "text-base font-bold text-white mt-0.5", children: selectedApp.studentName }), _jsxs("p", { className: "text-xs text-slate-400", children: [selectedApp.companyName, " \u00B7 ", selectedApp.jobTitle] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-300 font-medium mb-1", children: "New Stage" }), _jsxs("select", { value: newStage, onChange: e => setNewStage(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "Applied" }), _jsx("option", { children: "Assessment" }), _jsx("option", { children: "Shortlisted" }), _jsx("option", { children: "Technical Interview" }), _jsx("option", { children: "HR Interview" }), _jsx("option", { children: "Selected" }), _jsx("option", { children: "Rejected" })] })] }), newStage.includes('Interview') && (_jsxs("div", { className: "space-y-3 p-3 rounded-xl bg-slate-950 border border-slate-800", children: [_jsx("span", { className: "text-indigo-400 font-bold block text-[11px]", children: "Schedule Interview Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { type: "date", value: interviewDate, onChange: e => setInterviewDate(e.target.value), className: "bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white" }), _jsx("input", { type: "text", value: interviewTime, onChange: e => setInterviewTime(e.target.value), placeholder: "11:00 AM IST", className: "bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white" })] }), _jsx("input", { type: "url", value: meetingLink, onChange: e => setMeetingLink(e.target.value), placeholder: "https://meet.google.com/...", className: "w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white font-mono text-[11px]" })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-300 font-medium mb-1", children: "Status Remarks" }), _jsx("textarea", { rows: 2, value: stageRemarks, onChange: e => setStageRemarks(e.target.value), placeholder: "e.g. Cleared coding assessment round with top percentile...", className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs" })] }), _jsxs("div", { className: "pt-2 flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => setSelectedApp(null), className: "px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg", children: "Cancel" }), _jsx("button", { onClick: handleUpdateStage, className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md", children: "Confirm & Notify Student" })] })] }) })), showCreateDrive && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in zoom-in-95 space-y-4 text-xs", children: [_jsx("button", { onClick: () => setShowCreateDrive(false), className: "absolute top-4 right-4 text-slate-400 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " Automated Campus Recruitment Engine"] }), _jsx("h3", { className: "text-lg font-bold text-white mt-0.5", children: "Schedule Placement Drive" }), _jsx("p", { className: "text-xs text-slate-400", children: "System will evaluate all 50 registered students and broadcast notifications to eligible candidates." })] }), _jsxs("form", { onSubmit: handleCreateDrive, className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-medium", children: "Hiring Organization" }), _jsxs("select", { value: driveForm.companyId, onChange: e => setDriveForm({ ...driveForm, companyId: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white", children: [_jsx("option", { value: "comp-1", children: "Google" }), _jsx("option", { value: "comp-2", children: "Microsoft" }), _jsx("option", { value: "comp-3", children: "Amazon" }), _jsx("option", { value: "comp-4", children: "Atlassian" }), _jsx("option", { value: "comp-5", children: "Goldman Sachs" }), _jsx("option", { value: "comp-6", children: "Zomato" }), _jsx("option", { value: "comp-7", children: "Razorpay" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-medium", children: "Designation / Role" }), _jsx("input", { type: "text", value: driveForm.role, onChange: e => setDriveForm({ ...driveForm, role: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white", required: true })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-medium", children: "Compensation" }), _jsx("input", { type: "text", value: driveForm.packageLPA, onChange: e => setDriveForm({ ...driveForm, packageLPA: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-medium", children: "Min CGPA" }), _jsx("input", { type: "number", step: "0.1", value: driveForm.minCgpa, onChange: e => setDriveForm({ ...driveForm, minCgpa: parseFloat(e.target.value) || 7.0 }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-medium", children: "Max Backlogs" }), _jsx("input", { type: "number", value: driveForm.maxBacklogs, onChange: e => setDriveForm({ ...driveForm, maxBacklogs: parseInt(e.target.value) || 0 }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-medium", children: "Drive Date" }), _jsx("input", { type: "date", value: driveForm.driveDate, onChange: e => setDriveForm({ ...driveForm, driveDate: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-medium", children: "Required Skills (CSV)" }), _jsx("input", { type: "text", value: driveForm.requiredSkills, onChange: e => setDriveForm({ ...driveForm, requiredSkills: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" })] })] }), _jsxs("div", { className: "pt-3 flex items-center justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowCreateDrive(false), className: "px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg", children: "Create & Run Eligibility Check" })] })] })] }) }))] }));
};
