import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Bell, Activity, User, 
  MapPin, Clock, Star, Zap,
  CheckCircle, MessageSquare, Heart,
  Shield, Navigation
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import AlertCard from '../../components/ui/AlertCard';
import { cn } from '../../utils/cn';

const VolunteerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
              Volunteer Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              You are currently <span className="text-emerald-500 font-bold">Active & Available</span> for response.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <StatCard title="Response Score" value="98/100" icon={Star} trend="2%" />
            <StatCard title="Missions" value="42" icon={CheckCircle} trend="5" />
            <StatCard title="People Helped" value="128" icon={Heart} trend="12" />
          </div>

          {/* Active Missions */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              Nearby Emergency Alerts
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'First Aid Required', distance: '1.2km', loc: 'Pune Univ Circle', time: '2m ago', severity: 'high' },
                { title: 'Traffic Assistance', distance: '0.8km', loc: 'Aundh Bridge', time: '5m ago', severity: 'moderate' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "p-3 rounded-xl",
                      item.severity === 'high' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    )}>
                      <Zap size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {item.loc} • {item.distance}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-indigo-700 transition-all">
                      Accept
                    </button>
                    <button className="flex-1 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Volunteer Status Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-emerald-100 dark:shadow-none">
                JD
              </div>
            </div>
            <div>
              <h3 className="text-xl font-outfit font-bold text-slate-900 dark:text-white">John Doe</h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">Certified First Responder</p>
            </div>
            <div className="flex justify-center gap-2">
              {['CERTIFIED', 'QUICK RESPONSE', 'TOP 1%'].map(badge => (
                <span key={badge} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-[8px] font-extrabold text-slate-500 dark:text-slate-400 rounded-md uppercase tracking-tighter">
                  {badge}
                </span>
              ))}
            </div>
            <button className="w-full py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all text-xs uppercase tracking-widest">
              Go Offline
            </button>
          </div>

          {/* Achievement Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden group shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-widest">
                <Star size={12} /> Next Level: Elite Responder
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                  <span className="text-lg font-outfit font-bold">85%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-amber-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">
                "Complete 8 more missions to unlock the 'Life Saver' badge."
              </p>
            </div>
            <Activity size={100} className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
