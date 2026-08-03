import React from 'react';

const SearchBar = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search clients..."
        className="w-full pl-10 pr-4 py-2 bg-slate-900 text-slate-200 placeholder-slate-400 rounded-lg border border-slate-800 focus:outline-none focus:border-purple-500 text-sm transition-colors"
      />
    </div>
  );
};

export default SearchBar;