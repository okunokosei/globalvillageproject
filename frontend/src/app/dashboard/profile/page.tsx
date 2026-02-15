'use client';

import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import { UserProfileType, Event } from "../types";
import { MOCK_USER, MOCK_MY_JOINED_EVENTS } from "../../../constants/MockData";
import Header from "../components/Header";
import EventDetailModal from "../components/events/EventDetailModal";

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

const EventHistoryCard = ({event, onClick}: {event: Event, onClick: () => void}) => {
    return (
        <div>
            <button
                onClick={onClick}
                className="text-sm flex gap-2 "
            >
                <p>{event.date}</p>
                <p>{event.title_jp}</p>
            </button>
        </div>
    )
}

const EventHistory = ({events, onOpenModal}: {events: Event[], onOpenModal: (e: Event) => void}) => {
    return (
        <div className="flex flex-col gap-2 ">
            {events.length > 0 ? (
                events.map((event) => (
                    <EventHistoryCard 
                        key={event.id}
                        event={event}
                        onClick={() => onOpenModal(event)}
                    />
                ))
            ) : (
                <p className="text-gray-400 text-sm py-4 text-center">No events found.</p>
            )
            }
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
                <button
                    onClick={deactivateUser}
                    className="border border-gray-600 text-gray-800 p-1 text-sm rounded-sm shadow"
                >
                    アカウント削除
                </button>
                {deactivateError && (
                    <div className="text-red-600 text-xs text-center mt-1 p-2 bg-red-50 border border-red-100 rounded">
                        ⚠️ {deactivateError}
                    </div>
                )}
            </div>
            {selectedEvent && (
                <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} readOnly={true} />
            )}
        </div>
    )
};

export default ProfilePage;