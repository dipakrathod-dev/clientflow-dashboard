import React from 'react';
import ActionButton from './ActionButton';

const ClientCard = ({ client }) => {
  const statusColors = {
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Completed: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={client.avatar} 
            alt={client.name} 
            className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow-inner" 
          />
          <div>
            <h3 className="text-base font-semibold text-slate-100">{client.name}</h3>
            <p className="text-xs text-slate-400">{client.service}</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[client.status] || "bg-slate-800 text-slate-300"}`}>
          {client.status}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 block">Budget</span>
          <span className="text-sm font-semibold text-slate-200">${client.budget.toLocaleString()}</span>
        </div>

        <div className="flex items-center space-x-2">
          <ActionButton text="Edit" variant="secondary" />
          <ActionButton text="Delete" variant="danger" />
        </div>
      </div>
    </div>
  );
};

export default ClientCard;