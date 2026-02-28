'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { UserProfileType } from "../app/dashboard/types";

type UserContextType = {
    user: UserProfileType | null;
    isLoading: boolean;
};

const UserContext = createContext<UserContextType>({ user: null, isLoading: true});

export const UserProvider = ({ children }: {children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfileType|null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('accessToken');
                if(!token) {
                    setIsLoading(false);
                    return;
                }
                const res = await fetch(`${BACKEND_URL}/api/accounts/me/`, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                if(res.ok){
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error("ユーザー情報の取得に失敗しました。", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [BACKEND_URL]);

    return (
        <UserContext.Provider value={{ user, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);