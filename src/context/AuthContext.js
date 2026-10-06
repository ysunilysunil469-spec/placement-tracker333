import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
const AuthContext = createContext(undefined);
const DEMO_CREDENTIALS = {
    student: { email: 'student@placementai.com', pass: 'Demo@123' },
    officer: { email: 'officer@placementai.com', pass: 'Demo@123' },
    recruiter: { email: 'recruiter@placementai.com', pass: 'Demo@123' },
    admin: { email: 'admin@placementai.com', pass: 'Demo@123' },
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const initAuth = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                const data = await api.getMe();
                setUser(data.user);
                if (data.student)
                    setStudent(data.student);
            }
            else {
                // Default to student demo for instant judge review
                await switchDemoRole('student');
            }
        }
        catch (e) {
            console.warn('Init auth failed, logging into demo student:', e);
            try {
                await switchDemoRole('student');
            }
            catch (err) {
                console.error('Demo login failed:', err);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        initAuth();
    }, []);
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await api.login(email, password);
            localStorage.setItem('token', res.token);
            setUser(res.user);
            setStudent(res.student || null);
        }
        finally {
            setIsLoading(false);
        }
    };
    const register = async (data) => {
        setIsLoading(true);
        try {
            const res = await api.register(data);
            localStorage.setItem('token', res.token);
            setUser(res.user);
            setStudent(res.student || null);
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setStudent(null);
    };
    const switchDemoRole = async (role) => {
        setIsLoading(true);
        try {
            const creds = DEMO_CREDENTIALS[role];
            const res = await api.login(creds.email, creds.pass);
            localStorage.setItem('token', res.token);
            setUser(res.user);
            setStudent(res.student || null);
        }
        catch (e) {
            console.error('Failed to switch role:', e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const refreshProfile = async () => {
        if (user?.role === 'student') {
            try {
                const std = await api.getMyProfile();
                setStudent(std);
            }
            catch (e) {
                console.warn('Could not refresh student profile:', e);
            }
        }
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            student,
            isLoading,
            login,
            register,
            logout,
            switchDemoRole,
            refreshProfile,
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
