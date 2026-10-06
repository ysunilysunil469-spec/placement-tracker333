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
import { UserRole } from './types';

function MainApp() {
  const { user, switchDemoRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Handle default tab routing based on role when tab is not set or when role changes
  React.useEffect(() => {
    if (!user) {
      setCurrentTab('landing');
    } else if (currentTab === 'landing' || currentTab === 'login') {
      if (user.role === 'student') setCurrentTab('dashboard');
      else if (user.role === 'officer') setCurrentTab('officer-dashboard');
      else if (user.role === 'recruiter') setCurrentTab('recruiter-dashboard');
      else if (user.role === 'admin') setCurrentTab('admin-dashboard');
    }
  }, [user]);

  const handleRoleSelectFromLanding = async (role: UserRole) => {
    await switchDemoRole(role);
    if (role === 'student') setCurrentTab('dashboard');
    else if (role === 'officer') setCurrentTab('officer-dashboard');
    else if (role === 'recruiter') setCurrentTab('recruiter-dashboard');
    else if (role === 'admin') setCurrentTab('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Hackathon Demo Switcher Banner */}
      <QuickDemoBanner />

      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        onOpenCopilot={() => setCurrentTab('copilot')}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentTab('login')}
            onSelectRole={handleRoleSelectFromLanding}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => {
              if (user?.role === 'student') setCurrentTab('dashboard');
              else if (user?.role === 'officer') setCurrentTab('officer-dashboard');
              else if (user?.role === 'recruiter') setCurrentTab('recruiter-dashboard');
              else setCurrentTab('admin-dashboard');
            }}
          />
        )}

        {/* Student Views */}
        {currentTab === 'dashboard' && (
          <StudentDashboard
            onNavigate={tab => setCurrentTab(tab)}
            onOpenCopilot={() => setCurrentTab('copilot')}
          />
        )}
        {currentTab === 'profile' && <StudentProfilePage />}
        {currentTab === 'jobs' && <JobDiscoveryPage />}
        {currentTab === 'applications' && (
          <ApplicationTrackerPage onNavigateToInterview={() => setCurrentTab('interview')} />
        )}
        {currentTab === 'copilot' && <CareerCopilotPage />}
        {currentTab === 'resume' && <ResumeAnalyzerPage />}
        {currentTab === 'interview' && <InterviewPrepPage />}

        {/* Officer Views */}
        {currentTab === 'officer-dashboard' && (
          <OfficerDashboardPage onNavigateToDrives={() => setCurrentTab('officer-drives')} />
        )}
        {currentTab === 'officer-drives' && <OfficerDrivesPage />}
        {currentTab === 'officer-students' && <StudentProfilePage />}

        {/* Recruiter Views */}
        {currentTab === 'recruiter-dashboard' && <RecruiterDashboardPage />}

        {/* Admin Views */}
        {currentTab === 'admin-dashboard' && <AdminDashboardPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Placement Tracker AI</span>
            <span>·</span>
            <span>From College to Career — Track. Improve. Get Placed.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Class of 2027 Campus Edition</span>
            <span>·</span>
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
