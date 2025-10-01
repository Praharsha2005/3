'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children, 
  allowedUserTypes 
}: { 
  children: React.ReactNode; 
  allowedUserTypes?: ('student' | 'business')[];
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      router.push('/auth');
      return;
    }

    // If specific user types are required and user doesn't match, redirect to home
    if (allowedUserTypes && !allowedUserTypes.includes(user.userType as 'student' | 'business')) {
      router.push('/');
    }
  }, [user, router, allowedUserTypes]);

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check user type restrictions
  if (allowedUserTypes && !allowedUserTypes.includes(user.userType as 'student' | 'business')) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}