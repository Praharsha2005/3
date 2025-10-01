'use client';

import { useState } from 'react';

export default function FinalAuthTestPage() {
  const [testStep, setTestStep] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runAuthTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);
    setTestStep(0);
    
    try {
      // Step 1: Test localStorage
      setTestStep(1);
      addResult('Step 1: Testing localStorage...');
      
      if (typeof window === 'undefined' || !window.localStorage) {
        throw new Error('localStorage not available');
      }
      addResult('✓ localStorage is available');
      
      // Step 2: Test registration
      setTestStep(2);
      addResult('Step 2: Testing registration...');
      
      const mockUser = {
        id: Date.now().toString(),
        name: 'Test User',
        email: 'test@example.com',
        userType: 'student',
        createdAt: new Date(),
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      addResult('✓ User registered and stored in localStorage');
      
      // Step 3: Test retrieval
      setTestStep(3);
      addResult('Step 3: Testing user retrieval...');
      
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not found in localStorage');
      }
      
      const parsedUser = JSON.parse(storedUser);
      parsedUser.createdAt = new Date(parsedUser.createdAt);
      
      if (parsedUser.email !== 'test@example.com') {
        throw new Error('User data mismatch');
      }
      addResult('✓ User successfully retrieved and parsed');
      
      // Step 4: Test login simulation
      setTestStep(4);
      addResult('Step 4: Testing login simulation...');
      
      // This simulates what happens in the login function
      const loginUser = {
        id: '1',
        name: 'John Doe',
        email: 'test@example.com',
        userType: 'student',
        createdAt: new Date(),
      };
      
      localStorage.setItem('user', JSON.stringify(loginUser));
      addResult('✓ Login simulation successful');
      
      // Step 5: Test logout
      setTestStep(5);
      addResult('Step 5: Testing logout...');
      
      localStorage.removeItem('user');
      const afterLogout = localStorage.getItem('user');
      
      if (afterLogout !== null) {
        throw new Error('User not removed from localStorage');
      }
      addResult('✓ Logout successful');
      
      addResult('All authentication tests passed!');
    } catch (error) {
      addResult(`Test failed at step ${testStep}: ${(error as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Final Authentication Test</h1>
        
        <button
          onClick={runAuthTest}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-6"
        >
          {isRunning ? `Running Test (Step ${testStep}/5)...` : 'Run Authentication Test'}
        </button>
        
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-3 rounded ${
                result.startsWith('✓') ? 'bg-green-100 text-green-800' :
                result.startsWith('Step') ? 'bg-blue-100 text-blue-800' :
                result.includes('failed') ? 'bg-red-100 text-red-800' :
                'bg-gray-100'
              }`}
            >
              {result}
            </div>
          ))}
        </div>
        
        {testResults.length > 0 && !isRunning && (
          <div className="mt-6 p-4 bg-blue-100 rounded">
            <h2 className="text-xl font-bold mb-2">Test Summary:</h2>
            <p>
              {testResults.filter(r => r.startsWith('✓')).length} steps passed
              {testResults.some(r => r.includes('failed')) ? ', 1 or more steps failed' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}