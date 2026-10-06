import React, { useState } from 'react';
import {
  Code,
  AlertCircle,
  BookOpen,
  FolderGit2,
  Users,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface RoadmapInteractiveProps {
  currentSkills: string[];
  missingSkills?: string[];
}

export const RoadmapInteractive: React.FC<RoadmapInteractiveProps> = ({
  currentSkills,
  missingSkills = ['Docker & Containers', 'Advanced System Design', 'Distributed Caching'],
}) => {
  const [activeStep, setActiveStep] = useState<number>(3);

  const steps = [
    {
      id: 0,
      title: 'Current Skill Core',
      icon: Code,
      status: 'completed',
      tag: 'Verified Foundations',
      description: 'Established proficiency across core stacks.',
      details: currentSkills.slice(0, 5).join(' · '),
    },
    {
      id: 1,
      title: 'Identified Skill Gaps',
      icon: AlertCircle,
      status: 'completed',
      tag: 'ATS & Recruiter Gaps',
      description: 'High-impact technical competencies missing from job requirements.',
      details: missingSkills.join(' · '),
    },
    {
      id: 2,
      title: 'Targeted Sprint Plan',
      icon: BookOpen,
      status: 'in-progress',
      tag: 'Active 3-Week Sprint',
      description: 'Self-paced mastery of microservices architecture & SQL optimization.',
      details: 'Docker containerization & Redis spatial caching benchmarks.',
    },
    {
      id: 3,
      title: 'High-Fidelity Projects',
      icon: FolderGit2,
      status: 'in-progress',
      tag: '3 Verified Systems',
      description: 'Production-grade applications deployed with measurable latency metrics.',
      details: 'Placement Tracker AI, Distributed Key-Value Store, Chest X-Ray AI.',
    },
    {
      id: 4,
      title: 'Technical Interviews',
      icon: Users,
      status: 'upcoming',
      tag: 'Google Round 1 (Oct 18)',
      description: 'Algorithmic DSA grilling & System Design architectural defense.',
      details: 'Data structures, BFS/DFS, LRU caches, STAR behavioral technique.',
    },
    {
      id: 5,
      title: 'Placement Offer',
      icon: Trophy,
      status: 'upcoming',
      tag: 'Zomato Offer Secured (₹22 LPA)',
      description: 'Targeting Super-Dream compensation package tier (₹30L+ LPA).',
      details: 'Formal offer released, pending Google & Microsoft decisions.',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Placement Trajectory
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Career Progression Roadmap
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4 of 6 Milestones Met
          </span>
          <span>·</span>
          <span>Level 7 Scholar</span>
        </div>
      </div>

      {/* Timeline nodes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-3.5 rounded-xl border transition-all relative ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : isCompleted
                  ? 'bg-slate-950/70 border-emerald-500/30 hover:border-emerald-500/60'
                  : isInProgress
                  ? 'bg-slate-950/70 border-indigo-500/30 hover:border-indigo-500/60'
                  : 'bg-slate-950/40 border-slate-850 hover:border-slate-750 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isInProgress
                      ? 'bg-indigo-500/20 text-indigo-400 animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[10px] text-slate-500">0{idx + 1}</span>
              </div>

              <h4 className="text-xs font-bold text-white truncate">{step.title}</h4>
              <span
                className={`text-[10px] font-mono block mt-1 truncate ${
                  isCompleted ? 'text-emerald-400' : isInProgress ? 'text-indigo-400' : 'text-slate-500'
                }`}
              >
                {step.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Expanded Inspector */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              Stage 0{activeStep + 1}: {steps[activeStep].title}
            </span>
            <span className="text-xs text-slate-400">{steps[activeStep].description}</span>
          </div>
          <p className="text-xs font-mono text-slate-300 mt-1">
            <strong className="text-indigo-400">Key Context:</strong> {steps[activeStep].details}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-400">Step {activeStep + 1} of 6</span>
          <button
            onClick={() => setActiveStep((activeStep + 1) % steps.length)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            <span>Next Phase</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
