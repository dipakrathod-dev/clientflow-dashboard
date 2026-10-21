import React from 'react';
import { Bell, MessageSquare, DollarSign, UserPlus } from 'lucide-react';
import { notificationsData } from '../data/mockdata';

export default function NotificationDropdown({ isOpen, onClose }) {
  if (!isOpen) return null;

  const getIcon = (title) => {
    if (title.includes('Client')) return <UserPlus size={16} className="text-blue-400" />;
    if (title.includes('Invoice')) return <DollarSign size={16} className="text-green-400" />;
    return <MessageSquare size={16} className="text-purple-400" />;
  };

  return (
    <>
      <button type="button" aria-label="Close notifications" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
      <div id="notifications-panel" role="dialog" aria-labelledby="notifications-heading" className="absolute right-0 z-40 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-800 dark:bg-slate-900 sm:w-96">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 id="notifications-heading" className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bell aria-hidden="true" size={18} /> Notifications
          </h3>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
            Demo
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800" role="list">
          {notificationsData.map((n) => (
            <div key={n.id} role="listitem" className="flex items-start gap-3 p-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                <span aria-hidden="true">{getIcon(n.title)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
