"use client";

import React, { useState } from 'react';
import LoginWrapper from '@/components/LoginWrapper';
import { AuthProvider } from '@/context/AuthContext';
import CalendarComponent from '@/components/CalendarComponent';
import ScheduleTestModal from '@/components/ScheduleTestModal';

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSave = () => {
    // Logic to refresh calendar after saving a schedule
  };

  return (
    <main className="">
      <AuthProvider>
        <LoginWrapper>
          <CalendarComponent />
        </LoginWrapper>
      </AuthProvider>
    </main>
  );
}
