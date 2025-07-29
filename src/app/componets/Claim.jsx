'use client';

import React, { useState } from 'react';
import Image from 'next/image';

function Claim() {

    const users = [
        { id: 1, name: 'Aarav Sharma', imageUrl: 'https://i.pravatar.cc/150?u=aarav' },
        { id: 2, name: 'Isha Verma', imageUrl: 'https://i.pravatar.cc/150?u=isha' },
        { id: 3, name: 'Rohan Mehta', imageUrl: 'https://i.pravatar.cc/150?u=rohan' },
        { id: 4, name: 'Priya Kapoor', imageUrl: 'https://i.pravatar.cc/150?u=priya' },
        { id: 5, name: 'Vivaan Deshmukh', imageUrl: 'https://i.pravatar.cc/150?u=vivaan' },
        { id: 6, name: 'Diya Nair', imageUrl: 'https://i.pravatar.cc/150?u=diya' },
        { id: 7, name: 'Kabir Rao', imageUrl: 'https://i.pravatar.cc/150?u=kabir' },
        { id: 8, name: 'Ananya Joshi', imageUrl: 'https://i.pravatar.cc/150?u=ananya' },
        { id: 9, name: 'Aryan Bhatia', imageUrl: 'https://i.pravatar.cc/150?u=aryan' },
        { id: 10, name: 'Sneha Kulkarni', imageUrl: 'https://i.pravatar.cc/150?u=sneha' },
    ];


    const [popup, setPopup] = useState({ visible: false, user: null, points: 0 });
    const [loadingUserId, setLoadingUserId] = useState(null);
    const [apiError, setApiError] = useState(null);


    const handleClaimClick = async (user) => {
        setLoadingUserId(user.id);
        setApiError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setApiError("You must be logged in to claim points.");
            setLoadingUserId(null);
            return;
        }

        try {
            const res = await fetch('/api/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ fromUser: user }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to claim points.');
            }


            setPopup({
                visible: true,
                user: user,
                points: data.pointsClaimed,
            });

        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoadingUserId(null);
        }
    };

    const closePopup = () => {
        setPopup({ visible: false, user: null, points: 0 });
    };

    return (
        <>
            <div className='bg-white border border-gray-200 p-4 sm:p-6 rounded-lg font-sans shadow-sm'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-bold mb-5 text-gray-800'>Claim From Great Kings</h1>

                    {apiError && (
                        <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 text-center">
                            {apiError}
                        </div>
                    )}

                    <div className='space-y-3'>
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className='flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg'
                            >
                                <div className='flex items-center gap-3 sm:gap-4'>
                                    <Image
                                        src={user.imageUrl}
                                        alt={`${user.name}'s avatar`}
                                        width={48}
                                        height={48}
                                        className='rounded-full'
                                    />
                                    <div>
                                        <div className='font-semibold text-base sm:text-lg text-gray-900'>
                                            {user.name}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleClaimClick(user)}
                                    disabled={loadingUserId === user.id}
                                    className='bg-blue-600 text-white font-bold text-sm px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shrink-0 disabled:bg-blue-400 disabled:cursor-wait'
                                >
                                    {loadingUserId === user.id ? 'Claiming...' : 'Claim'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {popup.visible && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                    onClick={closePopup}
                >
                    <div
                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center max-w-sm mx-auto animate-jump-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                        <p className="text-gray-600 mb-4">You claimed points from</p>
                        <Image
                            src={popup.user.imageUrl}
                            alt={popup.user.name}
                            width={80}
                            height={80}
                            className="rounded-full mx-auto border-4 border-yellow-400"
                        />
                        <p className="font-bold text-lg mt-3">{popup.user.name}</p>
                        <div className="my-6">
                            <span className="text-5xl font-extrabold text-green-500">
                                +{popup.points}
                            </span>
                            <p className="text-gray-500 font-medium mt-1">Points!</p>
                        </div>
                        <button
                            onClick={closePopup}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Claim;