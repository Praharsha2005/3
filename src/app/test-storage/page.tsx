'use client';

import { useState, useEffect } from 'react';

export default function TestStoragePage() {
  const [storageTest, setStorageTest] = useState('');
  const [retrievedData, setRetrievedData] = useState('');

  const testStorage = () => {
    try {
      // Test storing data
      const testData = {
        id: 'test123',
        name: 'Test User',
        createdAt: new Date()
      };
      
      localStorage.setItem('testData', JSON.stringify(testData));
      setStorageTest('Data stored successfully');
      
      // Test retrieving data
      const storedData = localStorage.getItem('testData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setRetrievedData(`Retrieved: ${parsedData.name}, Created: ${parsedData.createdAt}`);
      }
    } catch (error) {
      setStorageTest('Storage test failed: ' + (error as Error).message);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('testData');
    localStorage.removeItem('user');
    setStorageTest('Storage cleared');
    setRetrievedData('');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Storage Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={testStorage}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Storage
          </button>
          
          <button
            onClick={clearStorage}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear Storage
          </button>
        </div>
        
        {storageTest && (
          <div className="mt-6 p-4 bg-yellow-100 rounded">
            <h2 className="text-xl font-bold mb-2">Storage Test Result:</h2>
            <p>{storageTest}</p>
          </div>
        )}
        
        {retrievedData && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <h2 className="text-xl font-bold mb-2">Retrieved Data:</h2>
            <p>{retrievedData}</p>
          </div>
        )}
      </div>
    </div>
  );
}