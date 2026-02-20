'use client';
import { useState, useEffect } from 'react';
import { Event } from "../types";
import { MOCK_EVENTS} from "../../../constants/MockData";

import { format } from 'date-fns';

import Header from "../components/Header";
import TabButton from "../components/TabButton";
import EventDetailModal from "../components/events/EventDetailModal";
import EventList from "../components/events/EventList";
import DailyEventList from "../components/events/DailyEventList";
import EventCalendar from "../components/events/EventCalendar";

import Cookies from 'js-cookie';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const EventPage = () => {
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    
    // 通信用
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] =useState<string | null>(null);

    const fetchEvents = async () => {
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

    useEffect(() => {
        fetchEvents();
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
                <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </div>
    )
};

export default EventPage;