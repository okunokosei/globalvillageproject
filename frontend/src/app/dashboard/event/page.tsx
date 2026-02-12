'use client';
import { useState } from 'react';
import { Event } from "../types";
import { MOCK_EVENTS } from "../../../constants/MockData";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

import Header from "../components/Header";
import TabButton from "../components/TabButton";
import ModalBase from "../components/ModalBase";

const EventDetailModal = ({event, onClose}: {event: Event, onClose: () => void}) => {
    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            {event.cover_image && (
                <div className="w-full h-56 bg-gray-100">
                    <img src={event.cover_image} alt="" className="w-full h-full object-cover" />
                </div>
            )}
            <div>
                {event.title_jp}
            </div>
            <div>
                {event.date}
            </div>
            <div>
                {`${event.start_time}-${event.end_time}`}
            </div>
            <div>
                {event.location}
            </div>
            <div>
                {event.description_jp}
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
    const [events, setEvents] =useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] =useState<string | null>(null);

    // if(isLoading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //             <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full "></div>
    //         </div>
    //     );
    // }

    // if(error){
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 px-4 text-center">
    //             <p>{error}</p>
    //         </div>
    //     );
    // }


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
                            <EventCalendar selectedDate={selectedDate} onSelectedDate={(date) => setSelectedDate(date)} events={MOCK_EVENTS} />
                            <DailyEventList date={selectedDate} events={MOCK_EVENTS} onOpenModal={(event) => setSelectedEvent(event)} />
                        </div>
                    )
                    : <EventList events={MOCK_EVENTS} onOpenModal={(event) => setSelectedEvent(event)} />
                }
            </div>
            {selectedEvent && (
                <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </div>
    )
};

export default EventPage;