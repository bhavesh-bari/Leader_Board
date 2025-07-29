// src/app/auth/page.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AtSymbolIcon, LockClosedIcon, UserIcon, PhotoIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

function AuthPage() {
    const router = useRouter();
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // State for API feedback
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (isLoginView) {

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to log in');
                }


                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                router.push('/maindashboard');

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            if (imageFile) {
                formData.append('imageFile', imageFile);
            }

            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to sign up');
                }
                setIsLoginView(true);
                alert('Signup successful! Please log in.');

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isLoginView ? 'Welcome Back!' : 'Create Account'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLoginView ? 'Log in to continue your journey.' : 'Sign up to get started.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {!isLoginView && (
                        <>
                            <div className="text-center">
                                <label htmlFor="photo-upload" className="cursor-pointer">
                                    <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:border-gray-400">
                                        {imagePreview ? (
                                            <Image src={imagePreview} alt="Preview" width={96} height={96} className="rounded-full object-cover w-full h-full" />
                                        ) : (
                                            <PhotoIcon className="w-8 h-8" />
                                        )}
                                    </div>
                                </label>
                                <input id="photo-upload" name="photo-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                <p className="text-xs text-gray-500 mt-2">Upload Profile Photo</p>
                            </div>
                            <div className="relative">
                                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                        </>
                    )}
                    <div className="relative">
                        <AtSymbolIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    {error && (
                        <div className="flex items-center p-3 text-sm text-red-800 rounded-lg bg-red-50">
                            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : (isLoginView ? 'Log In' : 'Sign Up')}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-600">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => { setIsLoginView(!isLoginView); setError(null); }}
                        className="font-medium text-blue-600 hover:underline ml-1"
                    >
                        {isLoginView ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </main>
    );
}

export default AuthPage;