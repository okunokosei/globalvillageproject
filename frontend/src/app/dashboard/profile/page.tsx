'use client';

import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import { UserProfileType, Event } from "../types";
import { MOCK_USER, MOCK_MY_JOINED_EVENTS } from "../../../constants/MockData";
import Header from "../components/Header";
import EventDetailModal from "../components/events/EventDetailModal";
import UserProfile from "../components/profile/UserProfile";
import EventHistoryCard from "../components/profile/EventHistoryCard";
import EventHistory from "../components/profile/EventHistory";
import EditProfileModal from "../components/profile/EditProfileModal";

const MenuButton = ({icon, label, onClick, isDanger}: any) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors active:bg-gray-100
                ${isDanger ? 'text-red-500' : 'text-gray-700'}
                `}
        >
            <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="font-medium text-sm">{label}</span>
            </div>
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    )
};

type Props ={
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
};
const ConfirmModal =({
    isOpen, onClose, onConfirm, title, message,
    confirmText = "OK", cancelText = "キャンセル", isDanger = false
}: Props) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
                <h3 className={`text-lg font-bold mb-2 ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-transform active:scale-95
                            ${isDanger
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};



const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
    const [myEvents, setMyEvents] = useState<Event[]>([])

    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileGetError, setProfileGetError] = useState<string | null>(null);
    const [isEventLoading, setIsEventLoading] = useState(true);
    const [MyEventError, setMyEventError] = useState<string | null>(null);
    const [isDeactivateLoading, setIsDeactivateLoading] = useState(false);
    const [deactivateError, setDeactivateError] = useState<string|null>(null);
    const [deactivateSuccessMsg, setdeactivateSuccessMsg] =useState<string|null>(null);

    const [language, setLanguage] = useState<"En" | "Jp">("En");

    const [selectedEvent, setSelectedEvent] = useState<Event|null>(null);
    const [activeTab, setActiveTab] = useState<"upcoming"|"past">("upcoming");

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const router = useRouter();

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

    const filterdEvents = () => {
        const getTodayString = () => {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const todayStr = getTodayString();
        const futureEvents = myEvents.filter(event => event.date >= todayStr);
        const pastEvents = myEvents.filter(event => event.date < todayStr);
        futureEvents.sort((a,b) => a.date.localeCompare(b.date));
        pastEvents.sort((a,b) => b.date.localeCompare(a.date));
        return activeTab === 'upcoming' ? futureEvents : pastEvents
    };

    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        alert('ログアウトしました。');
        router.push('/login');
    };

    const fetchUser = async () => {
        try {
            setIsProfileLoading(true);
            const token = Cookies.get('accessToken');
            const userRes = await fetch(`${BACKEND_URL}/api/accounts/me/`,{
                method: 'GET',
                headers: {
                    'content-Type': 'application/json',
                    ...(token ? {'Authorization': `Bearer ${token}`} : {})
                }
            });
            if(!userRes.ok){
                throw new Error (`ユーザー情報取得エラー${userRes.status}`);
            }
            const userData = await userRes.json();
            setUserProfile(userData);
        }catch(err) {
            console.error(err);
            setProfileGetError("ユーザーデータの読み込みに失敗しました。時間を空けて再度お試しください。")
        }finally {
            setIsProfileLoading(false);
        }
    };

    const fetchMyEvents = async () => {
        try {
            setIsEventLoading(true);
            const token = Cookies.get('accessToken');
            const MyEventsRes = await fetch(`${BACKEND_URL}/api/events/my-joined/`,{
                method: 'GET',
                headers: {
                    'content-Type': 'application/json',
                    ...(token ? {'Authorization': `Bearer ${token}`} : {})
                }
            });
            if(!MyEventsRes.ok){
                throw new Error (`イベント情報取得エラー${MyEventsRes.status}`)
            }
            const MyEventsData = await MyEventsRes.json();
            setMyEvents(MyEventsData.results);
        }catch(err){
            console.error(err);
            setMyEventError("イベント情報の取得に失敗しました。時間を空けて再度お試しください。")
        }finally{
            setIsEventLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchMyEvents();
    },[])

    const deactivateUser = async () => {
        try {
            setIsDeactivateLoading(true);
            const token = Cookies.get('accessToken');
            const deactivateRes = await fetch(`${BACKEND_URL}/api/accounts/me/deactivate/`,{
                method: 'DELETE',
                headers: {
                    'content-Type': 'application/json',
                    ...(token ? {'Authorization': `Bearer ${token}`} : {})
                }
            });
            if(!deactivateRes.ok){
                throw new Error (`退会エラー${deactivateRes.status}`);
            }
            setdeactivateSuccessMsg("退会に成功しました。");
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 2000);
        }catch(err){
            console.error(err);
            setDeactivateError("退会に失敗しました。")
        }finally{
            setIsDeactivateLoading(false);
        }
    };

    if(isDeactivateLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full "></div>
            </div>
        );
    }
    if(deactivateSuccessMsg){
        return(
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                    ✓
                </div>
                <h2 className="text-2xl font-blod text-gray-800 mb-2">Success!</h2>
                <p className="text-gray-600 font-medium">{deactivateSuccessMsg}</p>
                <p className="text-sm text-gray-400 mt-4">ログイン画面に戻ります...</p>
            </div>
        );
    }

    return (
        <div>
            <Header title="Profile" subtitle="ユーザー情報" />
            {isProfileLoading
                ? (
                    <div className="m-2 p-10 bg-white rounded-lg shadow-lg flex justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div>
                        {userProfile
                            ? <UserProfile userProfile={userProfile} userLanguage={language} changeLanguage={setLanguage} />
                            : <p className="text-red-600 m-2 p-2 bg-white rounded-lg shadow-lg">{profileGetError}</p>
                        }
                    </div>
                )
            }
            <div className="m-2 p-4 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        {activeTab === "upcoming" ? "Upcoming Events" : "Event History"}
                    </h2>
                    <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold ">
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`px-3 py-1.5 rounded-md transition-all ${
                                activeTab === "upcoming"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setActiveTab("past")}
                            className={`px-3 py-1.5 rounded-md transition-all ${
                                activeTab === "past"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Past
                        </button>
                    </div>
                </div>
                {isEventLoading
                    ? (
                        <div className="m-2 p-10 bg-white rounded-lg  flex justify-center">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <div>
                            {(!MyEventError)
                                ? <EventHistory events={filterdEvents()} onOpenModal={(event) => setSelectedEvent(event)} />
                                : <p className="text-red-600 m-2 p-2 bg-white rounded-lg shadow-lg">{MyEventError}</p>
                            }
                        </div>
                    )
                }
            </div>
            <div className="m-2 rounded overflow-hidden shadow-sm border border-gray-100 rounded-lg shadow-lg">
                <MenuButton
                    icon="✏️"
                    label="Edit Profile"
                    onClick={() => setIsEditOpen(true)}
                />
                <MenuButton
                    icon="🚪"
                    label="Log out"
                    onClick={() => setIsLogoutOpen(true)}
                />
                <MenuButton
                    icon="🗑️"
                    label="Delete Account"
                    onClick={() => setIsDeleteOpen(true)}
                    isDanger={true}
                />
                {deactivateError && (
                    <div className="text-red-600 text-xs text-center mt-1 p-2 bg-red-50 border border-red-100 rounded">
                        ⚠️ {deactivateError}
                    </div>
                )}
            </div>
            {selectedEvent && (
                <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} readOnly={true} />
            )}
            {isEditOpen && userProfile && (
                <EditProfileModal 
                    user={userProfile}
                    onClose={() => setIsEditOpen(false)}
                    onUpdate={() => {
                        fetchUser();
                    }}
                />
            )}
            <ConfirmModal 
                isOpen={isLogoutOpen}
                onClose={() => setIsLogoutOpen(false)}
                onConfirm={handleLogout}
                title="Log out"
                message="Are you sure you want to log out ?"
                confirmText="Log out"
                isDanger={false}
            />
            <ConfirmModal 
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={deactivateUser}
                title="Delete Account"
                message="Are you sure? This action cannot be undone and all your data will be permanently removed."
                confirmText="Delete Account"
                isDanger={true}
            />
        </div>
    )
};

export default ProfilePage;