import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertCircle, MessageSquare,
  MapPin, Zap, TrendingUp, Users, Heart
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
  const { currentUser } = useAuth();
  const { notifications } = useSocket();
  const navigate = useNavigate();

  const crimeNotifications = notifications.filter(n => n.type === 'CRIME');
  const safetyScore = Math.max(0, (10 - (crimeNotifications.length * 0.5)).toFixed(1));
  const safetyStatus = safetyScore > 8 ? 'Stable' : safetyScore > 5 ? 'Warning' : 'Critical';
  const safetyColor = safetyScore > 8 ? 'text-emerald-500' : safetyScore > 5 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
          Good Morning, {currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Citizen')}
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
        <div className="bg-rose-50 dark:bg-rose-900/10 border-y border-rose-100 dark:border-rose-900/30 py-2 -mx-6 px-6 overflow-hidden flex items-center gap-4">
          <span className="flex-shrink-0 flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-tighter bg-rose-100 px-2 py-0.5 rounded">
            <Zap size={12} className="fill-rose-600" />
            Live Ticker
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Safe Routes"
          value="12 Available"
          icon={ShieldCheck}
          trend="8%"
          description="Based on real-time crime data"
        />
        <StatCard
          title="Active Alerts"
          value={notifications.length.toString().padStart(2, '0')}
          icon={AlertCircle}
          trend="Live"
          trendType={notifications.length > 5 ? "up" : "down"}
          description="Detected in real-time"
        />
        <StatCard
          title="Civic Reports"
          value="48"
          icon={MessageSquare}
          trend="15%"
          description="Issues resolved in your ward"
        />
        <StatCard
          title="SOS Contacts"
          value="05"
          icon={Users}
          description="Verified emergency contacts"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          {/* Chart Section */}
          <ChartCard title="Weekly Safety Trends" subtitle="Crime vs Accident frequency in your city">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="accidents" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAccidents)" />
                <Area type="monotone" dataKey="crime" stroke="#f43f5e" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
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
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white">Personal Safety Guide</h3>
              <button
                onClick={() => navigate('/user/tips')}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
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
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-default"
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
                  />
                  <AlertCard
                    title="Fire Outbreak"
                    type="Building fire reported"
                    location="Kothrud, Pune"
                    time="25 mins ago"
                    severity="high"
                  />
                </>
              )}
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
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
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
                Learn More
              </button>
            </div>
            <ShieldCheck size={120} className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );

};

export default CitizenDashboard;
