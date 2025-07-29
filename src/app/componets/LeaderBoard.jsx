'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';

const LeaderboardSkeleton = () => (
    <div className="w-full max-w-2xl mx-auto p-4 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
        <div className="flex justify-center items-end gap-2 mb-8">
            <div className="bg-gray-300 rounded-t-lg h-40 w-1/4"></div>
            <div className="bg-gray-400 rounded-t-lg h-48 w-1/4"></div>
            <div className="bg-gray-300 rounded-t-lg h-36 w-1/4"></div>
        </div>
        <div className="space-y-3">
            <div className="h-12 bg-gray-300 rounded-lg"></div>
            <div className="h-12 bg-gray-300 rounded-lg"></div>
            <div className="h-12 bg-gray-300 rounded-lg"></div>
        </div>
    </div>
);

const fetchLeaderboardData = async (setLeaderboardData, setCurrentUserRank, setIsLoading, setError) => {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch('/api/leaderboard', { headers, cache: 'no-store' });

        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();

        setLeaderboardData(data.leaderboard || []);
        setCurrentUserRank(data.currentUserData);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};

function LeaderBoard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) { setCurrentUserInfo(JSON.parse(storedUser)); }

        fetchLeaderboardData(setLeaderboardData, setCurrentUserRank, setIsLoading, setError);

        const socket = io();

        socket.on('update-event', () => {
            fetchLeaderboardData(setLeaderboardData, setCurrentUserRank, () => { }, setError);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const isCurrentUserInTopList = leaderboardData.some(user => user._id === currentUserInfo?._id);

    useEffect(() => {
        if (!isLoading && !isCurrentUserInTopList && currentUserRef.current) {
            currentUserRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isLoading, isCurrentUserInTopList, currentUserInfo, leaderboardData]);

    if (isLoading) return <LeaderboardSkeleton />;
    if (error) return (<div className="text-center py-10 p-4 bg-red-50 text-red-600 rounded-lg"><h1 className='text-xl font-bold mb-2'>Error</h1><p>{error}</p></div>);
    if (leaderboardData.length === 0) return (<div className="text-center py-10"><h2 className="text-xl font-semibold text-gray-600">No Players Yet!</h2></div>);

    const topThree = leaderboardData.slice(0, 3);
    const restOfTopUsers = leaderboardData.slice(3);
    const getPodiumOrderAndStyle = (rank) => {
        if (rank === 1) return 'order-2 transform -translate-y-6';
        if (rank === 2) return 'order-1';
        if (rank === 3) return 'order-3';
        return '';
    };
    const getBorderColor = (rank) => {
        if (rank === 1) return 'border-yellow-400';
        if (rank === 2) return 'border-gray-400';
        if (rank === 3) return 'border-orange-400';
        return 'border-gray-300';
    };

    return (
        <div className="bg-white p-4 sm:p-6 font-sans rounded-2xl shadow-xl">
            <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Game Ranking</h1>
            <div className="flex justify-around items-end px-2 pt-8 mb-6">
                {topThree.map((user) => (
                    <div key={user._id} className={`w-1/3 flex flex-col items-center transition-transform duration-300 ${getPodiumOrderAndStyle(user.rank)}`}>
                        <div className="relative">
                            <Image src={user.imageUrl} alt={`${user.name}'s avatar`} width={user.rank === 1 ? 80 : 70} height={user.rank === 1 ? 80 : 70} className={`rounded-full object-cover border-4 ${getBorderColor(user.rank)}`} />
                            <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full text-white font-bold flex items-center justify-center border-2 border-white ${getBorderColor(user.rank)} bg-gray-700`}>{user.rank}</div>
                        </div>
                        <div className="text-center mt-4 w-full">
                            <p className="font-bold text-sm sm:text-base text-gray-800 truncate px-1">{user.name}</p>
                            <p className="text-sm text-yellow-600 font-semibold">🪙 {user.totalPoints}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-1">
                {restOfTopUsers.map((user) => {
                    const isCurrentUser = user._id === currentUserInfo?._id;
                    return (
                        <div key={user._id} className={`flex items-center p-3 rounded-lg ${isCurrentUser ? 'bg-blue-100' : 'bg-transparent'}`}>
                            <div className="w-12 text-lg font-bold text-gray-500 text-center">#{user.rank}</div>
                            <div className="flex-grow flex items-center gap-4">
                                <Image src={user.imageUrl} alt={`${user.name}'s avatar`} width={45} height={45} className="rounded-full object-cover" />
                                <span className="font-semibold text-gray-800">{user.name}</span>
                            </div>
                            <div className="font-bold text-yellow-600 text-right w-24">🪙 {user.totalPoints}</div>
                        </div>
                    );
                })}
            </div>

            {currentUserInfo && !isCurrentUserInTopList && currentUserRank && (
                <>
                    <div className="text-center text-gray-400 my-4 text-2xl tracking-widest">...</div>
                    <div ref={currentUserRef} className="sticky bottom-4 flex items-center p-3 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <div className="w-12 text-lg font-bold text-center">
                            #{currentUserRank.rank}
                        </div>
                        <div className="flex-grow flex items-center gap-4">
                            <Image
                                src={currentUserInfo.imageUrl}
                                alt={`${currentUserInfo.name}'s avatar`}
                                width={45}
                                height={45}
                                className="rounded-full object-cover border-2 border-white"
                            />
                            <span className="font-semibold">{currentUserInfo.name} (You)</span>
                        </div>
                        <div className="font-bold text-right w-24">
                            🪙 {currentUserRank.totalPoints}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default LeaderBoard;