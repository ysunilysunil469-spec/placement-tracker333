import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ResumeAnalysis } from '../types';
import {
  FileCheck2,
  Sparkles,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Check,
  RefreshCw,
  FileText,
} from 'lucide-react';

export const ResumeAnalyzerPage: React.FC = () => {
  const { student } = useAuth();
  const [resumeText, setResumeText] = useState(student?.resumeText || '');
  const [targetRole, setTargetRole] = useState('Software Engineer (Full-Stack)');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Run initial scan on student's existing resume
    if (student?.resumeText) {
      handleAnalyze(student.resumeText);
    }
  }, [student]);

  const handleAnalyze = async (textToScan?: string) => {
    setIsScanning(true);
    try {
      const res = await api.analyzeResume(textToScan || resumeText, targetRole);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const content = event.target?.result as string;
        if (content) {
          setResumeText(content);
          handleAnalyze(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
          <FileCheck2 className="w-3.5 h-3.5" /> High-Fidelity Recruiter ATS Engine
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          AI Resume & ATS Analyzer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Benchmark your resume bullets against Tier-1 campus hiring algorithms with metric quantification and Google XYZ rewrites.
        </p>
      </div>

      {/* Target Role & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-slate-400 font-medium shrink-0">Target Hiring Profile:</label>
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            className="flex-1 max-w-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>Software Engineer (Full-Stack)</option>
            <option>AI / Machine Learning Engineer</option>
            <option>Backend Engineer (Distributed Systems)</option>
            <option>Cloud / DevOps Engineer</option>
            <option>Data Engineer</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5 border border-slate-750">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Resume File</span>
            <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => handleAnalyze()}
            disabled={isScanning || !resumeText.trim()}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Analyzing ATS...' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-indigo-500/40 flex flex-col items-center justify-center font-mono shrink-0 shadow-lg">
                <span className="text-2xl font-bold text-white">{analysis.score}</span>
                <span className="text-[10px] uppercase text-indigo-400">/ 100</span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-indigo-400 font-semibold">
                  Overall ATS Compatibility Index
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {analysis.score >= 80 ? 'Tier-1 Recruiter Ready' : 'Optimization Required'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your resume will clear {analysis.atsCompatibility}% of automated corporate ATS screens without parsing dropouts.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Detected Tech Skills</span>
                <span className="text-emerald-400 font-bold">{analysis.detectedSkills.length} Verified</span>
              </div>
              <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Missing Key Terms</span>
                <span className="text-amber-400 font-bold">{analysis.missingKeywords.length} Gaps</span>
              </div>
            </div>
          </div>

          {/* Sub-Metric Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'ATS Formatting', val: analysis.breakdown.formatting },
              { label: 'Skills Alignment', val: analysis.breakdown.skillsMatch },
              { label: 'Project Depth', val: analysis.breakdown.projectsQuality },
              { label: 'Metrics Impact', val: analysis.breakdown.achievementsQuantification },
              { label: 'Keyword Density', val: analysis.breakdown.keywordDensity },
              { label: 'Parser Health', val: analysis.breakdown.atsScore },
            ].map((metric, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
                <span className="text-slate-400 block text-[11px] truncate mb-1">{metric.label}</span>
                <div className="flex items-center justify-between font-mono mb-1.5">
                  <span className="text-sm font-bold text-white">{metric.val}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.val >= 80 ? 'bg-emerald-500' : metric.val >= 65 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                    style={{ width: `${metric.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actionable Bullet Rewrites (Google XYZ Formula) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase font-semibold mb-4">
              <Sparkles className="w-4 h-4" /> Actionable Bullet Point Enhancements (Google XYZ Model)
            </div>

            <div className="space-y-4">
              {analysis.actionableRewrites.map((rewrite, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  {/* Before */}
                  <div className="flex items-start gap-2 text-rose-300">
                    <span className="font-mono font-bold text-rose-400 shrink-0">Original (Weak):</span>
                    <span className="italic line-through opacity-80">{rewrite.original}</span>
                  </div>

                  {/* After */}
                  <div className="flex items-start gap-2 text-emerald-300 font-medium">
                    <span className="font-mono font-bold text-emerald-400 shrink-0">Optimized (Impact):</span>
                    <span>{rewrite.improved}</span>
                  </div>

                  {/* Why */}
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                    <strong className="text-slate-300">Why this wins:</strong> {rewrite.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords & Recruiter Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Missing Keywords */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-semibold mb-3">
                <AlertTriangle className="w-4 h-4" /> Essential Keywords to Inject
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Recruiter parsing filters look for these specific industry terms for {targetRole}:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Critical Feedback */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase font-semibold mb-3">
                <Lightbulb className="w-4 h-4" /> Recruiter Optimization Directives
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.criticalFeedback.map((fb, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold shrink-0">0{idx + 1}.</span>
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Raw Resume Text Editor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 text-indigo-400">
            <FileText className="w-4 h-4" /> Live Resume Content
          </h3>
          <span className="text-xs font-mono text-slate-400">{resumeText.length} characters</span>
        </div>
        <textarea
          rows={10}
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
          placeholder="Paste full resume text to analyze against ATS parsing algorithms..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
        />
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={() => handleAnalyze()}
            disabled={isScanning || !resumeText.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-Analyze Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
