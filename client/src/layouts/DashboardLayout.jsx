import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../firebase/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { currentUser, userProfile, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isVolunteer, setIsVolunteer] = useState(false);
  
  useEffect(() => {
    if (!currentUser) return;
    const checkVolunteerStatus = async () => {
      try {
        const q = query(collection(db, 'volunteerRequests'), where('uid', '==', currentUser.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const volData = snap.docs[0].data();
          if (volData.status === 'approved') {
            setIsVolunteer(true);
          }
        }
      } catch (err) {
        console.error("Error fetching volunteer status:", err);
      }
    };
    checkVolunteerStatus();
  }, [currentUser]);
  
  // High Priority: Email Pattern (Trust official domains/keywords)
  const emailRole = 
    currentUser?.email?.includes('admin') ? 'admin' : 
    currentUser?.email?.includes('police') ? 'police' :
    currentUser?.email?.includes('volunteer') ? 'volunteer' :
    currentUser?.email?.includes('hospital') ? 'hospital' :
    currentUser?.email?.includes('fire') ? 'fire' : null;

  // Final Role: Email Pattern -> URL Path -> Firestore Profile -> Default
  const role = emailRole || (
    window.location.pathname.startsWith('/police') ? 'police' :
    window.location.pathname.startsWith('/admin') ? 'admin' :
    window.location.pathname.startsWith('/volunteer') ? 'volunteer' :
    window.location.pathname.startsWith('/hospital') ? 'hospital' :
    window.location.pathname.startsWith('/fire') ? 'fire' :
    userRole || 'citizen'
  );

  const user = {
    name: userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Guest User',
    role: role.charAt(0).toUpperCase() + role.slice(1),
    email: currentUser?.email || '',
    photoURL: userProfile?.photoURL || currentUser?.photoURL || ''
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
        isVolunteer={isVolunteer}
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={handleLogout}
      />
      

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
