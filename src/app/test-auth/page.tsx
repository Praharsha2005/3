'use client';

import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function TestAuthPage() {
  const { user, login, register, logout } = useAuth();
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    console.log('TestAuthPage: user state changed', user);
  }, [user]);

  const testLogin = async () => {
    try {
      console.log('TestAuthPage: Calling login');
      await login('test@example.com', 'password123');
      setTestResult('Login successful');
    } catch (error) {
      setTestResult('Login failed: ' + (error as Error).message);
    }
  };

  const testRegister = async () => {
    try {
      console.log('TestAuthPage: Calling register');
      await register('Test User', 'test@example.com', 'password123', 'student');
      setTestResult('Registration successful');
    } catch (error) {
      setTestResult('Registration failed: ' + (error as Error).message);
    }
  };

  const testLogout = () => {
    console.log('TestAuthPage: Calling logout');
    logout();
    setTestResult('Logged out');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Auth Test Page</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">Current User Status:</h2>
          {user ? (
            <div>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>User Type: {user.userType}</p>
              <p>Created At: {user.createdAt.toString()}</p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Login
          </button>
          
          <button
            onClick={testRegister}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Register
          </button>
          
          <button
            onClick={testLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Logout
          </button>
        </div>
        
        {testResult && (
          <div className="mt-6 p-4 bg-yellow-100 rounded">
            <h2 className="text-xl font-bold mb-2">Test Result:</h2>
            <p>{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}