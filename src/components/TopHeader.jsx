import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';
import { useAuth } from '../hooks/useAuth';

export default function TopHeader({ onOpenMobile, isDarkMode, setIsDarkMode, onOpenSearch }) {
  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between">
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation"
          aria-controls="primary-navigation"
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Open search"
          aria-haspopup="dialog"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition text-sm w-44 sm:w-64"
        >
            <Search aria-hidden="true" size={18} />
          <span>Search...</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {currentDate}
        </span>

        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
            {isDarkMode ? <Sun aria-hidden="true" size={20} className="text-amber-400" /> : <Moon aria-hidden="true" size={20} />}
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            aria-controls="notifications-panel"
            aria-haspopup="dialog"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
          >
            <Bell aria-hidden="true" size={20} />
            <span aria-hidden="true" className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>
          <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Open account menu"
            aria-expanded={showProfile}
            aria-controls="profile-panel"
            aria-haspopup="menu"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={`${currentUser.displayName || 'Account'} profile`}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
            ) : (
                <span aria-hidden="true" className="w-8 h-8 rounded-lg bg-violet-600 text-white text-sm font-semibold grid place-items-center ring-2 ring-indigo-500/20">
                {(currentUser?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </button>
          <ProfileDropdown isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
      </div>
    </header>
  );
}
