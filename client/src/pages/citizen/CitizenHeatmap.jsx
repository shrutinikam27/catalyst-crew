import React from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, Map as MapIcon, Layers, 
  Search, Shield, AlertTriangle, 
  CheckCircle, MoreHorizontal, Maximize2
} from 'lucide-react';
import { cn } from '../../utils/cn';

const CitizenHeatmap = () => {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Filter size={18} />
          </div>
          <div className="flex gap-2">
            {['Crime', 'Accidents', 'Civic', 'Safe Zones'].map((tag) => (
              <button key={tag} className="px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search area..." 
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:text-indigo-600 transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Main Map */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 animate-spin opacity-50"></div>
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Initializing Smart Map...</p>
          </div>
          
          {/* Overlay Map UI */}
          <div className="absolute top-6 left-6 z-10 space-y-3">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-800 w-64">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Shield size={14} className="text-indigo-500" />
                Zone Safety Index
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Shivaji Nagar', score: 8.4, status: 'safe' },
                  { name: 'Hadapsar', score: 4.2, status: 'high-risk' },
                  { name: 'Kothrud', score: 9.1, status: 'very-safe' },
                ].map((zone) => (
                  <div key={zone.name} className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{zone.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            zone.status === 'very-safe' ? "bg-emerald-500" :
                            zone.status === 'safe' ? "bg-indigo-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${zone.score * 10}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400">{zone.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-10">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-xl shadow-xl border border-white/50 dark:border-slate-800 flex flex-col gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><MapIcon size={18} /></button>
              <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><Layers size={18} /></button>
            </div>
          </div>
        </div>

        {/* Legend/Info Panel */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto hidden xl:flex">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Map Legend</h3>
            <div className="space-y-4">
              {[
                { label: 'High Crime Zone', color: 'bg-rose-500', desc: 'Reported incidents > 10' },
                { label: 'Accident Prone', color: 'bg-amber-500', desc: 'Multiple reports this week' },
                { label: 'Sanitized Area', color: 'bg-emerald-500', desc: 'Frequent police patrols' },
                { label: 'Live Incident', color: 'bg-indigo-500', desc: 'Active emergency response' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className={cn("w-2 h-10 rounded-full flex-shrink-0", item.color)}></div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{item.label}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Risk Insights</h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-[10px] font-bold uppercase">AI Prediction</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed">
                  Traffic density near Shivaji Nagar is expected to increase by 20% in the next hour.
                </p>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase">Patrol Update</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed">
                  Area Sanitization completed for Zone-4 Kothrud.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenHeatmap;
