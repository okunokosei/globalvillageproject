'use client';

import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import { useState } from "react";
import { UserProfileType } from "../types";
import { MOCK_USER } from "../../../constants/MockData";
import Header from "../components/Header";

const UserProfile = ({ userProfile, userLanguage, changeLanguage }: { userProfile: UserProfileType, userLanguage: "En"|"Jp", changeLanguage: (lang: "En"|"Jp") => void}) => {
    const formatYearMonth = (datesString: string) => {
        const parts = datesString.split('-');
        return `${parts[0]}.${parts[1]}`;
    };
    
    return (
        <div className="m-2 p-2 bg-white rounded-lg shadow-lg">
            <div className="flex gap-4">
                <img
                    src={userProfile.icon ?? ""}
                    alt=""
                    className="h-28 w-28 p-2"
                />
                <div className="flex flex-col gap-1 mt-2">
                    <p className="mb-1 text-xl font-bold">{userProfile.name}</p>
                    <p className="text-gray-600">{`Room: ${userProfile.room_number}`}</p>
                    <p className="text-gray-600">{`${formatYearMonth(userProfile.move_in_date)} - ${formatYearMonth(userProfile.move_out_date)}`}</p>
                </div>
            </div>
            <div className="flex gap-2 p-2 m-2">
                <button
                    onClick={() => changeLanguage("En")}
                    className={`p-1 text-sm border border-gray-400 w-full rounded-full ${(userLanguage === "En") ? "bg-blue-600 text-white" : ""}`}
                >
                    English
                </button>
                <button
                    onClick={() => changeLanguage("Jp")}
                    className={`p-1 text-sm border border-gray-400 w-full rounded-full ${(userLanguage === "Jp") ? "bg-blue-600 text-white" : ""}`}
                >
                    日本語
                </button>
            </div>
        </div>
    );
};

const EventHistory = () => {
    return (
        <div>
            イベントヒストリー
        </div>
    );
};

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [language, setLanguage] = useState<"En" | "Jp">("En");

    const router = useRouter();


    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        alert('ログアウトしました。');
        router.push('/login');
    };


    return (
        <div>
            <Header title="Profile" subtitle="ユーザー情報" />
            <div>
                <UserProfile userProfile={MOCK_USER} userLanguage={language} changeLanguage={setLanguage} />
            </div>
            <div>
                <EventHistory />
            </div>
            <div className="flex flex-col gap-2 bg-white m-2 p-2 rounded-lg shadow-lg">
                <button className="border border-gray-600 text-gray-800 p-1 text-sm rounded-sm shadow">
                    プロフィール編集
                </button>
                <button
                    onClick={handleLogout}
                    className="border border-gray-600 text-gray-800 p-1 text-sm rounded-sm shadow"
                >
                    ログアウト
                </button>
                <button className="border border-gray-600 text-gray-800 p-1 text-sm rounded-sm shadow">
                    アカウント削除
                </button>
            </div>
            
        </div>
    )
};

export default ProfilePage