import { Event } from "../../types";

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
};

export default EventHistoryCard;