import React, { useState } from 'react';
import { Search, Bell, Menu, Sun, Moon, User, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

const Topbar = ({ onMenuClick, isDark, toggleTheme, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 lg:hidden text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search data, incidents, or maps..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4 ml-auto">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 mx-2 hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            <div 
              className="flex items-center gap-3 pl-2 cursor-pointer group"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {user?.role || 'Citizen'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
                {user?.name?.[0] || <User size={20} />}
              </div>
              <ChevronDown size={14} className={cn("text-slate-400 group-hover:text-slate-600 transition-transform", showUserMenu && "rotate-180")} />
            </div>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                  <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <User size={16} /> Profile Settings
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
