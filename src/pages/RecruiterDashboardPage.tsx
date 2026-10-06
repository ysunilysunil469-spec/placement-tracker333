import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Job, Application } from '../types';
import {
  Building,
  Briefcase,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Post Job Modal
  const [showPostJob, setShowPostJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('Senior Systems Associate');
  const [newJobPkg, setNewJobPkg] = useState('₹24–32 LPA');
  const [newJobCgpa, setNewJobCgpa] = useState(7.5);
  const [newJobSkills, setNewJobSkills] = useState('Go, Distributed Systems, Docker');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allJobs, allApps] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
      ]);
      setJobs(allJobs);
      setApplications(allApps);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createJob({
        companyId: 'comp-1',
        title: newJobTitle,
        packageLPA: newJobPkg,
        minCgpa: Number(newJobCgpa),
        requiredSkills: newJobSkills.split(',').map(s => s.trim()),
      });
      setShowPostJob(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" /> Corporate Talent Acquisition Portal
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Recruiter Candidate Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review top-percentile engineering candidates pre-ranked with AI match scores and verified project portfolios.
          </p>
        </div>

        <button
          onClick={() => setShowPostJob(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campus Job</span>
        </button>
      </div>

      {/* Recruiter Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-slate-400 text-xs font-medium block">Active Campus Openings</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{jobs.length}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Google, Microsoft, Amazon</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-slate-400 text-xs font-medium block">Total Candidate Applicants</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">{applications.length}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Pre-ranked with AI ATS benchmarks</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-slate-400 text-xs font-medium block">Shortlisted for Interviews</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {applications.filter(a => a.currentStage.includes('Interview') || a.currentStage === 'Shortlisted').length}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Pending technical rounds</span>
        </div>
      </div>

      {/* Applicants review table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Candidate Pool & ATS Compatibility</h3>
          <span className="text-xs font-mono text-slate-400">{applications.length} candidates in pipeline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Candidate</th>
                <th className="pb-3 font-semibold">Branch & CGPA</th>
                <th className="pb-3 font-semibold">Applied Role</th>
                <th className="pb-3 font-semibold">AI Match Score</th>
                <th className="pb-3 font-semibold">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.slice(0, 12).map(app => (
                <tr key={app.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 font-bold text-white">{app.studentName}</td>
                  <td className="py-3 text-slate-300 font-mono">
                    {app.studentDepartment.slice(0, 16)} · <strong className="text-emerald-400">{app.studentCgpa.toFixed(1)}</strong>
                  </td>
                  <td className="py-3 text-slate-300">
                    <span className="font-semibold text-slate-200">{app.jobTitle}</span>
                    <span className="block text-[11px] text-slate-500">{app.companyName}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">{app.aiMatchScore}%</span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${app.aiMatchScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300">
                      {app.currentStage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-xs space-y-4">
            <button onClick={() => setShowPostJob(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">Campus Drive Listing</span>
              <h3 className="text-base font-bold text-white mt-0.5">Post New Opportunity</h3>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Job Designation</label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={e => setNewJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Package LPA</label>
                  <input
                    type="text"
                    value={newJobPkg}
                    onChange={e => setNewJobPkg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newJobCgpa}
                    onChange={e => setNewJobCgpa(parseFloat(e.target.value) || 7.0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Required Skills (CSV)</label>
                <input
                  type="text"
                  value={newJobSkills}
                  onChange={e => setNewJobSkills(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostJob(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
