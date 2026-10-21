import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Clients', path: '/clients' },
  { name: 'Projects', path: '/projects' },
  { name: 'Invoices', path: '/invoices' },
  { name: 'Settings', path: '/settings' },
];

export default function SideBar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          aria-controls="primary-navigation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}
      <aside aria-label="Application navigation" className={`fixed inset-y-0 left-0 z-40 flex min-h-screen flex-col justify-between border-r border-slate-800 bg-slate-900 p-4 transition-all duration-300 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div>
        <div className={`mb-8 flex items-center gap-2 text-xl font-bold text-white ${isCollapsed ? 'lg:justify-center lg:px-0' : 'px-4'}`}>
          <span className="rounded-lg bg-violet-600 p-1.5 text-xs">⚡</span>
          <span className={isCollapsed ? 'lg:hidden' : ''}>SaaS Pro</span>
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-expanded={!isCollapsed}
            aria-controls="primary-navigation"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto hidden rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:block"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav id="primary-navigation" aria-label="Primary" className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? item.name : undefined}
              aria-label={isCollapsed ? item.name : undefined}
              className={({ isActive }) => `
                relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
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
                  <span className={isCollapsed ? 'lg:hidden' : ''}>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      </aside>
    </>
  );
}
