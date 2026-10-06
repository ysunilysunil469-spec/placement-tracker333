import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application } from '../types';
import {
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Award,
  ChevronRight,
  Sparkles,
  Building,
  AlertCircle,
  XCircle,
} from 'lucide-react';

interface ApplicationTrackerPageProps {
  onNavigateToInterview?: () => void;
}

export const ApplicationTrackerPage: React.FC<ApplicationTrackerPageProps> = ({ onNavigateToInterview }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stageFilter, setStageFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [stageFilter]);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getApplications({
        stage: stageFilter !== 'All' ? stageFilter : undefined,
      });
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const STAGES = [
    'Applied',
    'Assessment',
    'Shortlisted',
    'Technical Interview',
    'HR Interview',
    'Selected',
  ];

  const getStageIndex = (stage: string) => {
    if (stage === 'Rejected') return -1;
    return STAGES.indexOf(stage);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> Campus Recruitment Funnel
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Application Pipeline Tracker
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your recruitment stages, online assessments, technical rounds, and formal job offers in real time.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        {['All', 'Applied', 'Assessment', 'Shortlisted', 'Technical Interview', 'Selected', 'Rejected'].map(s => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              stageFilter === s
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No applications in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Submit applications from the Opportunities page to track your pipeline</p>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map(app => {
            const currentIdx = getStageIndex(app.currentStage);
            const isSelected = app.currentStage === 'Selected';
            const isRejected = app.currentStage === 'Rejected';

            return (
              <div
                key={app.id}
                className={`bg-slate-900 border rounded-2xl p-6 shadow-xl transition-all ${
                  isSelected
                    ? 'border-emerald-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20'
                    : isRejected
                    ? 'border-rose-900/40 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-750'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">{app.companyName}</h3>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{app.packageLPA}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{app.jobTitle}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold">
                      {app.aiMatchScore}% AI Match
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isRejected
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {app.currentStage}
                    </span>
                  </div>
                </div>

                {/* Visual Stages Progress Pipeline */}
                {!isRejected && (
                  <div className="py-6">
                    <div className="hidden md:grid grid-cols-6 gap-2 relative">
                      {STAGES.map((stg, idx) => {
                        const isDone = currentIdx >= idx;
                        const isCurrent = currentIdx === idx;
                        return (
                          <div key={stg} className="relative text-center">
                            {/* Connector line */}
                            {idx > 0 && (
                              <div
                                className={`absolute top-3.5 -left-1/2 w-full h-[2px] -z-0 ${
                                  currentIdx >= idx ? 'bg-indigo-500' : 'bg-slate-800'
                                }`}
                              />
                            )}

                            {/* Node circle */}
                            <div
                              className={`relative z-10 w-7 h-7 mx-auto rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                                isCurrent
                                  ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/20 scale-110 shadow-lg shadow-indigo-500/50'
                                  : isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`block mt-2 text-[11px] font-medium leading-tight ${
                                isCurrent ? 'text-white font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              {stg}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile simplified progress */}
                    <div className="md:hidden flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400">Current Phase:</span>
                      <strong className="text-indigo-400 font-bold">{app.currentStage} (Step {currentIdx + 1} of 6)</strong>
                    </div>
                  </div>
                )}

                {/* Interview Schedule Callout (if active) */}
                {app.interviewSchedule && (
                  <div className="mb-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white block">Interview Scheduled</strong>
                        <span className="text-slate-300 font-mono">
                          {app.interviewSchedule.date} at {app.interviewSchedule.time} · {app.interviewSchedule.interviewer}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onNavigateToInterview && (
                        <button
                          onClick={onNavigateToInterview}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 border border-slate-750"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>AI Mock Prep</span>
                        </button>
                      )}
                      <a
                        href={app.interviewSchedule.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <span>Join Meeting</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Stage History Timeline */}
                <div className="pt-3 border-t border-slate-800/80">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    Recruitment Stage History
                  </h4>
                  <div className="space-y-2 text-xs">
                    {app.stageHistory.map((hist, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-slate-300">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-white">{hist.stage}</strong>
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(hist.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{hist.remarks}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
