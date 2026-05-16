import React, { useState, useRef } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { Flame, ShieldAlert, Ambulance, AlertTriangle } from 'lucide-react';

function HomePage() {
  const { currentUser } = useAuth();
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
          <div className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Instant Emergency Trigger</h3>
                <p className="text-indigo-100 text-sm max-w-[200px]">Automated dispatch to nearest Pune Police or Health station.</p>
              </div>
              <div onClick={handleSosClick} className="w-24 h-24 bg-red-600 rounded-full border-8 border-indigo-500/30 dark:border-indigo-400/30 flex items-center justify-center text-white font-black text-xl shadow-2xl active:scale-90 transition-transform cursor-pointer relative select-none">
                SOS
                {sosClicks > 0 && <span className="absolute top-0 right-0 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm shadow-md border-2 border-red-600">{sosClicks}</span>}
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

      {/* SOS Triple-Click Modal Overlay */}
      {showSosOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-200 dark:border-red-900/50 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <AlertTriangle size={48} className="text-red-600 dark:text-red-500 relative z-10" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">EMERGENCY SOS</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Select the exact emergency. Nearby certified volunteers will be notified instantly to provide rapid response before official authorities arrive.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleEmergencySelect('Fire')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-500 hover:border-orange-600 hover:text-white text-orange-700 transition-all active:scale-95 group shadow-sm">
                <Flame size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">FIRE</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Crime')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-600 hover:border-blue-700 hover:text-white text-blue-700 transition-all active:scale-95 group shadow-sm">
                <ShieldAlert size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">CRIME</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Medical')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-green-200 bg-green-50 hover:bg-green-600 hover:border-green-700 hover:text-white text-green-700 transition-all active:scale-95 group shadow-sm">
                <Ambulance size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">MEDICAL</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Accident')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-600 hover:border-purple-700 hover:text-white text-purple-700 transition-all active:scale-95 group shadow-sm">
                <AlertTriangle size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">ACCIDENT</span>
              </button>
            </div>
            
            <button onClick={() => setShowSosOptions(false)} className="mt-8 px-6 py-2 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 font-semibold transition-colors">
              Cancel Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmergencyStatusBar() {
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

      <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all group shrink-0 shadow-lg shadow-red-200 dark:shadow-none">
        SEND SOS NOW
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
  return (
    <div className="fixed right-6 bottom-32 flex flex-col items-center gap-2 z-40">
      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:scale-110 transition-all text-center">
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

export default HomePage;
