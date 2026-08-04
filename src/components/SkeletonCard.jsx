import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 animate-pulse flex flex-col justify-between h-44">
      <div className="flex justify-between items-start">
        <div className="space-y-2.5">
          <div className="h-5 w-36 bg-slate-800 rounded-md"></div>
          <div className="h-4 w-24 bg-slate-800/60 rounded-md"></div>
        </div>
        <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-800/60">
        <div className="h-5 w-20 bg-slate-800 rounded-md"></div>
        <div className="h-7 w-16 bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  );
}