"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, BookOpenIcon, Bars4Icon, CalendarIcon } from '@heroicons/react/24/outline';
import ScheduleTestModal from './ScheduleTestModal';
import { useAuth } from '@/context/AuthContext';


interface TestSuite {
    id: string;
    test_suite_name: string;
    start_time: string;
    cadence: string[];
}

interface ScheduleTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

interface WeekState {
    startDate: Date;
    weekDays: Array<{
        name: string;
        date: Date;
    }>;
}

const getStartOfWeek = (date: Date): Date => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() - day);
    return newDate;
};


const CalendarComponent: React.FC = () => {
    const { user, logout } = useAuth();
    const [schedules, setSchedules] = useState<TestSuite[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarView, setIsCalendarView] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 10;
    const totalPages = Math.ceil(schedules.length / recordsPerPage);

    const paginatedSchedules = schedules.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const [weekState, setWeekState] = useState<WeekState>(() => {
        const today = new Date();
        const startDate = getStartOfWeek(today);
        return {
            startDate,
            weekDays: generateWeekDays(startDate),
        };
    });

    useEffect(() => {
        async function fetchSchedules() {
            try {
                console.log('Fetching schedules...');
                const response = await fetch('/api/schedules');
                const data = await response.json();
                console.log('Fetched schedules:', data);
                setSchedules(data);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        }
        fetchSchedules();
    }, []);

    function generateWeekDays(startDate: Date) {
        const days = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 7; i++) {
            days.push({
                name: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(currentDate),
                date: new Date(currentDate),
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    }

    const navigateWeek = (direction: 'prev' | 'next') => {
        setWeekState(prevState => {
            const newStartDate = new Date(prevState.startDate);
            const days = direction === 'prev' ? -7 : 7;
            newStartDate.setDate(newStartDate.getDate() + days);

            return {
                startDate: newStartDate,
                weekDays: generateWeekDays(newStartDate),
            };
        });
    };

    const formatWeekDisplay = (date: Date): string => {
        return new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        }).format(date);
    };

    const timeSlots = ['PST', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM'];

    const renderScheduledTests = (day: Date, hour: number) => {
        return schedules
            .filter((schedule) => {
                const scheduleDate = new Date(schedule.start_time);
                return (
                    scheduleDate.getDate() === day.getDate() &&
                    scheduleDate.getMonth() === day.getMonth() &&
                    scheduleDate.getFullYear() === day.getFullYear() &&
                    scheduleDate.getHours() === hour
                );
            })
            .map((schedule) => (
                <div
                    key={schedule.id}
                    className="absolute inset-1 bg-blue-50 p-2 rounded flex flex-col gap-1 w-[137.71px] border border-[#0435DD80]"
                    style={{ backgroundColor: 'rgba(4, 53, 221, 0.05)' }}
                >
                    <div className="w-[122.71px] h-3 text-[#0435DD] font-sans text-xs font-semibold leading-[12px]">
                        {schedule.test_suite_name}
                    </div>
                    <div className="w-full h-3 flex items-center gap-1 text-[#0435DD]">
                        <ClockIcon className="w-3 h-3" />
                        <span className="font-sans text-xs font-semibold leading-[12px]">
                            {new Date(schedule.start_time).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                                timeZone: 'PST',
                                hour12: true
                            })} PST
                        </span>
                    </div>
                </div>
            ));
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    return (
        <div className="flex">
            {/* Side Navigation */}
            <div className="w-[300px] bg-[#F9F8F8] border-r border-[#EDEBE9]" />

            <div className="flex-1">
                {/* Top Bar */}
                <div className="h-[64px] bg-[#FFFFFF] border-b border-[#DED9D6] flex items-center justify-between pl-3 pr-6">
                    {/* Side pane toggle */}
                    <button className="p-2.5 hover:bg-gray-100 rounded-lg border-2 border-gray-300">
                        <Image
                            src="/sidebar.png"
                            alt="Toggle Sidebar"
                            width={20}
                            height={20}
                        />
                    </button>

                    {/* Documentation & Profile */}
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-3 py-2 text-[#1B1919] hover:bg-gray-50 rounded-md">
                            <BookOpenIcon className="h-5 w-5" />
                            <span className="text-sm font-medium">Docs</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                            {user ? user.email.charAt(0).toUpperCase() : '??'}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="pt-6 pr-9 pb-6 pl-9 bg-white font-sans">

                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-sans text-3xl font-semibold leading-normal text-left text-[#1B1919]">Scheduled Suites</h1>
                    </div>

                    {/* Header section */}
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => setIsModalOpen(true)} className="w-[145px] h-9 rounded-lg pt-2 pr-3 pb-2 pl-3 gap-2 bg-[#0435DD] text-white flex items-center font-sans text-sm font-semibold leading-normal text-left">
                            <span className="text-lg">+</span>Schedule Test
                        </button>

                        <div className="flex items-center justify-between w-[240px] h-[36px] rounded-md border text-[#1B1919] border-[#DED9D6] px-[10px] py-2.5">
                            <button onClick={() => navigateWeek('prev')} className="hover:bg-gray-100">
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="font-sans text-base font-medium leading-normal text-center" > Week of {formatWeekDisplay(weekState.startDate)} </span>
                            <button onClick={() => navigateWeek('next')} className="hover:bg-gray-200">
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <div className="flex p-1 bg-[#F3F2F1] rounded-lg">
                                <button
                                    className={`p-1 rounded-lg transition-all duration-200 ${!isCalendarView ? 'bg-white border border-[#DED9D6]' : ''}`}
                                    onClick={() => setIsCalendarView(false)}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M7 5H3M7 10H3M7 15H3M11 5H17M11 10H17M11 15H17" stroke="#1B1919" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </button>
                                <button
                                    className={`p-1 rounded-lg transition-all duration-200 ${isCalendarView ? 'bg-white border border-[#DED9D6]' : ''}`}
                                    onClick={() => setIsCalendarView(true)}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <CalendarIcon className="h-5 w-5 text-[#1B1919]" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Conditional rendering of Calendar or List view */}
                    {isCalendarView ? (

                        <div className="grid grid-cols-[60px,1fr] h-full">
                            {/* Time column */}
                            <div className="w-[48px] h-fit pt-[34px]">
                                {timeSlots.map((time, index) => (
                                    <div key={index} className="h-[60px] text-xs font-normal text-left font-sans leading-[12px] text-[#717070]">
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Days grid */}
                            <div className="grid grid-cols-7 border border-[#e0e0e0] rounded-lg">
                                {weekState.weekDays.map((day) => (
                                    <div key={day.date.toISOString()} className="border-r border-[#e0e0e0]">
                                        <div className="pl-4 pr-4 pt-1 pb-1 bg-[#F3F2F1] flex items-center">
                                            <span className="text-lg font-normal text-left text-[#1B1919] mr-2">
                                                {day.date.getDate()}
                                            </span>
                                            <span className="text-sm font-normal text-left text-[#717070]">
                                                {day.name}
                                            </span>
                                        </div>

                                        {/* Time slots for each day */}
                                        {Array.from({ length: 13 }, (_, i) => (
                                            <div
                                                key={i}
                                                className="h-[56px] relative"
                                            >
                                                {renderScheduledTests(day.date, i + 1)}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : (
                        // Display a list view of scheduled tests
                        <div className="flex flex-col h-[calc(100vh-240px)]">
                            <div className="flex-1 overflow-y-auto">
                                {paginatedSchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="flex items-center justify-between p-4 border-b border-[#DED9D6]"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <span className="text-base font-semibold text-[#1B1919]">
                                                {schedule.test_suite_name}
                                            </span>
                                            <div className="flex items-center gap-2 text-[#717070]">
                                                <ClockIcon className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {new Date(schedule.start_time).toLocaleString([], {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        timeZone: 'PST',
                                                        hour12: true
                                                    })} PST
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 p-4 border-t border-[#DED9D6]">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <span className="text-sm text-[#1B1919]">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* Schedule Detail Modal */}
            {isModalOpen && (
                <ScheduleTestModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => {
                        setIsModalOpen(false);
                        // Refresh schedules after saving
                        async function refreshSchedules() {
                            try {
                                const response = await fetch('/api/schedules');
                                const data = await response.json();
                                setSchedules(data);
                            } catch (error) {
                                console.error('Error refreshing schedules:', error);
                            }
                        }
                        refreshSchedules();
                    }}
                />
            )}
        </div>
    );
};

export default CalendarComponent;
