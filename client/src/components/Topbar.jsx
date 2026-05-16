import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Sun, Moon, User, ChevronDown, LogOut, ShieldAlert, Heart, Flame, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../firebase/AuthContext';
import { subscribeToUserNotifications, markNotificationRead } from '../services/firestoreService';

const Topbar = ({ onMenuClick, isDark, toggleTheme, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications: socketNotifications } = useSocket();
  const { currentUser } = useAuth();
  const [firestoreNotifs, setFirestoreNotifs] = useState([]);

  // Subscribe to Firestore notifications for this user
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = subscribeToUserNotifications(currentUser.uid, setFirestoreNotifs);
    return () => unsub();
  }, [currentUser?.uid]);

  // Merge notifications: Firestore (persistent) + Socket.IO (ephemeral)
  const allNotifications = [
    ...firestoreNotifs.map(n => ({
      id: n.id,
      type: n.type || 'ALERT',
      message: n.message || n.title || 'New notification',
      title: n.title,
      time: n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      read: n.read,
      source: 'firestore',
      firestoreId: n.id,
    })),
    ...socketNotifications.slice(0, 5).map(n => ({
      ...n,
      source: 'socket',
    }))
  ];

  const unreadCount = firestoreNotifs.filter(n => !n.read).length + socketNotifications.length;

  const handleMarkRead = async (notif) => {
    if (notif.source === 'firestore' && !notif.read) {
      try {
        await markNotificationRead(notif.firestoreId);
      } catch (err) {
        console.error('Mark read error:', err);
      }
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'CRIME': return <ShieldAlert size={14} />;
      case 'MEDICAL': return <Heart size={14} />;
      case 'FIRE': return <Flame size={14} />;
      case 'emergency': return <AlertTriangle size={14} />;
      default: return <Bell size={14} />;
    }
  };

  const getNotifColor = (type) => {
    switch (type) {
      case 'CRIME': return 'bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400';
      case 'MEDICAL': return 'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400';
      case 'FIRE': return 'bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400';
      case 'emergency': return 'bg-amber-100 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400';
    }
  };

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
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Notifications</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Socket.IO + Firestore real-time</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {firestoreNotifs.length > 0 && (
                        <span className="text-[9px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{firestoreNotifs.length} stored</span>
                      )}
                      <span className="text-[9px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 px-2 py-0.5 rounded-full font-bold animate-pulse">Live</span>
                    </div>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                    {allNotifications.length > 0 ? (
                      allNotifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => handleMarkRead(n)}
                          className={cn(
                            "p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer",
                            !n.read && n.source === 'firestore' && "bg-indigo-50/30 dark:bg-indigo-900/10"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                              getNotifColor(n.type)
                            )}>
                              {getNotifIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{n.message || n.title}</p>
                                {!n.read && n.source === 'firestore' && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] text-slate-400 font-medium">{n.time}</p>
                                <span className={cn(
                                  "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded",
                                  n.source === 'firestore' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                )}>
                                  {n.source === 'firestore' ? 'DB' : 'LIVE'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <Bell size={24} className="mx-auto mb-2 text-slate-200" />
                        <p className="text-xs font-medium">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="w-full py-3 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800 uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>

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
