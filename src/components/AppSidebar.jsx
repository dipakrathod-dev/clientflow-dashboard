import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Clients', path: '/clients' },
  { name: 'Projects', path: '/projects' },
  { name: 'Invoices', path: '/invoices' },
  { name: 'Settings', path: '/settings' },
];

export default function SideBar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="text-xl font-bold text-white mb-8 px-4 flex items-center gap-2">
          <span className="p-1.5 bg-violet-600 rounded-lg text-xs">⚡</span> SaaS Pro
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-slate-800/80 text-violet-400 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                  )}
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}