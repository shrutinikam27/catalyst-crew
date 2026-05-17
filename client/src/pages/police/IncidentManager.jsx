import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, Clock, 
  MapPin, CheckCircle, Zap,
  Search, Filter, MoreVertical,
  Navigation, User, Phone,
  Loader2, ExternalLink
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { cn } from '../../utils/cn';
import { subscribeToAllComplaints, updateComplaintStatus } from '../../services/firestoreService';
import { sendComplaintStatusNotify } from '../../utils/notify';

const IncidentManager = () => {
  const { notifications } = useSocket();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [firestoreComplaints, setFirestoreComplaints] = useState([]);
  const [actionLoading, setActionLoading] = useState(null); // 'dispatch' | 'investigate' | 'resolve'

  // Subscribe to Firestore complaints — keep selectedIncident in sync
  useEffect(() => {
    const unsub = subscribeToAllComplaints((complaints) => {
      const processed = complaints.map(c => ({
        ...c,
        title: c.title || c.category,
        location: c.location?.address || 'Unknown',
        severity: c.priority === 'high' ? 'high' : 'moderate',
        time: c.createdAt?.toDate ? c.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
        source: 'Firestore',
        type: 'CRIME',
        message: c.description || '',
        isFirestore: true,
        imageUrl: c.imageUrl || null,
        images: c.images || null
      }));
      setFirestoreComplaints(processed);
      // Keep dispatch panel in sync when Firestore updates
      setSelectedIncident(prev => {
        if (!prev) return prev;
        const updated = processed.find(p => p.id === prev.id);
        return updated || prev;
      });
    }, 'police');
    return () => unsub();
  }, []);

  const handleAction = async (incident, newStatus) => {
    if (!incident?.isFirestore) return;
    setActionLoading(newStatus);
    try {
      await updateComplaintStatus(incident.id, newStatus, 'police');
      // Fire-and-forget Notification to citizen
      sendComplaintStatusNotify({
        email:       incident.userEmail || incident.citizenEmail || null,
        fcmToken:    incident.fcmToken || null,
        userName:    incident.userName || incident.citizenName || 'Citizen',
        complaintId: incident.id,
        status:      newStatus,
      });
    } catch (err) {
      console.error('Action error:', err);
    }
    setActionLoading(null);
  };

  // Merge Socket.IO + Firestore incidents with real-time sorting
  const filteredIncidents = useMemo(() => {
    const now = new Date();
    const socketCrimes = notifications.filter(n => n.type === 'CRIME').map(n => ({
      ...n,
      isLive: true,
      timestamp: new Date() // Sockets are always 'now'
    }));

    let list = [...firestoreComplaints, ...socketCrimes];
    
    // Add 'isNew' flag for pulsing animation (less than 2 mins old)
    list = list.map(item => {
      const itemTime = item.createdAt?.toDate ? item.createdAt.toDate() : new Date();
      const diffMinutes = (now - itemTime) / 1000 / 60;
      return { ...item, isNew: diffMinutes < 2 || item.isLive };
    });

    // Sort by newest first
    list.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
      return timeB - timeA;
    });

    if (filter === 'CRITICAL') list = list.filter(n => n.severity === 'high');
    if (filter === 'PENDING') list = list.filter(n => n.status === 'pending');
    if (filter === 'RESOLVED') list = list.filter(n => n.status === 'resolved');

    if (searchQuery) {
      list = list.filter(n => 
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [notifications, firestoreComplaints, filter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Shield className="text-indigo-600" size={32} />
            Incident Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Real-time dispatching and emergency response monitoring.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs w-full sm:w-64 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Zap size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { label: 'Total Incidents', value: filteredIncidents.length, icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Critical Cases', value: filteredIncidents.filter(n => n.severity === 'high').length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Active Dispatch', value: Math.floor(filteredIncidents.length * 0.4), icon: Navigation, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg. Clear Time', value: '14m', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Incident List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              {['ALL', 'CRITICAL', 'PENDING', 'RESOLVED'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    filter === t ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence mode="popLayout">
                    {filteredIncidents.map((incident) => (
                      <motion.tr 
                        key={incident.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer",
                          selectedIncident?.id === incident.id ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                        )}
                        onClick={() => setSelectedIncident(incident)}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            {incident.isNew && (
                              <div className="flex-shrink-0 relative flex items-center justify-center">
                                <span className="absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600"></span>
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-slate-900 dark:text-white mb-0.5">{incident.title}</p>
                                {incident.isLive && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[8px] font-black rounded uppercase tracking-tighter">PULSE</span>}
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">#{incident.id.substring(0,6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter",
                            incident.severity === 'high' ? "bg-rose-100 text-rose-600 border border-rose-200" : "bg-indigo-100 text-indigo-600 border border-indigo-200"
                          )}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{incident.location}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-[11px] font-bold text-slate-400">
                          {incident.time}
                        </td>
                        <td className="px-8 py-5">
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredIncidents.length === 0 && (
                <div className="py-20 text-center">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Shield size={32} className="text-slate-200" />
                   </div>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Active Incidents Found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dispatch Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedIncident ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 sticky top-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-outfit font-black text-slate-900 dark:text-white text-lg uppercase tracking-widest">Dispatch Details</h3>
                  <button onClick={() => setSelectedIncident(null)} className="text-[10px] font-black text-indigo-600 uppercase">Close</button>
                </div>

                <div className="space-y-8">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
                        <Shield size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Incident Type</p>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none">{selectedIncident.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed">
                      "{selectedIncident.message}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Source</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        {selectedIncident.source} <ExternalLink size={10} />
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Verification</p>
                      <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle size={10} /> AI VERIFIED
                      </p>
                    </div>
                  </div>

                  {/* Current Status Badge */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status:</span>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
                      selectedIncident.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                      selectedIncident.status === 'investigating' ? 'bg-amber-100 text-amber-600' :
                      selectedIncident.status === 'dispatched' ? 'bg-indigo-100 text-indigo-600' :
                      'bg-slate-100 text-slate-500'
                    )}>{selectedIncident.status || 'pending'}</span>
                  </div>

                  {/* Evidence Photos Gallery */}
                  {((selectedIncident.images && selectedIncident.images.length > 0) || selectedIncident.imageUrl) && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Evidence Photos</p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {selectedIncident.imageUrl && (
                          <a href={selectedIncident.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={selectedIncident.imageUrl} 
                              alt="evidence-main" 
                              className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer shadow-sm" 
                            />
                          </a>
                        )}
                        {selectedIncident.images && selectedIncident.images.map((imgUrl, idx) => (
                          <a href={imgUrl} target="_blank" rel="noopener noreferrer" key={idx}>
                            <img 
                              src={imgUrl} 
                              alt={`evidence-${idx}`} 
                              className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer shadow-sm" 
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Dispatch Closest Unit */}
                    <button
                      disabled={!!actionLoading || selectedIncident.status === 'dispatched' || selectedIncident.status === 'investigating' || selectedIncident.status === 'resolved' || !selectedIncident.isFirestore}
                      onClick={() => handleAction(selectedIncident, 'dispatched')}
                      className={cn(
                        'w-full py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2',
                        selectedIncident.status === 'dispatched' || selectedIncident.status === 'investigating' || selectedIncident.status === 'resolved'
                          ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 dark:shadow-none'
                      )}
                    >
                      {actionLoading === 'dispatched' ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                      {selectedIncident.status === 'dispatched' ? 'Unit Dispatched ✓' : 'Dispatch Closest Unit'}
                    </button>

                    {/* Assign Investigator */}
                    <button
                      disabled={!!actionLoading || selectedIncident.status === 'investigating' || selectedIncident.status === 'resolved' || !selectedIncident.isFirestore}
                      onClick={() => handleAction(selectedIncident, 'investigating')}
                      className={cn(
                        'w-full py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border',
                        selectedIncident.status === 'investigating' || selectedIncident.status === 'resolved'
                          ? 'bg-amber-50 border-amber-200 text-amber-400 cursor-not-allowed'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600'
                      )}
                    >
                      {actionLoading === 'investigating' ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
                      {selectedIncident.status === 'investigating' ? 'Under Investigation ✓' : 'Assign Investigator'}
                    </button>

                    {/* Mark Resolved */}
                    <button
                      disabled={!!actionLoading || selectedIncident.status === 'resolved' || !selectedIncident.isFirestore}
                      onClick={() => handleAction(selectedIncident, 'resolved')}
                      className={cn(
                        'w-full py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border',
                        selectedIncident.status === 'resolved'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-400 cursor-not-allowed'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                      )}
                    >
                      {actionLoading === 'resolved' ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                      {selectedIncident.status === 'resolved' ? 'Case Resolved ✓' : 'Mark as Resolved'}
                    </button>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Field Contacts</p>
                    <div className="space-y-3">
                      {[
                        { name: 'Unit 4A - Kothrud', distance: '1.2km', contact: '+91 98XXX XXX01' },
                        { name: 'Unit 7B - Shivajinagar', distance: '2.8km', contact: '+91 98XXX XXX05' },
                      ].map((unit, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black uppercase">
                               {unit.name.split(' ')[1]}
                             </div>
                             <div>
                               <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{unit.name}</p>
                               <p className="text-[9px] text-slate-400 font-medium">{unit.distance}</p>
                             </div>
                           </div>
                           <button className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:text-indigo-600 rounded-lg transition-colors">
                             <Phone size={14} />
                           </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center justify-center mb-6">
                  <Shield size={40} className="text-slate-200 dark:text-slate-700" />
                </div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">No Selection</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select an incident from the manager table to view dispatch details and field unit availability.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IncidentManager;
