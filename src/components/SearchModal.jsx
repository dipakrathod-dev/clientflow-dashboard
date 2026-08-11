import React, { useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { searchItemsData } from '../data/mockdata';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="text-slate-400 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Search Clients, Projects, Invoices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {searchItemsData.map((group) => {
            const filtered = group.items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
            if (filtered.length === 0) return null;

            return (
              <div key={group.type}>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group.type}</h4>
                <div className="space-y-1">
                  {filtered.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={onClose}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800/80 cursor-pointer text-slate-700 dark:text-slate-200 text-sm transition"
                    >
                      <span>{item}</span>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}