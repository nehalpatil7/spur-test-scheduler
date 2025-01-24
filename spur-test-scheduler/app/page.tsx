"use client";

import React, { useState } from 'react';
import CalendarComponent from '@/components/CalendarComponent';
import ScheduleTestModal from '@/components/ScheduleTestModal';

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSave = () => {
    // Logic to refresh calendar after saving a schedule
  };

  return (
    <main className="p-4">
      <button
        onClick={() => setModalOpen(true)}
        className="p-2 bg-blue-500 text-white rounded mb-4"
      >
        Schedule Test
      </button>
      <CalendarComponent />
      {isModalOpen && (
        <ScheduleTestModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
