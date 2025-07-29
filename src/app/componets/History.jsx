'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HistorySkeleton = () => (
    <div className='bg-gray-100 p-4 sm:p-6 rounded-lg font-sans animate-pulse'>
        <div className="h-7 bg-gray-300 rounded w-1/2 mb-8"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);



const groupHistoryByDate = (history) => {
    if (!history) return {};
    const groups = history.reduce((acc, item) => {
        const itemDate = new Date(item.date); 
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let dateKey;
        if (itemDate.toDateString() === today.toDateString()) {
            dateKey = 'Today';
        } else if (itemDate.toDateString() === yesterday.toDateString()) {
            dateKey = 'Yesterday';
        } else {
            dateKey = itemDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {});
    return groups;
};

function History() {
  
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

   
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("You are not logged in.");
                }

                const res = await fetch('/api/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch history data.');
                }

                const data = await res.json();
                setHistoryData(data.history || []);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []); 

    const groupedHistory = groupHistoryByDate(historyData);

    if (isLoading) {
        return <HistorySkeleton />;
    }

    if (error) {
        return (
            <div className="text-center py-10 p-4 bg-red-50 text-red-600 rounded-lg">
                <h1 className='text-xl font-bold mb-2'>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (historyData.length === 0) {
        return (
            <div className="text-center py-10">
                <h1 className='text-2xl font-bold mb-4'>History</h1>
                <p className="text-gray-500">No claim history found.</p>
            </div>
        );
    }

    return (
        <div className='bg-white border border-gray-200 p-4 sm:p-6 rounded-lg font-sans shadow-sm'>
            <h1 className='text-2xl font-bold mb-5 text-gray-800'>Claim History</h1>

            {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date} className="mb-6">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase">{date}</h2>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item._id} className='flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg'>
                                <div className='flex items-center gap-3 sm:gap-4'>
                                    <Image
                                        src={item.imageUrl}
                                        alt={`${item.userName}'s avatar`}
                                        width={40}
                                        height={40}
                                        className='rounded-full'
                                    />
                                    <div>
                                        <p className='text-xs text-gray-500'>Claimed from</p>
                                        <div className='font-semibold text-base text-gray-900'>
                                            {item.userName}
                                        </div>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <p className='font-bold text-lg text-green-600'>+{item.points}</p>
                                    <p className='text-xs text-gray-500'>
                                        {new Date(item.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default History;