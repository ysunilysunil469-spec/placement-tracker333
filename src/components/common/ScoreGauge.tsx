import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  grade?: string;
  breakdown?: {
    resume: number;
    skills: number;
    projects: number;
    communication: number;
    coding: number;
    interview: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  grade = 'Placement Ready',
  breakdown,
  size = 'md',
  showBreakdown = true,
}) => {
  // SVG circular calculations
  const radius = size === 'lg' ? 70 : size === 'md' ? 54 : 40;
  const stroke = size === 'lg' ? 12 : size === 'md' ? 10 : 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (val >= 65) return { stroke: '#6366f1', text: 'text-indigo-400', bg: 'bg-indigo-500/10' };
    return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute -right-12 -top-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90 transition-all duration-1000 ease-out"
          >
            {/* Background Circle */}
            <circle
              stroke="#1e293b"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress Circle */}
            <circle
              stroke={colors.stroke}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`font-mono font-bold tracking-tight ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl'} text-white`}>
              {score}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Status description */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> AI Readiness Engine
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{grade}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Continuous algorithmic synthesis of academic GPA, technical project depth, competitive programming, and ATS resume fidelity.
          </p>

          <div className="mt-3 flex items-center justify-center sm:justify-start gap-4 text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tier 1 Ready
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Targeting ₹20L+ LPA</span>
          </div>
        </div>
      </div>

      {/* Category breakdown bars */}
      {showBreakdown && breakdown && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Resume ATS', value: breakdown.resume },
            { label: 'Technical Skills', value: breakdown.skills },
            { label: 'Projects Depth', value: breakdown.projects },
            { label: 'Communication', value: breakdown.communication },
            { label: 'Coding / DSA', value: breakdown.coding },
            { label: 'Interview Readiness', value: breakdown.interview },
          ].map((cat, idx) => (
            <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium text-[11px]">{cat.label}</span>
                <span className="font-mono font-semibold text-slate-200">{cat.value}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    cat.value >= 80 ? 'bg-emerald-500' : cat.value >= 65 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${cat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
