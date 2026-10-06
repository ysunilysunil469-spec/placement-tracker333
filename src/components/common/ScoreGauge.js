import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sparkles, CheckCircle2 } from 'lucide-react';
export const ScoreGauge = ({ score, grade = 'Placement Ready', breakdown, size = 'md', showBreakdown = true, }) => {
    // SVG circular calculations
    const radius = size === 'lg' ? 70 : size === 'md' ? 54 : 40;
    const stroke = size === 'lg' ? 12 : size === 'md' ? 10 : 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const getScoreColor = (val) => {
        if (val >= 80)
            return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
        if (val >= 65)
            return { stroke: '#6366f1', text: 'text-indigo-400', bg: 'bg-indigo-500/10' };
        return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10' };
    };
    const colors = getScoreColor(score);
    return (_jsxs("div", { className: "bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden", children: [_jsx("div", { className: "absolute -right-12 -top-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-6", children: [_jsxs("div", { className: "relative flex items-center justify-center shrink-0", children: [_jsxs("svg", { height: radius * 2, width: radius * 2, className: "transform -rotate-90 transition-all duration-1000 ease-out", children: [_jsx("circle", { stroke: "#1e293b", fill: "transparent", strokeWidth: stroke, r: normalizedRadius, cx: radius, cy: radius }), _jsx("circle", { stroke: colors.stroke, fill: "transparent", strokeWidth: stroke, strokeDasharray: `${circumference} ${circumference}`, style: { strokeDashoffset }, strokeLinecap: "round", r: normalizedRadius, cx: radius, cy: radius, className: "transition-all duration-1000 ease-out" })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center", children: [_jsx("span", { className: `font-mono font-bold tracking-tight ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl'} text-white`, children: score }), _jsx("span", { className: "text-[10px] uppercase font-mono tracking-wider text-slate-400", children: "/ 100" })] })] }), _jsxs("div", { className: "flex-1 text-center sm:text-left", children: [_jsx("div", { className: "flex items-center justify-center sm:justify-start gap-2 mb-1", children: _jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 flex items-center gap-1 font-semibold", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " AI Readiness Engine"] }) }), _jsx("h3", { className: "text-xl font-bold text-white tracking-tight", children: grade }), _jsx("p", { className: "text-xs text-slate-400 mt-1 max-w-sm", children: "Continuous algorithmic synthesis of academic GPA, technical project depth, competitive programming, and ATS resume fidelity." }), _jsxs("div", { className: "mt-3 flex items-center justify-center sm:justify-start gap-4 text-xs font-mono", children: [_jsxs("span", { className: "text-emerald-400 flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Tier 1 Ready"] }), _jsx("span", { className: "text-slate-500", children: "|" }), _jsx("span", { className: "text-slate-300", children: "Targeting \u20B920L+ LPA" })] })] })] }), showBreakdown && breakdown && (_jsx("div", { className: "mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
                    { label: 'Resume ATS', value: breakdown.resume },
                    { label: 'Technical Skills', value: breakdown.skills },
                    { label: 'Projects Depth', value: breakdown.projects },
                    { label: 'Communication', value: breakdown.communication },
                    { label: 'Coding / DSA', value: breakdown.coding },
                    { label: 'Interview Readiness', value: breakdown.interview },
                ].map((cat, idx) => (_jsxs("div", { className: "bg-slate-950/60 p-2.5 rounded-lg border border-slate-850", children: [_jsxs("div", { className: "flex items-center justify-between text-xs mb-1.5", children: [_jsx("span", { className: "text-slate-400 font-medium text-[11px]", children: cat.label }), _jsxs("span", { className: "font-mono font-semibold text-slate-200", children: [cat.value, "%"] })] }), _jsx("div", { className: "w-full bg-slate-800 h-1.5 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-700 ${cat.value >= 80 ? 'bg-emerald-500' : cat.value >= 65 ? 'bg-indigo-500' : 'bg-amber-500'}`, style: { width: `${cat.value}%` } }) })] }, idx))) }))] }));
};
