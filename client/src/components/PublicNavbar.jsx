import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../firebase/AuthContext';
import { cn } from '../utils/cn';

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const location = useLocation();
  const { currentUser, logout } = useAuth();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleTheme = () => setIsDark(d => !d);

  const navLinks = [
    { name: 'Home',      path: '/' },
    { name: 'Features',  path: '/features' },
    { name: 'About Us',  path: '/about' },
    { name: 'Dashboard', path: currentUser ? '/user' : '/login' },
  ];

  return (
    <>
      {/* ─── Top navigation bar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
                <Shield size={22} />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-outfit text-slate-900 dark:text-white">SafeLink</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none hidden sm:block">Smart City Safety</p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'relative text-sm font-bold transition-colors py-1',
                      isActive ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    Hi, {currentUser.isAnonymous ? 'Anonymous' : (currentUser.displayName || currentUser.email?.split('@')[0] || 'User')}
                  </span>
                  <button
                    onClick={logout}
                    className="px-6 py-2.5 border-2 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-4 py-2 rounded-xl transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile — theme + hamburger */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(o => !o)}
                className="p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={22} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ─── Mobile drawer — rendered OUTSIDE <nav> so it is never clipped ─── */}

      {/* Semi-transparent backdrop */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Side drawer panel */}
      <div
        className={cn(
          'lg:hidden fixed top-0 right-0 bottom-0 w-4/5 max-w-[300px] z-[60]',
          'bg-white dark:bg-slate-900 shadow-2xl flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Shield size={18} />
            </div>
            <span className="font-outfit font-bold text-slate-900 dark:text-white text-lg">SafeLink</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center px-4 py-3.5 rounded-xl text-[15px] font-bold transition-colors',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="px-4 pb-8 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {currentUser ? (
            <>
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Signed in as</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {currentUser.isAnonymous ? 'Anonymous' : (currentUser.displayName || currentUser.email?.split('@')[0] || 'User')}
                </p>
              </div>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full py-3 text-center bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-center font-bold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-indigo-900/40 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-center font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicNavbar;
