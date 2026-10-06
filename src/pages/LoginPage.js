import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, GraduationCap, ShieldCheck, Building, UserCheck, ArrowRight, AlertCircle, } from 'lucide-react';
export const LoginPage = ({ onSuccess }) => {
    const { login, register, switchDemoRole } = useAuth();
    const [tab, setTab] = useState('login');
    // Form states
    const [email, setEmail] = useState('student@placementai.com');
    const [password, setPassword] = useState('Demo@123');
    const [name, setName] = useState('');
    const [role, setRole] = useState('student');
    const [department, setDepartment] = useState('Computer Science');
    const [cgpa, setCgpa] = useState(8.2);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(email, password);
            onSuccess();
        }
        catch (err) {
            setError(err.message || 'Login failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await register({
                name,
                email,
                password,
                role,
                department,
                cgpa,
            });
            onSuccess();
        }
        catch (err) {
            setError(err.message || 'Registration failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleQuickDemo = async (demoRole) => {
        setIsLoading(true);
        setError(null);
        try {
            await switchDemoRole(demoRole);
            onSuccess();
        }
        catch (err) {
            setError(err.message || 'Demo login failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto py-12 px-4", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] mx-auto mb-3 shadow-lg shadow-indigo-600/20", children: _jsx("div", { className: "w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center", children: _jsx(Sparkles, { className: "w-6 h-6 text-indigo-400" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-white tracking-tight", children: "Placement Tracker AI" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Campus Career & Recruitment Ecosystem" })] }), _jsxs("div", { className: "bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl mb-6 space-y-2", children: [_jsx("span", { className: "text-[11px] font-mono uppercase text-indigo-400 font-semibold block text-center", children: "\u26A1 1-Click Demo Logins for Judges" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("button", { onClick: () => handleQuickDemo('student'), className: "p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group", children: [_jsx(GraduationCap, { className: "w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" }), _jsxs("div", { children: [_jsx("strong", { className: "block leading-tight", children: "Student" }), _jsx("span", { className: "text-[10px] text-slate-400 group-hover:text-indigo-200", children: "Suneel (8.4 CGPA)" })] })] }), _jsxs("button", { onClick: () => handleQuickDemo('officer'), className: "p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" }), _jsxs("div", { children: [_jsx("strong", { className: "block leading-tight", children: "Placement Officer" }), _jsx("span", { className: "text-[10px] text-slate-400 group-hover:text-indigo-200", children: "Campus Cell" })] })] }), _jsxs("button", { onClick: () => handleQuickDemo('recruiter'), className: "p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group", children: [_jsx(Building, { className: "w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" }), _jsxs("div", { children: [_jsx("strong", { className: "block leading-tight", children: "Recruiter" }), _jsx("span", { className: "text-[10px] text-slate-400 group-hover:text-indigo-200", children: "Google Talent" })] })] }), _jsxs("button", { onClick: () => handleQuickDemo('admin'), className: "p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group", children: [_jsx(UserCheck, { className: "w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" }), _jsxs("div", { children: [_jsx("strong", { className: "block leading-tight", children: "System Admin" }), _jsx("span", { className: "text-[10px] text-slate-400 group-hover:text-indigo-200", children: "Platform Control" })] })] })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4", children: [_jsxs("div", { className: "flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold", children: [_jsx("button", { onClick: () => setTab('login'), className: `flex-1 py-2 rounded-lg transition-colors ${tab === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`, children: "Sign In" }), _jsx("button", { onClick: () => setTab('register'), className: `flex-1 py-2 rounded-lg transition-colors ${tab === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`, children: "Register Account" })] }), error && (_jsxs("div", { className: "p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: error })] })), tab === 'login' ? (_jsxs("form", { onSubmit: handleLogin, className: "space-y-3.5 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-500" }), _jsx("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "student@placementai.com", className: "w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "w-4 h-4 absolute left-3 top-2.5 text-slate-500" }), _jsx("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "Demo@123", className: "w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono", required: true })] })] }), _jsxs("button", { type: "submit", disabled: isLoading, className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4", children: [_jsx("span", { children: isLoading ? 'Signing in...' : 'Sign In to Dashboard' }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] })) : (_jsxs("form", { onSubmit: handleRegister, className: "space-y-3 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Full Name" }), _jsx("input", { type: "text", value: name, onChange: e => setName(e.target.value), placeholder: "Rohan Sharma", className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "rohan@college.edu", className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "SecurePassword@123", className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Account Role" }), _jsxs("select", { value: role, onChange: e => setRole(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white", children: [_jsx("option", { value: "student", children: "Student" }), _jsx("option", { value: "officer", children: "Placement Officer" }), _jsx("option", { value: "recruiter", children: "Recruiter" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), role === 'student' && (_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Current CGPA" }), _jsx("input", { type: "number", step: "0.1", min: "0", max: "10", value: cgpa, onChange: e => setCgpa(parseFloat(e.target.value) || 0), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white font-mono" })] }))] }), role === 'student' && (_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Department" }), _jsxs("select", { value: department, onChange: e => setDepartment(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white", children: [_jsx("option", { children: "Computer Science" }), _jsx("option", { children: "Information Technology" }), _jsx("option", { children: "AI & Data Science" }), _jsx("option", { children: "Electronics & Comm." })] })] })), _jsxs("button", { type: "submit", disabled: isLoading, className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4", children: [_jsx("span", { children: isLoading ? 'Creating Account...' : 'Create Account & Enter' }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }))] })] }));
};
