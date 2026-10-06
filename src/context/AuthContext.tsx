import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; password?: string; role?: string; department?: string; cgpa?: number }) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS: Record<UserRole, { email: string; pass: string }> = {
  student: { email: 'student@placementai.com', pass: 'Demo@123' },
  officer: { email: 'officer@placementai.com', pass: 'Demo@123' },
  recruiter: { email: 'recruiter@placementai.com', pass: 'Demo@123' },
  admin: { email: 'admin@placementai.com', pass: 'Demo@123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const data = await api.getMe();
        setUser(data.user);
        if (data.student) setStudent(data.student);
      } else {
        // Default to student demo for instant judge review
        await switchDemoRole('student');
      }
    } catch (e) {
      console.warn('Init auth failed, logging into demo student:', e);
      try {
        await switchDemoRole('student');
      } catch (err) {
        console.error('Demo login failed:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setStudent(res.student || null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password?: string; role?: string; department?: string; cgpa?: number }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setStudent(res.student || null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setStudent(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const creds = DEMO_CREDENTIALS[role];
      const res = await api.login(creds.email, creds.pass);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setStudent(res.student || null);
    } catch (e) {
      console.error('Failed to switch role:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.role === 'student') {
      try {
        const std = await api.getMyProfile();
        setStudent(std);
      } catch (e) {
        console.warn('Could not refresh student profile:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
