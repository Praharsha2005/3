'use client';

import { useState } from 'react';
import { useToast } from '@/app/contexts/ToastContext';

export default function CollaborationDetailPage() {
  const { showToast } = useToast();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the collaboration request
    showToast('Collaboration request submitted successfully!', 'success');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Collaboration Request</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project Information */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Project Details</h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-500">Project Image</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">AI-Powered Water Purifier</h3>
                <p className="text-gray-600 mb-4">
                  An innovative water purification system using machine learning to optimize filtration.
                </p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Technology
                  </span>
                  <span className="text-lg font-bold text-blue-600">$299.99</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Inventor</h3>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="bg-gray-200 w-12 h-12 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">John Smith</h4>
                  <p className="text-gray-600 text-sm">Computer Engineering Student, MIT</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Collaboration Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Send Collaboration Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Company</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your company name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief subject line"
                  defaultValue="Interest in AI-Powered Water Purifier"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain how you'd like to collaborate..."
                  rows={6}
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collaboration Type</label>
                <div className="space-y-2">
                  <label className="inline-flex items-center">
                    <input type="radio" name="collab-type" className="text-blue-600" defaultChecked />
                    <span className="ml-2">Licensing Agreement</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="collab-type" className="text-blue-600" />
                    <span className="ml-2">Joint Development</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="collab-type" className="text-blue-600" />
                    <span className="ml-2">Investment Opportunity</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="collab-type" className="text-blue-600" />
                    <span className="ml-2">Other</span>
                  </label>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded"
                >
                  Send Collaboration Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}