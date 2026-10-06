import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, PlacementDrive } from '../types';
import {
  Compass,
  TrendingUp,
  Users,
  Briefcase,
  Building,
  Award,
  ChevronRight,
  Plus,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

interface OfficerDashboardPageProps {
  onNavigateToDrives: () => void;
}

export const OfficerDashboardPage: React.FC<OfficerDashboardPageProps> = ({ onNavigateToDrives }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick Action Modal: Schedule Drive
  const [showCreateDrive, setShowCreateDrive] = useState(false);
  const [driveForm, setDriveForm] = useState({
    companyId: 'comp-1',
    role: 'Cloud Solutions Associate',
    packageLPA: '₹18–24 LPA',
    location: 'Bangalore / Hybrid',
    driveDate: '2026-10-28',
    minCgpa: 7.5,
    maxBacklogs: 0,
    requiredSkills: 'Python, Cloud, Docker',
    eligibleDepartments: ['Computer Science', 'Information Technology', 'AI & Data Science'],
  });

  // Stage update modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStage, setNewStage] = useState('Shortlisted');
  const [stageRemarks, setStageRemarks] = useState('');
  const [interviewDate, setInterviewDate] = useState('2026-10-20');
  const [interviewTime, setInterviewTime] = useState('02:00 PM IST');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/campus-interview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [anData, apps] = await Promise.all([
        api.getOfficerAnalytics(),
        api.getApplications(),
      ]);
      setAnalytics(anData);
      setApplications(apps);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDrive({
        ...driveForm,
        requiredSkills: driveForm.requiredSkills.split(',').map(s => s.trim()),
      });
      setShowCreateDrive(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStage = async () => {
    if (!selectedApp) return;
    try {
      const schedule = newStage.includes('Interview')
        ? {
            date: interviewDate,
            time: interviewTime,
            meetingLink,
            interviewer: 'Placement Interview Committee',
          }
        : undefined;

      await api.updateApplicationStage(selectedApp.id, newStage, stageRemarks || undefined, schedule);
      setSelectedApp(null);
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
            <Compass className="w-3.5 h-3.5" /> University Placement Cell Command Center
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Placement Officer Analytics & Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time batch metrics, automated drive eligibility computation, and campus recruitment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateDrive(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Placement Drive</span>
          </button>
          <button
            onClick={onNavigateToDrives}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-xl border border-slate-750 transition-colors"
          >
            <span>Eligibility Inspector</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Registered Students', val: analytics?.totalStudents || 50, sub: 'Class of 2027', icon: Users, color: 'text-indigo-400' },
          { label: 'Batch Placement Rate', val: `${analytics?.placementRate || 74}%`, sub: `${analytics?.placedCount || 37} offers secured`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Average Compensation', val: analytics?.averagePackage || '₹14.8 LPA', sub: 'Across Tier 1/2', icon: Briefcase, color: 'text-cyan-400' },
          { label: 'Highest Package Offered', val: analytics?.highestPackage || '₹45 LPA', sub: 'Google AI Engineer', icon: Award, color: 'text-amber-400' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-medium">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{kpi.val}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">{kpi.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Grid: Department Placement Rates & Skill Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Placement Rates */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center justify-between">
            <span>Department-Wise Placement Performance</span>
            <span className="text-xs font-normal text-slate-400">Class of 2027</span>
          </h3>

          <div className="space-y-4 text-xs">
            {(analytics?.departmentData || [
              { department: 'Computer Science', total: 22, placed: 19, rate: 86 },
              { department: 'AI & Data Science', total: 14, placed: 11, rate: 78 },
              { department: 'Information Technology', total: 10, placed: 7, rate: 70 },
              { department: 'Electronics & Comm.', total: 4, placed: 2, rate: 50 },
            ]).map((d: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{d.department}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-emerald-400">{d.placed}</strong> / {d.total} placed ({d.rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${d.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Demand vs Supply */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center justify-between">
            <span>Market Demand vs Student Skill Availability</span>
            <span className="text-xs font-normal text-indigo-400">AI Synthesized</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {(analytics?.skillDemand || [
              { skill: 'Python & AI Stacks', demand: 86, available: 78 },
              { skill: 'SQL & Database Design', demand: 82, available: 72 },
              { skill: 'Data Structures / DSA', demand: 90, available: 68 },
              { skill: 'React & Frontend', demand: 68, available: 58 },
              { skill: 'Docker & Cloud Infra', demand: 64, available: 32 },
            ]).map((s: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{s.skill}</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Demand: <strong className="text-indigo-400">{s.demand}%</strong> | Student Pool: {s.available}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex gap-0.5 border border-slate-850">
                  <div className="bg-indigo-500 h-full rounded-l-full" style={{ width: `${s.demand}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Triage & Stage Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Candidate Applications</h3>
            <p className="text-xs text-slate-400 mt-0.5">Advance stages, schedule interviews, or issue final placements.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{applications.length} applications total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Branch & CGPA</th>
                <th className="pb-3 font-semibold">Company / Role</th>
                <th className="pb-3 font-semibold">AI Match</th>
                <th className="pb-3 font-semibold">Current Stage</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.slice(0, 10).map(app => (
                <tr key={app.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 font-semibold text-white">{app.studentName}</td>
                  <td className="py-3 text-slate-300">
                    {app.studentDepartment.slice(0, 15)} · <span className="font-mono text-indigo-400">{app.studentCgpa.toFixed(1)}</span>
                  </td>
                  <td className="py-3 text-slate-300">
                    <span className="font-semibold text-slate-200">{app.companyName}</span>
                    <span className="block text-[11px] text-slate-400">{app.jobTitle}</span>
                  </td>
                  <td className="py-3 font-mono font-bold text-indigo-400">{app.aiMatchScore}%</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        app.currentStage === 'Selected'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : app.currentStage.includes('Interview')
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {app.currentStage}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setNewStage(app.currentStage);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Update Stage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stage Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 space-y-4 text-xs">
            <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">Triage Candidate Pipeline</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedApp.studentName}</h3>
              <p className="text-xs text-slate-400">{selectedApp.companyName} · {selectedApp.jobTitle}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">New Stage</label>
              <select
                value={newStage}
                onChange={e => setNewStage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option>Applied</option>
                <option>Assessment</option>
                <option>Shortlisted</option>
                <option>Technical Interview</option>
                <option>HR Interview</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>

            {newStage.includes('Interview') && (
              <div className="space-y-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-indigo-400 font-bold block text-[11px]">Schedule Interview Details</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={e => setInterviewTime(e.target.value)}
                    placeholder="11:00 AM IST"
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white"
                  />
                </div>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white font-mono text-[11px]"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Status Remarks</label>
              <textarea
                rows={2}
                value={stageRemarks}
                onChange={e => setStageRemarks(e.target.value)}
                placeholder="e.g. Cleared coding assessment round with top percentile..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md"
              >
                Confirm & Notify Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      {showCreateDrive && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in zoom-in-95 space-y-4 text-xs">
            <button onClick={() => setShowCreateDrive(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Automated Campus Recruitment Engine
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">Schedule Placement Drive</h3>
              <p className="text-xs text-slate-400">
                System will evaluate all 50 registered students and broadcast notifications to eligible candidates.
              </p>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Hiring Organization</label>
                  <select
                    value={driveForm.companyId}
                    onChange={e => setDriveForm({ ...driveForm, companyId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="comp-1">Google</option>
                    <option value="comp-2">Microsoft</option>
                    <option value="comp-3">Amazon</option>
                    <option value="comp-4">Atlassian</option>
                    <option value="comp-5">Goldman Sachs</option>
                    <option value="comp-6">Zomato</option>
                    <option value="comp-7">Razorpay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Designation / Role</label>
                  <input
                    type="text"
                    value={driveForm.role}
                    onChange={e => setDriveForm({ ...driveForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Compensation</label>
                  <input
                    type="text"
                    value={driveForm.packageLPA}
                    onChange={e => setDriveForm({ ...driveForm, packageLPA: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={driveForm.minCgpa}
                    onChange={e => setDriveForm({ ...driveForm, minCgpa: parseFloat(e.target.value) || 7.0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Max Backlogs</label>
                  <input
                    type="number"
                    value={driveForm.maxBacklogs}
                    onChange={e => setDriveForm({ ...driveForm, maxBacklogs: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Drive Date</label>
                  <input
                    type="date"
                    value={driveForm.driveDate}
                    onChange={e => setDriveForm({ ...driveForm, driveDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Required Skills (CSV)</label>
                  <input
                    type="text"
                    value={driveForm.requiredSkills}
                    onChange={e => setDriveForm({ ...driveForm, requiredSkills: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDrive(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Create & Run Eligibility Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
