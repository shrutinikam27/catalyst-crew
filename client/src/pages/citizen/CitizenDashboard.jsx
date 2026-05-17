import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, AlertCircle, MessageSquare,
  MapPin, Zap, TrendingUp, Users, Heart, X, Clock
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import AlertCard from '../../components/ui/AlertCard';
import ChartCard from '../../components/ui/ChartCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../firebase/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { subscribeToUserComplaints, subscribeToAlerts } from '../../services/firestoreService';

const data = [
  { name: 'Mon', accidents: 4, crime: 2 },
  { name: 'Tue', accidents: 3, crime: 5 },
  { name: 'Wed', accidents: 2, crime: 1 },
  { name: 'Thu', accidents: 6, crime: 3 },
  { name: 'Fri', accidents: 8, crime: 6 },
  { name: 'Sat', accidents: 5, crime: 4 },
  { name: 'Sun', accidents: 4, crime: 2 },
];

const CitizenDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { notifications, lastPulse } = useSocket();
  const navigate = useNavigate();

  // Real-time Firestore data
  const [myComplaints, setMyComplaints] = useState([]);
  const [firestoreAlerts, setFirestoreAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = subscribeToUserComplaints(currentUser.uid, setMyComplaints);
    return () => unsub();
  }, [currentUser?.uid]);

  useEffect(() => {
    const unsub = subscribeToAlerts(setFirestoreAlerts, 'citizen');
    return () => unsub();
  }, []);

  const resolvedCount = myComplaints.filter(c => c.status === 'resolved').length;
  const pendingCount = myComplaints.filter(c => c.status === 'pending').length;

  // Local state for live chart data to make it feel alive
  const [chartData, setChartData] = useState(data);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update chart data when a new pulse arrives
  useEffect(() => {
    if (lastPulse) {
      setChartData(prev => {
        const day = new Date().toLocaleDateString('en-US', { weekday: 'short' });
        return prev.map(d => {
          if (d.name === day) {
            return {
              ...d,
              crime: lastPulse.type === 'CRIME' ? d.crime + 1 : d.crime,
              accidents: ['FIRE', 'MEDICAL'].includes(lastPulse.type) ? d.accidents + 1 : d.accidents
            };
          }
          return d;
        });
      });
    }
  }, [lastPulse]);

  const crimeNotifications = notifications.filter(n => n.type === 'CRIME');
  const civicNotifications = notifications.filter(n => n.type === 'CIVIC');
  const emergencyNotifications = notifications.filter(n => ['FIRE', 'MEDICAL'].includes(n.type));

  const safetyScore = Math.max(0, (10 - (crimeNotifications.length * 0.2 + emergencyNotifications.length * 0.1)).toFixed(1));
  const safetyStatus = safetyScore > 8 ? 'Stable' : safetyScore > 5 ? 'Warning' : 'Critical';
  const safetyColor = safetyScore > 8 ? 'text-emerald-500' : safetyScore > 5 ? 'text-amber-500' : 'text-rose-500';

  // Dynamic Stats
  const safeRoutesCount = Math.max(0, 15 - crimeNotifications.length);
  const civicReportsCount = 40 + civicNotifications.length;
  const sosContactsCount = 5; // Usually static but could be dynamic if we had a contacts API

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
          Good Morning, {userProfile?.displayName || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Citizen')}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            The safety index in your current zone is <span className={cn("font-bold", safetyColor)}>{safetyStatus} ({safetyScore}/10)</span>.
          </p>
          {safetyScore < 7 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black uppercase rounded border border-rose-200 animate-pulse"
            >
              Crime Spike Detected
            </motion.div>
          )}
        </div>
      </div>



      {/* Live Crime Ticker */}
      {crimeNotifications.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-900/10 border-y border-rose-100 dark:border-rose-900/30 py-2 overflow-hidden flex items-center gap-4">
          <span className="flex-shrink-0 flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-tighter bg-rose-100 px-2 py-0.5 rounded">
            <Zap size={12} className="fill-rose-600" />
            Live
          </span>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <motion.div
              animate={{ x: [1000, -2000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-12"
            >
              {crimeNotifications.map((n, i) => (
                <span key={i} className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  {n.title} reported in {n.location} • {n.time}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Safe Routes"
          value={`${safeRoutesCount} Available`}
          icon={ShieldCheck}
          trend={`${((safeRoutesCount / 15) * 100).toFixed(0)}%`}
          trendType={safeRoutesCount > 10 ? "up" : "down"}
          description="Based on real-time crime data"
          onClick={() => navigate('/user/safety')}
        />
        <StatCard
          title="Active Alerts"
          value={notifications.length.toString().padStart(2, '0')}
          icon={AlertCircle}
          trend="Live"
          trendType={notifications.length > 5 ? "up" : "down"}
          description="Detected in real-time"
          isLive={true}
          onClick={() => setShowAllAlerts(true)}
        />
        <StatCard 
          title="My Reports" 
          value={myComplaints.length.toString().padStart(2, '0')} 
          icon={MessageSquare} 
          trend={myComplaints.length > 0 ? `${resolvedCount} resolved` : 'Syncing...'}
          description={myComplaints.length > 0 ? `${pendingCount} pending review` : 'Waiting for database index'}
          onClick={() => navigate('/user/tracking')}
        />
        <StatCard
          title="SOS Contacts"
          value={sosContactsCount.toString().padStart(2, '0')}
          icon={Users}
          description="Verified emergency contacts"
          onClick={() => navigate('/user/sos')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
        <div className="space-y-8">
          {/* Chart Section */}
          <ChartCard title="Weekly Safety Trends" subtitle="Crime vs Accident frequency in your city">
            <div className="h-[250px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCrime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                    <Area type="monotone" dataKey="accidents" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAccidents)" />
                    <Area type="monotone" dataKey="crime" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCrime)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Report Crime', icon: ShieldCheck, color: 'bg-rose-500', path: '/user/report' },
              { name: 'Civic Issue', icon: MessageSquare, color: 'bg-indigo-500', path: '/user/report' },
              { name: 'SOS Help', icon: Zap, color: 'bg-amber-500', path: '/user/sos' },
              { name: 'Safe Path', icon: MapPin, color: 'bg-emerald-500', path: '/user/safety' },
            ].map((action) => (
              <button
                key={action.name}
                onClick={() => navigate(action.path)}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group text-center"
              >
                <div className={cn("w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg", action.color)}>
                  <action.icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                  {action.name}
                </span>
              </button>
            ))}
          </div>

          {/* Safety Tips Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white">Personal Safety Guide</h3>
              <button
                onClick={() => navigate('/user/tips')}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all shrink-0"
              >
                View Handbook
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Emergency Readiness",
                  desc: "Keep a list of local emergency numbers and nearby safe zones saved on your device.",
                  icon: Zap,
                  color: "text-amber-500",
                  bg: "bg-amber-50 dark:bg-amber-900/10"
                },
                {
                  title: "Digital Security",
                  desc: "Avoid sharing your real-time location on public social media platforms.",
                  icon: ShieldCheck,
                  color: "text-emerald-500",
                  bg: "bg-emerald-50 dark:bg-emerald-900/10"
                },
                {
                  title: "Night Commute",
                  desc: "Always stick to well-lit main roads and use the 'Safe Path' feature for navigation.",
                  icon: MapPin,
                  color: "text-indigo-500",
                  bg: "bg-indigo-50 dark:bg-indigo-900/10"
                },
                {
                  title: "First Aid Basics",
                  desc: "Learn basic CPR and how to handle minor injuries until professional help arrives.",
                  icon: Heart,
                  color: "text-rose-500",
                  bg: "bg-rose-50 dark:bg-rose-900/10"
                }
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate('/user/tips')}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", tip.bg)}>
                    <tip.icon size={20} className={tip.color} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">{tip.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {tip.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8">
          {/* Nearby Alerts */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white mb-6">Nearby Alerts</h3>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 3).map((n) => (
                  <AlertCard
                    key={n.id}
                    title={n.message}
                    type={n.type}
                    location="Pune Sector"
                    time={n.time}
                    severity={n.severity || 'moderate'}
                    onClick={() => setSelectedAlert({
                      title: n.message,
                      type: n.type,
                      location: "Pune Sector",
                      time: n.time,
                      severity: n.severity || 'moderate'
                    })}
                  />
                ))
              ) : (
                <>
                  <AlertCard
                    title="Road Construction"
                    type="Heavy machinery on Baner Road"
                    location="Baner, Pune"
                    time="10 mins ago"
                    severity="moderate"
                    onClick={() => setSelectedAlert({
                      title: "Road Construction",
                      type: "Heavy machinery on Baner Road",
                      location: "Baner, Pune",
                      time: "10 mins ago",
                      severity: "moderate"
                    })}
                  />
                  <AlertCard
                    title="Fire Outbreak"
                    type="Building fire reported"
                    location="Kothrud, Pune"
                    time="25 mins ago"
                    severity="high"
                    onClick={() => setSelectedAlert({
                      title: "Fire Outbreak",
                      type: "Building fire reported",
                      location: "Kothrud, Pune",
                      time: "25 mins ago",
                      severity: "high"
                    })}
                  />
                </>
              )}
            </div>
            <button 
              onClick={() => setShowAllAlerts(true)}
              className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
            >
              View All Alerts
            </button>
          </div>

          {/* Safety Tip Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden group shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Heart size={24} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-bold font-outfit leading-tight">Safety Tip <br /> of the day</h3>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                "Keep your emergency contacts updated and always share your live location when traveling late at night."
              </p>
              <button 
                onClick={() => navigate('/user/tips')}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors active:scale-95"
              >
                Learn More
              </button>
            </div>
            <ShieldCheck size={120} className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Alert Detail Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlert(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Card Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={cn(
                "relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border overflow-hidden z-10",
                selectedAlert.severity === 'high' ? 'border-rose-100 dark:border-rose-900/30' :
                selectedAlert.severity === 'moderate' ? 'border-amber-100 dark:border-orange-900/30' : 'border-sky-100 dark:border-sky-900/30'
              )}
            >
              {/* Color accents */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-2 bg-gradient-to-r",
                selectedAlert.severity === 'high' ? 'from-rose-500 to-red-600' :
                selectedAlert.severity === 'moderate' ? 'from-amber-500 to-orange-600' : 'from-sky-500 to-indigo-600'
              )} />
              
              {/* Header */}
              <div className="flex justify-between items-start mt-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    selectedAlert.severity === 'high' ? 'bg-rose-600 shadow-rose-200 dark:shadow-none' :
                    selectedAlert.severity === 'moderate' ? 'bg-amber-500 shadow-amber-200 dark:shadow-none' : 'bg-sky-500 shadow-sky-200 dark:shadow-none'
                  )}>
                    <AlertCircle size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border",
                      selectedAlert.severity === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' :
                      selectedAlert.severity === 'moderate' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30' : 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30'
                    )}>
                      {selectedAlert.severity} severity
                    </span>
                    <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white mt-1 uppercase tracking-wide">
                      {selectedAlert.title}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Info Blocks */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-800 flex items-start gap-3">
                  <div className="text-indigo-500 mt-0.5"><MessageSquare size={16} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Details</h4>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {selectedAlert.type || selectedAlert.desc || 'No further description provided.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-800 flex items-center gap-3">
                    <div className="text-indigo-500"><MapPin size={16} /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</h4>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedAlert.location}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-800 flex items-center gap-3">
                    <div className="text-indigo-500"><Clock size={16} /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reported</h4>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedAlert.time}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Zap size={14} className="animate-pulse" /> Safety Action Plan
                  </h4>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedAlert.severity === 'high' 
                      ? 'High danger reported in this Pune sector. Please take alternative routes immediately, restrict outdoor movements, and strictly cooperate with Pune Police & Emergency response sirens.'
                      : 'Moderate delays or local hazard reported. Stay alert, slow down near the sector, and consult SafeLink smart routing map for optimized commute guidelines.'}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedAlert(null);
                    navigate('/user/safety');
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-[1.02] transition-all"
                >
                  Find Safe Route
                </button>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="px-6 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View All Alerts Modal */}
      <AnimatePresence>
        {showAllAlerts && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllAlerts(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white uppercase tracking-wide">
                    City Safety Bulletins
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Real-time alerts fetched across Pune sectors</p>
                </div>
                <button 
                  onClick={() => setShowAllAlerts(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable list of alerts */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {/* Active custom notifications */}
                {notifications.map((n) => (
                  <AlertCard
                    key={n.id}
                    title={n.message}
                    type={n.type}
                    location="Pune Sector"
                    time={n.time}
                    severity={n.severity || 'moderate'}
                    onClick={() => {
                      setSelectedAlert({
                        title: n.message,
                        type: n.type,
                        location: "Pune Sector",
                        time: n.time,
                        severity: n.severity || 'moderate'
                      });
                    }}
                  />
                ))}

                {/* Hardcoded system alerts */}
                <AlertCard
                  title="Road Construction"
                  type="Heavy machinery on Baner Road"
                  location="Baner, Pune"
                  time="10 mins ago"
                  severity="moderate"
                  onClick={() => {
                    setSelectedAlert({
                      title: "Road Construction",
                      type: "Heavy machinery on Baner Road",
                      location: "Baner, Pune",
                      time: "10 mins ago",
                      severity: "moderate"
                    });
                  }}
                />

                <AlertCard
                  title="Fire Outbreak"
                  type="Building fire reported"
                  location="Kothrud, Pune"
                  time="25 mins ago"
                  severity="high"
                  onClick={() => {
                    setSelectedAlert({
                      title: "Fire Outbreak",
                      type: "Building fire reported",
                      location: "Kothrud, Pune",
                      time: "25 mins ago",
                      severity: "high"
                    });
                  }}
                />

                <AlertCard
                  title="Sewer Gas Alert"
                  type="Hazmat ventilation operation near Hadapsar"
                  location="Hadapsar, Pune"
                  time="1 hour ago"
                  severity="low"
                  onClick={() => {
                    setSelectedAlert({
                      title: "Sewer Gas Alert",
                      type: "Hazmat ventilation operation near Hadapsar",
                      location: "Hadapsar, Pune",
                      time: "1 hour ago",
                      severity: "low"
                    });
                  }}
                />

                <AlertCard
                  title="Heavy Downpour Warning"
                  type="Waterlogging expected in low-lying zones"
                  location="Shivajinagar, Pune"
                  time="2 hours ago"
                  severity="moderate"
                  onClick={() => {
                    setSelectedAlert({
                      title: "Heavy Downpour Warning",
                      type: "Waterlogging expected in low-lying zones",
                      location: "Shivajinagar, Pune",
                      time: "2 hours ago",
                      severity: "moderate"
                    });
                  }}
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  onClick={() => setShowAllAlerts(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all"
                >
                  Close Feed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitizenDashboard;
