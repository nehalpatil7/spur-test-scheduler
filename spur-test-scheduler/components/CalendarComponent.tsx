import React, { useEffect, useState } from 'react';

interface Schedule {
    id: string;
    start_time: string;
    test_suite_name: string;
}

const CalendarComponent = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);

    // Fetch schedules dynamically
    useEffect(() => {
        async function fetchSchedules() {
            try {
                const response = await fetch('/api/schedules');
                const data: Schedule[] = await response.json();
                setSchedules(data);
            } catch (error) {
                console.error('Failed to fetch schedules:', error);
            }
        }
        fetchSchedules();
    }, []);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Scheduled Suites</h2>
            <div className="grid grid-cols-8 border">
                {/* Header Row */}
                <div className="border p-2 font-bold">PST</div>
                {days.map((day) => (
                    <div key={day} className="border p-2 font-bold text-center">
                        {day}
                    </div>
                ))}

                {/* Calendar Rows */}
                {hours.map((hour) => (
                    <React.Fragment key={hour}>
                        <div className="border p-2 text-center">{hour} AM</div>
                        {days.map((day) => (
                            <div key={day + hour} className="border h-16 relative">
                                {schedules.map((schedule) => {
                                    const start = new Date(schedule.start_time);
                                    if (start.getHours() === hour && days[start.getDay()] === day) {
                                        return (
                                            <div key={schedule.id} className="absolute inset-1 bg-blue-100 p-1 rounded">
                                                <p className="text-xs font-bold">{schedule.test_suite_name}</p>
                                                <p className="text-xs">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CalendarComponent;
