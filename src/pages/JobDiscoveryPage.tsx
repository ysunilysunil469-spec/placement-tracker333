import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Job, Application, JobMatchReport } from '../types';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Building,
  GraduationCap,
} from 'lucide-react';

export const JobDiscoveryPage: React.FC = () => {
  const { student } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [roleTypeFilter, setRoleTypeFilter] = useState('All');
  const [minSalaryFilter, setMinSalaryFilter] = useState('');

  // Selected job for AI Match breakdown modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobMatchReport, setJobMatchReport] = useState<JobMatchReport | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);

  // Applying state
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadJobsAndApplications();
  }, [search, departmentFilter, roleTypeFilter, minSalaryFilter]);

  const loadJobsAndApplications = async () => {
    setIsLoading(true);
    try {
      const [allJobs, userApps] = await Promise.all([
        api.getJobs({
          search: search || undefined,
          department: departmentFilter !== 'All' ? departmentFilter : undefined,
          roleType: roleTypeFilter !== 'All' ? roleTypeFilter : undefined,
          minSalary: minSalaryFilter ? Number(minSalaryFilter) : undefined,
        }),
        api.getApplications(),
      ]);

      setJobs(allJobs);
      const appliedIds = new Set(userApps.map(a => a.jobId));
      setAppliedJobIds(appliedIds);
    } catch (e) {
      console.error('Failed to load jobs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (job: Job) => {
    setApplyingJobId(job.id);
    setApplySuccessMsg(null);
    try {
      await api.applyToJob(job.id);
      setAppliedJobIds(prev => new Set([...prev, job.id]));
      setApplySuccessMsg(`Application successfully submitted for ${job.companyName} (${job.title})! +50 Placement XP awarded.`);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (err) {}

      setTimeout(() => setApplySuccessMsg(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleViewAiMatch = async (job: Job) => {
    setSelectedJob(job);
    setIsLoadingMatch(true);
    try {
      const report = await api.getJobMatch(job.id);
      setJobMatchReport(report);
    } catch (err) {
      console.error('Failed to compute job match:', err);
    } finally {
      setIsLoadingMatch(false);
    }
  };

  // Helper to compute quick approximate match for card badge
  const calculateCardMatch = (job: Job) => {
    const studentSkills = student?.skills.map(s => s.name.toLowerCase()) || [];
    const matched = job.requiredSkills.filter(req =>
      studentSkills.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))
    );
    const score = Math.min(96, Math.max(55, Math.round((matched.length / Math.max(1, job.requiredSkills.length)) * 50 + (student?.cgpa || 8) * 4.5)));
    return score;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div>
        <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> Campus Recruitment Drives & Openings
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Placement Opportunities
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore campus hiring openings tailored to your branch with automated eligibility and AI skill matching.
        </p>
      </div>

      {applySuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{applySuccessMsg}</span>
          </div>
          <button onClick={() => setApplySuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search company, job role, or skill (e.g. Python, Google, Azure)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="Electronics & Comm.">Electronics & Comm.</option>
          </select>

          <select
            value={roleTypeFilter}
            onChange={e => setRoleTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Role Types</option>
            <option value="Full-Time">Full-Time (FTE)</option>
            <option value="Internship">Summer Internship</option>
          </select>

          <select
            value={minSalaryFilter}
            onChange={e => setMinSalaryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Any Compensation</option>
            <option value="10">₹10+ LPA</option>
            <option value="20">₹20+ LPA (Super Dream)</option>
            <option value="30">₹30+ LPA (Elite Tier)</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
          <Building className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No opportunities matching criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting search filters or keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map(job => {
            const hasApplied = appliedJobIds.has(job.id);
            const cardMatch = calculateCardMatch(job);
            const isEligible = (student?.cgpa || 8.4) >= job.minCgpa && (student?.activeBacklogs || 0) <= job.maxBacklogs;

            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-xl flex flex-col justify-between transition-all hover:shadow-2xl relative overflow-hidden group"
              >
                {/* Top Company Info & Match badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400">{job.companyName}</h4>
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* AI Match Badge */}
                    <button
                      onClick={() => handleViewAiMatch(job)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-mono font-bold flex items-center gap-1 shrink-0 transition-colors"
                      title="Inspect AI Match Details"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>{cardMatch}% Match</span>
                    </button>
                  </div>

                  {/* Compensation & Mode */}
                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="font-mono font-bold text-emerald-400">{job.packageLPA}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location} ({job.workMode})
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  {/* Academic Eligibility verification */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-850 text-[11px] mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Eligibility Criteria:</span>
                      {isEligible ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Eligible (CGPA {student?.cgpa.toFixed(1) || '8.4'})
                        </span>
                      ) : (
                        <span className="text-rose-400 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Min CGPA {job.minCgpa}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Required Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requiredSkills.slice(0, 4).map((skill, sIdx) => {
                      const hasSkill = student?.skills.some(
                        s => s.name.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.name.toLowerCase())
                      );
                      return (
                        <span
                          key={sIdx}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            hasSkill ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30' : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {skill} {hasSkill && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewAiMatch(job)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Why I Match</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {hasApplied ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      disabled={applyingJobId === job.id}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{applyingJobId === job.id ? 'Submitting...' : 'Apply Now'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Match Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => {
                setSelectedJob(null);
                setJobMatchReport(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src={selectedJob.companyLogo} alt={selectedJob.companyName} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Candidate-Job Match Diagnostic
                </span>
                <h3 className="text-lg font-bold text-white">{selectedJob.title}</h3>
                <p className="text-xs text-slate-400">{selectedJob.companyName} · {selectedJob.packageLPA}</p>
              </div>
            </div>

            {isLoadingMatch ? (
              <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
                <span>Synthesizing ATS candidate profile against role specifications...</span>
              </div>
            ) : jobMatchReport ? (
              <div className="space-y-4 text-xs">
                {/* Score bar */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Computed Match Compatibility</span>
                    <span className="text-2xl font-bold font-mono text-white">
                      {jobMatchReport.matchScore}% <span className="text-xs text-indigo-400 font-normal">({jobMatchReport.matchTier} Match)</span>
                    </span>
                  </div>
                  <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: `${jobMatchReport.matchScore}%` }} />
                  </div>
                </div>

                {/* AI Rationale */}
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 leading-relaxed">
                  <strong className="text-white block mb-1">AI Recommendation Rationale:</strong>
                  {jobMatchReport.rationale}
                </div>

                {/* Matching Skills */}
                <div>
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Matching Skills ({jobMatchReport.matchingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jobMatchReport.matchingSkills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                        {s} ✓
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                {jobMatchReport.missingSkills.length > 0 && (
                  <div>
                    <h4 className="font-bold text-white mb-2 flex items-center gap-1 text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" /> Recommended Additional Competencies ({jobMatchReport.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatchReport.missingSkills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Prep */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-white mb-2">Recommended Prep Actions:</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {jobMatchReport.recommendedPrep.map((prep, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400">0{idx + 1}.</span>
                        <span>{prep}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modal Bottom Apply */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  {appliedJobIds.has(selectedJob.id) ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">
                      Already Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        handleApply(selectedJob);
                        setSelectedJob(null);
                      }}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors"
                    >
                      Confirm Application Submission
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
