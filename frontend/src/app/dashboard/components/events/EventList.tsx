import { Event } from "../../types";
import EventCard from "./EventCard";

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
};

export default EventList;