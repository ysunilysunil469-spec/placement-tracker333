import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Sparkles, UserCheck, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';

export const QuickDemoBanner: React.FC = () => {
  const { user, switchDemoRole } = useAuth();

  const roles: { id: UserRole; label: string; icon: any; email: string }[] = [
    { id: 'student', label: 'Student (Suneel)', icon: GraduationCap, email: 'student@placementai.com' },
    { id: 'officer', label: 'Placement Officer', icon: ShieldCheck, email: 'officer@placementai.com' },
    { id: 'recruiter', label: 'Recruiter (Google)', icon: Briefcase, email: 'recruiter@placementai.com' },
    { id: 'admin', label: 'Admin', icon: UserCheck, email: 'admin@placementai.com' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-b border-indigo-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 inline" /> Hackathon Judge Quick Switcher:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Active view: <strong className="text-white capitalize">{user?.role || 'Guest'}</strong> ({user?.name || user?.email})
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = user?.role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchDemoRole(r.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all text-xs font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                    : 'bg-slate-850/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-750'
                }`}
                title={`Switch to ${r.email}`}
              >
                <Icon className="w-3 h-3" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
