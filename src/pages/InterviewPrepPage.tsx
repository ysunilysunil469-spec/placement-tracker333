import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { InterviewQuestion, InterviewEvaluation } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

export const InterviewPrepPage: React.FC = () => {
  const { student } = useAuth();
  const [role, setRole] = useState('Software Engineer (SDE-1)');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [role, difficulty]);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    setEvaluation(null);
    setUserAnswer('');
    try {
      const data = await api.getInterviewQuestions(role, difficulty);
      setQuestions(data);
      setSelectedQuestionIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const currentQuestion = questions[selectedQuestionIdx];

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion || isEvaluating) return;

    setIsEvaluating(true);
    try {
      const res = await api.evaluateInterviewAnswer(
        currentQuestion.question,
        userAnswer.trim(),
        currentQuestion.category
      );
      setEvaluation(res);

      if (res.score >= 7.5) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" /> High-Pressure Technical Interview Simulator
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          AI Interview Preparation & Grilling
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Practice realistic architectural questions and receive automated scoring, strengths, and ideal model answers.
        </p>
      </div>

      {/* Role & Difficulty Selectors */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-slate-400 font-medium">Target Role:</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>Software Engineer (SDE-1)</option>
            <option>AI / Machine Learning Engineer</option>
            <option>Backend Systems Engineer (FastAPI/Go)</option>
            <option>Cloud Infrastructure Engineer</option>
          </select>

          <label className="text-slate-400 font-medium ml-2">Difficulty:</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <button
          onClick={loadQuestions}
          disabled={isLoadingQuestions}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-750"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuestions ? 'animate-spin' : ''}`} />
          <span>Generate New Set</span>
        </button>
      </div>

      {/* Main Question & Answer Interface */}
      {isLoadingQuestions ? (
        <div className="h-64 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />
      ) : currentQuestion ? (
        <div className="space-y-6">
          {/* Question Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {questions.map((q, idx) => (
              <button
                key={q.id || idx}
                onClick={() => {
                  setSelectedQuestionIdx(idx);
                  setEvaluation(null);
                  setUserAnswer('');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
                  selectedQuestionIdx === idx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Question 0{idx + 1}</span>
                <span className="text-[10px] font-mono opacity-80">({q.category})</span>
              </button>
            ))}
          </div>

          {/* Active Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                {currentQuestion.category} · {currentQuestion.difficulty}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {currentQuestion.question}
            </h3>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Expected Key Elements:</span>
              <span>{currentQuestion.expectedKeyPoints.join(' · ')}</span>
            </div>
          </div>

          {/* Candidate Response Workspace */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 text-indigo-400">
                <HelpCircle className="w-4 h-4" /> Your Technical Explanation
              </label>
              <span className="text-xs font-mono text-slate-400">
                {userAnswer.split(' ').filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={7}
              placeholder="Structure your answer clearly: state definition, explain internal architecture/trade-offs, and give an example from your project..."
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Aim for 80–150 words highlighting real engineering trade-offs.
              </span>

              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isEvaluating}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit for AI Evaluation'}</span>
              </button>
            </div>
          </div>

          {/* AI Feedback & Score Card */}
          {evaluation && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Interviewer Scorecard
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                    Evaluation Result
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-slate-950 border border-indigo-500/40 text-center font-mono">
                    <span className="text-2xl font-bold text-white">{evaluation.score}</span>
                    <span className="text-xs text-indigo-400"> / 10.0</span>
                  </div>
                </div>
              </div>

              {/* General Feedback */}
              <p className="text-xs text-slate-200 leading-relaxed bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/30">
                {evaluation.feedback}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> What You Did Well
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {evaluation.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Room for Improvement
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {evaluation.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">⚠</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Model Ideal Answer Sample */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white flex items-center gap-1 text-indigo-400">
                  <BookOpen className="w-3.5 h-3.5" /> Ideal Candidate Benchmark Answer
                </h4>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                  {evaluation.idealAnswerSample}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
