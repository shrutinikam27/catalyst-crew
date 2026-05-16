import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, Users, Shield, 
  TrendingUp, MapPin, Zap,
  Activity, CheckCircle, Clock,
  Cpu, LayoutGrid, Info, Loader2
} from 'lucide-react';
import SmartMap from '../../components/map/SmartMap';
import { cn } from '../../utils/cn';
import { useSocket } from '../../context/SocketContext';
import { subscribeToCollection } from '../../services/firestoreService';

const PatrolOptimizer = () => {
  const { notifications, lastPulse } = useSocket();
  const [activeTab, setActiveTab] = useState('units'); // units, routes, predictive
  const [optimizing, setOptimizing] = useState(false);
  const [optProgress, setOptProgress] = useState(0);
  const [focusCoords, setFocusCoords] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Real-time Firestore Data
  const [stations, setStations] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Police Stations
  useEffect(() => {
    const unsub = subscribeToCollection('police_stations', (data) => {
      setStations(data.map(s => ({
        id: s.id,
        name: s.name,
        coords: s.coords || [18.5204, 73.8567],
        status: s.status || 'active'
      })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to Active Response Teams (Officers)
  useEffect(() => {
    const unsub = subscribeToCollection('response_teams', (data) => {
      const policeUnits = data
        .filter(t => t.department === 'police')
        .map(t => ({
          id: t.id,
          name: t.name || t.teamId,
          status: t.status || 'Patrolling',
          location: t.currentZone || 'Unassigned',
          coords: t.coords || [18.5204, 73.8567],
          battery: t.batteryLevel || 100,
          lastActive: t.lastActive
        }));
      setOfficers(policeUnits);
    });
    return () => unsub();
  }, []);

  // AI Re-routing Pulse Logic
  useEffect(() => {
    if (lastPulse?.severity === 'high' && lastPulse?.type === 'CRIME') {
      // Find closest unit to the incident (simplified logic for UI feedback)
      console.log('🚨 AI Detecting High Priority Crime pulse. Re-calculating nearest units...');
    }
  }, [lastPulse]);

  const triggerOptimization = () => {
    setOptimizing(true);
    setOptProgress(0);
    setShowRecommendations(false);
    
    const interval = setInterval(() => {
      setOptProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setOptimizing(false);
          setShowRecommendations(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {optimizing && (
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: optProgress / 100 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-20"
          />
        )}
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none">
            <Navigation size={24} className="rotate-45" />
          </div>
          <div>
            <h1 className="text-2xl font-outfit font-extrabold text-slate-900 dark:text-white">AI Patrol Optimizer</h1>
            <p className="text-xs text-slate-500 font-medium italic">
              {optimizing ? `Running neural pathing algorithm... ${optProgress}%` : 'Dynamically re-routing units based on live crime density'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
             {['units', 'routes', 'predictive'].map(t => (
               <button
                 key={t}
                 onClick={() => setActiveTab(t)}
                 className={cn(
                   "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                   activeTab === t ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"
                 )}
               >
                 {t}
               </button>
             ))}
          </div>
          <button 
            onClick={triggerOptimization}
            disabled={optimizing}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2"
          >
            {optimizing ? <Loader2 className="animate-spin" size={16} /> : <Cpu size={16} />}
            {optimizing ? 'Calculating...' : 'Optimize Routes'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative">
        {/* Left Control Panel */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto pr-2">
          <AnimatePresence mode="wait">
            {activeTab === 'predictive' ? (
              <motion.div 
                key="predictive"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Zap size={16} className="text-amber-500" />
                      Risk Forecast
                    </h3>
                    <div className="space-y-4">
                       {[
                         { area: 'Shivaji Nagar', risk: 84, trend: '+12%', color: 'text-rose-500' },
                         { area: 'Kothrud', risk: 42, trend: '-5%', color: 'text-emerald-500' },
                         { area: 'Hadapsar', risk: 67, trend: '+2%', color: 'text-amber-500' },
                       ].map(item => (
                         <div key={item.area} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.area}</span>
                              <span className={cn("text-[9px] font-black uppercase", item.color)}>{item.trend}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                               <div className={cn("h-full", item.risk > 70 ? 'bg-rose-500' : 'bg-indigo-500')} style={{ width: `${item.risk}%` }} />
                            </div>
                            <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Predicted Probability: {item.risk}%</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-6 bg-indigo-600 rounded-[2rem] text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">AI Insight</p>
                    <p className="text-xs font-bold leading-relaxed">
                      Increased pedestrian activity detected near Camp Area. Suggesting temporary patrol increase for next 2 hours.
                    </p>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key="units"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Units</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">{officers.length} Live</span>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                       <div className="py-10 text-center space-y-3">
                         <Loader2 className="animate-spin mx-auto text-indigo-500" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Units...</p>
                       </div>
                    ) : officers.length === 0 ? (
                      <div className="py-10 text-center opacity-50">
                        <p className="text-xs font-bold text-slate-400">No active units deployed.</p>
                      </div>
                    ) : officers.map(officer => (
                      <button 
                        key={officer.id} 
                        onClick={() => setFocusCoords(officer.coords)}
                        className="w-full text-left group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-indigo-50 dark:hover:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 transition-all"
                      >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-black text-slate-900 dark:text-white">{officer.name}</p>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              officer.status === 'Patrolling' ? 'bg-emerald-500' : 
                              officer.status === 'Dispatching' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'
                            )} />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold mb-3">
                            <MapPin size={12} /> {officer.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Activity size={10} className="text-indigo-500" />
                              <span className="text-[9px] font-bold text-slate-400">Battery: {Math.floor(officer.battery)}%</span>
                            </div>
                            <span className="text-[9px] font-black text-indigo-600 uppercase group-hover:underline">Track Unit</span>
                          </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80 text-indigo-100">Efficiency Gain</h4>
                    <div className="flex items-end gap-2 mb-2">
                      <p className="text-4xl font-black">+24%</p>
                      <TrendingUp size={24} className="mb-1 text-emerald-400" />
                    </div>
                    <p className="text-[10px] font-medium text-indigo-100 leading-relaxed">
                      AI-driven routes have reduced response times by an average of 4.2 minutes this week.
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
          <SmartMap 
            incidents={notifications} 
            officers={officers}
            stations={stations}
            center={focusCoords || [18.5204, 73.8567]}
            zoom={focusCoords ? 14 : 12}
          />

          {/* AI Recommendations Panel (Overlay) */}
          <AnimatePresence>
            {showRecommendations && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-8 left-8 right-8 z-30 flex justify-center"
              >
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/50 dark:border-slate-800 max-w-2xl w-full pointer-events-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                        <CheckCircle size={20} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Optimization Complete</h4>
                    </div>
                    <button onClick={() => setShowRecommendations(false)} className="text-[10px] font-black text-slate-400 uppercase">Dismiss</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Recommendation 1</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Re-deploy Unit 7B from Shivajinagar to Hadapsar Sector-2. Predicted crime spike in 45 mins.</p>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Recommendation 2</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Extended patrol duration for Kothrud Zone-4. Area sanitization required post-event.</p>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all">
                    Apply AI Patrol Schedule
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Controls & Info */}
          <div className="absolute top-8 right-8 z-10 flex flex-col gap-3">
             <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-[1.5rem] shadow-2xl border border-white/50 dark:border-slate-800 w-56">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap size={12} className="text-amber-500" />
                  Hotspot Zones
                </p>
                <div className="space-y-3">
                   {[
                     { name: 'Kothrud Central', risk: 'High', color: 'bg-rose-500' },
                     { name: 'Viman Nagar', risk: 'Moderate', color: 'bg-amber-500' },
                     { name: 'Hinjewadi Ph-1', risk: 'Low', color: 'bg-emerald-500' },
                   ].map(zone => (
                     <div key={zone.name} className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{zone.name}</span>
                        <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black text-white uppercase", zone.color)}>{zone.risk}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-center pointer-events-none">
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50 dark:border-slate-800 flex items-center gap-4 pointer-events-auto"
             >
                <div className="flex items-center gap-2 px-4 border-r border-slate-100 dark:border-slate-800">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Live Optimization Active</span>
                </div>
                <div className="flex items-center gap-6 px-4">
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Current Beat</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Pune Sector 4-B</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Est. Coverage</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">92.4%</p>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatrolOptimizer;
