import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StudentSkill, StudentProject } from '../types';
import {
  User,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  Briefcase,
  FileText,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
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

  const [skills, setSkills] = useState<StudentSkill[]>(student?.skills || []);
  const [projects, setProjects] = useState<StudentProject[]>(student?.projects || []);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
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
  if (formData.name && formData.email) completionItems++;
  if (formData.phone && formData.rollNumber) completionItems++;
  if (formData.cgpa > 0) completionItems++;
  if (skills.length >= 3) completionItems++;
  if (projects.length >= 1) completionItems++;
  if (formData.githubUrl) completionItems++;
  if (formData.linkedinUrl) completionItems++;
  if (formData.resumeText) completionItems++;

  const completionPercent = Math.round((completionItems / totalItems) * 100);

  const handleSave = async (e: React.FormEvent) => {
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
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills(prev => [...prev, { name: newSkillName.trim(), level: newSkillLevel, category: newSkillCat }]);
    setNewSkillName('');
  };

  const removeSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const addProject = () => {
    if (!newProjTitle.trim()) return;
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

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Candidate Portfolio Dossier
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Student Placement Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep your verified academic scores, technical skills, and projects up to date for campus recruiters.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save & Update AI Score'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Profile updated successfully! AI Placement Readiness score re-evaluated and +25 XP credited.</span>
        </div>
      )}

      {/* Profile Completion Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Profile Readiness Index</span>
            <span className="font-mono text-indigo-400 font-bold">{completionPercent}%</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {completionPercent >= 85 ? 'Optimized for Recruiter Visibility' : 'Incomplete sections reduce drive match score'}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {!formData.githubUrl && (
          <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Complete your GitHub profile link to boost Tier-1 engineering interview selection.
          </p>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Academic Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2 text-indigo-400">
            <GraduationCap className="w-4 h-4" /> 1. Personal & Academic Fundamentals
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Official University Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Roll / Registration Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Academic Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>AI & Data Science</option>
                <option>Electronics & Comm.</option>
                <option>Electrical</option>
                <option>Mechanical</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Current CGPA (out of 10.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Active Backlogs</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.activeBacklogs}
                onChange={e => setFormData({ ...formData, activeBacklogs: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Graduation Year</label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={e => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2027 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Location / City</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-slate-400 font-medium mb-1">Professional Bio / Summary</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief technical self-summary targeting software engineering placements..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2 text-indigo-400">
            <ExternalLink className="w-4 h-4" /> 2. Developer Handles & Portfolio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Personal Portfolio / Website</label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://myportfolio.dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Technical Skills Inventory */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 text-indigo-400">
              <Code className="w-4 h-4" /> 3. Verified Technical Skills ({skills.length})
            </h3>
          </div>

          {/* Existing skills list */}
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <span className="font-semibold">{skill.name}</span>
                <span className="text-[10px] text-indigo-400 font-mono">({skill.level})</span>
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="text-slate-500 hover:text-rose-400 ml-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add skill input row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80">
            <input
              type="text"
              placeholder="Skill Name (e.g. Docker, PyTorch)"
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <select
              value={newSkillLevel}
              onChange={e => setNewSkillLevel(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
            <select
              value={newSkillCat}
              onChange={e => setNewSkillCat(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option>Backend</option>
              <option>Frontend</option>
              <option>Core CS</option>
              <option>AI & ML</option>
              <option>Database</option>
              <option>DevOps</option>
            </select>
            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-slate-750"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2 text-indigo-400">
            <FolderGit2 className="w-4 h-4" /> 4. Engineering Projects ({projects.length})
          </h3>

          <div className="space-y-3 mb-5">
            {projects.map(proj => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-850 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add project form */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs">
            <span className="font-semibold text-slate-300 block">Add New Project</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Project Title"
                value={newProjTitle}
                onChange={e => setNewProjTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Tech Stack (comma separated: React, Go, Docker)"
                value={newProjTech}
                onChange={e => setNewProjTech(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Measurable description with impact metrics (e.g. built microservice reducing latency by 40%)..."
              value={newProjDesc}
              onChange={e => setNewProjDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
            />
            <div className="flex items-center justify-between gap-3">
              <input
                type="url"
                placeholder="GitHub Repo URL (optional)"
                value={newProjGithub}
                onChange={e => setNewProjGithub(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={addProject}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Resume Text / Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 text-indigo-400">
              <FileText className="w-4 h-4" /> 5. Resume Raw Text for ATS Scanner
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {formData.resumeText.length} characters
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Paste or update your resume text. The AI Resume Analyzer and Job Matcher evaluate this content against recruiter ATS algorithms.
          </p>
          <textarea
            rows={8}
            value={formData.resumeText}
            onChange={e => setFormData({ ...formData, resumeText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save & Recalculate AI Score'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
