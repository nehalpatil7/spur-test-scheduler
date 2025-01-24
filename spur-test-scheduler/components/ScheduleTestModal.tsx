"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button"


interface TestSuite {
    id: string;
    name: string;
}

interface ScheduleTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ScheduleTestModal: React.FC<ScheduleTestModalProps> = ({ isOpen, onClose, onSave }) => {
    const [testSuites, setTestSuites] = useState<TestSuite[]>([]); // Test suite dropdown data
    const [selectedSuite, setSelectedSuite] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [cadence, setCadence] = useState<string[]>([]); // Days of the week

    // Fetch available test suites on load
    useEffect(() => {
        async function fetchTestSuites() {
            try {
                const response = await fetch('/api/test-suites');
                const data = await response.json();
                setTestSuites(data);
            } catch (error) {
                console.error('Failed to fetch test suites:', error);
            }
        }
        fetchTestSuites();
    }, []);

    const handleCadenceChange = (day: string) => {
        setCadence((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = async () => {
        try {
            const payload = {
                test_suite_id: selectedSuite,
                start_time: startTime,
                cadence,
            };

            const response = await fetch('/api/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSave(); // Callback to refresh calendar
                onClose(); // Close modal
            } else {
                console.error('Failed to save schedule');
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[20px] w-full sm:w-[640px] h-fit max-h-[430px] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center h-[52px] pt-4 pl-5 pr-5 pb-1">
                    <h2 className="text-2xl font-semibold leading-normal font-sans text-left text-[#1B1919]">Schedule Detail</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6 text-[#1B1919]" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[306px] p-6 space-y-6">
                    {/* Test Suite Selection */}
                    <div className="space-y-2 w-fill h-[66px]">
                        <label className="w-fill h-fill text-sm font-semibold leading-none text-left font-sans text-[#1B1919]">Test Suite</label>
                        <div className="relative w-full max-w-[600px] h-[44px] text-[#1B1919]">
                            <select
                                value={selectedSuite}
                                onChange={(e) => setSelectedSuite(e.target.value)}
                                className="w-full h-11 rounded-md border border-[#DED9D6] py-2.5 px-3 appearance-none bg-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-tight"
                            >
                                <option value="">Demo Suite</option>
                                {testSuites.map((suite) => (
                                    <option key={suite.id} value={suite.id}>
                                        {suite.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Start Date and Time */}
                    <div className="w-full h-[184px] pt-2 pl-4 pr-4 border border-[#DED9D6] rounded-xl">
                        <div className="space-y-2 pb-1">
                            <label className="w-fill h-fill text-sm font-semibold leading-none text-left font-sans text-[#1B1919]">Start Date and Time</label>
                            <div className="relative w-full max-w-[600px] h-[44px] text-[#1B1919]">
                                <input
                                    type="text"
                                    value="10/10/24 at 7:00 AM PST"
                                    readOnly
                                    className="w-full p-2 border border-[#DED9D6] rounded-lg text-base leading-normal"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Weekly Schedule */}
                        <div className="space-y-2 h-[66px] pt-2">
                            <div className="flex justify-between items-center">
                                <label className="w-fill h-fill text-sm font-semibold leading-none text-left font-sans text-[#1B1919]">Run Weekly on Every</label>
                                <button className="underline underline-offset-2 decoration-solid text-sm font-sansleading-none text-left text-[#8D8A8A]">
                                    Custom Interval
                                </button>
                            </div>
                            <div className="grid grid-cols-7 w-full h-[44px] rounded-md border border-[#DED9D6]">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => handleCadenceChange(day)}
                                        className={`h-[44px] border border-[#DED9D6] border-r-0 text-center text-base leading-normal
                                            ${cadence.includes(day)
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-black border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full h-[72px] py-4 px-5 flex justify-between items-center gap-4 border-t border-gray-200">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[292px] h-10 px-3 py-2 gap-2 rounded-lg border border-t-[1px] border-r-0 border-b-0 border-l-0 text-red-500 hover:text-red-600"
                    >
                        <XCircleIcon className="w-4 h-4 mr-2" />Cancel Schedule
                    </Button>
                    <Button
                        className="w-[292px] h-10 px-4 py-2 gap-2 rounded-lg border-t border-[#0435DD] bg-[#0435DD] text-white hover:bg-[#0435DD]/90 focus:ring-2 focus:ring-[#0435DD]/50"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTestModal;
