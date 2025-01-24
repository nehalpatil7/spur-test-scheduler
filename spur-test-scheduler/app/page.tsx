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
    <main className="">
      <CalendarComponent />
    </main>
  );
}
