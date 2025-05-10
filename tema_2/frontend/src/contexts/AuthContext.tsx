import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { login as apiLogin } from '../services/api';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    isAuthenticated: false,
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            try {
                return JSON.parse(savedUser);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                return null;
            }
        }
        return null;
    });

    const isAuthenticated = !!user && !!localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            try {
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                console.error('Error saving user:', error);
            }
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiLogin(email, password);
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 