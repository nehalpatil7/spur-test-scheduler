"use client";

import React, { useState, useEffect } from 'react';

const ScheduleTestModal = ({ onClose, onSave }) => {
    const [testSuites, setTestSuites] = useState([]); // Test suite dropdown data
    const [selectedSuite, setSelectedSuite] = useState('');
    const [startTime, setStartTime] = useState('');
    const [cadence, setCadence] = useState([]); // Days of the week

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

    const handleCadenceChange = (day) => {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-1/3">
                <h2 className="text-xl font-bold mb-4">Schedule Test Suite</h2>

                {/* Test Suite Dropdown */}
                <label className="block mb-2">Select Test Suite</label>
                <select
                    value={selectedSuite}
                    onChange={(e) => setSelectedSuite(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                >
                    <option value="">Select a Test Suite</option>
                    {testSuites.map((suite) => (
                        <option key={suite.id} value={suite.id}>
                            {suite.name}
                        </option>
                    ))}
                </select>

                {/* Date-Time Picker */}
                <label className="block mb-2">Start Date & Time</label>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />

                {/* Cadence Selection */}
                <label className="block mb-2">Run Weekly On</label>
                <div className="flex space-x-2 mb-4">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <button
                            key={day}
                            onClick={() => handleCadenceChange(day)}
                            className={`p-2 rounded border ${cadence.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>

                {/* Save & Cancel Buttons */}
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="p-2 bg-gray-500 text-white rounded">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTestModal;
