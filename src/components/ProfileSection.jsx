'use client';

import React, { useState } from 'react';
import { Share2, Edit2, LogOut, Check, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileSection = ({ username, avatar }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('DESIGN IN MOTION / HACKER_ETHOS / V_2.0');
  const [copied, setCopied] = useState(false);

  const handleShareId = () => {
    navigator.clipboard.writeText(`ucw.app/u/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidAvatar = avatar && avatar !== 'skipped';

  return (
    <div className="w-full h-full p-4 overflow-y-auto pb-24 custom-scrollbar">
      <div className="max-w-md mx-auto space-y-5">

        {/* ─── Profile ID Card (white) ───────────────────── */}
        <div className="bg-white text-black border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-6 relative overflow-hidden">
          {/* Faint icon watermark */}
          <Terminal className="absolute top-2 right-2 w-24 h-24 text-black/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-start border-b-4 border-black pb-5 mb-5">
            {/* Avatar block */}
            <div className="w-24 h-24 bg-black text-white flex items-center justify-center overflow-hidden
                            font-black font-mono text-3xl border-4 border-black mb-4 select-none">
              {isValidAvatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover grayscale" />
              ) : (
                username.substring(0, 2).toUpperCase()
              )}
            </div>

            <p className="font-mono text-[9px] uppercase tracking-widest text-black/40 mb-1">
              &gt;&nbsp;CURRENT_USER
            </p>
            <h2
              className="text-4xl font-black uppercase tracking-tighter text-black glitch glitch-dark"
              data-text={username.toUpperCase()}
            >
              {username.toUpperCase()}
            </h2>
            <span className="mt-3 px-2 py-1 bg-black text-white font-mono text-[10px] uppercase font-bold">
              STATUS: ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-black/60 uppercase">
            <span>ID: <strong className="text-black">UCW_{username.toUpperCase()}</strong></span>
          </div>
        </div>

        {/* ─── Bio ──────────────────────────────────────── */}
        <div className="brutalist-panel p-5">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/20">
            <h3 className="font-black text-white tracking-widest uppercase text-xs font-mono">
              &gt;&nbsp;BIO_DATA
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-black border-2 border-white text-white font-mono text-sm
                         uppercase p-3 focus:outline-none focus:border-secondary transition-colors"
              rows={3}
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <p className="font-mono text-sm text-white/80 uppercase leading-relaxed">{bio}</p>
          )}
        </div>

        {/* ─── Actions ──────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleShareId}
            className="brutalist-button flex flex-col items-center justify-center gap-2 py-5"
          >
            {copied
              ? <Check className="w-6 h-6" />
              : <Share2 className="w-6 h-6" />}
            <span className="text-[10px] font-black">
              {copied ? 'COPIED_!' : 'SHARE_ID'}
            </span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('ucw_current_user');
              router.push('/login');
            }}
            className="border-2 border-secondary bg-black text-secondary font-bold uppercase
                       tracking-widest flex flex-col items-center justify-center gap-2 py-5
                       hover:bg-secondary hover:text-black transition-all
                       shadow-[4px_4px_0px_0px_rgba(255,0,60,1)]
                       hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-black">TERMINATE</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSection;
