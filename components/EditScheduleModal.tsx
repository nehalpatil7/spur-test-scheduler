/* eslint-disable react-hooks/rules-of-hooks */
"use client";


import React, { useState } from "react";
import { XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button"


interface TestSuite {
    id: string;
    test_suite_name: string;
    start_time: string;
    cadence: string[];
}

interface EditScheduleModalProps {
    isOpen: boolean;
    schedule: TestSuite | null;
    onClose: () => void;
    onSave: () => void;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
    isOpen,
    schedule,
    onClose,
    onSave,
}) => {
    if (!isOpen || !schedule) return null;
    const [testSuiteName, setTestSuiteName] = useState(schedule?.test_suite_name);
    const [startTime, setStartTime] = useState(schedule?.start_time);
    const [cadence, setCadence] = useState(schedule?.cadence);

    const handleSave = async () => {
        try {
            const payload = {
                id: schedule.id,
                test_suite_name: testSuiteName,
                start_time: startTime,
                cadence: cadence,
            };

            const response = await fetch(`/api/schedules`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSave(); // Trigger parent component's refresh logic
                onClose();
            } else {
                console.error("Failed to update schedule");
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[20px] w-full sm:w-[640px] h-fit max-h-[430px] overflow-y-auto">
                <div className="flex justify-between items-center h-[52px] pt-4 pl-5 pr-5 pb-1">
                    <h2 className="text-2xl font-semibold leading-normal font-sans text-left text-[#1B1919]">
                        Edit Schedule Details
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✖
                    </button>
                </div>

                <div className="h-[306px] p-6 space-y-6">
                    {/* Test Suite Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Test Suite Name</label>
                        <input
                            type="text"
                            value={testSuiteName}
                            onChange={(e) => setTestSuiteName(e.target.value)}
                            className="w-full p-2 border border-[#DED9D6] rounded-lg"
                        />
                    </div>

                    {/* Start Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Start Time</label>
                        <input
                            type="datetime-local"
                            value={new Date(startTime).toISOString().slice(0, 16)}
                            onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
                            className="w-full p-2 border border-[#DED9D6] rounded-lg"
                        />
                    </div>

                    {/* Cadence */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Run Weekly On</label>
                        <div className="grid grid-cols-7 gap-1">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <button
                                    key={day}
                                    onClick={() =>
                                        setCadence((prev) =>
                                            prev.includes(day)
                                                ? prev.filter((d) => d !== day)
                                                : [...prev, day]
                                        )
                                    }
                                    className={`p-2 rounded-md ${cadence.includes(day)
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-black"
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {/* Footer */}
                <div className="w-full h-[72px] py-4 px-5 flex justify-between items-center gap-4 border-t border-gray-200">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                        className="w-[292px] h-10 px-3 py-2 gap-2 rounded-lg border border-t-[1px] border-r-0 border-b-0 border-l-0 text-red-500 hover:text-red-600"
                    >
                        <XCircleIcon className="w-4 h-4 mr-2" />Cancel Schedule
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="w-[292px] h-10 px-4 py-2 gap-2 rounded-lg border-t border-[#0435DD] bg-[#0435DD] text-white hover:bg-[#0435DD]/90 focus:ring-2 focus:ring-[#0435DD]/50"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditScheduleModal;
