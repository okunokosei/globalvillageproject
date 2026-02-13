'use client';
import { useState, useEffect } from 'react';
import { Event, Participant } from "../types";
import { MOCK_EVENTS, MOCK_PARTICIPANTS } from "../../../constants/MockData";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

import Header from "../components/Header";
import TabButton from "../components/TabButton";
import ModalBase from "../components/ModalBase";

import Cookies from 'js-cookie';
// import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const ParticipantList = ({ participants }: { participants: Participant[] }) => {
    // コピーした瞬間に「Copied!」と出すためのstate
    const [isCopied, setIsCopied] = useState(false);

    const sortedParticipants = [...participants].sort((a, b) => {
        return Number(a.room_number) - Number(b.room_number);
    });

    const handleCopy = () => {
        // 1. コピーするテキストを作成 (例: "101 Alex Johnson\n202 Yuki Tanaka...")
        const text = sortedParticipants
            .map(p => `${p.room_number} ${p.name}`)
            .join('\n');
        
        // 2. クリップボードに書き込み
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            // 2秒後に元の表示に戻す
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            {/* ヘッダー：タイトルと人数 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Participant Management
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shrink-0">
                    {sortedParticipants.length} people
                </span>
            </div>

            {/* リスト本体 */}
            <ul className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {sortedParticipants.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 text-sm text-gray-600 border-b border-dashed border-gray-100 pb-2 last:border-0 last:pb-0">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span className="font-mono text-gray-400 w-8">{p.room_number}</span>
                        <span className="font-medium">{p.name}</span>
                    </li>
                ))}
            </ul>

            {/* コピーボタン */}
            <button 
                onClick={handleCopy}
                className="w-full py-2.5 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors active:scale-95"
            >
                {isCopied ? (
                    <>
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        Copy List
                    </>
                )}
            </button>
        </div>
    );
};

const EventDetailModal = ({event, onClose}: {event: Event, onClose: () => void}) => {
    const isAdmin = true;
    const [isJoined, setIsJoined] = useState(event.is_joined);
    const [isAgreed, setIsagreed] = useState(false);
    const [eventParticipants, setEventParticipants] = useState<Participant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const handleJoinToggle = () => {
        setIsJoined(!isJoined);
        if (isJoined) {
            setIsagreed(false);
        }
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
        fetchData();
    },[])

    if(error){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 px-4 text-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md" >
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
        </ModalBase>
    )
}

const EventList = ({events, onOpenModal}: {events: Event[], onOpenModal: (e: Event) => void}) => {
    return (
        <div className="flex flex-col gap-4">
            {
                events.map((event) => (
                    <EventCard key={event.id} event={event} onClick={() => onOpenModal(event)} />
                ))
            }
        </div>
    )
}

const EventCard = ({event, onClick}: {event: Event, onClick: () => void}) => {
    const dateObj = new Date(event.date);
    const month = dateObj.toLocaleDateString('en-US', {month: 'short'}).toUpperCase();
    const day = dateObj.toLocaleDateString('en-US', {day: 'numeric'})
    return (
        <div>
            <button
                onClick={onClick}
                className="w-full h-40 text-left bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-4"
            >
                {/* 左 */}
                <div className="h-24 w-20 bg-blue-700 rounded-lg text-white flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-3xl font-bold leading-none">
                        {day}
                    </span>
                    <span className="text-sm font-medium mt-1">
                        {month}
                    </span>
                </div>
                {/* 中央 */}
                <div className="flex-1 flex flex-col gap-1 text-sm overflow-hidden">
                    <h2 className="font-bold mb-1 truncate text-base">{event.title_jp}</h2>
                    <div className="text-gray-500 flex flex-col gap-0.5">
                        <span>{event.date}</span>
                        <span>{`${event.start_time}-${event.end_time}`}</span>
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>
                <div className="h-24 w-24 rounded-lg shrink-0 overflow-hidden">
                    {event.cover_image && (
                        <div>
                            <img src={event.cover_image} alt="" className="w-full h-full object-cover"/>
                        </div>
                    )}
                </div>
            </button>
        </div>
    )
}

const EventCalendar = ({selectedDate, onSelectedDate, events}: {selectedDate: Date, onSelectedDate: (d: Date) => void, events: Event[]}) => {
    // const eventDates = events.map(event => new Date(event.date));
    const eventDates = events.map((event) => {
        const [year, month, day] = event.date.split('-').map(Number);
        return new Date(year, month - 1, day);
    });

    const handleSelect = (date: Date | undefined) => {
        if(date) {
            onSelectedDate(date);
        }
    };
    
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-center">
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}

                modifiers={{event: eventDates}}
                modifiersClassNames={{
                    event: 'font-bold underline decoration-blue-500 decoration-2 underline-offset-4'
                }}
                styles={{
                    head_cell: { width: '40px' },
                    cell: { width: '40px' },
                    day: { margin: 'auto' }
                }}
            />
        </div>
    )
}

const DailyEventList = ({date, events, onOpenModal}: {date: any, events: Event[], onOpenModal: (e: Event) => void}) => {
    // カレンダーコンポーネントからはDate型で送られてくる->string型に変更
    // その際、時差によって日付がずれないように注意している。
    const offset = date.getTimezoneOffset()*60000;
    const dateString = (new Date(date.getTime() - offset)).toISOString().split('T')[0];
    // console.log("選択された日付 :", dateString);
    const todaysEvents = events.filter((e: Event) => e.date === dateString);
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
                Events on {date.toLocaleDateString('en-US')}
            </h2>
            {
                todaysEvents.length > 0
                ? (
                    <div className="flex flex-col gap-4">
                        {todaysEvents.map((event: Event) => (
                            <EventCard key={event.id} event={event} onClick={() => onOpenModal(event)} />
                        ))}
                    </div>
                )
                : (
                    <p className="text-gray-500 text-center py-8" >No events on this date</p>
                )
            }
        </div>
    )
}


const EventPage = () => {
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    
    // 通信用
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] =useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const token = Cookies.get('accessToken');
                const eventRes = await fetch(`${BACKEND_URL}/api/events/`,{
                    method: 'GET',
                    headers: {
                        'content-Type': 'application/json',
                        ...(token ? {'Authorization': `Bearer ${token}`} : {})
                    }
                });
                if(!eventRes.ok){
                    throw new Error (`イベント取得エラー${eventRes.status}`);
                }
                const eventData = await eventRes.json();
                setEvents(eventData.results);
            }catch(err) {
                console.error(err);
                setError("データの読み込みに失敗しました。時間を空けて再度お試しください。")
            }finally {
                setIsLoading(false);
            }
        };
        fetchData();
    },[])

    if(isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full "></div>
            </div>
        );
    }

    if(error){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 px-4 text-center">
                <p>{error}</p>
            </div>
        );
    }


    return (
        <div>
            <Header title="Event" subtitle="カレンダーとリスト" />
            <div className="sticky top-[57px] z-40 bg-gray-50 pt-2 px-2 pb-2">
                <div className="flex bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <TabButton 
                        label="Calendar"
                        isActive={viewMode === "calendar"}
                        onClick={() => setViewMode("calendar")}
                    />
                    <TabButton 
                        label="List"
                        isActive={viewMode === "list"}
                        onClick={() => setViewMode("list")}
                    />
                </div>
            </div>
            <div className="px-4">
                {
                    (viewMode === "calendar") 
                    ? (
                        <div className="flex flex-col gap-6">
                            <EventCalendar selectedDate={selectedDate} onSelectedDate={(date) => setSelectedDate(date)} events={events} />
                            <DailyEventList date={selectedDate} events={events} onOpenModal={(event) => setSelectedEvent(event)} />
                        </div>
                    )
                    : <EventList events={events} onOpenModal={(event) => setSelectedEvent(event)} />
                }
            </div>
            {selectedEvent && (
                <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)}/>
            )}
        </div>
    )
};

export default EventPage;