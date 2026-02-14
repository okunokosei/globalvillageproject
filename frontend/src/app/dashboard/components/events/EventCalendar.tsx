import { Event } from "../../types";

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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

export default EventCalendar;