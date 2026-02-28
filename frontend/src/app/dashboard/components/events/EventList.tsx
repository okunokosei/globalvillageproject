import { Event } from "../../types";
import EventCard from "./EventCard";
import { useState } from "react";
import { CalendarX } from "lucide-react";

const EventList = ({events, onOpenModal}: {events: Event[], onOpenModal: (e: Event) => void}) => {
    const [listMode, setListMode] = useState<'upcoming'|'past'>('upcoming');

    const today = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'Asia/Tokyo'
    }).split('T')[0];

    const upcomingEvents = events
        .filter(event => event.date >= today)
        .sort((a,b) => a.date.localeCompare(b.date));
    const pastEvents = events
        .filter(event => event.date < today)
        .sort((a,b) => b.date.localeCompare(a.date));

    const displayEvents = listMode === 'upcoming' ? upcomingEvents : pastEvents;

    return (
        <div className="flex flex-col gap-4">
            
            <div className="flex items-center justify-between px-1 mb-1">
                <h3 className="text-[15px] font-bold text-gray-800">
                    {listMode === 'upcoming' ? '今後のイベント' : '過去のイベント'}
                </h3>
                <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setListMode('upcoming')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                            listMode === 'upcoming'
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setListMode('past')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                            listMode === 'past'
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Past
                    </button>
                </div>
            </div>
            
            <div className="flex flex-col gap-3">
                {displayEvents.length > 0 ? (
                    displayEvents.map((event) => (
                        <EventCard key={event.id} event={event} onClick={() => onOpenModal(event)} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 mt-2 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                            <CalendarX size={24} className="text-gray-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            {listMode === 'upcoming' ? '今後のイベントは予定されていません' : '過去のイベントはありません'}
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default EventList;