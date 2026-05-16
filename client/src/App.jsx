import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Features from './pages/Features';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import './index.css';

function Navbar({ toggleTheme, isDark }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold font-outfit text-[#1E293B] dark:text-white">SafeLinks</span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Smart City. Safe City.</p>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/about" className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">About Us</Link>
          <Link to="/features" className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">Features</Link>
          <a href="#" className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">How It Works</a>
          <Link to={currentUser ? "/user" : "/login"} className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">Dashboard</Link>
          <a href="#" className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-600 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 hidden md:inline">Hi, {currentUser.email.split('@')[0]}</span>
              <button 
                onClick={handleLogout}
                className="px-6 py-2 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">Login</Link>
              <Link to="/signup" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    return false;
  });

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
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-bg-main dark:bg-dark-bg-main transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/about" element={
              <>
                <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                <AboutUs />
              </>
            } />
            <Route path="/features" element={
              <>
                <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                <Features />
              </>
            } />
            <Route path="/" element={
              <>
                <Navbar toggleTheme={toggleTheme} isDark={isDark} />
                <HomePage />
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
