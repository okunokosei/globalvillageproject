import { useState, useEffect } from "react";
import { Event, Participant } from "../../types";
import Cookies from 'js-cookie';
import ModalBase from "../ModalBase";
import ParticipantList from "./ParticipantList";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;




const EventDetailModal = ({event, onClose, onUpdate, readOnly}: {event: Event, onClose: () => void, onUpdate?: () => void|Promise<void>, readOnly: boolean}) => {
    const isAdmin = true;
    const [isJoined, setIsJoined] = useState(event.is_joined);
    const [isAgreed, setIsagreed] = useState(false);

    const [isStatusChanged, setIsStatusChanged] = useState(false);

    const [eventParticipants, setEventParticipants] = useState<Participant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const handleJoinToggle = async () => {
        try {
            const token = Cookies.get('accessToken');
            const res = await fetch (`${BACKEND_URL}/api/events/${event.id}/join/`, {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                    ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                }
            });
            if(!res.ok) {
                throw new Error (`エラーが発生しました。: ${res.status}`);
            }
            if(res.status === 201) {
                setIsJoined(true);
                setIsagreed(false);
                setIsStatusChanged(true);
            } else if(res.status === 200) {
                setIsJoined(false);
                setIsStatusChanged(true);
            }
        } catch (err) {
            console.error(err);
            alert('通信に失敗しました。');
        }
    };

    const handleCloseModal = () => {
        if(isStatusChanged && onUpdate) {
            onUpdate();
        }
        onClose();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('accessToken');
                // console.log("アクセスURL: ", `${BACKEND_URL}/api/events/${event.id}/participants/`);
                const participantsRes = await fetch(`${BACKEND_URL}/api/events/${event.id}/participants/`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                    }
                });
                if(!participantsRes.ok) {
                    throw new Error (`参加者取得エラー${participantsRes.status}`);
                }
                const participantsData = await participantsRes.json();
                setEventParticipants(participantsData.results);
            }catch(err) {
                console.error(err);
                setError("データの読み込みに失敗しました。時間を空けて再度お試しください。")
            }
        };
        if(isAdmin) {
            fetchData();
        }
    },[])

    if(error){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 px-4 text-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <ModalBase onClose={handleCloseModal} maxWidth="max-w-md" >
            {event.cover_image ? (
                <div className="w-full h-56 bg-gray-100 relative group ">
                    <img src={event.cover_image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>
            ):(
                <div className="w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                    <div className="absolute top-4 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                </div>
            )}

            <div className="p-6 relative -mt-8 bg-white rounded-t-3xl">
                <div className="flex flex-col gap-1 mb-6">
                    {isJoined && (
                        <div className="self-start bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 mb-2 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Participating
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                        {event.title_jp}
                    </h2>
                </div>
                <div className="flex flex-col gap-3 mb-8 text-gray-500 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">📅</div>
                        <span className="font-medium text-gray-700">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">⏰</div>
                        <span className="font-medium text-gray-700">{event.start_time} - {event.end_time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">📍</div>
                        <span className="font-medium text-gray-700">{event.location}</span>
                    </div>
                </div>
                <div className="text-gray-600 leading-relaxed text-sm mb-8">
                    {event.description_jp}
                </div>
                {isAdmin && (
                    <ParticipantList participants={eventParticipants} />
                )}
            </div>
            {!readOnly && (
                <div className="sticky bottom-0 bg-white border-t border-gray-50 p-4 pb-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    {!isJoined && (
                        <label className="flex items-start gap-3 mb-4 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsagreed(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white checked:border-blue-500 checked:bg-blue-500 transition-all"
                                />
                                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors pt-0.5">
                                I agree to have my photo taken and published
                            </span>
                        </label>
                    )}
                    <div className="flex flex-col gap-3">
                        {isJoined 
                        ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-2">
                                    <span>🎉</span>You've joined this event!
                                </div>
                                <button
                                    onClick={handleJoinToggle}
                                    className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                                >
                                    Cancel participation
                                </button>
                            </div>
                        )
                        : (
                            <button
                                onClick={handleJoinToggle}
                                disabled={!isAgreed}
                                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200
                                    ${isAgreed
                                        ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl transform active:scale-[0.98]"
                                        : "bg-gray-300 shadow-none cursor-not-allowed opacity-70"
                                    }
                                `}
                            >
                                JOIN Event
                            </button>
                        )
                        }
                    </div>
                </div>
            )}
        </ModalBase>
    );
};

export default EventDetailModal;