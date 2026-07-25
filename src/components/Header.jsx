'use client';

import React, { useState } from 'react';
import { Search, UserSquare2 } from 'lucide-react';

const Header = ({ username }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="px-4 py-3 mx-4 mt-4 z-20 flex items-center justify-between gap-4 brutalist-panel">
      {/* User ID */}
      <div className="flex items-center gap-3 cursor-pointer group shrink-0">
        <div className="w-10 h-10 bg-white flex items-center justify-center group-hover:bg-secondary transition-colors">
          <UserSquare2 className="w-6 h-6 text-black" />
        </div>
        <div className="hidden sm:block">
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest">ID_</p>
          <p className="text-base text-white font-black uppercase tracking-tighter">
            {username}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md flex">
        <div className="bg-white border-2 border-white px-3 flex items-center justify-center shrink-0">
          <Search className="h-4 w-4 text-black" />
        </div>
        <input
          type="text"
          className="w-full px-3 py-2 bg-black border-2 border-l-0 border-white text-white
                     font-mono text-sm placeholder-white/25 focus:outline-none focus:bg-white/5
                     uppercase transition-colors"
          placeholder="SEARCH_ID_"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;
