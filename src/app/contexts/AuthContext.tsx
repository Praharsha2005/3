'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/app/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, userType: 'student' | 'business', profilePhoto?: string) => Promise<void>;
  deleteAccount: (deleteUserProducts: (userId: string) => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        
        // Check if user exists in localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        const storedUser = storedUsers[email];
        
        if (!storedUser) {
          console.log('AuthProvider: User not found');
          reject(new Error('No account found with this email. Please sign up.'));
          return;
        }
        
        // Check password (in a real app, this would be properly hashed)
        if (storedUser.password !== password) {
          console.log('AuthProvider: Password mismatch');
          reject(new Error('Incorrect password'));
          return;
        }
        
        // Create user object without password
        const { password: _, ...userWithoutPassword } = storedUser;
        const mockUser: User = {
          id: userWithoutPassword.id,
          name: userWithoutPassword.name,
          email: userWithoutPassword.email,
          userType: userWithoutPassword.userType,
          createdAt: new Date(userWithoutPassword.createdAt),
          profilePhoto: userWithoutPassword.profilePhoto,
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
    // Redirect to home page after logout
    router.push('/');
  };

  const register = async (name: string, email: string, password: string, userType: 'student' | 'business', profilePhoto?: string) => {
    console.log('AuthProvider: Register called with', { name, email, password, userType, profilePhoto });
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
        
        // Check if user already exists
        const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
        if (storedUsers[email]) {
          console.log('AuthProvider: User already exists');
          reject(new Error('An account with this email already exists. Please login.'));
          return;
        }
        
        const mockUser: User = {
          id: Date.now().toString(),
          name,
          email,
          userType,
          createdAt: new Date(),
          profilePhoto,
        };
        
        // Store user with password (in a real app, this would be properly hashed)
        storedUsers[email] = {
          ...mockUser,
          password, // Store password for demo purposes only
        };
        
        localStorage.setItem('users', JSON.stringify(storedUsers));
        console.log('AuthProvider: User registered in localStorage');
        
        // Set current user
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        console.log('AuthProvider: User set in localStorage');
        resolve();
      }, 500);
    });
  };

  const deleteAccount = (deleteUserProducts: (userId: string) => void) => {
    console.log('AuthProvider: Delete account called');
    if (user) {
      // Delete all products associated with this user by calling the provided function
      deleteUserProducts(user.id);
      
      // Remove user from stored users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      if (storedUsers[user.email]) {
        delete storedUsers[user.email];
        localStorage.setItem('users', JSON.stringify(storedUsers));
      }
      
      // In a real app, you would make an API call to delete the account
      // For demo purposes, we'll just clear the user data
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('collaborations');
      console.log('AuthProvider: Account deleted and all data cleared');
      // Redirect to home page after account deletion
      router.push('/');
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    deleteAccount,
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