import React from 'react';

export default function ClientCard({ client, onDelete }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md 
                    transition-all duration-300 transform hover:-translate-y-1 
                    hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 
                    flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{client.name}</h3>
          <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            {client.status || 'Active'}
          </span>
        </div>
        <p className="text-sm text-slate-400">{client.company}</p>
      </div>

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-800">
        <span className="text-sm font-bold text-violet-400">₹{client.budget?.toLocaleString('en-IN')}</span>
        {onDelete && (
          <button 
            onClick={() => onDelete(client.id)} 
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}