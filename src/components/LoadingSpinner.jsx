import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}