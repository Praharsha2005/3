'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { conversations } = useChat();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate total unread messages
  let unreadCount = 0;
  if (user) {
    Object.values(conversations).forEach(conversation => {
      conversation.forEach(message => {
        if (message.recipientId === user.id && !message.read) {
          unreadCount++;
        }
      });
    });
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Sciencify
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/products'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                }`}
              >
                Projects
              </Link>
              
              {user ? (
                <>
                  {user.userType === 'student' && (
                    <Link
                      href="/seller"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === '/seller'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      Sell
                    </Link>
                  )}
                  <Link
                    href="/collaborate"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/collaborate'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    Collaborate
                  </Link>
                </>
              ) : null}
              
              {/* Show Cart only for business users */}
              {user && user.userType === 'business' && (
                <Link
                  href="/cart"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/cart'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  Cart
                </Link>
              )}
              
              {user ? (
                <Link
                  href="/chat"
                  className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                    pathname === '/chat'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              ) : null}
              
              {user ? (
                <div className="relative" ref={accountRef}>
                  <button 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-500 hover:text-white"
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  >
                    Account
                  </button>
                  {isAccountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/auth/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/auth'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}