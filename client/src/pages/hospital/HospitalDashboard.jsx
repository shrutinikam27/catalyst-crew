import React from 'react';
import { motion } from 'framer-motion';
import { 
  Ambulance, Heart, Activity, Clock, 
  MapPin, AlertCircle, Phone, User,
  Navigation, CheckCircle, MoreHorizontal
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { cn } from '../../utils/cn';

const HospitalDashboard = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Emergencies" value="12" icon={AlertCircle} trend="5%" trendType="up" />
        <StatCard title="Ambulances Active" value="08" icon={Ambulance} trend="2" />
        <StatCard title="Critical Cases" value="03" icon={Heart} trend="1" trendType="down" />
        <StatCard title="Avg. Dispatch" value="2.4m" icon={Clock} trend="12s" trendType="down" />
      </div>

      {/* Main Board */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Dispatch Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">Live EMS Dispatch Board</h3>
              <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { id: 'EMS-901', type: 'Cardiac Arrest', loc: 'Pune Univ Rd', eta: '4 min', status: 'En Route', color: 'bg-rose-500' },
                { id: 'EMS-904', type: 'Accident/Trauma', loc: 'Kothrud Ph 2', eta: '12 min', status: 'Dispatched', color: 'bg-amber-500' },
                { id: 'EMS-898', type: 'Pediatric Care', loc: 'Baner Hills', eta: 'Arrived', status: 'On Site', color: 'bg-emerald-500' },
              ].map((ems) => (
                <div key={ems.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all flex items-center gap-6">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", ems.color)}>
                    <Ambulance size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{ems.type}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{ems.id}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin size={10} /> {ems.loc}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock size={10} /> ETA: {ems.eta}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-extrabold uppercase px-2 py-1 rounded",
                      ems.status === 'On Site' ? "bg-emerald-100 text-emerald-600" :
                      ems.status === 'En Route' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {ems.status}
                    </span>
                    <button className="block mt-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 underline">Track Live</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hospital Capacity */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Hospital Capacity</h3>
            <div className="space-y-6">
              {[
                { name: 'Emergency Beds', current: 12, total: 15, color: 'bg-rose-500' },
                { name: 'ICU Units', current: 4, total: 6, color: 'bg-indigo-500' },
                { name: 'Ambulances', current: 8, total: 10, color: 'bg-emerald-500' },
                { name: 'Blood Bank', current: 85, total: 100, color: 'bg-rose-600' },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{item.name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.current}/{item.total}</span>
                  </div>
                  <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${(item.current/item.total)*100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} /> Critical Alert
              </h4>
              <p className="text-sm font-bold font-outfit">Mass Casualty Protocol Enabled for Central Pune</p>
              <p className="text-[11px] text-slate-400 font-medium">Please ensure all trauma teams are on high alert for the next 4 hours.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-bold uppercase transition-all">
                Acknowledge Protocol
              </button>
            </div>
            <Activity size={100} className="absolute -right-6 -bottom-6 text-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
