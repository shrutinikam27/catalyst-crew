import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, Shield, Activity, Users, 
  MapPin, AlertTriangle, CheckCircle, 
  Settings, Download, Search, Briefcase, Globe
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, LineChart, Line, XAxis
} from 'recharts';
import { cn } from '../../utils/cn';

const cityData = [
  { name: 'Crime Prevention', value: 400 },
  { name: 'Medical Response', value: 300 },
  { name: 'Traffic Safety', value: 300 },
  { name: 'Fire Response', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* City Status Banner */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-widest">
              <Globe size={12} /> City Command Status: Operational
            </div>
            <h1 className="text-4xl font-outfit font-extrabold">Smart City <br /> Safety Overview</h1>
            <p className="text-indigo-100 font-medium max-w-md">
              Monitoring 12 wards, 48 active patrols, and 1.2M citizens in real-time. System integrity at 99.8%.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl border border-white/20 transition-all group">
              <Settings size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
            <button className="px-6 py-4 bg-white text-indigo-600 font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-50 transition-all">
              <Download size={20} />
              Full Report
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Incidents" value="12,482" icon={AlertTriangle} trend="4.2%" trendType="down" />
        <StatCard title="Active Volunteers" value="842" icon={Users} trend="12%" trendType="up" />
        <StatCard title="Dept. Response" value="94.8%" icon={Activity} trend="2.1%" trendType="up" />
        <StatCard title="Zones Sanitized" value="82%" icon={Shield} trend="5%" trendType="up" />
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        <ChartCard title="Resource Allocation" subtitle="Distribution across departments" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={cityData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {cityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Live Incident Feed" subtitle="Real-time event log" className="lg:col-span-2">
          <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2 scrollbar-hide">
            {[
              { id: 1, type: 'SOS Alert', loc: 'Wakad Sector 2', time: 'Just Now', status: 'Police Assigned' },
              { id: 2, type: 'Fire Report', loc: 'Hinjewadi Ph 3', time: '2m ago', status: 'Fire Engine En-route' },
              { id: 3, type: 'Medical Emergency', loc: 'Magarpatta City', time: '5m ago', status: 'Ambulance Dispatched' },
              { id: 4, type: 'Power Outage', loc: 'Koregaon Park', time: '12m ago', status: 'Maintenance Alert' },
              { id: 5, type: 'Accident', loc: 'Katraj Tunnel', time: '15m ago', status: 'Highway Patrol Notified' },
            ].map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-500/20 transition-all group">
                <div className="w-1.5 h-10 rounded-full bg-indigo-500"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{log.type}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={10} className="text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-500">{log.loc}</span>
                    <span className="text-indigo-500 text-xs mx-1">•</span>
                    <span className="text-[11px] font-bold text-emerald-500">{log.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Department Performance */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Police Dept.', icon: Shield, efficiency: 98, color: 'text-indigo-500' },
          { name: 'Medical Svc.', icon: Activity, efficiency: 92, color: 'text-emerald-500' },
          { name: 'Fire Dept.', icon: MapPin, efficiency: 88, color: 'text-rose-500' },
          { name: 'Civic Svc.', icon: Briefcase, efficiency: 75, color: 'text-amber-500' },
        ].map((dept) => (
          <div key={dept.name} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800", dept.color)}>
                <dept.icon size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{dept.name}</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Efficiency</span>
                <span className="text-lg font-outfit font-bold text-slate-900 dark:text-white">{dept.efficiency}%</span>
              </div>
              <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.efficiency}%` }}
                  className={cn("h-full rounded-full", dept.color.replace('text', 'bg'))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
