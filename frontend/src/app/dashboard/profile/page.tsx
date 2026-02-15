'use client';

import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import { useState } from "react";
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

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [language, setLanguage] = useState<"En" | "Jp">("En");

    const [selectedEvent, setSelectedEvent] = useState<Event|null>(null);
    const [activeTab, setActiveTab] = useState<"upcoming"|"past">("upcoming");

    const router = useRouter();

    const getTodayString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const todayStr = getTodayString();
    const futureEvents = MOCK_MY_JOINED_EVENTS.filter(event => event.date >= todayStr);
    const pastEvents = MOCK_MY_JOINED_EVENTS.filter(event => event.date < todayStr);
    futureEvents.sort((a,b) => a.date.localeCompare(b.date));
    pastEvents.sort((a,b) => b.date.localeCompare(a.date));

    const filterdEvents = () => {
        return activeTab === 'upcoming' ? futureEvents : pastEvents
    };

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
                <EventHistory events={filterdEvents()} onOpenModal={(event) => setSelectedEvent(event)} />
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
            {selectedEvent && (
                <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} readOnly={true} />
            )}
        </div>
    )
};

export default ProfilePage