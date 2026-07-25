'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import ChatSection from '@/components/ChatSection';
import ProfileSection from '@/components/ProfileSection';

// Dynamically import RadarSection with SSR disabled for Leaflet map support
const RadarSection = dynamic(() => import('@/components/RadarSection'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center font-mono text-white text-sm">
      LOADING_RADAR_MAP...
    </div>
  ),
});

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('OPERATOR');
  const [activeTab, setActiveTab] = useState('radar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userFromQuery = searchParams.get('user');
    if (userFromQuery) {
      setUsername(userFromQuery);
    } else if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('username');
      if (storedUser) {
        setUsername(storedUser);
      } else {
        router.push('/login');
      }
    }
  }, [searchParams, router]);

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

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8bGluZSB4MT0iMCIgeTE9IjIiIHgyPSI0IiB5Mj0iMiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] z-50 mix-blend-overlay" />

      {/* Main UI */}
      <div className="flex-1 flex flex-col z-10 relative h-full">
        <Header username={username} />

        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'radar' && <RadarSection />}
          {activeTab === 'chat' && <ChatSection />}
          {activeTab === 'profile' && <ProfileSection username={username} />}
        </main>

        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
