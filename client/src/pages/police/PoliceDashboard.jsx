import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, MapPin, 
  TrendingUp, Users, Activity, FileText,
  Clock, CheckCircle, Search
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { cn } from '../../utils/cn';

const crimeData = [
  { name: 'Jan', reports: 45, resolved: 38 },
  { name: 'Feb', reports: 52, resolved: 40 },
  { name: 'Mar', reports: 38, resolved: 35 },
  { name: 'Apr', reports: 65, resolved: 55 },
  { name: 'May', reports: 48, resolved: 42 },
  { name: 'Jun', reports: 70, resolved: 60 },
];

const PoliceDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
            Command Center Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Precinct-wide crime analytics and patrol management.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
            Export Report
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
            Filter Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Incidents" value="24" icon={AlertTriangle} trend="12%" trendType="up" />
        <StatCard title="Officer Patrols" value="18" icon={Users} trend="4%" trendType="up" />
        <StatCard title="Resolution Rate" value="92%" icon={CheckCircle} trend="2.4%" trendType="up" />
        <StatCard title="Avg. Response" value="6.5m" icon={Clock} trend="8%" trendType="down" />
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartCard title="Incident Frequency vs Resolutions" subtitle="Monthly tracking of precinct performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={crimeData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="reports" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crime Density Heatmap" subtitle="High-risk zones identified by AI">
          <div className="relative h-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center">
            <MapPin size={48} className="text-slate-300 dark:text-slate-800" />
            <p className="absolute bottom-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone Map Placeholder</p>
            {/* Mock Heat Spots */}
            <div className="absolute w-20 h-20 bg-rose-500/20 blur-2xl rounded-full top-1/4 left-1/3"></div>
            <div className="absolute w-32 h-32 bg-amber-500/10 blur-3xl rounded-full bottom-1/4 right-1/4"></div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-outfit font-bold text-slate-900 dark:text-white">Recent Active Incidents</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search ID..." className="bg-transparent border-none p-0 text-xs focus:ring-0 w-24" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Officer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { id: '#INC-2048', type: 'Grand Theft Auto', loc: 'Hadapsar Sector 4', priority: 'High', officer: 'J. Doe', status: 'In Pursuit' },
                { id: '#INC-2049', type: 'Public Disturbance', loc: 'Baner High St', priority: 'Low', officer: 'S. Smith', status: 'On Route' },
                { id: '#INC-2050', type: 'Vandalism Report', loc: 'Aundh Area', priority: 'Moderate', officer: 'M. Vane', status: 'Investigating' },
                { id: '#INC-2051', type: 'Street Harassment', loc: 'Viman Nagar', priority: 'High', officer: 'B. Wayne', status: 'Officer Assigned' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">{row.id}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{row.type}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.loc}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-extrabold uppercase",
                      row.priority === 'High' ? "bg-rose-100 text-rose-600" :
                      row.priority === 'Moderate' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{row.officer}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{row.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
