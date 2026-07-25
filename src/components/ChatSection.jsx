'use client';

import React, { useState } from 'react';
import { Send, Phone, Video, Info } from 'lucide-react';

const MOCK_UNREAD = [
  { id: 1, name: 'Hemant VS', count: 3, initials: 'HV' },
  { id: 2, name: 'DHISHA', count: 1, initials: 'DH' },
  { id: 3, name: 'HARINI', count: 5, initials: 'HR' },
  { id: 5, name: 'SANJAY', count: 1, initials: 'SJ' },
];

const MOCK_CHAT_HISTORY = [
  { id: 1, sender: 'other', text: 'HARINI PATHUPAAA', time: '10:30:00' },
  { id: 2, sender: 'me', text: 'EDHU PAAA', time: '10:32:15' },
  { id: 3, sender: 'other', text: 'BACKEND SOLREN', time: '10:33:42' },
  { id: 4, sender: 'other', text: 'APO SANJAY?', time: '10:34:18' },
];

const ChatSection = () => {
  const [activeChat, setActiveChat] = useState(MOCK_UNREAD[0]);
  const [msgInput, setMsgInput] = useState('');
  const [chatHistory, setChatHistory] = useState(MOCK_CHAT_HISTORY);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setChatHistory([
      ...chatHistory,
      { id: Date.now(), sender: 'me', text: msgInput.toUpperCase(), time: 'NOW' },
    ]);
    setMsgInput('');
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 pb-24 px-4 overflow-hidden">

      {/* ─── Unread Slideshow ─────────────────────────────── */}
      <div className="mb-5">
        <h3 className="text-white font-black mb-3 ml-1 uppercase tracking-widest text-xs font-mono border-b border-white/20 pb-2">
          &gt; PENDING_COMMS
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
          {MOCK_UNREAD.map((user) => {
            const active = activeChat.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={`shrink-0 w-[90px] border-2 p-2 transition-all text-left
                            ${active
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white/30 hover:border-white'}`}
              >
                {/* Initials block */}
                <div className={`w-full h-10 flex items-center justify-center font-black font-mono text-xl
                                 ${active ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  {user.initials}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-mono font-bold uppercase truncate">{user.name}</span>
                  <span className={`text-[10px] font-bold px-1 ml-1 shrink-0
                                    ${active ? 'bg-secondary text-white' : 'bg-secondary text-white'}`}>
                    {user.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main Chat ───────────────────────────────────── */}
      <div className="flex-1 brutalist-panel flex flex-col overflow-hidden min-h-0">

        {/* Chat Header */}
        <div className="px-4 py-3 border-b-2 border-white flex justify-between items-center bg-black shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black font-mono text-sm">
              {activeChat.initials}
            </div>
            <div>
              <h4 className="text-white font-black tracking-widest text-sm">{activeChat.name}</h4>
              <p className="text-[10px] font-mono text-secondary uppercase">STATUS: CONNECTED</p>
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
                         text-sm placeholder-white/25 focus:outline-none focus:border-secondary
                         uppercase transition-colors"
            />
            <button type="submit" className="brutalist-button px-4">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
