import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, MapPin, Clock, Navigation, 
  Phone, ShieldAlert, Heart, User,
  CheckCircle, ArrowRight, Activity, Filter
} from 'lucide-react';
import SmartMap from '../../components/map/SmartMap';
import { useSocket } from '../../context/SocketContext';
import { cn } from '../../utils/cn';

const staticAlerts = [
  {
    id: 1,
    title: 'Medical Emergency',
    description: 'Elderly person fainted, suspected cardiac issue. First aid required.',
    location: 'Shivaji Nagar, Sector 2',
    distance: '0.4km',
    time: '2 mins ago',
    severity: 'critical',
    type: 'medical',
    coords: [18.5312, 73.8445]
  }
];

const NearbyEmergencies = () => {
  const { notifications } = useSocket();

  const activeAlerts = [
    ...notifications.map(n => ({
      id: n.id,
      title: n.title || n.message,
      description: n.message,
      location: n.location || 'Pune Sector',
      distance: 'Live',
      time: n.time,
      severity: n.severity || 'high',
      type: n.type === 'CRIME' ? 'safety' : 'medical',
      coords: n.coords || [18.5312, 73.8445]
    })),
    ...staticAlerts
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Nearby Emergencies</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time alerts requiring immediate volunteer assistance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Status</span>
            <span className="text-emerald-500 font-black flex items-center gap-1 uppercase tracking-tighter">
              <Activity size={12} className="animate-pulse" /> Active & Online
            </span>
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8">
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
          {activeAlerts.map((alert, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={alert.id} 
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-3 rounded-2xl shadow-lg text-white",
                  alert.severity === 'critical' || alert.severity === 'high' ? "bg-rose-500" : "bg-indigo-500"
                )}>
                  {alert.type === 'medical' ? <Heart size={20} /> : <ShieldAlert size={20} />}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.time}</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{alert.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{alert.description}</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <MapPin size={12} /> {alert.location}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                    <Navigation size={12} /> {alert.distance}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                  Respond
                </button>
                <button className="px-3 py-3 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded-xl hover:bg-slate-100 transition-all">
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
          <SmartMap 
            center={activeAlerts[0]?.coords || [18.5204, 73.8567]}
            incidents={activeAlerts.map(a => ({ id: a.id, type: a.title, severity: a.severity, coords: a.coords }))}
          />
          
          {/* Map Overlay UI */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex gap-4 pointer-events-none">
            <div className="flex-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 pointer-events-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Dispatch: Medical</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status: Emergency Acknowledged</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-outfit font-black text-rose-500">0.4 KM</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Destination</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none">
                  On My Way
                </button>
                <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyEmergencies;
