import { Event } from "../../types";
import EventCard from "./EventCard";

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
};

export default DailyEventList;