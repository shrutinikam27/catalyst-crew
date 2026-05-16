import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Bell, Activity, User,
  MapPin, Clock, Star, Zap,
  CheckCircle, MessageSquare, Heart,
  Shield, Navigation, Flame, AlertTriangle, Loader2
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { cn } from '../../utils/cn';
import { useAuth } from '../../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  subscribeToSosAlertsForVolunteer,
  acceptSosAlert,
  buildGoogleMapsUrl,
} from '../../firebase/sosService';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Inline type meta so we don't need a separate import
const TYPE_META = {
  Fire:     { color: 'bg-orange-500', label: 'Fire',     Icon: Flame },
  Crime:    { color: 'bg-blue-600',   label: 'Crime',    Icon: Shield },
  Medical:  { color: 'bg-rose-500',   label: 'Medical',  Icon: Heart },
  Accident: { color: 'bg-purple-600', label: 'Accident', Icon: AlertTriangle },
};

function formatTime(ts) {
  if (!ts) return 'Just now';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

import { useLocationContext } from '../../contexts/LocationContext';

const VolunteerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [expertise, setExpertise] = useState(null);
  
  const { location: contextLocation } = useLocationContext();
  const myLocation = contextLocation ? { latitude: contextLocation.latitude, longitude: contextLocation.longitude } : null;
  const [acceptingId, setAcceptingId] = useState(null);

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : (currentUser?.email ? currentUser.email[0].toUpperCase() : 'V');

  // Fetch expertise
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const q = query(collection(db, 'volunteerRequests'), where('uid', '==', currentUser.uid), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) setExpertise(snap.docs[0].data().expertise || []);
        else setExpertise(['firebrigade', 'medical', 'crime']);
      } catch { setExpertise(['firebrigade', 'medical', 'crime']); }
    })();
  }, [currentUser]);

  // Subscribe to alerts
  useEffect(() => {
    if (!expertise || expertise.length === 0) return;
    const allAlerts = {};
    const unsubs = expertise.map((tag) =>
      subscribeToSosAlertsForVolunteer(tag, (tagAlerts) => {
        tagAlerts.forEach((a) => { allAlerts[a.id] = a; });
        setAlerts(Object.values(allAlerts).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
      })
    );
    return () => unsubs.forEach(u => u());
  }, [expertise]);

  const handleAcceptAndNavigate = async (alert) => {
    setAcceptingId(alert.id);
    try {
      await acceptSosAlert(alert.id, currentUser.uid, currentUser.displayName || currentUser.email || 'Volunteer');
      const from = myLocation || { latitude: 18.5204, longitude: 73.8567 };
      const to = { latitude: alert.location.latitude, longitude: alert.location.longitude };
      window.open(buildGoogleMapsUrl(from, to), '_blank');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
              Volunteer Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              You are currently <span className="text-emerald-500 font-bold">Active &amp; Available</span> for response.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <StatCard title="Response Score" value="0/100" icon={Star} trend="0%" />
            <StatCard title="Missions" value="0" icon={CheckCircle} trend="0" />
            <StatCard title="People Helped" value="0" icon={Heart} trend="0" />
          </div>

          {/* Live SOS Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                <Zap size={20} className="text-amber-500" />
                Live SOS Alerts
                {alerts.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">
                    {alerts.length}
                  </span>
                )}
              </h3>
              <button
                onClick={() => navigate('/volunteer/alerts')}
                className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest"
              >
                View All →
              </button>
            </div>

            {expertise === null ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={28} className="text-indigo-500 animate-spin" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap size={24} className="text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">No Active Alerts</h4>
                <p className="text-xs text-slate-500">Live citizen SOS requests will appear here in real-time.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {alerts.slice(0, 3).map((alert) => {
                  const meta = TYPE_META[alert.emergencyType] || TYPE_META.Medical;
                  const Icon = meta.Icon;
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group"
                    >
                      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg', meta.color)}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{meta.label}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">
                          {alert.userName} · {formatTime(alert.createdAt)}
                        </p>
                        {alert.location && (
                          <p className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 mt-0.5">
                            <MapPin size={10} />
                            {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAcceptAndNavigate(alert)}
                        disabled={acceptingId === alert.id}
                        className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-1 disabled:opacity-60"
                      >
                        {acceptingId === alert.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <CheckCircle size={12} />
                        }
                        Respond
                      </button>
                    </motion.div>
                  );
                })}
                {alerts.length > 3 && (
                  <button
                    onClick={() => navigate('/volunteer/alerts')}
                    className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase tracking-widest"
                  >
                    +{alerts.length - 3} more alerts → View all
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Volunteer Status Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-emerald-100 dark:shadow-none">
                {initials}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-outfit font-bold text-slate-900 dark:text-white">
                {currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Volunteer')}
              </h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">Certified First Responder</p>
              {expertise && (
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {expertise.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[9px] font-black rounded-md uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-center gap-2">
              {['CERTIFIED', 'QUICK RESPONSE', 'TOP 1%'].map(badge => (
                <span key={badge} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-[8px] font-extrabold text-slate-500 dark:text-slate-400 rounded-md uppercase tracking-tighter">
                  {badge}
                </span>
              ))}
            </div>
            <button className="w-full py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all text-xs uppercase tracking-widest">
              Go Offline
            </button>
          </div>

          {/* Achievement Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden group shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-widest">
                <Star size={12} /> Next Level: Elite Responder
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                  <span className="text-lg font-outfit font-bold">0%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[0%] bg-amber-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">
                "Complete your first mission to start tracking progress."
              </p>
            </div>
            <Activity size={100} className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
