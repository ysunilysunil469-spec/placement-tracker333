import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, GraduationCap, Code, FolderGit2, FileText, Save, Plus, Trash2, ExternalLink, CheckCircle2, AlertCircle, } from 'lucide-react';
export const StudentProfilePage = () => {
    const { student, refreshProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: student?.name || '',
        email: student?.email || '',
        phone: student?.phone || '',
        rollNumber: student?.rollNumber || '',
        department: student?.department || 'Computer Science',
        graduationYear: student?.graduationYear || 2027,
        cgpa: student?.cgpa || 8.4,
        activeBacklogs: student?.activeBacklogs || 0,
        historyOfBacklogs: student?.historyOfBacklogs || 0,
        bio: student?.bio || '',
        location: student?.location || 'Bangalore, India',
        githubUrl: student?.githubUrl || '',
        linkedinUrl: student?.linkedinUrl || '',
        portfolioUrl: student?.portfolioUrl || '',
        resumeText: student?.resumeText || '',
    });
    const [skills, setSkills] = useState(student?.skills || []);
    const [projects, setProjects] = useState(student?.projects || []);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
    const [newSkillCat, setNewSkillCat] = useState('Backend');
    const [newProjTitle, setNewProjTitle] = useState('');
    const [newProjDesc, setNewProjDesc] = useState('');
    const [newProjTech, setNewProjTech] = useState('');
    const [newProjGithub, setNewProjGithub] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    // Compute profile completion percentage
    let completionItems = 0;
    let totalItems = 8;
    if (formData.name && formData.email)
        completionItems++;
    if (formData.phone && formData.rollNumber)
        completionItems++;
    if (formData.cgpa > 0)
        completionItems++;
    if (skills.length >= 3)
        completionItems++;
    if (projects.length >= 1)
        completionItems++;
    if (formData.githubUrl)
        completionItems++;
    if (formData.linkedinUrl)
        completionItems++;
    if (formData.resumeText)
        completionItems++;
    const completionPercent = Math.round((completionItems / totalItems) * 100);
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await api.updateMyProfile({
                ...formData,
                skills,
                projects,
            });
            await refreshProfile();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 4000);
        }
        catch (err) {
            console.error('Failed to update profile:', err);
        }
        finally {
            setIsSaving(false);
        }
    };
    const addSkill = () => {
        if (!newSkillName.trim())
            return;
        setSkills(prev => [...prev, { name: newSkillName.trim(), level: newSkillLevel, category: newSkillCat }]);
        setNewSkillName('');
    };
    const removeSkill = (index) => {
        setSkills(prev => prev.filter((_, i) => i !== index));
    };
    const addProject = () => {
        if (!newProjTitle.trim())
            return;
        setProjects(prev => [
            ...prev,
            {
                id: `proj-${Date.now()}`,
                title: newProjTitle.trim(),
                description: newProjDesc.trim(),
                techStack: newProjTech.split(',').map(s => s.trim()).filter(Boolean),
                githubUrl: newProjGithub.trim(),
                stars: 12,
            },
        ]);
        setNewProjTitle('');
        setNewProjDesc('');
        setNewProjTech('');
        setNewProjGithub('');
    };
    const removeProject = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto pb-16", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(User, { className: "w-3.5 h-3.5" }), " Candidate Portfolio Dossier"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Student Placement Profile" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Keep your verified academic scores, technical skills, and projects up to date for campus recruiters." })] }), _jsxs("button", { onClick: handleSave, disabled: isSaving, className: "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: isSaving ? 'Saving Changes...' : 'Save & Update AI Score' })] })] }), saveSuccess && (_jsxs("div", { className: "p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400 shrink-0" }), _jsx("span", { children: "Profile updated successfully! AI Placement Readiness score re-evaluated and +25 XP credited." })] })), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between text-xs mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-white", children: "Profile Readiness Index" }), _jsxs("span", { className: "font-mono text-indigo-400 font-bold", children: [completionPercent, "%"] })] }), _jsx("span", { className: "text-slate-400 text-[11px]", children: completionPercent >= 85 ? 'Optimized for Recruiter Visibility' : 'Incomplete sections reduce drive match score' })] }), _jsx("div", { className: "w-full bg-slate-800 h-2 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-700", style: { width: `${completionPercent}%` } }) }), !formData.githubUrl && (_jsxs("p", { className: "text-[11px] text-amber-400 mt-2 flex items-center gap-1.5", children: [_jsx(AlertCircle, { className: "w-3.5 h-3.5 shrink-0" }), "Complete your GitHub profile link to boost Tier-1 engineering interview selection."] }))] }), _jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2 text-indigo-400", children: [_jsx(GraduationCap, { className: "w-4 h-4" }), " 1. Personal & Academic Fundamentals"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Full Legal Name" }), _jsx("input", { type: "text", value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Official University Email" }), _jsx("input", { type: "email", value: formData.email, onChange: e => setFormData({ ...formData, email: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Roll / Registration Number" }), _jsx("input", { type: "text", value: formData.rollNumber, onChange: e => setFormData({ ...formData, rollNumber: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Academic Department" }), _jsxs("select", { value: formData.department, onChange: e => setFormData({ ...formData, department: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "Computer Science" }), _jsx("option", { children: "Information Technology" }), _jsx("option", { children: "AI & Data Science" }), _jsx("option", { children: "Electronics & Comm." }), _jsx("option", { children: "Electrical" }), _jsx("option", { children: "Mechanical" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Current CGPA (out of 10.0)" }), _jsx("input", { type: "number", step: "0.1", min: "0", max: "10", value: formData.cgpa, onChange: e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono font-bold", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Active Backlogs" }), _jsx("input", { type: "number", min: "0", max: "10", value: formData.activeBacklogs, onChange: e => setFormData({ ...formData, activeBacklogs: parseInt(e.target.value) || 0 }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Graduation Year" }), _jsx("input", { type: "number", value: formData.graduationYear, onChange: e => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2027 }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Contact Phone" }), _jsx("input", { type: "text", value: formData.phone, onChange: e => setFormData({ ...formData, phone: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Location / City" }), _jsx("input", { type: "text", value: formData.location, onChange: e => setFormData({ ...formData, location: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" })] }), _jsxs("div", { className: "sm:col-span-2 lg:col-span-3", children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Professional Bio / Summary" }), _jsx("textarea", { rows: 2, value: formData.bio, onChange: e => setFormData({ ...formData, bio: e.target.value }), placeholder: "Brief technical self-summary targeting software engineering placements...", className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs" })] })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2 text-indigo-400", children: [_jsx(ExternalLink, { className: "w-4 h-4" }), " 2. Developer Handles & Portfolio"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "GitHub Profile URL" }), _jsx("input", { type: "url", value: formData.githubUrl, onChange: e => setFormData({ ...formData, githubUrl: e.target.value }), placeholder: "https://github.com/username", className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "LinkedIn Profile URL" }), _jsx("input", { type: "url", value: formData.linkedinUrl, onChange: e => setFormData({ ...formData, linkedinUrl: e.target.value }), placeholder: "https://linkedin.com/in/username", className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 font-medium mb-1", children: "Personal Portfolio / Website" }), _jsx("input", { type: "url", value: formData.portfolioUrl, onChange: e => setFormData({ ...formData, portfolioUrl: e.target.value }), placeholder: "https://myportfolio.dev", className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs" })] })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 text-indigo-400", children: [_jsx(Code, { className: "w-4 h-4" }), " 3. Verified Technical Skills (", skills.length, ")"] }) }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: skills.map((skill, idx) => (_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200", children: [_jsx("span", { className: "font-semibold", children: skill.name }), _jsxs("span", { className: "text-[10px] text-indigo-400 font-mono", children: ["(", skill.level, ")"] }), _jsx("button", { type: "button", onClick: () => removeSkill(idx), className: "text-slate-500 hover:text-rose-400 ml-1 transition-colors", children: _jsx(Trash2, { className: "w-3 h-3" }) })] }, idx))) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80", children: [_jsx("input", { type: "text", placeholder: "Skill Name (e.g. Docker, PyTorch)", value: newSkillName, onChange: e => setNewSkillName(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" }), _jsxs("select", { value: newSkillLevel, onChange: e => setNewSkillLevel(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "Beginner" }), _jsx("option", { children: "Intermediate" }), _jsx("option", { children: "Advanced" }), _jsx("option", { children: "Expert" })] }), _jsxs("select", { value: newSkillCat, onChange: e => setNewSkillCat(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "Backend" }), _jsx("option", { children: "Frontend" }), _jsx("option", { children: "Core CS" }), _jsx("option", { children: "AI & ML" }), _jsx("option", { children: "Database" }), _jsx("option", { children: "DevOps" })] }), _jsxs("button", { type: "button", onClick: addSkill, className: "px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-slate-750", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Skill" })] })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2 text-indigo-400", children: [_jsx(FolderGit2, { className: "w-4 h-4" }), " 4. Engineering Projects (", projects.length, ")"] }), _jsx("div", { className: "space-y-3 mb-5", children: projects.map(proj => (_jsxs("div", { className: "p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-bold text-sm text-white", children: proj.title }), proj.githubUrl && (_jsx("a", { href: proj.githubUrl, target: "_blank", rel: "noreferrer", className: "text-slate-400 hover:text-white", children: _jsx(ExternalLink, { className: "w-3.5 h-3.5" }) }))] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: proj.description }), _jsx("div", { className: "flex flex-wrap gap-1.5 mt-2", children: proj.techStack.map((tech, tIdx) => (_jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-850 text-slate-300", children: tech }, tIdx))) })] }), _jsx("button", { type: "button", onClick: () => removeProject(proj.id), className: "text-slate-500 hover:text-rose-400 p-1", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, proj.id))) }), _jsxs("div", { className: "p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs", children: [_jsx("span", { className: "font-semibold text-slate-300 block", children: "Add New Project" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx("input", { type: "text", placeholder: "Project Title", value: newProjTitle, onChange: e => setNewProjTitle(e.target.value), className: "bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" }), _jsx("input", { type: "text", placeholder: "Tech Stack (comma separated: React, Go, Docker)", value: newProjTech, onChange: e => setNewProjTech(e.target.value), className: "bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" })] }), _jsx("textarea", { rows: 2, placeholder: "Measurable description with impact metrics (e.g. built microservice reducing latency by 40%)...", value: newProjDesc, onChange: e => setNewProjDesc(e.target.value), className: "w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs" }), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("input", { type: "url", placeholder: "GitHub Repo URL (optional)", value: newProjGithub, onChange: e => setNewProjGithub(e.target.value), className: "flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono" }), _jsx("button", { type: "button", onClick: addProject, className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors", children: "Add Project" })] })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 text-indigo-400", children: [_jsx(FileText, { className: "w-4 h-4" }), " 5. Resume Raw Text for ATS Scanner"] }), _jsxs("span", { className: "text-[11px] font-mono text-slate-400", children: [formData.resumeText.length, " characters"] })] }), _jsx("p", { className: "text-xs text-slate-400 mb-3", children: "Paste or update your resume text. The AI Resume Analyzer and Job Matcher evaluate this content against recruiter ATS algorithms." }), _jsx("textarea", { rows: 8, value: formData.resumeText, onChange: e => setFormData({ ...formData, resumeText: e.target.value }), className: "w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed" })] }), _jsx("div", { className: "flex items-center justify-end gap-3 pt-4", children: _jsxs("button", { type: "submit", disabled: isSaving, className: "flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xl shadow-indigo-600/30 transition-all cursor-pointer", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: isSaving ? 'Saving Changes...' : 'Save & Recalculate AI Score' })] }) })] })] }));
};
