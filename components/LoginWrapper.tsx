"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const LoginWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login } = useAuth();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-xl font-semibold mb-4">Login to Access the App</h1>
                <form className="w-full max-w-md space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    login(email, password);
                }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return <>{children}</>;
};


export default LoginWrapper;
