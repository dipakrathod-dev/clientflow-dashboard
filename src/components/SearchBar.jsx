import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      {/* Point 6: Magnifying Glass Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search clients, projects..."
        className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 
                   outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
      />
    </div>
  );
}