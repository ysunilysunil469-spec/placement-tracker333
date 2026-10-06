import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Bot, Send, Sparkles, User, Lightbulb, Copy, Check, } from 'lucide-react';
export const CareerCopilotPage = () => {
    const { student } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 'init-1',
            role: 'model',
            text: `Hello ${student?.name?.split(' ')[0] || 'Suneel'}! I am your dedicated **Career Copilot**.

I have reviewed your verified academic dossier:
- **CGPA:** ${student?.cgpa.toFixed(1) || '8.4'}/10.0 (Zero active backlogs)
- **Top Competencies:** ${student?.skills.slice(0, 4).map(s => s.name).join(', ') || 'Python, React, FastAPI, DSA'}
- **Readiness Score:** ${student?.readinessScore || 78}/100 (Tier-1 Ready)
- **Upcoming Milestone:** Google Technical Interview on Oct 18!

How can I help accelerate your placement strategy today? Choose a suggested inquiry below or ask me anything.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const chatBottomRef = useRef(null);
    const suggestedPrompts = [
        'Which companies can I apply for with my 8.4 CGPA?',
        'What skills am I missing for an AI Engineer role?',
        'Give me a 30-day placement preparation plan.',
        'Am I eligible for the Atlassian campus drive?',
        'Ask me 5 interview questions for Python & System Design.',
        'Review my distributed key-value store project.',
    ];
    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    const handleSend = async (messageText) => {
        if (!messageText.trim() || isTyping)
            return;
        const userMsg = {
            id: `msg-${Date.now()}`,
            role: 'user',
            text: messageText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        try {
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }],
            }));
            const reply = await api.askCareerCopilot(messageText.trim(), history);
            const aiMsg = {
                id: `ai-${Date.now()}`,
                role: 'model',
                text: reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, aiMsg]);
        }
        catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: 'model',
                    text: 'I encountered an issue connecting to the AI brain. Please try your question again.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        }
        finally {
            setIsTyping(false);
        }
    };
    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    return (_jsxs("div", { className: "space-y-6 pb-12 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between shrink-0", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xs font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5", children: [_jsx(Bot, { className: "w-3.5 h-3.5" }), " Context-Aware Placement Advisor"] }), _jsx("h1", { className: "text-2xl font-extrabold text-white tracking-tight mt-0.5", children: "Career Copilot" })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }), _jsx("span", { children: "Grounded in student database profile" })] })] }), _jsxs("div", { className: "shrink-0 flex items-center gap-2 overflow-x-auto pb-1 text-xs", children: [_jsxs("span", { className: "text-slate-500 font-mono flex items-center gap-1 shrink-0 text-[11px]", children: [_jsx(Lightbulb, { className: "w-3.5 h-3.5 text-amber-400" }), " Prompts:"] }), suggestedPrompts.map((p, idx) => (_jsx("button", { onClick: () => handleSend(p), className: "px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white whitespace-nowrap text-xs transition-colors shrink-0", children: p }, idx)))] }), _jsxs("div", { className: "flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-y-auto space-y-4 shadow-xl", children: [messages.map(m => {
                        const isUser = m.role === 'user';
                        return (_jsxs("div", { className: `flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`, children: [_jsx("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isUser
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-400'}`, children: isUser ? _jsx(User, { className: "w-4 h-4" }) : _jsx(Bot, { className: "w-4 h-4" }) }), _jsxs("div", { className: `max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed relative group ${isUser
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-slate-950 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-md'}`, children: [_jsx("div", { className: "whitespace-pre-line prose-invert", children: m.text }), _jsxs("div", { className: "mt-2 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-500", children: [_jsx("span", { children: m.timestamp }), !isUser && (_jsxs("button", { onClick: () => copyToClipboard(m.text, m.id), className: "opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white flex items-center gap-1", children: [copiedId === m.id ? _jsx(Check, { className: "w-3 h-3 text-emerald-400" }) : _jsx(Copy, { className: "w-3 h-3" }), _jsx("span", { children: copiedId === m.id ? 'Copied' : 'Copy' })] }))] })] })] }, m.id));
                    }), isTyping && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0", children: _jsx(Bot, { className: "w-4 h-4 animate-spin" }) }), _jsxs("div", { className: "bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5 text-indigo-400 animate-pulse" }), _jsx("span", { children: "Analyzing academic parameters and drafting guidance..." })] })] })), _jsx("div", { ref: chatBottomRef })] }), _jsxs("form", { onSubmit: e => {
                    e.preventDefault();
                    handleSend(input);
                }, className: "shrink-0 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-xl", children: [_jsx("input", { type: "text", placeholder: "Ask Career Copilot about company eligibility, resume critique, interview questions...", value: input, onChange: e => setInput(e.target.value), disabled: isTyping, className: "flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none" }), _jsxs("button", { type: "submit", disabled: !input.trim() || isTyping, className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0", children: [_jsx("span", { children: "Send" }), _jsx(Send, { className: "w-3.5 h-3.5" })] })] })] }));
};
