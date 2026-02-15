import { Event } from "../../types";
import EventHistoryCard from "../profile.tsx/EventHistoryCard";

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

export default EventHistory;