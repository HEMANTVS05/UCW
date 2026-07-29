'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Camera, ImagePlus, ArrowRight, SkipForward } from 'lucide-react';
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

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('radar');
  const [mounted, setMounted] = useState(false);
  
  // Avatar Setup State
  const [showAvatarSetup, setShowAvatarSetup] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('ucw_current_user');
      
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setCurrentUser(user);
        
        // Show avatar setup if it's explicitly null (meaning they haven't uploaded or skipped yet)
        if (user.avatar === null) {
          setShowAvatarSetup(true);
        }
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const completeAvatarSetup = (avatarData) => {
    if (typeof window !== 'undefined' && currentUser) {
      const updatedUser = { ...currentUser, avatar: avatarData || 'skipped' };
      
      // Update current user session
      localStorage.setItem('ucw_current_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      // Update user in DB
      const usersDb = JSON.parse(localStorage.getItem('ucw_users_db') || '[]');
      const updatedDb = usersDb.map(u => 
        u.username === currentUser.username ? { ...u, avatar: avatarData || 'skipped' } : u
      );
      localStorage.setItem('ucw_users_db', JSON.stringify(updatedDb));
      
      setShowAvatarSetup(false);
    }
  };

  if (!mounted) return null;

  if (showAvatarSetup && currentUser) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative p-4">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="brutalist-panel p-8 w-full max-w-md flex flex-col items-center text-center z-10 bg-black"
        >
          <Camera className="w-8 h-8 text-white mb-4" />
          <h1 className="text-2xl font-black text-white glitch uppercase tracking-tighter mb-2" data-text="PROFILE_IMAGE_UPLOAD">PROFILE_IMAGE_UPLOAD</h1>
          <p className="font-mono text-xs text-white/50 mb-8 uppercase tracking-widest">// initialize operator visual id</p>
          
          <div 
            className="w-40 h-40 border-2 border-white mb-8 flex items-center justify-center cursor-pointer group relative overflow-hidden bg-white/5"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="w-10 h-10 text-white/30 group-hover:text-white transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-mono text-xs uppercase font-bold tracking-widest">
                {avatarPreview ? 'CHANGE_IMG' : 'SELECT_IMG'}
              </span>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex flex-col w-full gap-4">
            <button
              onClick={() => completeAvatarSetup(avatarPreview)}
              disabled={!avatarPreview}
              className={`brutalist-button w-full flex items-center justify-center gap-2 py-4 ${!avatarPreview ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => completeAvatarSetup(null)}
              className="text-white/60 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
            >
              <span>Skip for now</span>
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) return null;

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
        <Header username={currentUser?.displayName || currentUser?.username || 'OPERATOR'} avatar={currentUser?.avatar} />

        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'radar' && <RadarSection currentUser={currentUser} />}
          {activeTab === 'chat' && <ChatSection />}
          {activeTab === 'profile' && <ProfileSection username={currentUser?.displayName || currentUser?.username} avatar={currentUser?.avatar} />}
        </main>

        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full bg-black flex items-center justify-center font-mono text-white text-sm tracking-widest uppercase">
        INITIALIZING...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
