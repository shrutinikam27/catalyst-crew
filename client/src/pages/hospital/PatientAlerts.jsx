import React, { useState, useEffect } from 'react';
import {
  Bell,
  Activity,
  User,
  MapPin,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  Thermometer,
  Droplet,
  ExternalLink,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const initialAlerts = [
  {
    id: 1,
    type: 'INCOMING_CRITICAL',
    patient: 'Aditya Deshmukh',
    age: '58M',
    vitals: { hr: '112 bpm', bp: '90/60', ox: '88%' },
    eta: '3 mins',
    condition: 'Acute Myocardial Infarction',
    ambulance: 'AMB-7721',
    status: 'URGENT',
    time: 'Just Now'
  },
  {
    id: 2,
    type: 'ARRIVING_SOON',
    patient: 'Sunita Patil',
    age: '32F',
    vitals: { hr: '98 bpm', bp: '110/70', ox: '94%' },
    eta: '7 mins',
    condition: 'Trauma - Fracture',
    ambulance: 'AMB-8832',
    status: 'STABLE',
    time: '2 mins ago'
  }
];

const PatientAlerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [bedStatus, setBedStatus] = useState({
    icu: { total: 10, occupied: 8 },
    er: { total: 20, occupied: 15 },
    general: { total: 50, occupied: 42 }
  });

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const socket = io(SOCKET_URL);

    socket.on('city_pulse', (pulse) => {
      if (pulse.type === 'MEDICAL') {
        const newAlert = {
          id: pulse.id,
          type: pulse.severity === 'high' ? 'INCOMING_CRITICAL' : 'ARRIVING_SOON',
          patient: 'Reported Subject',
          age: 'N/A',
          vitals: {
            hr: `${70 + Math.floor(Math.random() * 50)} bpm`,
            bp: 'Pending',
            ox: `${85 + Math.floor(Math.random() * 15)}%`
          },
          eta: '6 mins',
          condition: pulse.title,
          ambulance: `AMB-${pulse.id.slice(0, 4).toUpperCase()}`,
          status: pulse.severity === 'high' ? 'CRITICAL' : 'URGENT',
          time: 'Just Now'
        };

        setAlerts(prev => [newAlert, ...prev].slice(0, 10));

        // Slightly fluctuate bed status for realism
        if (Math.random() > 0.7) {
          setBedStatus(prev => ({
            ...prev,
            er: { ...prev.er, occupied: Math.min(prev.er.total, prev.er.occupied + 1) }
          }));
        }
      }
    });

    return () => socket.disconnect();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'URGENT': return 'bg-rose-500 text-white';
      case 'CRITICAL': return 'bg-rose-600 text-white animate-pulse';
      case 'STABLE': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Patient Alert Center</h1>
              <p className="text-slate-500 dark:text-slate-400">Monitoring {alerts.length} active emergencies across Pune Metro.</p>
            </div>
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 z-10 animate-ping"></div>
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl">
                <Bell size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <BedStat label="ICU Beds" occupied={bedStatus.icu.occupied} total={bedStatus.icu.total} color="rose" />
            <BedStat label="ER Bays" occupied={bedStatus.er.occupied} total={bedStatus.er.total} color="amber" />
            <BedStat label="General" occupied={bedStatus.general.occupied} total={bedStatus.general.total} color="indigo" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Staff on Duty</span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                    DR
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                  +12
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Emergency Protocol</h3>
            <p className="text-sm text-indigo-200/70 leading-relaxed mb-6">
              Current protocol: LEVEL 2 (Elevated Awareness). Trauma team alpha is on standby for Zone 4.
            </p>
          </div>
          <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
            Update Protocol <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Alert Feed */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Emergency Feed</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Clock size={14} /> Auto-refreshing via Socket
            </div>
          </div>

          <AnimatePresence>
            {alerts.map((alert, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={alert.id}
                className="group p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:border-rose-200 dark:hover:border-rose-900/50 transition-all"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 shrink-0 ${alert.status === 'CRITICAL' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                      <Activity size={24} className={alert.status === 'CRITICAL' ? 'animate-bounce' : ''} />
                      <span className="text-[8px] font-black">{alert.time}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{alert.patient}</h3>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[10px] font-bold">{alert.age}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <AlertTriangle size={14} /> {alert.condition}
                      </p>
                      <div className="flex items-center gap-6 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                        <VitalStat icon={Heart} value={alert.vitals.hr} label="HR" />
                        <VitalStat icon={Droplet} value={alert.vitals.bp} label="BP" />
                        <VitalStat icon={Thermometer} value={alert.vitals.ox} label="SpO2" />
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETA / Location</div>
                      <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 justify-end">
                        <Clock size={18} className="text-indigo-500" /> {alert.eta}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                        Prepare Bay
                      </button>
                      <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle size={20} className="text-indigo-500" /> Bay Assignments
            </h3>
            <div className="space-y-4">
              <AssignmentItem bay="ER-01" status="Occupied" patient="R. Sharma" />
              <AssignmentItem bay="ER-02" status="Available" patient="Ready" isAvailable />
              <AssignmentItem bay="ER-03" status="Occupied" patient="M. Khan" />
              <AssignmentItem bay="ICU-05" status="Cleaning" patient="Wait" />
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Plus size={16} /> Assign New Bay
            </button>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30">
            <h3 className="text-indigo-900 dark:text-indigo-100 font-bold mb-4">Upcoming Arrivals</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Ambulance AMB-4410</span>
                <span className="ml-auto font-bold text-slate-900 dark:text-white">12:10</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Private Transport</span>
                <span className="ml-auto font-bold text-slate-900 dark:text-white">12:25</span>
              </div>
            </div>
            <button className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-2 hover:underline">
              View Schedule <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BedStat = ({ label, occupied, total, color }) => {
  const percent = (occupied / total) * 100;
  const colors = {
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{occupied}/{total}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={`h-full ${colors[color]}`}
        />
      </div>
    </div>
  );
};

const VitalStat = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2">
    <Icon size={12} className="text-slate-400" />
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-900 dark:text-white leading-none">{value}</span>
      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
  </div>
);

const AssignmentItem = ({ bay, status, patient, isAvailable }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
      <span className="text-xs font-bold text-slate-900 dark:text-white">{bay}</span>
    </div>
    <div className="text-right">
      <div className={`text-[9px] font-black uppercase tracking-widest ${isAvailable ? 'text-emerald-500' : 'text-slate-400'}`}>{status}</div>
      <div className="text-[10px] font-bold text-slate-500">{patient}</div>
    </div>
  </div>
);

export default PatientAlerts;
