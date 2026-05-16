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
import { useAuth } from '../../firebase/AuthContext';

const VolunteerDashboard = () => {
  const { currentUser } = useAuth();
  const initials = currentUser?.displayName 
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : (currentUser?.email ? currentUser.email[0].toUpperCase() : 'U');

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
            <StatCard title="Response Score" value="0/100" icon={Star} trend="0%" />
            <StatCard title="Missions" value="0" icon={CheckCircle} trend="0" />
            <StatCard title="People Helped" value="0" icon={Heart} trend="0" />
          </div>

          {/* Active Missions */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              Nearby Emergency Alerts
            </h3>
            <div className="grid sm:grid-cols-1 gap-4">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap size={24} className="text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">No Active Alerts</h4>
                <p className="text-xs text-slate-500">Live citizen emergency requests will appear here once connected.</p>
              </div>
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
                {initials}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-outfit font-bold text-slate-900 dark:text-white">
                {currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Volunteer')}
              </h3>
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
                  <span className="text-lg font-outfit font-bold">0%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[0%] bg-amber-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">
                "Complete your first mission to start tracking progress."
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
