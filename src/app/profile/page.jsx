'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import ProfileSection from '@/components/ProfileSection';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('ucw_current_user');
      const token = localStorage.getItem('ucw_access_token');

      if (storedUserData) {
        try {
          setCurrentUser(JSON.parse(storedUserData));
        } catch (e) {}
      } else if (!token) {
        router.push('/login');
        return;
      }

      if (token) {
        fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) {
              setCurrentUser(data);
              localStorage.setItem('ucw_current_user', JSON.stringify(data));
            }
          })
          .catch((err) => console.error('Error syncing user:', err));
      }
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="h-screen w-full bg-black flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="flex-1 flex flex-col z-10 relative h-full">
        <Header
          username={currentUser?.display_name || currentUser?.username || 'OPERATOR'}
          avatar={currentUser?.profile_photo || currentUser?.avatar}
        />

        <main className="flex-1 overflow-hidden relative">
          <ProfileSection
            username={currentUser?.username}
            avatar={currentUser?.profile_photo || currentUser?.avatar}
          />
        </main>

        <Navbar />
      </div>
    </div>
  );
}
