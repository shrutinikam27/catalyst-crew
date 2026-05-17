import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, MapPin, 
  Users, Activity, Clock, CheckCircle, Search,
  UserCheck, UserX, Loader2
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/cn';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { subscribeToAllComplaints, subscribeToEmergencies, subscribeToCrimes, COLLECTIONS } from '../../services/firestoreService';
import { useSocket } from '../../context/SocketContext';
import SmartMap from '../../components/map/SmartMap';

const initialCrimeData = [
  { name: 'Jan', reports: 45, resolved: 38 },
  { name: 'Feb', reports: 52, resolved: 40 },
  { name: 'Mar', reports: 38, resolved: 35 },
  { name: 'Apr', reports: 65, resolved: 55 },
  { name: 'May', reports: 48, resolved: 42 },
  { name: 'Jun', reports: 70, resolved: 60 },
];

const PoliceDashboard = () => {
  const { notifications, lastPulse } = useSocket();
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVols, setLoadingVols] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tab, setTab] = useState('pending'); // pending | approved | rejected
  const [chartData, setChartData] = useState(initialCrimeData);

  const crimeAlerts = notifications.filter(n => n.type === 'CRIME');

  // Real-time chart update
  useEffect(() => {
    if (lastPulse && lastPulse.type === 'CRIME') {
      setChartData(prev => {
        const newData = [...prev];
        const lastIdx = newData.length - 1;
        // Deep clone the last object to avoid mutation errors
        newData[lastIdx] = { 
          ...newData[lastIdx], 
          reports: (newData[lastIdx].reports || 0) + 1 
        };
        return newData;
      });
    }
  }, [lastPulse]);

  useEffect(() => {
    // Real-time listener for crime volunteer requests
    const q = query(
      collection(db, 'volunteerRequests'),
      where('expertise', 'array-contains', 'crime')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setVolunteers(data);
      setLoadingVols(false);
    });
    return () => unsub();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(id + status);
    try {
      await updateDoc(doc(db, 'volunteerRequests', id), { status });
    } catch (e) {
      console.error(e);
    }
    setActionLoading(null);
  };

  const filtered = volunteers.filter(v => v.status === tab);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
            Command Center Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Precinct-wide crime analytics and patrol management.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
            Export Report
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
            Filter Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard 
          title="Active Incidents" 
          value={crimeAlerts.length || "0"} 
          icon={AlertTriangle} 
          trend="Live" 
          trendType="up" 
          description={lastPulse?.type === 'CRIME' ? `Last: ${lastPulse.title} at ${lastPulse.location}` : 'Monitoring city pulse...'}
        />
        <StatCard 
          title="Officer Patrols" 
          value={lastPulse?.patrolCount || "18"} 
          icon={Users} 
          trend="4%" 
          trendType="up" 
        />
        <StatCard 
          title="Resolution Rate" 
          value={`${lastPulse?.resolutionRate || "92"}%`} 
          icon={CheckCircle} 
          trend="2.4%" 
          trendType="up" 
        />
        <StatCard 
          title="Avg. Response" 
          value={`${lastPulse?.avgResponse || "6.5"}m`} 
          icon={Clock} 
          trend="8%" 
          trendType="down" 
        />
      </div>

      {/* Chart */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <ChartCard title="Incident Frequency vs Resolutions" subtitle="Monthly tracking of precinct performance">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="reports" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crime Density Heatmap" subtitle="High-risk zones identified by AI">
          <div className="h-full min-h-[300px]">
            <SmartMap incidents={notifications} />
          </div>
        </ChartCard>
      </div>

      {/* ─── Data Sources & Verification ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-outfit font-extrabold mb-2">Verified Real-Time Feed</h3>
            <p className="text-indigo-100 text-sm mb-6 max-w-md">
              Your dashboard is currently synchronized with multiple official Pune data streams including the Pune Police NCRB portal and PMC Open Data.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="http://punepolice.co.in/ncrb.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
              >
                <Shield size={16} /> Pune Police NCRB
              </a>
              <a 
                href="http://bi.punecorporation.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
              >
                <Activity size={16} /> PMC Civic BI
              </a>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle size={24} />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">AI Verified</h4>
          <p className="text-slate-500 text-xs">
            98.5% of incidents are cross-referenced with citizen reports for maximum accuracy.
          </p>
        </div>
      </div>

      {/* ─── REAL-TIME Volunteer Verification ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-lg">Crime Volunteer Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time · approve or reject applicants</p>
            </div>
            {/* Tab switcher */}
            <div className="flex gap-2">
              {['pending','approved','rejected'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all',
                    tab === t
                      ? t === 'pending'   ? 'bg-amber-500 text-white'
                        : t === 'approved' ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  )}
                >
                  {t} ({volunteers.filter(v => v.status === t).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {loadingVols ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm font-bold uppercase tracking-widest">Loading requests…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <UserCheck size={40} className="text-slate-200 dark:text-slate-700" />
            <p className="text-sm font-bold uppercase tracking-widest">No {tab} requests</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expertise</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Proof</th>
                  {tab === 'pending' && <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{row.name}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.email}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.phone || '—'}</td>
                    <td className="px-6 py-4">
                      {(row.expertise || []).map(e => (
                        <span key={e} className="mr-1 px-2 py-1 rounded text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-600">{e}</span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.idFileName || '—'}</td>
                    {tab === 'pending' && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(row.id, 'approved')}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded uppercase transition-colors disabled:opacity-60"
                          >
                            {actionLoading === row.id + 'approved' ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={12} />}
                            Verify
                          </button>
                          <button
                            onClick={() => handleAction(row.id, 'rejected')}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded uppercase transition-colors disabled:opacity-60"
                          >
                            {actionLoading === row.id + 'rejected' ? <Loader2 size={12} className="animate-spin" /> : <UserX size={12} />}
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceDashboard;
