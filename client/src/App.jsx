import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold font-outfit text-[#1E293B]">SafeLinks</span>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Smart City. Safe City.</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">Home</a>
            <a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">About Us</a>
            <a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Features</a>
            <a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Dashboard</a>
            <a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </button>
            <button className="px-6 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition-colors">Login</button>
            <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold ring-1 ring-indigo-100">
              <span className="animate-pulse">✨</span> AI-Powered City Safety Platform
            </div>
            <h1 className="text-6xl font-outfit font-extrabold text-[#1E293B] leading-[1.1]">
              Building Safer Cities <br />
              Through <span className="text-indigo-600">Smart Intelligence</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              SafeLinks integrates data, technology and community reporting to identify risks, prevent incidents and ensure faster emergency response.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Report an Issue
              </button>
              <button className="px-8 py-4 bg-white border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-50 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                View Risk Map
              </button>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm italic">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Together, let's build a safer tomorrow.
            </div>
          </div>

          <div className="relative animate-float hidden lg:block">
            <img
              src="/src/assets/hero-illustration.png"
              alt="City Safety Illustration"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Row - Exact 5 cards from image */}
      <section className="px-6 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
        <FeatureCard icon="🛡️" title="Report an Issue" desc="Report crime, accidents, civic issues and more." />
        <FeatureCard icon="🗺️" title="Live Risk Map" desc="Explore hotspots and safety zones in real-time." />
        <FeatureCard icon="📊" title="Safety Analytics" desc="Data-driven insights to help make better decisions." />
        <FeatureCard icon="🔔" title="Live Alerts" desc="Get real-time notifications about emergencies." />
        <FeatureCard icon="👥" title="Community" desc="Join and build a safer and stronger city together." />
      </section>

      {/* Bottom Dashboard Section */}
      <section className="px-6 max-w-[1400px] mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-12 pb-24">
        {/* Map Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Crime Hotspot Map</h3>
            <button className="text-indigo-600 font-bold text-sm">View Full Map</button>
          </div>
          <div className="w-full aspect-video bg-indigo-50 rounded-3xl relative overflow-hidden border border-indigo-100">
            {/* Map Placeholder with Pune Labels */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 font-bold text-4xl opacity-20">PUNE</div>
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-red-500/20 rounded-full animate-ping"></div>
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>

            <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-orange-500/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-orange-600 rounded-full border-2 border-white"></div>

            <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-green-500/20 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
          </div>
          <div className="mt-6 flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-xs font-bold text-slate-600">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span className="text-xs font-bold text-slate-600">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-xs font-bold text-slate-600">Safe</span>
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">Today at a Glance</h3>
              <button className="text-indigo-600 font-bold text-sm">View Dashboard</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <StatItem label="High Risk Zones" value="23" icon="🔥" color="red" />
              <StatItem label="Active Incidents" value="17" icon="⚠️" color="orange" />
              <StatItem label="Resolved Issues" value="926" icon="✅" color="green" />
              <StatItem label="People Protected" value="45.2K" icon="👥" color="indigo" />
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Emergency? Need Help Now?</h3>
                <p className="text-indigo-100 text-sm max-w-[200px]">Press the SOS button to alert authorities immediately.</p>
              </div>
              <div className="w-24 h-24 bg-red-600 rounded-full border-8 border-indigo-500/30 flex items-center justify-center text-white font-black text-xl shadow-2xl group-active:scale-90 transition-transform">
                SOS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="pb-12 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Trusted by Citizens. Powered by Technology.</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50">
          <span className="font-outfit font-black text-slate-800">PUNE POLICE</span>
          <span className="font-outfit font-black text-slate-800">PMC</span>
          <span className="font-outfit font-black text-slate-800">FIRE BRIGADE</span>
          <span className="font-outfit font-black text-slate-800">HEALTHCARE</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatItem({ label, value, icon, color }) {
  const colorMap = {
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default App;
