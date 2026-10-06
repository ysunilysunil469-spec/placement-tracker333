import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Users, Activity, Building, Briefcase, FileText, } from 'lucide-react';
export const AdminDashboardPage = () => {
    const [adminData, setAdminData] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        setIsLoading(true);
        try {
            const [adm, stds] = await Promise.all([
                api.getAdminAnalytics(),
                api.getStudents(),
            ]);
            setAdminData(adm);
            setStudents(stds);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(ShieldCheck, { className: "w-3.5 h-3.5" }), " University System Administration Console"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Platform Governance & Activity Telemetry" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Full oversight of campus users, hiring partners, active placement drives, and real-time audit logs." })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Registered Platform Users', val: adminData?.totalUsers || 54, sub: '50 Students · 4 Staff', icon: Users },
                    { label: 'Campus Corporate Partners', val: adminData?.companiesCount || 10, sub: 'Google, MSFT, Amazon, etc.', icon: Building },
                    { label: 'Campus Job Opportunities', val: adminData?.jobsCount || 20, sub: '₹6L - ₹45L CTC Ranges', icon: Briefcase },
                    { label: 'Total Submitted Applications', val: adminData?.applicationsCount || 104, sub: 'Pipeline throughput', icon: FileText },
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-slate-400 text-xs font-medium", children: item.label }), _jsx(Icon, { className: "w-4 h-4 text-indigo-400" })] }), _jsx("div", { className: "text-2xl font-bold font-mono text-white", children: item.val }), _jsx("span", { className: "text-[10px] text-slate-500 mt-1 block", children: item.sub })] }, idx));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center justify-between", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "w-4 h-4 text-indigo-400" }), " Live Platform Activity Feed"] }), _jsx("span", { className: "text-[10px] text-emerald-400 font-mono", children: "Real-time DB Events" })] }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto pr-1", children: (adminData?.activities || [
                                    { actor: 'Suneel Kumar', action: 'applied to', target: 'Google SDE-1 (₹32–42 LPA)', timestamp: '2 hours ago' },
                                    { actor: 'Placement Officer', action: 'scheduled drive for', target: 'Atlassian Full Stack Engineer', timestamp: '4 hours ago' },
                                    { actor: 'Sarah Jenkins (Google)', action: 'shortlisted 24 students for', target: 'Google AI / ML Engineer Drive', timestamp: '5 hours ago' },
                                    { actor: 'Zomato HR', action: 'extended offer to', target: 'Suneel Kumar (Backend Engineer ₹22 LPA)', timestamp: '1 day ago' },
                                ]).map((act, idx) => (_jsxs("div", { className: "p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs flex items-start gap-2.5", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-slate-300", children: [_jsx("strong", { className: "text-white", children: act.actor }), " ", act.action, " ", _jsx("span", { className: "text-indigo-300 font-semibold", children: act.target })] }), _jsx("span", { className: "text-[10px] font-mono text-slate-500 block mt-0.5", children: act.timestamp })] })] }, idx))) })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center justify-between", children: [_jsx("span", { children: "Top Placement Ready Students" }), _jsxs("span", { className: "text-[10px] text-slate-400 font-mono", children: [students.length, " Total"] })] }), _jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto pr-1", children: students.slice(0, 8).map(std => (_jsxs("div", { className: "p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between text-xs", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-white", children: std.name }), _jsxs("span", { className: "text-[11px] text-slate-400 font-mono", children: [std.department, " \u00B7 CGPA ", _jsx("strong", { className: "text-emerald-400", children: std.cgpa.toFixed(1) })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("span", { className: "font-mono font-bold text-indigo-400", children: [std.readinessScore, "/100"] }), _jsxs("span", { className: "block text-[10px] text-slate-500 font-mono", children: ["Level ", std.level] })] })] }, std.id))) })] })] })] }));
};
