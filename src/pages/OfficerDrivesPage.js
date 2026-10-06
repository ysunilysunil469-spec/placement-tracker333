import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Calendar, CheckCircle2, XCircle, X, Search, Sparkles, } from 'lucide-react';
export const OfficerDrivesPage = () => {
    const [drives, setDrives] = useState([]);
    const [selectedDriveReport, setSelectedDriveReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reportFilter, setReportFilter] = useState('all');
    const [searchStudent, setSearchStudent] = useState('');
    useEffect(() => {
        loadDrives();
    }, []);
    const loadDrives = async () => {
        setIsLoading(true);
        try {
            const data = await api.getDrives();
            setDrives(data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInspectDrive = async (driveId) => {
        try {
            const report = await api.getDriveEligibilityReport(driveId);
            setSelectedDriveReport(report);
            setReportFilter('all');
            setSearchStudent('');
        }
        catch (e) {
            console.error(e);
        }
    };
    const filteredReportStudents = selectedDriveReport
        ? (reportFilter === 'eligible'
            ? selectedDriveReport.eligibleStudents
            : reportFilter === 'ineligible'
                ? selectedDriveReport.ineligibleStudents
                : [...selectedDriveReport.eligibleStudents, ...selectedDriveReport.ineligibleStudents]).filter((s) => s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
            s.department.toLowerCase().includes(searchStudent.toLowerCase()))
        : [];
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(ShieldCheck, { className: "w-3.5 h-3.5" }), " Automated Rules & Compliance Engine"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Placement Drives & Eligibility Verification" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Inspect deterministic candidate qualification reports calculated against university CGPA, backlog quotas, and branch filters." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: drives.map(drive => {
                    const total = drive.eligibleStudentCount + drive.ineligibleStudentCount;
                    const eligiblePercent = Math.round((drive.eligibleStudentCount / Math.max(1, total)) * 100);
                    return (_jsxs("div", { className: "bg-slate-900 border border-slate-800 hover:border-slate-750 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-semibold text-slate-400", children: drive.companyName }), _jsx("h3", { className: "text-sm font-bold text-white line-clamp-1", children: drive.role })] }), _jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${drive.status === 'Completed'
                                                    ? 'bg-slate-800 text-slate-300'
                                                    : drive.status === 'In-Progress'
                                                        ? 'bg-indigo-500/20 text-indigo-300'
                                                        : 'bg-emerald-500/20 text-emerald-300'}`, children: drive.status })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs mb-3 font-mono", children: [_jsx("span", { className: "text-emerald-400 font-bold", children: drive.packageLPA }), _jsx("span", { className: "text-slate-500", children: "\u00B7" }), _jsxs("span", { className: "text-slate-400 flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), " ", drive.driveDate] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1.5 text-xs mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-[11px]", children: [_jsx("span", { className: "text-slate-400", children: "Criteria Requirements:" }), _jsxs("span", { className: "text-slate-200 font-mono", children: ["Min CGPA ", drive.minCgpa, " \u00B7 0 Backlogs"] })] }), _jsxs("div", { className: "flex items-center justify-between text-[11px]", children: [_jsx("span", { className: "text-slate-400", children: "Branches:" }), _jsx("span", { className: "text-slate-300 truncate max-w-[170px]", children: drive.eligibleDepartments.join(', ') })] })] }), _jsxs("div", { className: "space-y-1.5 mb-4 text-xs", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-semibold text-emerald-400 flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " ", drive.eligibleStudentCount, " Eligible (", eligiblePercent, "%)"] }), _jsxs("span", { className: "text-rose-400 flex items-center gap-1", children: [_jsx(XCircle, { className: "w-3 h-3" }), " ", drive.ineligibleStudentCount, " Ineligible"] })] }), _jsx("div", { className: "w-full bg-rose-950/40 h-2 rounded-full overflow-hidden flex", children: _jsx("div", { className: "bg-emerald-500 h-full rounded-full", style: { width: `${eligiblePercent}%` } }) })] })] }), _jsxs("button", { onClick: () => handleInspectDrive(drive.id), className: "w-full py-2 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-750", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Inspect Eligibility Report" })] })] }, drive.id));
                }) }), selectedDriveReport && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 text-xs", children: [_jsxs("div", { className: "p-6 border-b border-slate-800 flex items-start justify-between gap-3 shrink-0", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-[10px] font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " Automated Eligibility Audit Engine"] }), _jsxs("h3", { className: "text-lg font-bold text-white mt-0.5", children: [selectedDriveReport.drive.companyName, " \u2014 ", selectedDriveReport.drive.role] }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Required: CGPA \u2265 ", selectedDriveReport.drive.minCgpa, " \u00B7 Max Backlogs: ", selectedDriveReport.drive.maxBacklogs, " \u00B7 Departments: ", selectedDriveReport.drive.eligibleDepartments.join(', ')] })] }), _jsx("button", { onClick: () => setSelectedDriveReport(null), className: "p-1 text-slate-400 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "px-6 py-3 bg-slate-950 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0", children: [_jsxs("div", { className: "flex items-center gap-1 p-1 bg-slate-900 rounded-lg", children: [_jsxs("button", { onClick: () => setReportFilter('all'), className: `px-3 py-1 rounded font-medium transition-colors ${reportFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`, children: ["All (", selectedDriveReport.totalStudents, ")"] }), _jsxs("button", { onClick: () => setReportFilter('eligible'), className: `px-3 py-1 rounded font-medium transition-colors ${reportFilter === 'eligible' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`, children: ["Eligible (", selectedDriveReport.eligibleCount, ")"] }), _jsxs("button", { onClick: () => setReportFilter('ineligible'), className: `px-3 py-1 rounded font-medium transition-colors ${reportFilter === 'ineligible' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`, children: ["Ineligible (", selectedDriveReport.ineligibleCount, ")"] })] }), _jsxs("div", { className: "relative flex-1 max-w-xs", children: [_jsx(Search, { className: "w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" }), _jsx("input", { type: "text", placeholder: "Search student or department...", value: searchStudent, onChange: e => setSearchStudent(e.target.value), className: "w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-white focus:outline-none focus:border-indigo-500" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6 space-y-2.5 divide-y divide-slate-800/40", children: filteredReportStudents.map((std) => {
                                const isEligible = std.isEligible;
                                return (_jsxs("div", { className: "pt-2.5 flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold text-white", children: std.name }), _jsxs("span", { className: "text-[11px] text-slate-400 font-mono", children: [std.department, " \u00B7 CGPA ", _jsx("strong", { className: isEligible ? 'text-emerald-400' : 'text-rose-400', children: std.cgpa.toFixed(1) })] }), std.activeBacklogs > 0 && (_jsxs("span", { className: "text-[10px] text-amber-400 font-mono", children: ["(", std.activeBacklogs, " backlogs)"] }))] }), _jsx("div", { className: "mt-1 text-[11px]", children: isEligible ? (_jsxs("span", { className: "text-emerald-400 flex items-center gap-1 font-medium", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " Meets all academic & department parameters"] })) : (_jsx("div", { className: "text-rose-400 space-y-0.5", children: std.reasons.map((r, rIdx) => (_jsxs("span", { className: "block flex items-center gap-1", children: [_jsx(XCircle, { className: "w-3 h-3 shrink-0" }), " Reason: ", r] }, rIdx))) })) })] }), _jsx("span", { className: `px-2.5 py-1 rounded text-[10px] font-mono font-bold shrink-0 ${isEligible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`, children: isEligible ? 'Eligible' : 'Not Eligible' })] }, std.studentId));
                            }) })] }) }))] }));
};
