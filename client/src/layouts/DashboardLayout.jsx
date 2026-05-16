import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../firebase/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Mock role determination - in real app would come from user profile/claims
  const role = currentUser?.email?.includes('admin') ? 'admin' : 
               currentUser?.email?.includes('police') ? 'police' :
               currentUser?.email?.includes('volunteer') ? 'volunteer' :
               currentUser?.email?.includes('hospital') ? 'hospital' : 'citizen';

  const user = {
    name: currentUser?.email?.split('@')[0] || 'Guest User',
    role: role.charAt(0).toUpperCase() + role.slice(1)
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar 
        role={role} 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={handleLogout}
      />
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar 
          onMenuClick={() => setSidebarOpen(true)} 
          isDark={isDark} 
          toggleTheme={toggleTheme}
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
        
        <footer className="p-4 lg:p-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            &copy; 2026 SafeLink Platform. Powered by Predictive Intelligence.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
