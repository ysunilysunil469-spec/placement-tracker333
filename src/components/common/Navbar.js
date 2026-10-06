import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Compass, Briefcase, FileText, Bot, User, Bell, LogOut, Sparkles, ShieldCheck, Building, Menu, X, Award, } from 'lucide-react';
export const Navbar = ({ currentTab, onSelectTab, onOpenCopilot }) => {
    const { user, student, logout } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useEffect(() => {
        loadNotifications();
    }, [user]);
    const loadNotifications = async () => {
        try {
            const data = await api.getNotifications();
            setNotifications(data);
        }
        catch (e) {
            console.warn('Failed to load notifications:', e);
        }
    };
    const handleMarkAllRead = async () => {
        try {
            await api.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
        catch (e) {
            console.error(e);
        }
    };
    const unreadCount = notifications.filter(n => !n.isRead).length;
    // Role-based Nav items
    const getNavLinks = () => {
        if (!user) {
            return [{ id: 'landing', label: 'Home' }];
        }
        if (user.role === 'student') {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: Compass },
                { id: 'jobs', label: 'Opportunities', icon: Briefcase },
                { id: 'applications', label: 'Applications', icon: FileText },
                { id: 'copilot', label: 'Career Copilot', icon: Bot, isAi: true },
                { id: 'resume', label: 'Resume Analyzer', icon: Sparkles },
                { id: 'interview', label: 'Interview Prep', icon: Award },
                { id: 'profile', label: 'Profile', icon: User },
            ];
        }
        if (user.role === 'officer') {
            return [
                { id: 'officer-dashboard', label: 'Placement Analytics', icon: Compass },
                { id: 'officer-drives', label: 'Manage Drives & Eligibility', icon: ShieldCheck },
                { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
                { id: 'officer-students', label: 'Student Directory', icon: User },
            ];
        }
        if (user.role === 'recruiter') {
            return [
                { id: 'recruiter-dashboard', label: 'Recruitment Hub', icon: Building },
                { id: 'jobs', label: 'Job Listings', icon: Briefcase },
                { id: 'applications', label: 'Candidate Pipeline', icon: FileText },
            ];
        }
        if (user.role === 'admin') {
            return [
                { id: 'admin-dashboard', label: 'Admin Console', icon: ShieldCheck },
                { id: 'officer-dashboard', label: 'Placement Analytics', icon: Compass },
                { id: 'officer-drives', label: 'Placement Drives', icon: Briefcase },
                { id: 'officer-students', label: 'Students', icon: User },
            ];
        }
        return [{ id: 'landing', label: 'Home' }];
    };
    const links = getNavLinks();
    return (_jsxs("header", { className: "sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsxs("button", { onClick: () => onSelectTab(user ? (user.role === 'student' ? 'dashboard' : user.role === 'officer' ? 'officer-dashboard' : user.role === 'recruiter' ? 'recruiter-dashboard' : 'admin-dashboard') : 'landing'), className: "flex items-center gap-2.5 text-left group", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20", children: _jsx("div", { className: "w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center", children: _jsx(Sparkles, { className: "w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" }) }) }), _jsxs("div", { children: [_jsxs("span", { className: "font-bold text-base text-white tracking-tight flex items-center gap-1.5", children: ["Placement Tracker ", _jsx("span", { className: "text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium", children: "AI" })] }), _jsx("span", { className: "text-[10px] text-slate-400 block font-normal tracking-wide", children: "College to Career Ecosystem" })] })] }) }), _jsx("nav", { className: "hidden md:flex items-center gap-1", children: links.map(link => {
                                const Icon = link.icon;
                                const isActive = currentTab === link.id;
                                return (_jsxs("button", { onClick: () => onSelectTab(link.id), className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isActive
                                        ? 'bg-slate-800 text-white font-semibold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`, children: [Icon && _jsx(Icon, { className: `w-3.5 h-3.5 ${link.isAi ? 'text-indigo-400 animate-pulse' : ''}` }), _jsx("span", { children: link.label }), link.isAi && (_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-indigo-400" }))] }, link.id));
                            }) }), _jsxs("div", { className: "flex items-center gap-2.5", children: [user?.role === 'student' && (_jsxs("button", { onClick: onOpenCopilot, className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm shadow-indigo-600/30 transition-all border border-indigo-500/30", children: [_jsx(Bot, { className: "w-3.5 h-3.5 text-indigo-200" }), _jsx("span", { children: "Ask Copilot" })] })), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowNotifMenu(!showNotifMenu), className: "p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors relative", "aria-label": "Notifications", children: [_jsx(Bell, { className: "w-4 h-4" }), unreadCount > 0 && (_jsx("span", { className: "absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" }))] }), showNotifMenu && (_jsxs("div", { className: "absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-800", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-xs text-white", children: "Notifications" }), unreadCount > 0 && (_jsxs("span", { className: "px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono", children: [unreadCount, " new"] }))] }), unreadCount > 0 && (_jsx("button", { onClick: handleMarkAllRead, className: "text-[11px] text-slate-400 hover:text-indigo-400 transition-colors", children: "Mark all read" }))] }), _jsx("div", { className: "mt-2 max-h-80 overflow-y-auto space-y-2 divide-y divide-slate-800/40", children: notifications.length === 0 ? (_jsx("p", { className: "text-center py-6 text-xs text-slate-500", children: "No notifications yet" })) : (notifications.map(notif => (_jsxs("div", { className: `pt-2 text-xs ${notif.isRead ? 'opacity-70' : ''}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: "font-medium text-slate-200", children: notif.title }), _jsx("span", { className: "text-[10px] text-slate-500 shrink-0", children: new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) })] }), _jsx("p", { className: "text-[11px] text-slate-400 mt-0.5 leading-relaxed", children: notif.message })] }, notif.id)))) })] }))] }), user ? (_jsxs("div", { className: "flex items-center gap-2 pl-2 border-l border-slate-800", children: [_jsxs("button", { onClick: () => onSelectTab(user.role === 'student' ? 'profile' : currentTab), className: "flex items-center gap-2 text-left p-1 rounded-lg hover:bg-slate-900 transition-colors group", children: [_jsx("img", { src: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', alt: user.name, className: "w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" }), _jsxs("div", { className: "hidden lg:block", children: [_jsx("span", { className: "text-xs font-medium text-white block leading-tight truncate max-w-[110px]", children: user.name.split(' ')[0] }), _jsx("span", { className: "text-[10px] text-indigo-400 block uppercase font-mono font-medium", children: user.role })] })] }), _jsx("button", { onClick: logout, className: "p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors", title: "Logout", children: _jsx(LogOut, { className: "w-4 h-4" }) })] })) : (_jsx("button", { onClick: () => onSelectTab('login'), className: "px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors", children: "Sign In" })), _jsx("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "p-2 text-slate-400 hover:text-white md:hidden", children: mobileMenuOpen ? _jsx(X, { className: "w-5 h-5" }) : _jsx(Menu, { className: "w-5 h-5" }) })] })] }) }), mobileMenuOpen && (_jsx("div", { className: "md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-1", children: links.map(link => {
                    const Icon = link.icon;
                    const isActive = currentTab === link.id;
                    return (_jsxs("button", { onClick: () => {
                            onSelectTab(link.id);
                            setMobileMenuOpen(false);
                        }, className: `w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`, children: [Icon && _jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: link.label })] }, link.id));
                }) }))] }));
};
