import React from 'react';
import { useAuth } from '../firebase/AuthContext';
import PublicNavbar from '../components/PublicNavbar';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] font-inter transition-colors duration-300">
      <PublicNavbar />
      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold ring-1 ring-indigo-100 dark:ring-indigo-800">
              <span className="animate-pulse">🛰️</span> Smart Urban Risk Mapping & Citizen Safety
            </div>
            <h1 className="text-6xl font-outfit font-extrabold text-[#1E293B] dark:text-white leading-[1.1]">
              Predictive Intelligence <br />
              for <span className="text-indigo-600 dark:text-indigo-400">Urban Safety</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              SafeLinks empowers the citizens and authorities of Pune with real-time risk mapping, civic grievance tracking, and AI-driven emergency response prioritization.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none group">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Report Civic Issue
              </button>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Explore Live Map
              </button>
            </div>
            <div className="flex items-center gap-4 py-4 border-t border-slate-100 dark:border-slate-800">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                   </div>
                 ))}
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                 <span className="text-slate-800 dark:text-white font-bold">12k+ Citizens</span> actively reporting in Pune
               </p>
            </div>
          </div>

          <div className="relative animate-float hidden lg:block">
            <img 
              src="/src/assets/hero-illustration.png" 
              alt="City Safety Illustration" 
              className="w-full h-auto drop-shadow-2xl dark:opacity-80"
            />
            {/* Floating Emergency Button */}
            <div className="absolute top-1/2 -right-12 -translate-y-1/2 flex flex-col items-center gap-4">
               <button className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-[0_0_50px_rgba(220,38,38,0.5)] border-8 border-white dark:border-slate-900 animate-pulse hover:scale-110 transition-transform active:scale-95 group relative">
                  <span className="relative z-10">SOS</span>
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
               </button>
               <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">
                  <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest whitespace-nowrap">Instant Trigger</span>
               </div>
            </div>
            {/* Overlay Dashboard Snippet */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-6 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 max-w-[240px] animate-pulse">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Predictive Safety Score</span>
               </div>
               <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">84%</div>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                 <div className="w-[84%] h-full bg-indigo-600"></div>
               </div>
               <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 italic">Risk level: Low in Core City areas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Grievance Section */}
      <section className="px-6 max-w-[1400px] mx-auto mb-24">
        <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-outfit font-black mb-6 leading-tight">
                Empowering Governance <br /> with Data
              </h2>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
                SafeLinks bridges the gap between citizens and authorities by integrating crime statistics from Pune Police and civic grievances from PMC.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">📍</div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Hotspot Mapping</h4>
                    <p className="text-indigo-100/70 text-sm">Identifying high-risk regions based on crime and civic density.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">⚖️</div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Response Prioritization</h4>
                    <p className="text-indigo-100/70 text-sm">Automated dispatch based on demographic urgency and risk level.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <div className="text-4xl font-black mb-2">452</div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Active Grievances</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <div className="text-4xl font-black mb-2">92%</div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Resolution Rate</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <div className="text-4xl font-black mb-2">12m</div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Avg Response Time</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <div className="text-4xl font-black mb-2">6.4k</div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Monthly Reports</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Preview */}
      <section className="px-6 max-w-[1400px] mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-12 pb-24">
        {/* Map Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Smart Urban Risk Map</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live data integration from PMC & Pune Police</p>
            </div>
            <div className="flex items-center gap-3">
               <select className="bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-100 dark:ring-slate-700 px-4 py-2 rounded-xl text-xs font-bold dark:text-white outline-none">
                 <option>All Hazards</option>
                 <option>Crime Hotspots</option>
                 <option>Civic Issues</option>
               </select>
               <button className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
               </button>
            </div>
          </div>
          <div className="w-full aspect-video bg-indigo-50 dark:bg-slate-900 rounded-3xl relative overflow-hidden border border-indigo-100 dark:border-slate-700">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 font-bold text-4xl opacity-20">PUNE METRO</div>
            
            {/* Crime Pins */}
            <div className="absolute top-1/4 left-1/4 group cursor-pointer">
              <div className="w-12 h-12 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">High Crime Zone</div>
            </div>
            
            {/* Civic Issue Pins */}
            <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Civic Grievance: Streetlight</div>
            </div>
            
            {/* Safe Zone */}
            <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-green-500/5 rounded-full border border-green-500/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-green-600/50 uppercase tracking-widest">Safe Zone</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-8 border-t border-slate-50 dark:border-slate-700 pt-6">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-red-600 rounded-full"></div>
               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">High Risk (Crime)</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Civic Issues (PMC)</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-green-600 rounded-full"></div>
               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Low Risk Zones</span>
             </div>
          </div>
        </div>

        {/* Predictive Stats Column */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Predictive Analytics</h3>
              <button className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">Full Report</button>
            </div>
            <div className="space-y-6">
               <PredictiveItem label="Emergency Probability" value="High" trend="up" color="red" />
               <PredictiveItem label="Civic Health Score" value="7.2/10" trend="stable" color="green" />
               <PredictiveItem label="Rescue Coverage" value="84%" trend="up" color="indigo" />
            </div>
          </div>

          <div className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Instant Emergency Trigger</h3>
                <p className="text-indigo-100 text-sm max-w-[200px]">Automated dispatch to nearest Pune Police or Health station.</p>
              </div>
              <div className="w-24 h-24 bg-red-600 rounded-full border-8 border-indigo-500/30 dark:border-indigo-400/30 flex items-center justify-center text-white font-black text-xl shadow-2xl group-active:scale-90 transition-transform">
                SOS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="pb-12 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Trusted by Citizens. Powered by Technology.</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 dark:opacity-30">
          <span className="font-outfit font-black text-slate-800 dark:text-white">PUNE POLICE</span>
          <span className="font-outfit font-black text-slate-800 dark:text-white">PMC</span>
          <span className="font-outfit font-black text-slate-800 dark:text-white">FIRE BRIGADE</span>
          <span className="font-outfit font-black text-slate-800 dark:text-white">HEALTHCARE</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
      <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 dark:text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function PredictiveItem({ label, value, trend, color }) {
  const colorMap = {
    red: "text-red-600 dark:text-red-400",
    green: "text-green-600 dark:text-green-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
  };
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xl font-black ${colorMap[color]}`}>{value}</p>
      </div>
      <div className={`text-xs font-bold ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
        {trend === 'up' ? '↑ Increasing' : '↓ Improving'}
      </div>
    </div>
  );
}

export default HomePage;
