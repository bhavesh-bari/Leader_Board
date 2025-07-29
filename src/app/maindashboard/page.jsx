'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Claim from '../componets/Claim';
import LeaderBoard from '../componets/LeaderBoard';
import History from '../componets/History';

const AuthRequired = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800">Authentication Required</h2>
      <p className="mt-2 text-gray-600">Please log in to access your dashboard and view the leaderboard.</p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
      >
        Go to Login Page
      </button>
    </div>
  );
};

const AuthLoading = () => (
  <div className="flex items-center justify-center p-10">
    <p className="text-gray-500">Checking authentication...</p>
  </div>
);


function Page() {
  const [activeTab, setActiveTab] = useState('leaderboard');
 
  const [authStatus, setAuthStatus] = useState('checking');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthStatus('unauthenticated');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
 
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setAuthStatus('unauthenticated');
      } else {
        setAuthStatus('authenticated');
      }
    } catch (error) {
   
      setAuthStatus('unauthenticated');
    }
  }, []);

  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
  

        {authStatus === 'checking' && <AuthLoading />}

        {authStatus === 'unauthenticated' && <AuthRequired />}

        {authStatus === 'authenticated' && (
          <>
        
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('leaderboard')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${getTabClass('leaderboard')}`}>
                  🏆 Leaderboard
                </button>
                <button onClick={() => setActiveTab('claim')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${getTabClass('claim')}`}>
                  🪙 Claim
                </button>
                <button onClick={() => setActiveTab('history')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${getTabClass('history')}`}>
                  📜 History
                </button>
              </nav>
            </div>

            
            <div className="mt-6">
              {activeTab === 'leaderboard' && <LeaderBoard />}
              {activeTab === 'claim' && <Claim />}
              {activeTab === 'history' && <History />}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Page;