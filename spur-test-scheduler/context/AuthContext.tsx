"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

interface AuthContextProps {
    user: any;
    login: (email: string, password: string) => Promise<{ error: any | null }>;
    signup: (email: string, password: string) => Promise<{ error: any | null }>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and subscribe to auth changes
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => subscription?.subscription?.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { error };
            }

            setUser(data.user);
            return { error: null };
        } catch (error) {
            console.error('Login error:', error);
            return { error };
        }
    };

    const signup = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                return { error };
            }

            // Note: By default, Supabase requires email verification
            return { error: null };
        } catch (error) {
            console.error('Signup error:', error);
            return { error };
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                loading
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
