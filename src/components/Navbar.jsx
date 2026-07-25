'use client';

import React from 'react';
import { Crosshair, MessageSquareDashed, Fingerprint } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'radar', icon: Crosshair, label: 'RADAR' },
    { id: 'chat', icon: MessageSquareDashed, label: 'COMMS' },
    { id: 'profile', icon: Fingerprint, label: 'IDENTITY' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="brutalist-panel p-2 flex items-center justify-between bg-black">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-1 items-center justify-center p-3 gap-2 border-2 transition-all ${
                isActive 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black text-white border-transparent hover:border-white/50'
              }`}
            >
              <Icon 
                strokeWidth={isActive ? 3 : 2}
                className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} 
              />
              <span className="text-xs font-black tracking-widest hidden sm:block">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
