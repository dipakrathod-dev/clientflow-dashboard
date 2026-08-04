import React from 'react';

export default function StateCard({ title = "Total Revenue", value = "₹90,000", change = "+12.5%" }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-violet-500/10 to-transparent border border-violet-500/20 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">{value}</h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          {change}
        </span>
      </div>

      <div className="mt-4 pt-2">
        <svg className="w-full h-10 text-violet-500 overflow-visible" viewBox="0 0 100 25" fill="none" stroke="currentColor">
          <path
            d="M0 20 Q 20 5, 40 18 T 80 8 T 100 2"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="drop-shadow-[0_2px_8px_rgba(139,92,246,0.5)]"
          />
        </svg>
      </div>
    </div>
  );
}