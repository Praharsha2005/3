'use client';

import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sciencify
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            {user 
              ? `Welcome back, ${user.name}! Continue exploring innovative student projects.`
              : "Where student innovation meets business opportunity. Showcase, sell, and collaborate on groundbreaking projects."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/products" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Explore Projects
            </Link>
            {user ? (
              user.userType === 'student' ? (
                <Link 
                  href="/seller" 
                  className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link 
                  href="/collaborate" 
                  className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Find Projects
                </Link>
              )
            ) : (
              <Link 
                href="/auth" 
                className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Join Sciencify
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How Sciencify Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Showcase Your Projects</h3>
            <p className="text-gray-600">
              Students upload their innovative projects, research, and inventions to our platform.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">Connect with Businesses</h3>
            <p className="text-gray-600">
              Businesses discover and collaborate with talented students on real-world applications.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Monetize Innovation</h3>
            <p className="text-gray-600">
              Students can sell licenses, prototypes, or full implementations of their projects.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {user 
              ? "Continue your journey on Sciencify today."
              : "Join thousands of students and businesses transforming education into opportunity."
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link 
                href={user.userType === 'student' ? "/seller" : "/collaborate"} 
                className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                {user.userType === 'student' ? "My Dashboard" : "Find Projects"}
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth" 
                  className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Create Account
                </Link>
                <Link 
                  href="/collaborate" 
                  className="bg-transparent hover:bg-blue-700 text-white border border-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Explore Collaborations
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}