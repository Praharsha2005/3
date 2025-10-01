'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/app/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, userType: 'student' | 'business') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (in a real app, you would check for a valid token)
    console.log('AuthProvider: Checking for stored user');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthProvider: Found stored user', parsedUser);
        // Convert createdAt string back to Date object
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        setUser(parsedUser);
        console.log('AuthProvider: Set user state', parsedUser);
      } catch (error) {
        console.error('AuthProvider: Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('AuthProvider: No stored user found');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthProvider: Login called with', { email, password });
    // In a real app, you would make an API call here
    // For demo purposes, we'll simulate a successful login
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo
        if (!email || !password) {
          console.log('AuthProvider: Login validation failed - missing fields');
          reject(new Error('Email and password are required'));
          return;
        }
        
        // Retrieve stored user to check userType
        const storedUser = localStorage.getItem('user');
        let userType: 'student' | 'business' = 'student';
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userType = parsedUser.userType || 'student';
          } catch (e) {
            console.error('Error parsing stored user for login:', e);
          }
        }
        
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email,
          userType, // Use the actual userType
          createdAt: new Date(),
        };
        console.log('AuthProvider: Setting user', mockUser);
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        console.log('AuthProvider: User set in localStorage');
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    console.log('AuthProvider: Logout called');
    setUser(null);
    localStorage.removeItem('user');
    console.log('AuthProvider: User logged out');
  };

  const register = async (name: string, email: string, password: string, userType: 'student' | 'business') => {
    console.log('AuthProvider: Register called with', { name, email, password, userType });
    // In a real app, you would make an API call here
    // For demo purposes, we'll simulate a successful registration
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo
        if (!name || !email || !password) {
          console.log('AuthProvider: Registration validation failed - missing fields');
          reject(new Error('All fields are required'));
          return;
        }
        
        if (password.length < 6) {
          console.log('AuthProvider: Registration validation failed - password too short');
          reject(new Error('Password must be at least 6 characters'));
          return;
        }
        
        const mockUser: User = {
          id: Date.now().toString(),
          name,
          email,
          userType,
          createdAt: new Date(),
        };
        console.log('AuthProvider: Setting user', mockUser);
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        console.log('AuthProvider: User set in localStorage');
        resolve();
      }, 500);
    });
  };

  const value = {
    user,
    login,
    logout,
    register,
  };

  console.log('AuthProvider: Rendering with user', user);
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth: Returning context', context?.user);
  return context;
}