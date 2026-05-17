import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Map as MapIcon, Layers, 
  Search, Shield, AlertTriangle, 
  CheckCircle, Zap, Crosshair,
  Maximize2, List, Activity, Users
} from 'lucide-react';
import SmartMap from '../../components/map/SmartMap';
import { cn } from '../../utils/cn';
import { useSocket } from '../../context/SocketContext';

const PUNE_STATIONS = [
  { id: 'ps1', name: 'Shivaji Nagar Police Station', coords: [18.5312, 73.8445] },
  { id: 'ps2', name: 'Kothrud Police Station', coords: [18.5074, 73.8077] },
  { id: 'ps3', name: 'Hadapsar Police Station', coords: [18.5089, 73.9260] },
  { id: 'ps4', name: 'Viman Nagar Police Station', coords: [18.5679, 73.9143] },
  { id: 'ps5', name: 'Hinjewadi Police Station', coords: [18.5913, 73.7389] },
  { id: 'ps6', name: 'Koregaon Park Police Station', coords: [18.5362, 73.8940] },
  { id: 'ps7', name: 'Yerwada Police Station', coords: [18.5529, 73.8796] },
  { id: 'ps8', name: 'Kondhwa Police Station', coords: [18.4771, 73.8907] },
];

const mockHotspots = [
  // RED ZONES - High Crime
  { coords: [18.5089, 73.9260], radius: 900, color: '#ef4444', label: 'RED' },   // Hadapsar
  { coords: [18.5529, 73.8796], radius: 700, color: '#ef4444', label: 'RED' },   // Yerwada
  { coords: [18.5289, 73.8744], radius: 600, color: '#ef4444', label: 'RED' },   // Pune Station
  // ORANGE ZONES - Accident Prone
  { coords: [18.5580, 73.8075], radius: 800, color: '#f59e0b', label: 'ORANGE' }, // Aundh
  { coords: [18.5913, 73.7389], radius: 900, color: '#f59e0b', label: 'ORANGE' }, // Hinjewadi
  { coords: [18.4771, 73.8907], radius: 700, color: '#f59e0b', label: 'ORANGE' }, // Kondhwa
  // GREEN ZONES - Safe / Patrolled
  { coords: [18.5204, 73.8567], radius: 1000, color: '#10b981', label: 'GREEN' }, // Central Pune
  { coords: [18.5074, 73.8077], radius: 800, color: '#10b981', label: 'GREEN' },  // Kothrud
  { coords: [18.5590, 73.7787], radius: 800, color: '#10b981', label: 'GREEN' },  // Baner
];

const PoliceHeatmap = () => {
  const { notifications, lastPulse } = useSocket();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(false);
  const [focusCoords, setFocusCoords] = useState(null);

  const filters = ['ALL', 'CRIME', 'CIVIC', 'FIRE', 'MEDICAL'];

  const filteredIncidents = useMemo(() => {
    let list = notifications;
    if (activeFilter !== 'ALL') {
      list = list.filter(item => item.type === activeFilter);
    }
    if (searchQuery) {
      list = list.filter(item => 
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [notifications, activeFilter, searchQuery]);

  // Effect to auto-focus on high severity pulses
  useEffect(() => {
    if (lastPulse?.severity === 'high') {
      setFocusCoords(lastPulse.coords);
    }
  }, [lastPulse]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="text-xl font-outfit font-extrabold text-slate-900 dark:text-white">Real-Time Crime Heatmap</h2>
            <p className="text-xs text-slate-500 font-medium">Live sync with Pune Police Dispatch System &bull; <span className="text-emerald-500 font-bold">{notifications.length} events tracked</span></p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
             {filters.map(f => (
               <button
                 key={f}
                 onClick={() => setActiveFilter(f)}
                 className={cn(
                   "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                   activeFilter === f ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"
                 )}
               >
                 {f}
               </button>
             ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by sector..." 
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs w-48 dark:text-white"
            />
          </div>

          <button 
            onClick={() => setShowList(!showList)}
            className={cn(
              "p-2 rounded-xl border transition-all",
              showList ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500"
            )}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-[500px] xl:min-h-0 relative">
        {/* Map Container */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
          <SmartMap 
            incidents={filteredIncidents} 
            hotspots={mockHotspots}
            stations={PUNE_STATIONS}
            center={focusCoords || [18.5204, 73.8567]}
            zoom={focusCoords ? 14 : 12}
          />
          
          {/* Real-time Stats Overlay */}
          <div className="absolute top-8 left-8 z-10 flex flex-col gap-3 pointer-events-none">
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 w-[calc(100vw-2rem)] sm:w-64 pointer-events-auto"
             >
               <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Activity size={12} className="text-indigo-500" />
                   Live Pulse
                 </span>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
               </div>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Active Alerts</p>
                     <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{notifications.length}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-rose-500 uppercase">Critical</p>
                     <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{notifications.filter(n => n.severity === 'high').length}</p>
                   </div>
                 </div>
                 
                 <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                 
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
                     <Users size={16} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Field Response</p>
                     <p className="text-xs font-bold text-slate-700 dark:text-slate-200">24 Units Active</p>
                   </div>
                 </div>
               </div>
             </motion.div>

             <AnimatePresence>
               {lastPulse && (
                 <motion.div
                   initial={{ scale: 0.8, opacity: 0, y: 10 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   exit={{ scale: 0.8, opacity: 0, y: -10 }}
                   className="bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-64 pointer-events-auto border border-white/20"
                 >
                    <div className="flex items-center gap-2 mb-2">
                      <Crosshair size={14} className="animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">New Incident Detected</span>
                    </div>
                    <p className="text-xs font-bold mb-1">{lastPulse.title}</p>
                    <p className="text-[10px] text-indigo-100 italic">"{lastPulse.location}"</p>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Map Legend (Mini) */}
          <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-2xl border border-white/50 dark:border-slate-800 flex gap-4 pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar List (Conditional) */}
        <AnimatePresence>
          {showList && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-outfit font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">Active Feed</h3>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full">{filteredIncidents.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredIncidents.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setFocusCoords(item.coords)}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                        item.severity === 'high' ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"
                      )}>
                        {item.type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">{item.time}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 flex items-center gap-1">
                      <Crosshair size={10} /> {item.location}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PoliceHeatmap;
