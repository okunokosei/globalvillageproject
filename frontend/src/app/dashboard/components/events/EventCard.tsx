import { Event } from "../../types";

const EventCard = ({event, onClick}: {event: Event, onClick: () => void}) => {
    const dateObj = new Date(event.date);
    const month = dateObj.toLocaleDateString('en-US', {month: 'short'}).toUpperCase();
    const day = dateObj.toLocaleDateString('en-US', {day: 'numeric'})
    return (
        <div className="shrink-0">
            <button
                onClick={onClick}
                className="w-full h-38 text-left bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-4"
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
                {/* 右側 */}
                <div className="h-24 w-24 rounded-lg shrink-0 overflow-hidden">
                    {event.cover_image && (
                        <img src={event.cover_image} alt="" className="w-full h-full object-cover"/>
                    )}
                </div>
            </button>
        </div>
    )
};

export default EventCard;