'use client';

import { useState } from 'react';

export default function ComprehensiveTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      // Test 1: Check if localStorage is available
      addResult('Test 1: Checking localStorage availability...');
      if (typeof window !== 'undefined' && window.localStorage) {
        addResult('✓ localStorage is available');
      } else {
        addResult('✗ localStorage is not available');
        return;
      }
      
      // Test 2: Test storing and retrieving data
      addResult('Test 2: Testing data storage and retrieval...');
      try {
        const testData = {
          id: 'test123',
          name: 'Test User',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('testData', JSON.stringify(testData));
        const retrievedData = localStorage.getItem('testData');
        
        if (retrievedData) {
          const parsedData = JSON.parse(retrievedData);
          if (parsedData.name === 'Test User') {
            addResult('✓ Data storage and retrieval working');
          } else {
            addResult('✗ Data retrieval returned unexpected data');
          }
        } else {
          addResult('✗ Data was not retrieved');
        }
        
        // Clean up
        localStorage.removeItem('testData');
      } catch (error) {
        addResult(`✗ Storage test failed: ${(error as Error).message}`);
      }
      
      // Test 3: Test JSON operations
      addResult('Test 3: Testing JSON operations...');
      try {
        const testObj = { test: 'value', number: 123 };
        const jsonString = JSON.stringify(testObj);
        const parsedObj = JSON.parse(jsonString);
        
        if (parsedObj.test === 'value' && parsedObj.number === 123) {
          addResult('✓ JSON operations working');
        } else {
          addResult('✗ JSON operations returned unexpected results');
        }
      } catch (error) {
        addResult(`✗ JSON test failed: ${(error as Error).message}`);
      }
      
      // Test 4: Test Date operations
      addResult('Test 4: Testing Date operations...');
      try {
        const now = new Date();
        const dateString = now.toISOString();
        const parsedDate = new Date(dateString);
        
        if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
          addResult('✓ Date operations working');
        } else {
          addResult('✗ Date operations failed');
        }
      } catch (error) {
        addResult(`✗ Date test failed: ${(error as Error).message}`);
      }
      
      addResult('All tests completed!');
    } catch (error) {
      addResult(`Test suite failed: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Comprehensive System Test</h1>
        
        <button
          onClick={runTests}
          disabled={isTesting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-6"
        >
          {isTesting ? 'Running Tests...' : 'Run Comprehensive Tests'}
        </button>
        
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-3 rounded ${
                result.startsWith('✓') ? 'bg-green-100 text-green-800' :
                result.startsWith('✗') ? 'bg-red-100 text-red-800' :
                result.includes('failed') ? 'bg-red-100 text-red-800' :
                'bg-gray-100'
              }`}
            >
              {result}
            </div>
          ))}
        </div>
        
        {testResults.length > 0 && !isTesting && (
          <div className="mt-6 p-4 bg-blue-100 rounded">
            <h2 className="text-xl font-bold mb-2">Test Summary:</h2>
            <p>
              {testResults.filter(r => r.startsWith('✓')).length} passed, 
              {testResults.filter(r => r.startsWith('✗') || r.includes('failed')).length} failed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}