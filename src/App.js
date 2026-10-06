import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { QuickDemoBanner } from './components/common/QuickDemoBanner';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { JobDiscoveryPage } from './pages/JobDiscoveryPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { CareerCopilotPage } from './pages/CareerCopilotPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { OfficerDrivesPage } from './pages/OfficerDrivesPage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
function MainApp() {
    const { user, switchDemoRole } = useAuth();
    const [currentTab, setCurrentTab] = useState('dashboard');
    // Handle default tab routing based on role when tab is not set or when role changes
    React.useEffect(() => {
        if (!user) {
            setCurrentTab('landing');
        }
        else if (currentTab === 'landing' || currentTab === 'login') {
            if (user.role === 'student')
                setCurrentTab('dashboard');
            else if (user.role === 'officer')
                setCurrentTab('officer-dashboard');
            else if (user.role === 'recruiter')
                setCurrentTab('recruiter-dashboard');
            else if (user.role === 'admin')
                setCurrentTab('admin-dashboard');
        }
    }, [user]);
    const handleRoleSelectFromLanding = async (role) => {
        await switchDemoRole(role);
        if (role === 'student')
            setCurrentTab('dashboard');
        else if (role === 'officer')
            setCurrentTab('officer-dashboard');
        else if (role === 'recruiter')
            setCurrentTab('recruiter-dashboard');
        else if (role === 'admin')
            setCurrentTab('admin-dashboard');
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans", children: [_jsx(QuickDemoBanner, {}), _jsx(Navbar, { currentTab: currentTab, onSelectTab: tab => setCurrentTab(tab), onOpenCopilot: () => setCurrentTab('copilot') }), _jsxs("main", { className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6", children: [currentTab === 'landing' && (_jsx(LandingPage, { onGetStarted: () => setCurrentTab('login'), onSelectRole: handleRoleSelectFromLanding })), currentTab === 'login' && (_jsx(LoginPage, { onSuccess: () => {
                            if (user?.role === 'student')
                                setCurrentTab('dashboard');
                            else if (user?.role === 'officer')
                                setCurrentTab('officer-dashboard');
                            else if (user?.role === 'recruiter')
                                setCurrentTab('recruiter-dashboard');
                            else
                                setCurrentTab('admin-dashboard');
                        } })), currentTab === 'dashboard' && (_jsx(StudentDashboard, { onNavigate: tab => setCurrentTab(tab), onOpenCopilot: () => setCurrentTab('copilot') })), currentTab === 'profile' && _jsx(StudentProfilePage, {}), currentTab === 'jobs' && _jsx(JobDiscoveryPage, {}), currentTab === 'applications' && (_jsx(ApplicationTrackerPage, { onNavigateToInterview: () => setCurrentTab('interview') })), currentTab === 'copilot' && _jsx(CareerCopilotPage, {}), currentTab === 'resume' && _jsx(ResumeAnalyzerPage, {}), currentTab === 'interview' && _jsx(InterviewPrepPage, {}), currentTab === 'officer-dashboard' && (_jsx(OfficerDashboardPage, { onNavigateToDrives: () => setCurrentTab('officer-drives') })), currentTab === 'officer-drives' && _jsx(OfficerDrivesPage, {}), currentTab === 'officer-students' && _jsx(StudentProfilePage, {}), currentTab === 'recruiter-dashboard' && _jsx(RecruiterDashboardPage, {}), currentTab === 'admin-dashboard' && _jsx(AdminDashboardPage, {})] }), _jsx("footer", { className: "border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold text-slate-300", children: "Placement Tracker AI" }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: "From College to Career \u2014 Track. Improve. Get Placed." })] }), _jsxs("div", { className: "flex items-center gap-4 text-slate-400", children: [_jsx("span", { children: "Class of 2027 Campus Edition" }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: "Powered by Gemini AI" })] })] }) })] }));
}
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(MainApp, {}) }));
}
