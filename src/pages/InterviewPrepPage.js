import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { Award, Sparkles, HelpCircle, CheckCircle2, AlertCircle, RefreshCw, BookOpen, } from 'lucide-react';
export const InterviewPrepPage = () => {
    const { student } = useAuth();
    const [role, setRole] = useState('Software Engineer (SDE-1)');
    const [difficulty, setDifficulty] = useState('Medium');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
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
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoadingQuestions(false);
        }
    };
    const currentQuestion = questions[selectedQuestionIdx];
    const handleSubmitAnswer = async () => {
        if (!userAnswer.trim() || !currentQuestion || isEvaluating)
            return;
        setIsEvaluating(true);
        try {
            const res = await api.evaluateInterviewAnswer(currentQuestion.question, userAnswer.trim(), currentQuestion.category);
            setEvaluation(res);
            if (res.score >= 7.5) {
                try {
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.6 },
                    });
                }
                catch (e) { }
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsEvaluating(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-16 max-w-5xl mx-auto", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(Award, { className: "w-3.5 h-3.5" }), " High-Pressure Technical Interview Simulator"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "AI Interview Preparation & Grilling" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Practice realistic architectural questions and receive automated scoring, strengths, and ideal model answers." })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("label", { className: "text-slate-400 font-medium", children: "Target Role:" }), _jsxs("select", { value: role, onChange: e => setRole(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "Software Engineer (SDE-1)" }), _jsx("option", { children: "AI / Machine Learning Engineer" }), _jsx("option", { children: "Backend Systems Engineer (FastAPI/Go)" }), _jsx("option", { children: "Cloud Infrastructure Engineer" })] }), _jsx("label", { className: "text-slate-400 font-medium ml-2", children: "Difficulty:" }), _jsxs("select", { value: difficulty, onChange: e => setDifficulty(e.target.value), className: "bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500", children: [_jsx("option", { children: "Easy" }), _jsx("option", { children: "Medium" }), _jsx("option", { children: "Hard" })] })] }), _jsxs("button", { onClick: loadQuestions, disabled: isLoadingQuestions, className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-750", children: [_jsx(RefreshCw, { className: `w-3.5 h-3.5 ${isLoadingQuestions ? 'animate-spin' : ''}` }), _jsx("span", { children: "Generate New Set" })] })] }), isLoadingQuestions ? (_jsx("div", { className: "h-64 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" })) : currentQuestion ? (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-1", children: questions.map((q, idx) => (_jsxs("button", { onClick: () => {
                                setSelectedQuestionIdx(idx);
                                setEvaluation(null);
                                setUserAnswer('');
                            }, className: `px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${selectedQuestionIdx === idx
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`, children: [_jsxs("span", { children: ["Question 0", idx + 1] }), _jsxs("span", { className: "text-[10px] font-mono opacity-80", children: ["(", q.category, ")"] })] }, q.id || idx))) }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsxs("span", { className: "text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold", children: [currentQuestion.category, " \u00B7 ", currentQuestion.difficulty] }) }), _jsx("h3", { className: "text-base sm:text-lg font-bold text-white tracking-tight leading-snug", children: currentQuestion.question }), _jsxs("div", { className: "mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400", children: [_jsx("span", { className: "font-semibold text-slate-300", children: "Expected Key Elements:" }), _jsx("span", { children: currentQuestion.expectedKeyPoints.join(' · ') })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 text-indigo-400", children: [_jsx(HelpCircle, { className: "w-4 h-4" }), " Your Technical Explanation"] }), _jsxs("span", { className: "text-xs font-mono text-slate-400", children: [userAnswer.split(' ').filter(Boolean).length, " words"] })] }), _jsx("textarea", { rows: 7, placeholder: "Structure your answer clearly: state definition, explain internal architecture/trade-offs, and give an example from your project...", value: userAnswer, onChange: e => setUserAnswer(e.target.value), className: "w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[11px] text-slate-500", children: "Aim for 80\u2013150 words highlighting real engineering trade-offs." }), _jsxs("button", { onClick: handleSubmitAnswer, disabled: !userAnswer.trim() || isEvaluating, className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer", children: [_jsx(Sparkles, { className: `w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}` }), _jsx("span", { children: isEvaluating ? 'Evaluating with AI...' : 'Submit for AI Evaluation' })] })] })] }), evaluation && (_jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " AI Interviewer Scorecard"] }), _jsx("h3", { className: "text-lg font-bold text-white tracking-tight mt-0.5", children: "Evaluation Result" })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "px-4 py-2 rounded-xl bg-slate-950 border border-indigo-500/40 text-center font-mono", children: [_jsx("span", { className: "text-2xl font-bold text-white", children: evaluation.score }), _jsx("span", { className: "text-xs text-indigo-400", children: " / 10.0" })] }) })] }), _jsx("p", { className: "text-xs text-slate-200 leading-relaxed bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/30", children: evaluation.feedback }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs", children: [_jsxs("div", { className: "p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2", children: [_jsxs("h4", { className: "font-bold text-emerald-400 flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " What You Did Well"] }), _jsx("ul", { className: "space-y-1.5 text-slate-300", children: evaluation.strengths.map((s, idx) => (_jsxs("li", { className: "flex items-start gap-1.5", children: [_jsx("span", { className: "text-emerald-400", children: "\u2713" }), _jsx("span", { children: s })] }, idx))) })] }), _jsxs("div", { className: "p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2", children: [_jsxs("h4", { className: "font-bold text-amber-400 flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-3.5 h-3.5" }), " Room for Improvement"] }), _jsx("ul", { className: "space-y-1.5 text-slate-300", children: evaluation.improvements.map((imp, idx) => (_jsxs("li", { className: "flex items-start gap-1.5", children: [_jsx("span", { className: "text-amber-400", children: "\u26A0" }), _jsx("span", { children: imp })] }, idx))) })] })] }), _jsxs("div", { className: "p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs", children: [_jsxs("h4", { className: "font-bold text-white flex items-center gap-1 text-indigo-400", children: [_jsx(BookOpen, { className: "w-3.5 h-3.5" }), " Ideal Candidate Benchmark Answer"] }), _jsx("p", { className: "text-slate-300 font-mono text-[11px] leading-relaxed", children: evaluation.idealAnswerSample })] })] }))] })) : null] }));
};
