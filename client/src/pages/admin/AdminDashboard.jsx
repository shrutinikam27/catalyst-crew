import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, Shield, Activity, Users, 
  MapPin, AlertTriangle, CheckCircle, 
  Settings, Download, Search, Briefcase, Globe,
  MessageSquare, Mail, Clock, ChevronRight,
  ExternalLink, BadgeCheck
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, LineChart, Line, XAxis
} from 'recharts';
import { cn } from '../../utils/cn';
import { useSocket } from '../../context/SocketContext';
import { 
  subscribeToAllComplaints,
  subscribeToEmergencies,
  subscribeToAnalytics,
  subscribeToCollection,
  COLLECTIONS
} from '../../services/firestoreService';
import { seedDatabase } from '../../services/seedDatabase';

const cityData = [
  { name: 'Crime Prevention', value: 400 },
  { name: 'Medical Response', value: 300 },
  { name: 'Traffic Safety', value: 300 },
  { name: 'Fire Response', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

const AdminDashboard = () => {
  const { notifications } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubs = [
      subscribeToAllComplaints(setComplaints),
      subscribeToEmergencies(setEmergencies),
      subscribeToAnalytics(setAnalytics),
      subscribeToCollection(COLLECTIONS.NOTIFICATIONS, setSupportRequests, [], 'createdAt', 'desc', 10),
      subscribeToCollection('volunteerRequests', (vols) => {
        // Sort in-memory to avoid composite index requirements
        const sorted = [...vols].sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return timeB - timeA;
        });
        setVolunteers(sorted);
      }, [{ field: 'status', operator: '==', value: 'pending' }], null),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  // Compute live stats
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
  const activeEmergencies = emergencies.filter(e => e.status === 'active').length;
  const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : '0';

  const cityData = [
    { name: 'Crime Reports', value: complaints.filter(c => c.category === 'crime' || c.department === 'police').length || 40 },
    { name: 'Medical Response', value: complaints.filter(c => c.category === 'accident' || c.department === 'hospital').length || 30 },
    { name: 'Fire Incidents', value: complaints.filter(c => c.category === 'fire' || c.department === 'fire').length || 20 },
    { name: 'Civic Issues', value: complaints.filter(c => c.category === 'civic' || c.department === 'admin').length || 25 },
  ];

  const handleVolunteerAction = async (vol, status) => {
    setActionLoading(vol.id);
    try {
      const { updateDocument, syncUserProfile } = await import('../../services/firestoreService');
      
      // 1. Update request status
      await updateDocument('volunteerRequests', vol.id, { status });
      
      // 2. If approved, update user's profile role
      if (status === 'approved') {
        await syncUserProfile(vol.uid, {
          role: 'volunteer',
          displayName: vol.name
        });
        console.log(`✅ Volunteer ${vol.name} approved and role updated.`);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* City Status Banner */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-widest">
              <Globe size={12} /> City Command Status: Operational
            </div>
            <h1 className="text-4xl font-outfit font-extrabold">Smart City <br /> Safety Overview</h1>
            <p className="text-indigo-100 font-medium max-w-md">
              Monitoring 12 wards, 48 active patrols, and 1.2M citizens in real-time. System integrity at 99.8%.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={async () => {
                setSeeding(true);
                try {
                  await seedDatabase();
                  setSeedDone(true);
                  setTimeout(() => setSeedDone(false), 5000);
                } catch (err) {
                  console.error('Seed error:', err);
                }
                setSeeding(false);
              }}
              disabled={seeding}
              className="p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl border border-white/20 transition-all group disabled:opacity-50"
              title="Populate database with Pune infrastructure data"
            >
              {seeding ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <Settings size={24} className="group-hover:rotate-90 transition-transform" />
              )}
            </button>
            <button className="px-6 py-4 bg-white text-indigo-600 font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-50 transition-all">
              <Download size={20} />
              Full Report
            </button>
          </div>
          {seedDone && (
            <div className="absolute top-4 right-4 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg animate-bounce">
              ✅ Database seeded with Pune data!
            </div>
          )}
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Complaints" value={totalComplaints.toString()} icon={AlertTriangle} trend={`${resolvedComplaints} resolved`} trendType="down" description="From Firestore real-time" />
        <StatCard title="Active Emergencies" value={activeEmergencies.toString()} icon={Activity} trend="Live" trendType={activeEmergencies > 3 ? "up" : "down"} description="SOS & dispatch requests" />
        <StatCard title="Resolution Rate" value={`${resolutionRate}%`} icon={CheckCircle} trend="2.1%" trendType="up" description="Across all departments" />
        <StatCard title="Live Incidents" value={notifications.length.toString()} icon={Shield} trend="Socket.IO" trendType="up" description="Real-time city pulse" />
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        <ChartCard title="Resource Allocation" subtitle="Distribution across departments" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={cityData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {cityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Live Incident Feed" subtitle="Real-time from Socket.IO + Firestore" className="lg:col-span-2">
          <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2 scrollbar-hide">
            {notifications.length > 0 ? (
              notifications.slice(0, 8).map((log, i) => (
                <div key={log.id || i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-500/20 transition-all group">
                  <div className={cn("w-1.5 h-10 rounded-full", 
                    log.type === 'CRIME' ? 'bg-rose-500' : 
                    log.type === 'FIRE' ? 'bg-orange-500' : 
                    log.type === 'MEDICAL' ? 'bg-emerald-500' : 'bg-indigo-500'
                  )}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{log.title || log.type}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="text-[11px] font-medium text-slate-500">{log.location}</span>
                      <span className="text-indigo-500 text-xs mx-1">•</span>
                      <span className={cn("text-[11px] font-bold", log.severity === 'high' ? 'text-rose-500' : 'text-emerald-500')}>
                        {log.severity === 'high' ? 'Critical' : 'Moderate'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Activity className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase">Awaiting live data stream...</p>
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Support Inquiries Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <ChartCard title="Support Inquiries" subtitle="Direct messages from citizens" className="lg:col-span-2">
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
            {supportRequests.length === 0 ? (
              <div className="py-12 text-center">
                <Mail className="mx-auto text-slate-300 mb-4" size={40} />
                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">No active inquiries</p>
              </div>
            ) : (
              supportRequests.map((req) => (
                <div key={req.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase">
                        {req.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{req.name}</h4>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{req.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                    "{req.message}"
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                      Reply to Citizen <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ChartCard>

        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                <MessageSquare size={80} />
              </div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Inquiry Stats</h4>
              <div className="text-4xl font-outfit font-black text-slate-900 dark:text-white mb-1">{supportRequests.length}</div>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6">New Messages</p>
              <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-indigo-600 hover:text-white transition-all">
                Manage All Messages
              </button>
           </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Police Dept.', icon: Shield, efficiency: 98, color: 'text-indigo-500' },
          { name: 'Medical Svc.', icon: Activity, efficiency: 92, color: 'text-emerald-500' },
          { name: 'Fire Dept.', icon: MapPin, efficiency: 88, color: 'text-rose-500' },
          { name: 'Civic Svc.', icon: Briefcase, efficiency: 75, color: 'text-amber-500' },
        ].map((dept) => (
          <div key={dept.name} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800", dept.color)}>
                <dept.icon size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{dept.name}</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Efficiency</span>
                <span className="text-lg font-outfit font-bold text-slate-900 dark:text-white">{dept.efficiency}%</span>
              </div>
              <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.efficiency}%` }}
                  className={cn("h-full rounded-full", dept.color.replace('text', 'bg'))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Volunteer Verification Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white">Volunteer Verification Hub</h3>
            <p className="text-sm text-slate-500 font-medium">Review government IDs and expertise of applicants.</p>
          </div>
          <div className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
            {volunteers.length} Pending Requests
          </div>
        </div>

        {volunteers.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
              <BadgeCheck size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">All volunteers verified</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Proof</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black text-xs">
                          {vol.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{vol.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{vol.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {(vol.expertise || []).map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {vol.idProofUrl && vol.idProofUrl !== 'Not provided' ? (
                        <button 
                          onClick={() => setSelectedProof({ url: vol.idProofUrl, name: vol.name })}
                          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-[10px] font-black uppercase tracking-widest"
                        >
                          <ExternalLink size={14} /> View Document
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-bold uppercase italic">No Proof Uploaded</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleVolunteerAction(vol, 'approved')}
                          disabled={actionLoading === vol.id}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-emerald-100 dark:shadow-none disabled:opacity-50"
                        >
                          {actionLoading === vol.id ? '...' : 'APPROVE'}
                        </button>
                        <button 
                          onClick={() => handleVolunteerAction(vol, 'rejected')}
                          disabled={actionLoading === vol.id}
                          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-[10px] font-black rounded-xl transition-all disabled:opacity-50"
                        >
                          REJECT
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Premium Glassmorphic Image Preview Modal */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md"
            onClick={() => setSelectedProof(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">Document Verification Proof</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Submitted by {selectedProof.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedProof(null)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex items-center justify-center min-h-[300px] max-h-[60vh] bg-slate-50 dark:bg-slate-950/50 rounded-2xl overflow-y-auto p-4 border border-slate-100 dark:border-slate-800">
                {selectedProof.url.startsWith('data:') || selectedProof.url.startsWith('http') ? (
                  <img 
                    src={selectedProof.url} 
                    alt="ID Proof Document" 
                    className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm font-bold text-rose-500">{selectedProof.url}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">The upload was blocked by CORS or Network constraints. Verify manually via phone or email.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
