import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';
import { api } from '../../services/api';
import {
  Compass,
  Briefcase,
  FileText,
  Bot,
  User,
  Bell,
  LogOut,
  Sparkles,
  ShieldCheck,
  Building,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
  Award,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCopilot: () => void;
}

interface NavLinkItem {
  id: string;
  label: string;
  icon?: any;
  isAi?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenCopilot }) => {
  const { user, student, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Role-based Nav items
  const getNavLinks = (): NavLinkItem[] => {
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

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab(user ? (user.role === 'student' ? 'dashboard' : user.role === 'officer' ? 'officer-dashboard' : user.role === 'recruiter' ? 'recruiter-dashboard' : 'admin-dashboard') : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
                  Placement Tracker <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-normal tracking-wide">
                  College to Career Ecosystem
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${link.isAi ? 'text-indigo-400 animate-pulse' : ''}`} />}
                  <span>{link.label}</span>
                  {link.isAi && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Copilot shortcut, Notification dropdown, User badge */}
          <div className="flex items-center gap-2.5">
            {/* Quick Copilot button */}
            {user?.role === 'student' && (
              <button
                onClick={onOpenCopilot}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm shadow-indigo-600/30 transition-all border border-indigo-500/30"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-200" />
                <span>Ask Copilot</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>

              {/* Notification popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-80 overflow-y-auto space-y-2 divide-y divide-slate-800/40">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-500">No notifications yet</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`pt-2 text-xs ${notif.isRead ? 'opacity-70' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-slate-200">{notif.title}</span>
                            <span className="text-[10px] text-slate-500 shrink-0">
                              {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={() => onSelectTab(user.role === 'student' ? 'profile' : currentTab)}
                  className="flex items-center gap-2 text-left p-1 rounded-lg hover:bg-slate-900 transition-colors group"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div className="hidden lg:block">
                    <span className="text-xs font-medium text-white block leading-tight truncate max-w-[110px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-indigo-400 block uppercase font-mono font-medium">
                      {user.role}
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectTab('login')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-1">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
