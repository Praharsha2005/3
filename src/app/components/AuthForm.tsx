'use client';

import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student', // 'student' or 'business'
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePhotoPreview(e.target.result as string);
          setProfilePhoto(e.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Form submitted:', formData);

    try {
      if (isLogin) {
        // Login
        console.log('Attempting login with:', formData.email, formData.password);
        await login(formData.email, formData.password);
        console.log('Login successful');
        showToast('Login successful!', 'success');
        // Redirect to home page after successful login
        router.push('/');
      } else {
        // Register
        console.log('Attempting registration with:', formData);
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(
          formData.name, 
          formData.email, 
          formData.password, 
          formData.userType as 'student' | 'business',
          profilePhoto || undefined
        );
        console.log('Registration successful');
        showToast('Registration successful! Welcome to Sciencify.', 'success');
        // Redirect to home page after successful registration
        router.push('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="flex border-b mb-6">
        <button
          className={`flex-1 py-2 font-medium ${isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 font-medium ${!isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isLogin}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <div className="flex items-center space-x-4">
                <div 
                  className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center cursor-pointer"
                  onClick={triggerFileInput}
                >
                  {profilePhotoPreview ? (
                    <img 
                      src={profilePhotoPreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">Upload</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                {profilePhotoPreview && (
                  <button
                    type="button"
                    onClick={removeProfilePhoto}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={formData.userType === 'student'}
                    onChange={handleChange}
                    className="text-blue-600"
                  />
                  <span className="ml-2">Student</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="business"
                    checked={formData.userType === 'business'}
                    onChange={handleChange}
                    className="text-blue-600"
                  />
                  <span className="ml-2">Business Professional</span>
                </label>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}