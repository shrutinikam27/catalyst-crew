import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, MapPin, AlertTriangle, Send, 
  ChevronDown, Info, Shield, ShieldAlert
} from 'lucide-react';
import { cn } from '../../utils/cn';

const ReportIncident = () => {
  const [severity, setSeverity] = useState('moderate');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Report an Incident</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Your reports help authorities respond faster and keep the city safe.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        {/* Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Incident Category</label>
                <div className="relative group">
                  <select className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold appearance-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all cursor-pointer">
                    <option>Crime / Theft</option>
                    <option>Accident / Medical</option>
                    <option>Fire Emergency</option>
                    <option>Civic / Infrastructure</option>
                    <option>Harassment</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Severity Level</label>
                <div className="flex gap-2">
                  {['low', 'moderate', 'high'].map((lvl) => (
                    <button 
                      key={lvl}
                      onClick={() => setSeverity(lvl)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border-2 transition-all",
                        severity === lvl 
                          ? lvl === 'high' ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" :
                            lvl === 'moderate' ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200" :
                            "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                          : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                placeholder="Describe the incident in detail..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Evidence / Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <button className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 group hover:border-indigo-500 transition-all">
                  <Camera size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Upload</span>
                </button>
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 transition-all group active:scale-95">
            <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            Submit Report
          </button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                <MapPin size={14} />
                Live Location
              </div>
              <div className="h-40 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Map Placeholder</p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                We've automatically detected your location. You can drag the pin to adjust.
              </p>
            </div>
            <Shield size={100} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <Info size={14} />
              Important
            </div>
            <ul className="space-y-3">
              {[
                'Provide clear descriptions',
                'Upload images if possible',
                'Report genuine incidents',
                'False reporting is illegal'
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-indigo-500">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
