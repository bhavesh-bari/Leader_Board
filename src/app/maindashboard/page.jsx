'use client';

import React, { useState } from 'react';
import Claim from '../componets/Claim';
import LeaderBoard from '../componets/LeaderBoard';
import History from '../componets/History';


const top15Users = [
  { _id: 'user2', name: 'Kamal', totalPoints: 120, rank: 1, imageUrl: 'https://i.pravatar.cc/150?u=user2' },
  { _id: 'user1', name: 'Rahul', totalPoints: 100, rank: 2, imageUrl: 'https://i.pravatar.cc/150?u=user1' },
  { _id: 'user3', name: 'Sanaka', totalPoints: 90, rank: 3, imageUrl: 'https://i.pravatar.cc/150?u=user3' },
  { _id: 'user5', name: 'Priya', totalPoints: 80, rank: 4, imageUrl: 'https://i.pravatar.cc/150?u=user5' },
  { _id: 'user6', name: 'Vikram', totalPoints: 78, rank: 5, imageUrl: 'https://i.pravatar.cc/150?u=user6' },
  { _id: 'user7', name: 'Anika', totalPoints: 75, rank: 6, imageUrl: 'https://i.pravatar.cc/150?u=user7' },
  { _id: 'user8', name: 'Rohan', totalPoints: 72, rank: 7, imageUrl: 'https://i.pravatar.cc/150?u=user8' },
  { _id: 'user9', name: 'Isha', totalPoints: 68, rank: 8, imageUrl: 'https://i.pravatar.cc/150?u=user9' },
  { _id: 'user10', name: 'Arjun', totalPoints: 65, rank: 9, imageUrl: 'https://i.pravatar.cc/150?u=user10' },
  { _id: 'user11', name: 'Diya', totalPoints: 61, rank: 10, imageUrl: 'https://i.pravatar.cc/150?u=user11' },
  { _id: 'user12', name: 'Kabir', totalPoints: 59, rank: 11, imageUrl: 'https://i.pravatar.cc/150?u=user12' },
  { _id: 'user13', name: 'Zara', totalPoints: 55, rank: 12, imageUrl: 'https://i.pravatar.cc/150?u=user13' },
  { _id: 'user14', name: 'Neil', totalPoints: 52, rank: 13, imageUrl: 'https://i.pravatar.cc/150?u=user14' },
  { _id: 'user15', name: 'Saanvi', totalPoints: 50, rank: 14, imageUrl: 'https://i.pravatar.cc/150?u=user15' },
  { _id: 'user16', name: 'Advik', totalPoints: 48, rank: 15, imageUrl: 'https://i.pravatar.cc/150?u=user16' },
];
const sampleHistory = [
  { _id: 'hist1', pointsClaimed: 8, fromUser: { _id: 'user2', name: 'Kamal', imageUrl: 'https://i.pravatar.cc/150?u=user2' }, timestamp: '2025-07-28T14:30:00Z' },
  { _id: 'hist2', pointsClaimed: 3, fromUser: { _id: 'user5', name: 'Priya', imageUrl: 'https://i.pravatar.cc/150?u=user5' }, timestamp: '2025-07-28T09:15:00Z' },
  { _id: 'hist3', pointsClaimed: 10, fromUser: { _id: 'user1', name: 'Rahul', imageUrl: 'https://i.pravatar.cc/150?u=user1' }, timestamp: '2025-07-27T18:00:00Z' },
  { _id: 'hist4', pointsClaimed: 5, fromUser: { _id: 'user7', name: 'Vikram', imageUrl: 'https://i.pravatar.cc/150?u=user7' }, timestamp: '2025-07-26T11:45:00Z' },
];
const currentUserData = { _id: 'user99', name: 'Meera', totalPoints: 15, rank: 99, imageUrl: 'https://i.pravatar.cc/150?u=user99' };


function Page() {

  const [leaderboard, setLeaderboard] = useState(top15Users);
  const [history, setHistory] = useState(sampleHistory);
  const [currentUser, setCurrentUser] = useState(currentUserData);

  const [activeTab, setActiveTab] = useState('leaderboard');

  const handleClaim = (claimedFromUser) => {
    const points = Math.floor(Math.random() * 10) + 1;
    const newHistoryEntry = {
      _id: `hist_${new Date().getTime()}`,
      pointsClaimed: points,
      fromUser: claimedFromUser,
      timestamp: new Date().toISOString(),
    };
    setHistory([newHistoryEntry, ...history]);
    setCurrentUser(prevUser => ({
        ...prevUser,
        totalPoints: prevUser.totalPoints + points
    }));
  };

  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('leaderboard')}`}
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('claim')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('claim')}`}
            >
              🪙 Claim
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('history')}`}
            >
              📜 History
            </button>
          </nav>
        </div>

   
        <div className="mt-6">
          {activeTab === 'leaderboard' && (
            <LeaderBoard
              topUsers={leaderboard}
              currentUser={currentUser}
              isLoading={false}
            />
          )}

          {activeTab === 'claim' && (
            <Claim users={leaderboard} onClaim={handleClaim} />
          )}

          {activeTab === 'history' && (
            <History historyData={history} />
          )}
        </div>
      </div>
    </main>
  );
}

export default Page;