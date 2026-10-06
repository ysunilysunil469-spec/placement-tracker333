import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PlacementDrive } from '../types';
import {
  ShieldCheck,
  Calendar,
  Building,
  Users,
  CheckCircle2,
  XCircle,
  X,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const OfficerDrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [selectedDriveReport, setSelectedDriveReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportFilter, setReportFilter] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const [searchStudent, setSearchStudent] = useState('');

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDrives();
      setDrives(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspectDrive = async (driveId: string) => {
    try {
      const report = await api.getDriveEligibilityReport(driveId);
      setSelectedDriveReport(report);
      setReportFilter('all');
      setSearchStudent('');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredReportStudents = selectedDriveReport
    ? (reportFilter === 'eligible'
        ? selectedDriveReport.eligibleStudents
        : reportFilter === 'ineligible'
        ? selectedDriveReport.ineligibleStudents
        : [...selectedDriveReport.eligibleStudents, ...selectedDriveReport.ineligibleStudents]
      ).filter((s: any) =>
        s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
        s.department.toLowerCase().includes(searchStudent.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Automated Rules & Compliance Engine
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Placement Drives & Eligibility Verification
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect deterministic candidate qualification reports calculated against university CGPA, backlog quotas, and branch filters.
        </p>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {drives.map(drive => {
          const total = drive.eligibleStudentCount + drive.ineligibleStudentCount;
          const eligiblePercent = Math.round((drive.eligibleStudentCount / Math.max(1, total)) * 100);

          return (
            <div
              key={drive.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-750 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">{drive.companyName}</span>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{drive.role}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      drive.status === 'Completed'
                        ? 'bg-slate-800 text-slate-300'
                        : drive.status === 'In-Progress'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {drive.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs mb-3 font-mono">
                  <span className="text-emerald-400 font-bold">{drive.packageLPA}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {drive.driveDate}
                  </span>
                </div>

                {/* Eligibility criteria badges */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1.5 text-xs mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Criteria Requirements:</span>
                    <span className="text-slate-200 font-mono">Min CGPA {drive.minCgpa} · 0 Backlogs</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Branches:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{drive.eligibleDepartments.join(', ')}</span>
                  </div>
                </div>

                {/* Eligibility Breakdown Bar */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {drive.eligibleStudentCount} Eligible ({eligiblePercent}%)
                    </span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {drive.ineligibleStudentCount} Ineligible
                    </span>
                  </div>
                  <div className="w-full bg-rose-950/40 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${eligiblePercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Bottom Inspection trigger */}
              <button
                onClick={() => handleInspectDrive(drive.id)}
                className="w-full py-2 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-750"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inspect Eligibility Report</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Eligibility Inspection Modal */}
      {selectedDriveReport && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 text-xs">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-3 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Automated Eligibility Audit Engine
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedDriveReport.drive.companyName} — {selectedDriveReport.drive.role}
                </h3>
                <p className="text-xs text-slate-400">
                  Required: CGPA &ge; {selectedDriveReport.drive.minCgpa} · Max Backlogs: {selectedDriveReport.drive.maxBacklogs} · Departments: {selectedDriveReport.drive.eligibleDepartments.join(', ')}
                </p>
              </div>

              <button onClick={() => setSelectedDriveReport(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter controls */}
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg">
                <button
                  onClick={() => setReportFilter('all')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    reportFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({selectedDriveReport.totalStudents})
                </button>
                <button
                  onClick={() => setReportFilter('eligible')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    reportFilter === 'eligible' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Eligible ({selectedDriveReport.eligibleCount})
                </button>
                <button
                  onClick={() => setReportFilter('ineligible')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    reportFilter === 'ineligible' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ineligible ({selectedDriveReport.ineligibleCount})
                </button>
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search student or department..."
                  value={searchStudent}
                  onChange={e => setSearchStudent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Scrollable Students List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2.5 divide-y divide-slate-800/40">
              {filteredReportStudents.map((std: any) => {
                const isEligible = std.isEligible;
                return (
                  <div key={std.studentId} className="pt-2.5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{std.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {std.department} · CGPA <strong className={isEligible ? 'text-emerald-400' : 'text-rose-400'}>{std.cgpa.toFixed(1)}</strong>
                        </span>
                        {std.activeBacklogs > 0 && (
                          <span className="text-[10px] text-amber-400 font-mono">({std.activeBacklogs} backlogs)</span>
                        )}
                      </div>

                      <div className="mt-1 text-[11px]">
                        {isEligible ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Meets all academic & department parameters
                          </span>
                        ) : (
                          <div className="text-rose-400 space-y-0.5">
                            {std.reasons.map((r: string, rIdx: number) => (
                              <span key={rIdx} className="block flex items-center gap-1">
                                <XCircle className="w-3 h-3 shrink-0" /> Reason: {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold shrink-0 ${
                        isEligible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {isEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
