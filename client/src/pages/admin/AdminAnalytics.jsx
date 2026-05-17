import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, TrendingUp, TrendingDown, Activity, Users,
  MapPin, AlertTriangle, Shield, Clock, Zap, CheckCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import ChartCard from '../../components/ui/ChartCard';
import { cn } from '../../utils/cn';
import { useSocket } from '../../context/SocketContext';
import {
  subscribeToAllComplaints,
  subscribeToEmergencies,
  subscribeToHotspots,
  subscribeToCollection,
  COLLECTIONS
} from '../../services/firestoreService';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];

const AdminAnalytics = () => {
  const { notifications } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [responseTeams, setResponseTeams] = useState([]);

  useEffect(() => {
    const unsubs = [
      subscribeToAllComplaints(setComplaints),
      subscribeToEmergencies(setEmergencies),
      subscribeToHotspots(setHotspots),
      subscribeToCollection(COLLECTIONS.RESPONSE_TEAMS, setResponseTeams, [], 'name', 'asc'),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  // Computed analytics
  const totalComplaints = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const assigned = complaints.filter(c => c.status === 'assigned' || c.status === 'investigating').length;
  const resolutionRate = totalComplaints > 0 ? ((resolved / totalComplaints) * 100).toFixed(1) : 0;

  // Category distribution for pie chart
  const categoryData = [
    { name: 'Crime', value: complaints.filter(c => c.category === 'crime').length || 1 },
    { name: 'Accident', value: complaints.filter(c => c.category === 'accident').length || 1 },
    { name: 'Fire', value: complaints.filter(c => c.category === 'fire').length || 1 },
    { name: 'Civic', value: complaints.filter(c => c.category === 'civic').length || 1 },
    { name: 'Harassment', value: complaints.filter(c => c.category === 'harassment').length || 1 },
  ];

  // Department distribution
  const deptData = [
    { name: 'Police', complaints: complaints.filter(c => c.department === 'police').length, resolved: complaints.filter(c => c.department === 'police' && c.status === 'resolved').length },
    { name: 'Hospital', complaints: complaints.filter(c => c.department === 'hospital').length, resolved: complaints.filter(c => c.department === 'hospital' && c.status === 'resolved').length },
    { name: 'Fire', complaints: complaints.filter(c => c.department === 'fire').length, resolved: complaints.filter(c => c.department === 'fire' && c.status === 'resolved').length },
    { name: 'Admin', complaints: complaints.filter(c => c.department === 'admin').length, resolved: complaints.filter(c => c.department === 'admin' && c.status === 'resolved').length },
  ];

  // Priority breakdown
  const priorityData = [
    { name: 'Critical', value: complaints.filter(c => c.priority === 'high' || c.priority === 'critical').length, color: '#f43f5e' },
    { name: 'Medium', value: complaints.filter(c => c.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: complaints.filter(c => c.priority === 'low').length, color: '#10b981' },
  ];

  // Hotspot risk distribution
  const hotspotData = [
    { name: 'Critical', count: hotspots.filter(h => h.riskLevel === 'critical' || h.riskLevel === 'high').length },
    { name: 'Medium', count: hotspots.filter(h => h.riskLevel === 'medium').length },
    { name: 'Low', count: hotspots.filter(h => h.riskLevel === 'low').length },
  ];

  // Mock weekly trend (would be from analytics collection in production)
  const weeklyTrend = [
    { day: 'Mon', complaints: Math.floor(Math.random() * 10) + totalComplaints, emergencies: Math.floor(Math.random() * 5) },
    { day: 'Tue', complaints: Math.floor(Math.random() * 10) + totalComplaints + 2, emergencies: Math.floor(Math.random() * 5) },
    { day: 'Wed', complaints: Math.floor(Math.random() * 10) + totalComplaints - 1, emergencies: Math.floor(Math.random() * 5) },
    { day: 'Thu', complaints: Math.floor(Math.random() * 10) + totalComplaints + 4, emergencies: Math.floor(Math.random() * 5) },
    { day: 'Fri', complaints: Math.floor(Math.random() * 10) + totalComplaints + 3, emergencies: Math.floor(Math.random() * 5) },
    { day: 'Sat', complaints: Math.floor(Math.random() * 10) + totalComplaints - 2, emergencies: Math.floor(Math.random() * 5) },
    { day: 'Sun', complaints: totalComplaints, emergencies: emergencies.length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart2 className="text-indigo-600" size={32} />
            City Analytics Engine
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Firestore-powered real-time insights &bull; <span className="text-emerald-500 font-bold">{totalComplaints} data points</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live Analytics</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Complaints', value: totalComplaints, icon: AlertTriangle, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'In Progress', value: assigned, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Emergencies', value: emergencies.length, icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
          { label: 'Resolution %', value: `${resolutionRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", kpi.bg)}>
              <kpi.icon size={20} className={kpi.color} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Category Distribution */}
        <ChartCard title="Category Distribution" subtitle="Complaints by type from Firestore">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={categoryData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
              <Legend verticalAlign="bottom" height={36} iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Performance */}
        <ChartCard title="Department Caseload" subtitle="Complaints vs resolved per dept" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={deptData} barGap={4}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="complaints" fill="#6366f1" radius={[6, 6, 0, 0]} name="Filed" />
              <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Trend */}
        <ChartCard title="Weekly Trend" subtitle="Complaints & emergencies over the week">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEmergencies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Area type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorComplaints)" />
              <Area type="monotone" dataKey="emergencies" stroke="#f43f5e" strokeWidth={2.5} fill="url(#colorEmergencies)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Priority Breakdown + Hotspot Stats */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Priority Breakdown</h3>
            <div className="space-y-4">
              {priorityData.map(p => (
                <div key={p.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{p.name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{p.value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${totalComplaints > 0 ? (p.value / totalComplaints) * 100 : 0}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Hotspot Zones</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {hotspotData.map((h, i) => (
                <div key={h.name} className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{h.count}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{h.name} Risk</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Response Teams Status */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white mb-6">Response Team Status</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {responseTeams.map(team => (
            <div key={team.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{team.name}</h4>
                <span className={cn(
                  "px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase",
                  team.status === 'available' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                )}>
                  {team.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={12} className="text-slate-400" />
                <span className="text-[10px] text-slate-500 font-bold uppercase">{team.department}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(team.members || []).map((m, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[9px] font-bold text-slate-500">{m}</span>
                ))}
              </div>
            </div>
          ))}
          {responseTeams.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-400 text-xs font-bold uppercase">
              No response teams data — run database seeder to populate
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
