"use client";

import React from 'react';
import LoginWrapper from '@/components/LoginWrapper';
import { AuthProvider } from '@/context/AuthContext';
import CalendarComponent from '@/components/CalendarComponent';

export default function Home() {

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
