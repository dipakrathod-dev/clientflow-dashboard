import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfileDropdown({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-40 p-1.5 space-y-1 animate-in fade-in duration-150">
        <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Rohan Dev</p>
          <p className="text-xs text-slate-400">rohan@example.com</p>
        </div>

        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <User size={16} /> Profile
        </Link>

        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Settings size={16} /> Settings
        </Link>

        <button
          onClick={() => {
            alert('Logged out!');
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );
}