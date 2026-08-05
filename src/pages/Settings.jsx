import React, { useState } from 'react';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Dipak Rathod',
    role: 'Frontend Developer',
    email: 'dipakrathod.work@email.com',
    phone: '+91 8408090375',
    avatar: 'https://i.pravatar.cc/300?img=12'
  });

  const [account, setAccount] = useState({
    password: '••••••••••••',
    email: 'dipakrathod.work@email.com',
    phone: '+91 8408090375'
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    emailUpdates: false,
    autoSave: true
  });

  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [isSaved, setIsSaved] = useState(false);

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 animate-fade-in text-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800/80 pb-4">
          <span className="text-xl">👤</span>
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={profile.avatar}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-2 border-violet-500/50 object-cover shadow-md"
          />
          <div className="flex-1 text-center sm:text-left space-y-2 w-full">
            <h3 className="text-xl font-bold text-white">{profile.name}</h3>
            <p className="text-sm font-medium text-violet-400">{profile.role}</p>
            <p className="text-sm text-slate-400">{profile.email}</p>
            <div className="pt-2">
              <button className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all duration-200">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800/80 pb-4">
          <span className="text-xl">🔒</span>
          <h2 className="text-lg font-semibold">Account Settings</h2>
        </div>
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/50">
            <div>
              <p className="text-sm font-medium text-slate-200">Password</p>
              <p className="text-xs text-slate-400 mt-0.5">{account.password}</p>
            </div>
            <button className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all duration-200 self-start sm:self-auto">
              Change Password
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/50">
            <div>
              <p className="text-sm font-medium text-slate-200">Email Address</p>
              <p className="text-xs text-slate-400 mt-0.5">{account.email}</p>
            </div>
            <button className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all duration-200 self-start sm:self-auto">
              Update Email
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-200">Phone Number</p>
              <p className="text-xs text-slate-400 mt-0.5">{account.phone}</p>
            </div>
            <button className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all duration-200 self-start sm:self-auto">
              Update Number
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800/80 pb-4">
          <span className="text-xl">⚙️</span>
          <h2 className="text-lg font-semibold">Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-base">🌙</span>
              <span className="text-sm font-medium text-slate-200">Dark Mode</span>
            </div>
            <button
              onClick={() => togglePreference('darkMode')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                preferences.darkMode ? 'bg-violet-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-base">🔔</span>
              <span className="text-sm font-medium text-slate-200">Notifications</span>
            </div>
            <button
              onClick={() => togglePreference('notifications')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                preferences.notifications ? 'bg-violet-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-base">📧</span>
              <span className="text-sm font-medium text-slate-200">Email Updates</span>
            </div>
            <button
              onClick={() => togglePreference('emailUpdates')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                preferences.emailUpdates ? 'bg-violet-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-base">💼</span>
              <span className="text-sm font-medium text-slate-200">Auto Save</span>
            </div>
            <button
              onClick={() => togglePreference('autoSave')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                preferences.autoSave ? 'bg-violet-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800/80 pb-4">
          <span className="text-xl">🎨</span>
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedTheme('Dark')}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
              selectedTheme === 'Dark'
                ? 'bg-violet-600/10 border-violet-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}
          >
            <span className="text-lg">🌙</span>
            <span className="text-xs font-semibold">Dark</span>
          </button>

          <button
            disabled
            className="p-4 rounded-xl border bg-slate-800/20 border-slate-800 text-slate-600 cursor-not-allowed flex flex-col items-center justify-center gap-2"
          >
            <span className="text-lg opacity-50">☀️</span>
            <span className="text-xs font-semibold">Light</span>
          </button>

          <button
            disabled
            className="p-4 rounded-xl border bg-slate-800/20 border-slate-800 text-slate-600 cursor-not-allowed flex flex-col items-center justify-center gap-2"
          >
            <span className="text-lg opacity-50">💻</span>
            <span className="text-xs font-semibold">System</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-red-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800/80 pb-4">
          <span className="text-xl">⚠️</span>
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button className="px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 rounded-xl transition-all duration-200">
            Delete Account
          </button>
          <button className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all duration-200">
            Sign Out
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`w-full py-3.5 px-6 font-semibold text-sm rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-emerald-600 text-white border border-emerald-500 shadow-emerald-600/20'
              : 'bg-violet-600 hover:bg-violet-500 text-white hover:scale-[1.01] hover:shadow-violet-500/25 border border-violet-500/50'
          }`}
        >
          {isSaved ? (
            <>
              <span>✅</span> Changes Saved Successfully
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}