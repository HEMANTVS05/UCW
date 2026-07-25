'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('username', username.trim());
      }
      router.push(`/?user=${encodeURIComponent(username.trim())}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black p-4">
      {/* Structural background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner marks */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white/40" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white/40" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white/40" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white/40" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md brutalist-panel p-8 z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-start mb-10 pb-6 border-b-2 border-white/30">
          <div className="w-12 h-12 bg-white flex items-center justify-center mb-5">
            <Terminal className="w-7 h-7 text-black" />
          </div>
          <h1
            className="text-5xl font-black text-white glitch uppercase tracking-tighter leading-none"
            data-text="SYSTEM.ENTRY"
          >
            SYSTEM.ENTRY
          </h1>
          <p className="font-mono text-xs mt-3 text-white/50 uppercase tracking-widest">
            // initialize connection sequence
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-white/60">
              &gt;&nbsp;User_Identification
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER_ID_"
              className="w-full px-4 py-4 bg-black border-2 border-white text-white font-mono text-base
                         placeholder-white/25 focus:outline-none focus:border-secondary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="brutalist-button w-full flex items-center justify-between"
          >
            <span>Execute Access</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/15">
          <p className="font-mono text-[10px] text-white/40 uppercase flex justify-between">
            <span>SEC_LEVEL: ALPHA</span>
            <span>V_2.0.44</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
