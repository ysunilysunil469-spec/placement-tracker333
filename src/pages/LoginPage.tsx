import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  ShieldCheck,
  Building,
  UserCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register, switchDemoRole } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('student@placementai.com');
  const [password, setPassword] = useState('Demo@123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science');
  const [cgpa, setCgpa] = useState(8.2);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      await switchDemoRole(demoRole);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] mx-auto mb-3 shadow-lg shadow-indigo-600/20">
          <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Placement Tracker AI</h2>
        <p className="text-xs text-slate-400 mt-1">Campus Career & Recruitment Ecosystem</p>
      </div>

      {/* 1-Click Quick Demo Switcher for Judges */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl mb-6 space-y-2">
        <span className="text-[11px] font-mono uppercase text-indigo-400 font-semibold block text-center">
          ⚡ 1-Click Demo Logins for Judges
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleQuickDemo('student')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" />
            <div>
              <strong className="block leading-tight">Student</strong>
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-200">Suneel (8.4 CGPA)</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemo('officer')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" />
            <div>
              <strong className="block leading-tight">Placement Officer</strong>
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-200">Campus Cell</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemo('recruiter')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group"
          >
            <Building className="w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" />
            <div>
              <strong className="block leading-tight">Recruiter</strong>
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-200">Google Talent</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemo('admin')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 transition-all text-left flex items-center gap-2 group"
          >
            <UserCheck className="w-4 h-4 text-indigo-400 group-hover:text-white shrink-0" />
            <div>
              <strong className="block leading-tight">System Admin</strong>
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-200">Platform Control</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Toggle Login / Register */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@placementai.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Demo@123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rohan@college.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="SecurePassword@123"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                >
                  <option value="student">Student</option>
                  <option value="officer">Placement Officer</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={e => setCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white font-mono"
                  />
                </div>
              )}
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-slate-400 font-medium mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>AI & Data Science</option>
                  <option>Electronics & Comm.</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
