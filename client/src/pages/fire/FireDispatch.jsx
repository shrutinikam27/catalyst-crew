import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, AlertTriangle, MapPin, Truck,
  Clock, CheckCircle, Phone, Navigation,
  Zap, Shield
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

const FireDispatch = () => {
  const { notifications } = useSocket();
  const [emergencies, setEmergencies] = useState([]);
  const [responseTeams, setResponseTeams] = useState([]);
  const [fireStations, setFireStations] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    const unsubs = [
      subscribeToEmergencies(setEmergencies, 'fire'),
      subscribeToCollection(COLLECTIONS.RESPONSE_TEAMS, setResponseTeams, [
        { field: 'department', operator: '==', value: 'fire' }
      ], 'name', 'asc'),
      subscribeToCollection(COLLECTIONS.FIRE_STATIONS, setFireStations, [], 'name', 'asc'),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  const fireAlerts = notifications.filter(n => n.type === 'FIRE');
  const allEmergencies = [
    ...emergencies.map(e => ({
      ...e,
      title: e.description || 'Fire Emergency',
      location: e.location?.address || 'Unknown',
      time: e.createdAt?.toDate ? e.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
      severity: e.priority === 'critical' ? 'high' : 'moderate',
      source: 'Firestore',
      isFirestore: true
    })),
    ...fireAlerts.map(a => ({ ...a, source: 'Socket.IO', isFirestore: false }))
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
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 dark:shadow-none">
            <Flame size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Fire Dispatch Board</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Real-time fire engine dispatch &bull; <span className="text-orange-600 font-bold">{allEmergencies.length} active incidents</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{availableTeams.length} Engines Ready</span>
          </div>
        </div>
      </div>

      {/* Fire Stations */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {fireStations.map(station => (
          <div key={station.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Truck size={16} />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">{station.name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-lg font-black text-slate-900 dark:text-white">{station.vehicles || 0}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Vehicles</p>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-lg font-black text-slate-900 dark:text-white">{station.personnel || 0}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Personnel</p>
              </div>
            </div>
          </div>
        ))}
        {fireStations.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400 text-xs font-bold uppercase">
            No fire stations — seed database to populate
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Emergency Queue */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fire Emergency Queue</h3>
          {allEmergencies.length === 0 ? (
            <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
              <Flame size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase">No active fire emergencies</p>
            </div>
          ) : (
            <AnimatePresence>
              {allEmergencies.map((ems, i) => (
                <motion.div
                  key={ems.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEmergency(ems)}
                  className={cn(
                    "p-5 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer",
                    selectedEmergency?.id === ems.id
                      ? "border-orange-300 dark:border-orange-600 ring-2 ring-orange-100 dark:ring-orange-900/30"
                      : "border-slate-100 dark:border-slate-800"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0",
                      ems.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                    )}>
                      <Flame size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{ems.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{ems.time}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin size={10} /> {ems.location}
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-extrabold uppercase",
                          ems.status === 'dispatched' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
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
        <div>
          {selectedEmergency ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-6 sticky top-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-outfit font-bold text-slate-900 dark:text-white">Dispatch Details</h3>
                <button onClick={() => setSelectedEmergency(null)} className="text-xs font-bold text-slate-400">Close</button>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-3 mb-2">
                  <Flame size={16} className="text-orange-600" />
                  <span className="text-xs font-bold text-orange-600 uppercase">Fire Emergency</span>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedEmergency.title}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin size={10} /> {selectedEmergency.location}</p>
              </div>

              {/* Evidence Photos Gallery */}
              {((selectedEmergency.images && selectedEmergency.images.length > 0) || selectedEmergency.imageUrl) && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Evidence Photos</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedEmergency.imageUrl && (
                      <a href={selectedEmergency.imageUrl} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={selectedEmergency.imageUrl} 
                          alt="evidence-main" 
                          className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer shadow-sm" 
                        />
                      </a>
                    )}
                    {selectedEmergency.images && selectedEmergency.images.map((imgUrl, idx) => (
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

              {/* Available Fire Engines */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Available Fire Engines</h4>
                <div className="space-y-2">
                  {availableTeams.map(team => (
                    <div key={team.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                          <Truck size={14} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{team.name}</p>
                          <p className="text-[9px] text-slate-400">{(team.members || []).join(', ')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDispatch(selectedEmergency, team.id)}
                        disabled={dispatching || !selectedEmergency.isFirestore}
                        className="px-3 py-1.5 bg-orange-600 text-white text-[9px] font-bold uppercase rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all"
                      >
                        Deploy
                      </button>
                    </div>
                  ))}
                  {availableTeams.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">All engines deployed</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                  <Phone size={14} /> Emergency Line
                </button>
                {selectedEmergency.isFirestore && (
                  <button
                    onClick={() => handleResolve(selectedEmergency.id)}
                    className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> Resolved
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center">
              <Truck size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Select Incident</h4>
              <p className="text-xs text-slate-400">Click an emergency to dispatch fire units.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FireDispatch;
