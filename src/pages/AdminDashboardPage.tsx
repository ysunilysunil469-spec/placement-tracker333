import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Student } from '../types';
import {
  ShieldCheck,
  Users,
  Activity,
  Building,
  Briefcase,
  FileText,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> University System Administration Console
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Platform Governance & Activity Telemetry
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Full oversight of campus users, hiring partners, active placement drives, and real-time audit logs.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Registered Platform Users', val: adminData?.totalUsers || 54, sub: '50 Students · 4 Staff', icon: Users },
          { label: 'Campus Corporate Partners', val: adminData?.companiesCount || 10, sub: 'Google, MSFT, Amazon, etc.', icon: Building },
          { label: 'Campus Job Opportunities', val: adminData?.jobsCount || 20, sub: '₹6L - ₹45L CTC Ranges', icon: Briefcase },
          { label: 'Total Submitted Applications', val: adminData?.applicationsCount || 104, sub: 'Pipeline throughput', icon: FileText },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-medium">{item.label}</span>
                <Icon className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{item.val}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">{item.sub}</span>
            </div>
          );
        })}
      </div>

      {/* System Live Audit Feed & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Activity Audit Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Live Platform Activity Feed
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Real-time DB Events</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {(adminData?.activities || [
              { actor: 'Suneel Kumar', action: 'applied to', target: 'Google SDE-1 (₹32–42 LPA)', timestamp: '2 hours ago' },
              { actor: 'Placement Officer', action: 'scheduled drive for', target: 'Atlassian Full Stack Engineer', timestamp: '4 hours ago' },
              { actor: 'Sarah Jenkins (Google)', action: 'shortlisted 24 students for', target: 'Google AI / ML Engineer Drive', timestamp: '5 hours ago' },
              { actor: 'Zomato HR', action: 'extended offer to', target: 'Suneel Kumar (Backend Engineer ₹22 LPA)', timestamp: '1 day ago' },
            ]).map((act: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-300">
                    <strong className="text-white">{act.actor}</strong> {act.action} <span className="text-indigo-300 font-semibold">{act.target}</span>
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Students Directory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center justify-between">
            <span>Top Placement Ready Students</span>
            <span className="text-[10px] text-slate-400 font-mono">{students.length} Total</span>
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {students.slice(0, 8).map(std => (
              <div key={std.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{std.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {std.department} · CGPA <strong className="text-emerald-400">{std.cgpa.toFixed(1)}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-indigo-400">{std.readinessScore}/100</span>
                  <span className="block text-[10px] text-slate-500 font-mono">Level {std.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
