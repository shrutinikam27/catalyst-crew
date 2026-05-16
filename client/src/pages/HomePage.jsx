import React from 'react';
import { useAuth } from '../firebase/AuthContext';
import { Activity, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] font-inter transition-colors duration-300">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
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
              <button 
                onClick={() => navigate('/report', { state: { category: 'civic' } })}
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none group"
              >
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
              src="/hero-illustration.png" 
              alt="City Safety Illustration" 
              className="w-full h-auto drop-shadow-2xl dark:opacity-80"
            />
            
            {/* Restored: Predictive Safety Score Card */}
            <div className="absolute -top-10 -right-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white dark:border-slate-700 animate-float-delayed z-30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                  <Activity size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Pune Safety Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-800 dark:text-white">84</span>
                    <span className="text-sm font-bold text-slate-400">/100</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[84%] bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Predicted Risk: <span className="text-green-600 font-bold">LOW</span> for next 24h</p>
              </div>
            </div>

            {/* Floating SOS Button - Matching Image Style */}
            <div className="absolute top-0 -left-16 z-20 flex flex-col items-center">
              <button 
                onClick={() => navigate('/report')}
                className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-white dark:border-slate-900 animate-pulse-sos hover:scale-110 transition-transform active:scale-95 group relative overflow-hidden"
              >
                 <span className="relative z-10">SOS</span>
                 <div className="absolute inset-0 bg-red-400 animate-ping opacity-20"></div>
              </button>
              <div className="mt-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/50 dark:border-slate-700 shadow-xl">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter text-center leading-tight">
                  Click or <br /> Long Press <br /> for SOS
                </p>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 dark:bg-slate-800/90 border-t border-l border-white/50 dark:border-slate-700 rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Emergency Status Bar - Positioned above Empowering Governance as requested */}
      <div className="px-6 max-w-[1400px] mx-auto mb-16">
        <EmergencyStatusBar />
      </div>

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
              <button 
                onClick={() => navigate('/report')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all mb-12"
              >
                START REPORTING NOW
              </button>
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
          <div className="w-full aspect-video bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] relative overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl group/map">
            {/* Base Map Image - Minimalist Style */}
            <img 
              src="/pune_safety_map_minimalist_1778919694567.png" 
              alt="City Safety Dashboard" 
              className="w-full h-full object-cover opacity-90 dark:opacity-40 group-hover:scale-105 transition-transform duration-[15s] ease-in-out"
            />
            
            {/* Soft Ambient Glows */}
            <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Elegant Data Markers */}
            <div className="absolute top-[35%] left-[28%] group cursor-pointer z-20">
              <div className="relative">
                <div className="w-12 h-12 bg-red-500/20 rounded-full animate-ping absolute -top-4 -left-4"></div>
                <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full border-[3px] border-red-500 shadow-lg relative flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
                
                {/* Modern Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 min-w-[160px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">High Alert</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white">Shivajinagar Square</h5>
                    <p className="text-[9px] text-slate-500 mt-1 font-medium">Increased traffic & civic density.</p>
                  </div>
                  <div className="w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700 rotate-45 mx-auto -mt-1.5 shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[30%] right-[35%] group cursor-pointer z-20">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-ping absolute -top-4 -left-4" style={{animationDelay: '1s'}}></div>
                <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full border-[3px] border-blue-500 shadow-lg relative flex items-center justify-center">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
                
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 min-w-[160px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">PMC Dispatch</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white">Kharadi IT Park</h5>
                    <p className="text-[9px] text-slate-500 mt-1 font-medium">Streetlight maintenance active.</p>
                  </div>
                  <div className="w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700 rotate-45 mx-auto -mt-1.5 shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Floating Stats Label */}
            <div className="absolute top-6 left-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-tighter">Live Status</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">Stable Response</span>
                </div>
              </div>
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-6 right-6 flex items-center gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 dark:border-white/5 shadow-xl z-20">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">High Risk</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">Civic</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">Safe</span>
               </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-8 border-t border-slate-50 dark:border-slate-700 pt-6">
             <div 
               onClick={() => navigate('/report', { state: { category: 'crime' } })}
               className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
             >
               <div className="w-3 h-3 bg-red-600 rounded-full"></div>
               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">High Risk (Crime)</span>
             </div>
             <div 
               onClick={() => navigate('/report', { state: { category: 'civic' } })}
               className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
             >
               <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Civic Issues (PMC)</span>
             </div>
             <div 
               onClick={() => navigate('/report')}
               className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
             >
               <div className="w-3 h-3 bg-green-600 rounded-full"></div>
               <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Low Risk Zones</span>
             </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* New: Quick Reporting Card */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Citizen Action Center</h3>
             <div className="grid gap-4">
               <button 
                onClick={() => navigate('/report', { state: { category: 'crime' } })}
                className="w-full bg-red-600 hover:bg-red-700 text-white p-5 rounded-3xl font-black text-sm flex items-center justify-between transition-all group shadow-lg shadow-red-100 dark:shadow-none"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                     <Shield size={20} />
                   </div>
                   <span className="uppercase tracking-widest">Report Crime</span>
                 </div>
                 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>

               <button 
                onClick={() => navigate('/report', { state: { category: 'civic' } })}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white p-5 rounded-3xl font-black text-sm flex items-center justify-between transition-all group shadow-lg shadow-amber-100 dark:shadow-none"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                     <AlertTriangle size={20} />
                   </div>
                   <span className="uppercase tracking-widest">Report Civic Issue</span>
                 </div>
                 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-slate-800 dark:text-white">Predictive Analysis</h3>
               <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 text-[10px] font-black rounded-full uppercase">Live AI</span>
             </div>
             
             <div className="space-y-6">
               <PredictiveItem 
                 label="Emergency Response" 
                 value="94%" 
                 trend="+2.4%" 
                 color="indigo"
               />
               <PredictiveItem 
                 label="Citizen Reporting" 
                 value="82%" 
                 trend="+5.1%" 
                 color="blue"
               />
               <PredictiveItem 
                 label="Risk Mitigation" 
                 value="68%" 
                 trend="-1.2%" 
                 color="amber"
               />
             </div>
             
             <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg">🤖</div>
                 <div>
                   <h4 className="text-xs font-bold text-slate-800 dark:text-white">AI Safety Insight</h4>
                   <p className="text-[10px] text-slate-500">Updated 2m ago</p>
                 </div>
               </div>
               <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                 "Deployment of additional patrol units recommended in Zone 4 (Shivajinagar) between 18:00 - 21:00 based on historical density spikes."
               </p>
             </div>
          </div>

          <div 
            onClick={() => navigate('/report')}
            className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group cursor-pointer"
          >
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
      <footer className="pb-32 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Trusted by Citizens. Powered by Technology.</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 dark:opacity-30 mb-12">
          <span className="font-outfit font-black text-slate-800 dark:text-white">PUNE POLICE</span>
          <span className="font-outfit font-black text-slate-800 dark:text-white">PMC</span>
          <span className="font-outfit font-black text-slate-800 dark:text-white">FIRE BRIGADE</span>
          <span className="font-outfit font-black text-slate-800 dark:text-white">HEALTHCARE</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
             No Login Required for Emergency
           </div>
           <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             Fast • Secure • Always Available
           </div>
        </div>
      </footer>

      {/* New Features from Image */}
      <QuickHelpButton />
    </div>
  );
}

function EmergencyStatusBar() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-red-100 dark:border-red-900/20 p-6 flex flex-wrap items-center justify-between gap-8 relative overflow-hidden transition-all hover:shadow-xl">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
      <div className="flex items-center gap-4 border-r border-slate-100 dark:border-slate-800 pr-6 shrink-0">
        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600">
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
        <div>
          <h5 className="font-bold text-red-600 text-sm">In Emergency?</h5>
          <p className="text-[10px] text-slate-500 font-medium">Help is just one tap away.</p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-around px-4">
        <StatusOption icon="📍" label="Share Location" />
        <StatusOption icon="🛡️" label="Alert Authorities" />
        <StatusOption icon="👥" label="Notify Contacts" />
        <StatusOption icon="📡" label="Track Response" />
      </div>

      <button 
        onClick={() => navigate('/report', { state: { category: 'other' } })}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all group shrink-0 shadow-lg shadow-red-200 dark:shadow-none"
      >
        REPORT NOW
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </button>
    </div>
  );
}

function StatusOption({ icon, label }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
    </div>
  );
}

function QuickHelpButton() {
  const navigate = useNavigate();
  return (
    <div className="fixed right-6 bottom-32 flex flex-col items-center gap-2 z-40">
      <div 
        onClick={() => navigate('/report')}
        className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:scale-110 transition-all text-center"
      >
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white mb-1 shadow-lg shadow-red-200 dark:shadow-none mx-auto">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
        </div>
        <span className="text-[10px] font-black text-red-600 block uppercase leading-none">SOS</span>
        <span className="text-[8px] font-bold text-slate-400 block uppercase">Quick Help</span>
      </div>
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
  const colors = {
    indigo: 'bg-indigo-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-800 dark:text-white">{value}</span>
          <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full`} 
          style={{ width: value }}
        ></div>
      </div>
    </div>
  );
}

export default HomePage;
