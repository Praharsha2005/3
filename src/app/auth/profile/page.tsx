'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useProducts } from '@/app/contexts/ProductsContext';
import { useToast } from '@/app/contexts/ToastContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ProfilePage() {
  const { user, logout, deleteAccount } = useAuth();
  const { deleteProductsBySeller } = useProducts();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    return null; // This will be handled by ProtectedRoute
  }

  const handleDeleteAccount = () => {
    deleteAccount(deleteProductsBySeller);
    showToast('Account deleted successfully', 'info');
  };

  const handleLogout = () => {
    logout();
    showToast('You have been logged out', 'info');
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">User Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              {user.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center mx-auto" />
              )}
            </div>
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-lg">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Type</label>
                  <p className="mt-1 text-lg capitalize">{user.userType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-lg">
                    {user.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Account Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}