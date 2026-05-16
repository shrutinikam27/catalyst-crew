import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance, Heart, Activity, Clock,
  MapPin, AlertCircle, CheckCircle,
  Phone, Navigation, User, Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSocket } from '../../context/SocketContext';
import {
  subscribeToEmergencies,
  subscribeToCollection,
  resolveEmergency,
  assignTeamToEmergency,
  COLLECTIONS
} from '../../services/firestoreService';

const HospitalDispatch = () => {
  const { notifications } = useSocket();
  const [emergencies, setEmergencies] = useState([]);
  const [responseTeams, setResponseTeams] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [dispatching, setDispatching] = useState(false);

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubs = [
      subscribeToEmergencies(setEmergencies, 'medical'),
      subscribeToCollection(COLLECTIONS.RESPONSE_TEAMS, setResponseTeams, [
        { field: 'department', operator: '==', value: 'hospital' }
      ], 'name', 'asc'),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  // Merge Firestore emergencies with Socket.IO medical alerts
  const medicalAlerts = notifications.filter(n => n.type === 'MEDICAL');
  const allEmergencies = [
    ...emergencies.map(e => ({
      ...e,
      title: e.description || 'Medical Emergency',
      location: e.location?.address || 'Unknown',
      time: e.createdAt?.toDate ? e.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
      severity: e.priority === 'critical' ? 'high' : 'moderate',
      source: 'Firestore',
      isFirestore: true
    })),
    ...medicalAlerts.map(a => ({ ...a, source: 'Socket.IO', isFirestore: false }))
  ];

  const handleDispatch = async (emergency, teamId) => {
    if (!emergency.isFirestore) return;
    setDispatching(true);
    try {
      await assignTeamToEmergency(emergency.id, teamId);
    } catch (err) {
      console.error('Dispatch error:', err);
    }
    setDispatching(false);
  };

  const handleResolve = async (emergencyId) => {
    try {
      await resolveEmergency(emergencyId);
      setSelectedEmergency(null);
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  const availableTeams = responseTeams.filter(t => t.status === 'available');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-none">
            <Ambulance size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">EMS Dispatch Board</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Real-time ambulance dispatch &bull; <span className="text-rose-600 font-bold">{allEmergencies.length} active</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{availableTeams.length} Teams Available</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Emergency Queue */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Emergency Queue</h3>
          {allEmergencies.length === 0 ? (
            <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
              <Heart size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase">No active medical emergencies</p>
              <p className="text-xs text-slate-400 mt-2">Emergencies from SOS triggers and complaints will appear here in real-time.</p>
            </div>
          ) : (
            <AnimatePresence>
              {allEmergencies.map((ems, i) => (
                <motion.div
                  key={ems.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEmergency(ems)}
                  className={cn(
                    "p-5 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer",
                    selectedEmergency?.id === ems.id
                      ? "border-rose-300 dark:border-rose-600 ring-2 ring-rose-100 dark:ring-rose-900/30"
                      : ems.severity === 'high'
                        ? "border-rose-100 dark:border-rose-900/30"
                        : "border-slate-100 dark:border-slate-800"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0",
                      ems.severity === 'high' ? 'bg-rose-500' : 'bg-indigo-500'
                    )}>
                      <Ambulance size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{ems.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{ems.source}</span>
                          <span className="text-[10px] font-bold text-slate-400">{ems.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin size={10} /> {ems.location}
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-extrabold uppercase",
                          ems.status === 'dispatched' ? 'bg-amber-100 text-amber-600' :
                          ems.status === 'active' ? 'bg-rose-100 text-rose-600' :
                          'bg-indigo-100 text-indigo-600'
                        )}>
                          {ems.status || 'active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Dispatch Panel */}
        <div className="space-y-6">
          {selectedEmergency ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-6 sticky top-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-outfit font-bold text-slate-900 dark:text-white">Dispatch Details</h3>
                <button onClick={() => setSelectedEmergency(null)} className="text-xs font-bold text-slate-400 hover:text-rose-500">Close</button>
              </div>

              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle size={16} className="text-rose-600" />
                  <span className="text-xs font-bold text-rose-600 uppercase">{selectedEmergency.severity === 'high' ? 'CRITICAL' : 'STANDARD'} PRIORITY</span>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedEmergency.title}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin size={10} /> {selectedEmergency.location}</p>
              </div>

              {/* Available EMS Units */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Available EMS Units</h4>
                <div className="space-y-2">
                  {availableTeams.length > 0 ? availableTeams.map(team => (
                    <div key={team.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                          <Ambulance size={14} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{team.name}</p>
                          <p className="text-[9px] text-slate-400">{(team.members || []).join(', ')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDispatch(selectedEmergency, team.id)}
                        disabled={dispatching || !selectedEmergency.isFirestore}
                        className="px-3 py-1.5 bg-rose-600 text-white text-[9px] font-bold uppercase rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-all"
                      >
                        <Navigation size={10} className="inline mr-1" />
                        Dispatch
                      </button>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400 text-center py-4">No teams available — all deployed</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                  <Phone size={14} /> Emergency Call
                </button>
                {selectedEmergency.isFirestore && (
                  <button
                    onClick={() => handleResolve(selectedEmergency.id)}
                    className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center">
              <Ambulance size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Select Emergency</h4>
              <p className="text-xs text-slate-400">Click an emergency from the queue to view dispatch options.</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-2xl font-black text-rose-600">{allEmergencies.filter(e => e.severity === 'high').length}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Critical</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-2xl font-black text-emerald-600">{responseTeams.filter(t => t.status === 'available').length}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Teams Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDispatch;
