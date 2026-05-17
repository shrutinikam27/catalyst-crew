import React, { useState, useEffect } from 'react';
import { 
  Ambulance, Heart, Activity, Clock, 
  MapPin, AlertCircle, CheckCircle,
  UserCheck, UserX, Loader2
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { cn } from '../../utils/cn';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { subscribeToEmergencies, subscribeToCollection, subscribeToAllComplaints, COLLECTIONS } from '../../services/firestoreService';
import { useSocket } from '../../context/SocketContext';

const HospitalDashboard = () => {
  const { notifications } = useSocket();
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVols, setLoadingVols] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tab, setTab] = useState('pending');

  const medicalAlerts = notifications.filter(n => n.type === 'MEDICAL');

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Medical/Accident reports filtered for Hospital department
    const unsub = subscribeToAllComplaints(setComplaints, 'hospital');
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'volunteerRequests'),
      where('expertise', 'array-contains', 'medical')
    );
    const unsub = onSnapshot(q, (snap) => {
      setVolunteers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingVols(false);
    });
    return () => unsub();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(id + status);
    try { await updateDoc(doc(db, 'volunteerRequests', id), { status }); }
    catch (e) { console.error(e); }
    setActionLoading(null);
  };

  const filtered = volunteers.filter(v => v.status === tab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-100 dark:shadow-none">
            <Heart size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Emergency Center</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Active EMS Dispatch and Critical Care Status</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Trauma Center: Ready</span>
        </div>
      </div>

      {/* EMS Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard title="Total Emergencies" value={medicalAlerts.length || "0"} icon={AlertCircle} trend="Live" trendType="up" />
        <StatCard title="Ambulances Active" value="08" icon={Ambulance} trend="2" />
        <StatCard title="Critical Cases" value={medicalAlerts.filter(a => a.severity === 'high').length || "0"} icon={Heart} trend="1" trendType="down" />
        <StatCard title="Avg. Dispatch" value="2.4m" icon={Clock} trend="12s" trendType="down" />
      </div>

      {/* Main Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">Live EMS Dispatch Board</h3>
              <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {medicalAlerts.map(ems => (
                <div key={ems.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all flex items-center gap-6">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg', ems.severity === 'high' ? 'bg-rose-500' : 'bg-indigo-500')}>
                    <Ambulance size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{ems.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{ems.id.slice(0, 6)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500"><MapPin size={10}/> {ems.location}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500"><Clock size={10}/> Reported: {new Date(ems.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-extrabold uppercase px-2 py-1 rounded', 'bg-indigo-100 text-indigo-600')}>En Route</span>
                </div>
              ))}
              {medicalAlerts.length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm font-bold uppercase tracking-widest">No active medical dispatches</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Hospital Capacity</h3>
            <div className="space-y-6">
              {[
                { name: 'Emergency Beds', current: 12, total: 15, color: 'bg-rose-500' },
                { name: 'ICU Units', current: 4, total: 6, color: 'bg-indigo-500' },
                { name: 'Ambulances', current: 8, total: 10, color: 'bg-emerald-500' },
                { name: 'Blood Bank', current: 85, total: 100, color: 'bg-rose-600' },
              ].map(item => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{item.name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.current}/{item.total}</span>
                  </div>
                  <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', item.color)} style={{ width: `${(item.current/item.total)*100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14}/> Critical Alert</h4>
              <p className="text-sm font-bold font-outfit">Mass Casualty Protocol Enabled for Central Pune</p>
              <p className="text-[11px] text-slate-400 font-medium">All trauma teams on high alert for next 4 hours.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-bold uppercase transition-all">Acknowledge Protocol</button>
            </div>
            <Activity size={100} className="absolute -right-6 -bottom-6 text-white/5" />
          </div>
        </div>
      </div>

      {/* ─── REAL-TIME Volunteer Verification ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-outfit font-bold text-slate-900 dark:text-white text-lg">Medical Volunteer Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time · approve or reject applicants</p>
            </div>
            <div className="flex gap-2">
              {['pending','approved','rejected'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn('px-4 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all',
                    tab===t
                      ? t==='pending' ? 'bg-amber-500 text-white' : t==='approved' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  )}>
                  {t} ({volunteers.filter(v => v.status===t).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {loadingVols ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={24}/><span className="text-sm font-bold uppercase tracking-widest">Loading…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <UserCheck size={40} className="text-slate-200 dark:text-slate-700"/>
            <p className="text-sm font-bold uppercase tracking-widest">No {tab} requests</p>
          </div>
        ) : (
          <div>
            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(row => (
                <div key={row.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{row.name}</p>
                      <p className="text-xs text-slate-500 break-all">{row.email}</p>
                    </div>
                    {tab==='pending' && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleAction(row.id,'approved')} disabled={!!actionLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg uppercase transition-colors disabled:opacity-60">
                          {actionLoading===row.id+'approved' ? <Loader2 size={12} className="animate-spin"/> : <UserCheck size={12}/>} Verify
                        </button>
                        <button onClick={() => handleAction(row.id,'rejected')} disabled={!!actionLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded-lg uppercase transition-colors disabled:opacity-60">
                          {actionLoading===row.id+'rejected' ? <Loader2 size={12} className="animate-spin"/> : <UserX size={12}/>} Reject
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(row.expertise||[]).map(e => (
                      <span key={e} className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-600">{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {['Name','Email','Phone','Expertise','ID Proof', tab==='pending'?'Actions':''].map((h,i) => h && (
                      <th key={i} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{row.name}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{row.email}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{row.phone||'—'}</td>
                      <td className="px-6 py-4">
                        {(row.expertise||[]).map(e => (
                          <span key={e} className="mr-1 px-2 py-1 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-600">{e}</span>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{row.idFileName||'—'}</td>
                      {tab==='pending' && (
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleAction(row.id,'approved')} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded uppercase transition-colors disabled:opacity-60">
                              {actionLoading===row.id+'approved' ? <Loader2 size={12} className="animate-spin"/> : <UserCheck size={12}/>} Verify
                            </button>
                            <button onClick={() => handleAction(row.id,'rejected')} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded uppercase transition-colors disabled:opacity-60">
                              {actionLoading===row.id+'rejected' ? <Loader2 size={12} className="animate-spin"/> : <UserX size={12}/>} Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
