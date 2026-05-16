import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, AlertTriangle, MapPin, 
  Truck, Users, Activity, FileText,
  Clock, CheckCircle, Search
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { cn } from '../../utils/cn';

const fireData = [
  { name: 'Jan', reports: 30, resolved: 28 },
  { name: 'Feb', reports: 25, resolved: 25 },
  { name: 'Mar', reports: 42, resolved: 39 },
  { name: 'Apr', reports: 55, resolved: 50 },
  { name: 'May', reports: 60, resolved: 58 },
  { name: 'Jun', reports: 45, resolved: 40 },
];

const FireDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
            Fire Brigade Command Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            City-wide fire response, hazard management, and dispatch operations.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 dark:shadow-none">
            Export Report
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
            Filter Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Emergencies" value="8" icon={Flame} trend="15%" trendType="up" />
        <StatCard title="Engines Deployed" value="14" icon={Truck} trend="2" trendType="up" />
        <StatCard title="Resolution Rate" value="96%" icon={CheckCircle} trend="1.2%" trendType="up" />
        <StatCard title="Avg. Response Time" value="4.2m" icon={Clock} trend="12%" trendType="down" />
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartCard title="Fire Incidents vs Resolutions" subtitle="Monthly tracking of brigade performance">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={fireData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(234, 88, 12, 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="reports" fill="#ea580c" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fire Hazard Density Heatmap" subtitle="High-risk zones and industrial areas">
          <div className="relative h-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center">
            <Flame size={48} className="text-slate-300 dark:text-slate-800" />
            <p className="absolute bottom-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone Map Placeholder</p>
            {/* Mock Heat Spots */}
            <div className="absolute w-24 h-24 bg-orange-500/20 blur-2xl rounded-full top-1/4 left-1/3"></div>
            <div className="absolute w-32 h-32 bg-red-500/10 blur-3xl rounded-full bottom-1/4 right-1/4"></div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-outfit font-bold text-slate-900 dark:text-white">Active Dispatch Logs</h3>
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unit Assigned</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { id: '#FIRE-1021', type: 'Building Fire', loc: 'Hinjewadi IT Park', priority: 'Critical', unit: 'Engine 42', status: 'On Scene' },
                { id: '#FIRE-1022', type: 'Chemical Spill', loc: 'Bhosari MIDC', priority: 'High', unit: 'Hazmat 03', status: 'En Route' },
                { id: '#FIRE-1023', type: 'Vehicle Fire', loc: 'Pune-Mumbai Expressway', priority: 'Moderate', unit: 'Engine 12', status: 'Extinguishing' },
                { id: '#FIRE-1024', type: 'Smoke Report', loc: 'Koregaon Park', priority: 'Low', unit: 'Engine 05', status: 'Investigating' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-orange-600 dark:text-orange-400">{row.id}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{row.type}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.loc}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-extrabold uppercase",
                      row.priority === 'Critical' ? "bg-red-100 text-red-600" :
                      row.priority === 'High' ? "bg-orange-100 text-orange-600" :
                      row.priority === 'Moderate' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{row.unit}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
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

export default FireDashboard;
