import React, { useState, useRef } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { Activity, AlertTriangle, Shield, ArrowRight, Flame, ShieldAlert, Ambulance } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import heroIllustration from '../assets/hero-illustration.png';
import safetyMap from '../assets/safety-map.png';

function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sosClicks, setSosClicks] = useState(0);
  const [showSosOptions, setShowSosOptions] = useState(false);
  const clickTimeoutRef = useRef(null);

  const handleSosClick = () => {
    setSosClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowSosOptions(true);
        return 0; // reset
      }
      return newCount;
    });

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setSosClicks(0);
    }, 1500);
  };

  const handleEmergencySelect = (type) => {
    alert(`SOS Triggered for: ${type}\n\nNearby certified volunteers have been notified and will arrive immediately, followed by official emergency services.`);
    setShowSosOptions(false);
  };

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

          <div className="relative animate-float lg:block">
            <img 
              src={heroIllustration} 
              alt="City Safety Illustration" 
              className="w-full h-auto drop-shadow-2xl dark:opacity-80 lg:translate-x-12 rounded-[2rem]"
            />
            
            {/* Restored: Predictive Safety Score Card */}
            <div className="absolute -top-40 -right-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white dark:border-slate-700 animate-float-delayed z-30">
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

            {/* Floating SOS Button - Triple Click Trigger */}
            <div className="absolute top-0 -left-16 z-20 flex flex-col items-center">
              <button 
                onClick={handleSosClick}
                className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-white dark:border-slate-900 animate-pulse-sos hover:scale-110 transition-transform active:scale-95 group relative overflow-hidden"
              >
                 <span className="relative z-10">SOS</span>
                 {sosClicks > 0 && <span className="absolute top-2 right-2 text-xs z-20 bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">{sosClicks}</span>}
                 <div className="absolute inset-0 bg-red-400 animate-ping opacity-20"></div>
              </button>
              <div className="mt-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/50 dark:border-slate-700 shadow-xl">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter text-center leading-tight">
                  Triple Click <br /> for Emergency <br /> Options
                </p>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 dark:bg-slate-800/90 border-t border-l border-white/50 dark:border-slate-700 rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Emergency Status Bar */}
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
            <img 
              src={safetyMap} 
              alt="City Safety Dashboard" 
              className="w-full h-full object-cover opacity-90 dark:opacity-40 group-hover:scale-105 transition-transform duration-[15s] ease-in-out"
            />
            
            <div className="absolute bottom-6 right-6 flex items-center gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 dark:border-white/5 shadow-xl z-20">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">High Risk</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">Civic</span>
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
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Quick Reporting Card */}
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

          {/* Triple-Click SOS Status */}
          <div 
            onClick={handleSosClick}
            className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group cursor-pointer"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Instant Emergency Trigger</h3>
                <p className="text-indigo-100 text-sm max-w-[200px]">Triple click the SOS button or here to trigger automated dispatch.</p>
              </div>
              <div className="w-24 h-24 bg-red-600 rounded-full border-8 border-indigo-500/30 dark:border-indigo-400/30 flex items-center justify-center text-white font-black text-xl shadow-2xl active:scale-90 transition-transform">
                SOS
                {sosClicks > 0 && <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-xl border-2 border-red-600">{sosClicks}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOS Triple-Click Modal Overlay */}
      {showSosOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-200 dark:border-red-900/50 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <AlertTriangle size={48} className="text-red-600 dark:text-red-500 relative z-10" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">EMERGENCY SOS</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm">
              Select the emergency type. Nearby certified volunteers and official emergency services will be notified instantly.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleEmergencySelect('Fire')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-500 hover:border-orange-600 hover:text-white text-orange-700 transition-all active:scale-95 group shadow-sm">
                <Flame size={32} />
                <span className="font-bold text-sm">FIRE</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Crime')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-600 hover:border-blue-700 hover:text-white text-blue-700 transition-all active:scale-95 group shadow-sm">
                <Shield size={32} />
                <span className="font-bold text-sm">CRIME</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Medical')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-green-200 bg-green-50 hover:bg-green-600 hover:border-green-700 hover:text-white text-green-700 transition-all active:scale-95 group shadow-sm">
                <Ambulance size={32} />
                <span className="font-bold text-sm">MEDICAL</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Accident')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-600 hover:border-purple-700 hover:text-white text-purple-700 transition-all active:scale-95 group shadow-sm">
                <AlertTriangle size={32} />
                <span className="font-bold text-sm">ACCIDENT</span>
              </button>
            </div>
            
            <button onClick={() => setShowSosOptions(false)} className="mt-8 px-6 py-2 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 font-semibold transition-colors">
              Cancel Request
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

function EmergencyStatusBar() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 p-6 flex flex-wrap items-center justify-between gap-8 relative overflow-hidden transition-all hover:shadow-xl">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
      <div className="flex items-center gap-4 border-r border-slate-100 dark:border-slate-800 pr-6 shrink-0">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h5 className="font-bold text-slate-800 dark:text-white text-sm">Live City Insights</h5>
          <p className="text-[10px] text-slate-500 font-medium">Real-time data synchronization active.</p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-around px-4">
        <StatusOption icon="📍" label="All Pune Districts" />
        <StatusOption icon="👥" label="2.4k Activity" />
        <StatusOption icon="⚖️" label="92% Response" />
        <StatusOption icon="📡" label="Server Active" />
      </div>

      <button 
        onClick={() => navigate('/report', { state: { category: 'other' } })}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all group shrink-0 shadow-lg shadow-red-200 dark:shadow-none"
      >
        REPORT NOW
        <ArrowRight size={16} />
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

export default HomePage;
