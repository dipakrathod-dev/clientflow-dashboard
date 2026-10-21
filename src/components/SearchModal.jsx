import React, { useEffect, useId, useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { searchItemsData } from '../data/mockdata';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm" />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="text-slate-400 shrink-0" size={20} />
          <h2 id={titleId} className="sr-only">Search ClientFlow</h2>
          <input
            id="global-search"
            name="global-search"
            type="text"
            aria-label="Search clients, projects, and invoices"
            placeholder="Search Clients, Projects, Invoices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
            autoFocus
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto space-y-4" aria-live="polite">
          {searchItemsData.map((group) => {
            const filtered = group.items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
            if (filtered.length === 0) return null;

            return (
              <div key={group.type}>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group.type}</h4>
                <div className="space-y-1">
                  {filtered.map((item, idx) => (
                    <button
                      type="button"
                      key={idx} 
                      onClick={onClose}
                      className="flex w-full items-center justify-between rounded-xl p-2.5 text-left text-sm text-slate-700 transition hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                    >
                      <span>{item}</span>
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {!searchItemsData.some((group) => group.items.some((item) => item.toLowerCase().includes(query.toLowerCase()))) && (
            <p className="py-6 text-center text-sm text-slate-400">No matching results.</p>
          )}
        </div>
      </div>
    </div>
  );
}
