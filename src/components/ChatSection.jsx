'use client';

import React, { useState, useEffect } from 'react';
import { Send, Phone, Video, Info, MessageSquareDashed, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const ChatSection = () => {
  const router = useRouter();
  const [connections, setConnections] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msgInput, setMsgInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    fetchAcceptedConnections();
  }, []);

  const fetchAcceptedConnections = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('ucw_access_token') : null;
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/connections/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setConnections(data);
        if (data.length > 0) {
          setActiveChat(data[0]);
          setChatHistory([
            { id: 1, sender: 'other', text: `ENCRYPTED SESSION INITIALIZED WITH @${data[0].other_username}`, time: 'SYSTEM' }
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to load connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (conn) => {
    setActiveChat(conn);
    setChatHistory([
      { id: Date.now(), sender: 'other', text: `ENCRYPTED SESSION INITIALIZED WITH @${conn.other_username}`, time: 'SYSTEM' }
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { id: Date.now(), sender: 'me', text: msgInput.toUpperCase(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setMsgInput('');
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center font-mono text-white text-xs">
        LOADING_ENCRYPTED_COMMS_CHANNELS...
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="brutalist-panel p-8 max-w-md w-full bg-black border-2 border-white space-y-4">
          <MessageSquareDashed className="w-12 h-12 text-white/40 mx-auto" />
          <h2 className="font-mono text-lg font-bold text-white uppercase">NO_ACTIVE_CHATS</h2>
          <p className="font-mono text-xs text-white/60 uppercase leading-relaxed">
            Search for registered operators, send connection requests, and once accepted your chat channel will initialize here.
          </p>
          <button
            onClick={() => router.push('/')}
            className="brutalist-button py-3 px-6 w-full font-mono text-xs uppercase flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Search & Connect Operators
          </button>
        </div>
      </div>
    );
  }

  const formatAvatarUrl = (url) => {
    if (!url || url === 'skipped') return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 pb-24 px-4 overflow-hidden">

      {/* ─── Active Connections Bar ─────────────────────────────── */}
      <div className="mb-5">
        <h3 className="text-white font-black mb-3 ml-1 uppercase tracking-widest text-xs font-mono border-b border-white/20 pb-2">
          &gt; CONNECTED_CHANNELS ({connections.length})
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
          {connections.map((conn) => {
            const active = activeChat?.connection_id === conn.connection_id;
            const displayName = conn.other_display_name || conn.other_username;
            const initials = conn.other_username.substring(0, 2).toUpperCase();
            const avatarUrl = formatAvatarUrl(conn.other_profile_photo);

            return (
              <button
                key={conn.connection_id}
                onClick={() => handleSelectChat(conn)}
                className={`shrink-0 w-[95px] border-2 p-2 transition-all text-left cursor-pointer
                            ${active
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white/30 hover:border-white'}`}
              >
                {/* Avatar / Initials block */}
                <div className={`w-full h-10 flex items-center justify-center font-black font-mono text-lg overflow-hidden
                                 ${active ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-mono font-bold uppercase truncate">{displayName}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main Chat ───────────────────────────────────── */}
      {activeChat && (
        <div className="flex-1 brutalist-panel flex flex-col overflow-hidden min-h-0">

          {/* Chat Header */}
          <div className="px-4 py-3 border-b-2 border-white flex justify-between items-center bg-black shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black font-mono text-sm overflow-hidden border border-white">
                {formatAvatarUrl(activeChat.other_profile_photo) ? (
                  <img src={formatAvatarUrl(activeChat.other_profile_photo)} alt={activeChat.other_username} className="w-full h-full object-cover" />
                ) : (
                  activeChat.other_username.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-white font-black tracking-widest text-sm">
                  {activeChat.other_display_name || activeChat.other_username}
                </h4>
                <p className="text-[10px] font-mono text-emerald-400 uppercase">
                  STATUS: CONNECTED (@{activeChat.other_username})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/60">
              <Phone className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
              <Video className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
              <Info className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-3 bg-black">
            {chatHistory.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] border-2 p-3
                                   ${isMe
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white border-white'}`}>
                    <p className="font-mono text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-2 font-mono font-bold border-t pt-1
                                   ${isMe ? 'border-black/20 text-black/50' : 'border-white/20 text-white/40'}`}>
                      TS:&nbsp;{msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-3 bg-black border-t-2 border-white shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="> INPUT_MESSAGE_"
                className="flex-1 bg-black border-2 border-white px-4 py-3 text-white font-mono
                           text-sm placeholder-white/25 focus:outline-none focus:border-emerald-400
                           uppercase transition-colors"
              />
              <button type="submit" className="brutalist-button px-4">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
