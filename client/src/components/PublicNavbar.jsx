import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { cn } from '../utils/cn';

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <div>
              <span className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">SafeLink</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Smart City Safety</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1">Home</Link>
            <Link to="/features" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">Features</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">About Us</Link>
            <Link to={currentUser ? "/user" : "/login"} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">Dashboard</Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Hi, {currentUser.email.split('@')[0]}</span>
                <button 
                  onClick={logout}
                  className="px-6 py-2.5 border-2 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-4 py-2 rounded-xl transition-colors">Login</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 rounded-xl">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-400">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-20 z-40 bg-white dark:bg-slate-900 transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 space-y-4">
          <Link to="/" className="block text-lg font-bold text-indigo-600">Home</Link>
          <Link to="/features" className="block text-lg font-semibold text-slate-600 dark:text-slate-400">Features</Link>
          <Link to="/about" className="block text-lg font-semibold text-slate-600 dark:text-slate-400">About</Link>
          <Link to={currentUser ? "/user" : "/login"} className="block text-lg font-semibold text-slate-600 dark:text-slate-400">Dashboard</Link>
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {currentUser ? (
              <button onClick={logout} className="w-full py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold rounded-xl uppercase tracking-widest text-xs">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block w-full py-3 text-center text-indigo-600 font-bold border-2 border-indigo-50 rounded-xl">Login</Link>
                <Link to="/signup" className="block w-full py-3 text-center bg-indigo-600 text-white font-bold rounded-xl">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
