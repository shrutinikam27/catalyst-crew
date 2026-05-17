import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, Shield } from 'lucide-react';

const ActiveMissions = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
            Active Missions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Track and manage your currently assigned response missions.
          </p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-2">
          <Activity size={16} className="text-indigo-600 animate-pulse" />
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Live Tracking</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-6">
        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Missions</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You currently have no active assigned missions. When you accept an SOS alert from the Nearby Alerts panel, it will appear here for tracking and resolution.
          </p>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-xs"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ActiveMissions;
