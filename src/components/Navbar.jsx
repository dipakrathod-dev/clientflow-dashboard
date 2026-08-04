import React from 'react';

export default function Navbar() {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md">
      <div className="text-slate-400 text-sm font-medium">Dashboard</div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
        </button>

        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-semibold text-white text-xs ring-2 ring-violet-500/30">
          US
        </div>
      </div>
    </header>
  );
}