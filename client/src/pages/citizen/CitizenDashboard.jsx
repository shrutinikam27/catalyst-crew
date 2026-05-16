import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, AlertCircle, MessageSquare, 
  MapPin, Zap, TrendingUp, Users, Heart
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import AlertCard from '../../components/ui/AlertCard';
import ChartCard from '../../components/ui/ChartCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { cn } from '../../utils/cn';

const data = [
  { name: 'Mon', accidents: 4, crime: 2 },
  { name: 'Tue', accidents: 3, crime: 5 },
  { name: 'Wed', accidents: 2, crime: 1 },
  { name: 'Thu', accidents: 6, crime: 3 },
  { name: 'Fri', accidents: 8, crime: 6 },
  { name: 'Sat', accidents: 5, crime: 4 },
  { name: 'Sun', accidents: 4, crime: 2 },
];

const CitizenDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
          Good Morning, Citizen
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          The safety index in your current zone is <span className="text-emerald-500 font-bold">Stable (8.4/10)</span>.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Safe Routes" 
          value="12 Available" 
          icon={ShieldCheck} 
          trend="8%" 
          description="Based on real-time crime data"
        />
        <StatCard 
          title="Active Alerts" 
          value="03" 
          icon={AlertCircle} 
          trend="2%" 
          trendType="down"
          description="Within 5km of your location"
        />
        <StatCard 
          title="Civic Reports" 
          value="48" 
          icon={MessageSquare} 
          trend="15%" 
          description="Issues resolved in your ward"
        />
        <StatCard 
          title="SOS Contacts" 
          value="05" 
          icon={Users} 
          description="Verified emergency contacts"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          {/* Chart Section */}
          <ChartCard title="Weekly Safety Trends" subtitle="Crime vs Accident frequency in your city">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="accidents" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAccidents)" />
                <Area type="monotone" dataKey="crime" stroke="#f43f5e" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Report Crime', icon: ShieldCheck, color: 'bg-rose-500' },
              { name: 'Civic Issue', icon: MessageSquare, color: 'bg-indigo-500' },
              { name: 'SOS Help', icon: Zap, color: 'bg-amber-500' },
              { name: 'Safe Path', icon: MapPin, color: 'bg-emerald-500' },
            ].map((action) => (
              <button key={action.name} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group text-center">
                <div className={cn("w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg", action.color)}>
                  <action.icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                  {action.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Nearby Alerts */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white mb-6">Nearby Alerts</h3>
            <div className="space-y-4">
              <AlertCard 
                title="Road Construction" 
                type="Heavy machinery on Baner Road"
                location="Baner, Pune"
                time="10 mins ago"
                severity="moderate"
              />
              <AlertCard 
                title="Fire Outbreak" 
                type="Building fire reported"
                location="Kothrud, Pune"
                time="25 mins ago"
                severity="high"
              />
              <AlertCard 
                title="Rain Alert" 
                type="Heavy showers expected"
                location="Central Pune"
                time="1 hr ago"
                severity="low"
              />
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
              View All Alerts
            </button>
          </div>

          {/* Safety Tip Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden group shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Heart size={24} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-bold font-outfit leading-tight">Safety Tip <br /> of the day</h3>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                "Keep your emergency contacts updated and always share your live location when traveling late at night."
              </p>
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
                Learn More
              </button>
            </div>
            <ShieldCheck size={120} className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
