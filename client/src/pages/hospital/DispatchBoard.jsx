import React, { useState, useEffect } from 'react';
import {
  Ambulance,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Search,
  Filter,
  Navigation,
  Phone,
  User,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const initialDispatches = [
  {
    id: 'AMB-7721',
    type: 'CARDIAC_ARREST',
    location: 'Kothrud, Pune - Near MIT College',
    status: 'EN_ROUTE',
    priority: 'CRITICAL',
    time: '12:45 PM',
    eta: '4 mins',
    patient: 'Rahul Sharma (45M)',
    crew: 'Dr. Patil | Paramedic Iyer'
  },
  {
    id: 'AMB-8832',
    type: 'TRAFFIC_ACCIDENT',
    location: 'Shivajinagar - Near Railway Station',
    status: 'AT_SCENE',
    priority: 'HIGH',
    time: '12:30 PM',
    eta: 'Arrived',
    patient: 'Multiple (2 victims)',
    crew: 'Dr. Deshpande | Paramedic Khan'
  },
  {
    id: 'AMB-4410',
    type: 'RESPIRATORY_DISTRESS',
    location: 'Baner - High Street Area',
    status: 'RETURNING',
    priority: 'MEDIUM',
    time: '12:15 PM',
    eta: '8 mins',
    patient: 'Sita Bai (72F)',
    crew: 'Dr. Joshi | Paramedic Sawant'
  },
  {
    id: 'AMB-9905',
    type: 'PREGNANCY_EMERGENCY',
    location: 'Viman Nagar - Symbiosis Road',
    status: 'DISPATCHED',
    priority: 'HIGH',
    time: '12:50 PM',
    eta: '12 mins',
    patient: 'Anjali V. (28F)',
    crew: 'Dr. Kulkarni | Nurse More'
  }
];

const DispatchBoard = () => {
  const [dispatches, setDispatches] = useState(initialDispatches);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8080');

    socket.on('city_pulse', (pulse) => {
      if (pulse.type === 'MEDICAL') {
        const newDispatch = {
          id: `AMB-${pulse.id.slice(0, 4).toUpperCase()}`,
          type: pulse.title.toUpperCase().replace(' ', '_'),
          location: `${pulse.location} - ${pulse.message.split('.')[0]}`,
          status: 'DISPATCHED',
          priority: pulse.severity.toUpperCase(),
          time: new Date(pulse.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          eta: 'Calculating...',
          patient: 'Reported Subject',
          crew: 'Pending Assignment'
        };

        setDispatches(prev => [newDispatch, ...prev].slice(0, 10));
      }
    });

    return () => socket.disconnect();
  }, []);

  const statusColors = {
    EN_ROUTE: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    AT_SCENE: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    RETURNING: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    DISPATCHED: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    COMPLETED: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  };

  const priorityColors = {
    CRITICAL: 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none',
    HIGH: 'bg-orange-500 text-white',
    MEDIUM: 'bg-blue-500 text-white',
    LOW: 'bg-slate-500 text-white'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <Ambulance size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Active Dispatch Board</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Monitoring {dispatches.length} active ambulance units across Pune Metro.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search ambulance or location..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl w-64 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 dark:shadow-none">
            <Zap size={16} />
            New Dispatch
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Units" value="12" subValue={`${dispatches.filter(d => d.status !== 'COMPLETED').length} Active`} icon={Ambulance} color="rose" />
        <StatCard label="Avg Response" value="8.4m" subValue="-1.2m today" icon={Clock} color="indigo" />
        <StatCard label="Critical Cases" value={dispatches.filter(d => d.priority === 'CRITICAL').length} subValue="Immediate attention" icon={AlertCircle} color="amber" />
        <StatCard label="Completed" value="28" subValue="Last 24 hours" icon={CheckCircle2} color="emerald" />
      </div>

      {/* Dispatch List */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white">Active Transports</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit ID</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority & Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ETA</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {dispatches.map((item, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={item.id}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                          {item.id.includes('-') ? item.id.split('-')[1] : '...'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${priorityColors[item.priority] || 'bg-slate-500'}`}>
                          {item.priority}
                        </span>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.type.replace('_', ' ')}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-2 max-w-xs">
                        <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.location}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <User size={10} /> {item.patient}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusColors[item.status]}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.eta}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                          <Navigation size={14} />
                        </button>
                        <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                          <Phone size={14} />
                        </button>
                        <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing {dispatches.length} active dispatches across all sectors.</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">Previous</button>
            <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subValue, icon: Icon, color }) => {
  const colors = {
    rose: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/20 dark:text-rose-400',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/20 dark:text-indigo-400',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20 dark:text-amber-400',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20 dark:text-emerald-400'
  };

  return (
    <div className={`p-6 rounded-[2rem] border ${colors[color]} flex items-center justify-between group hover:translate-y-[-4px] transition-all duration-300`}>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</p>
        <div className="text-2xl font-black">{value}</div>
        <p className="text-[10px] font-bold opacity-60">{subValue}</p>
      </div>
      <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl transition-transform group-hover:scale-110">
        <Icon size={24} />
      </div>
    </div>
  );
};

export default DispatchBoard;
