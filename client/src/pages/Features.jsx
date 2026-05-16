import React from 'react';
import { 
  Map, 
  Zap, 
  Activity, 
  ShieldAlert, 
  BarChart3, 
  MessageSquare, 
  Share2, 
  Globe, 
  Navigation, 
  Smartphone,
  Lock,
  Layers
} from 'lucide-react';

const Features = () => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <section className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold ring-1 ring-indigo-100 dark:ring-indigo-800 mb-6">
          Advanced Core Features
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">
          Tools for a <span className="text-gradient">Safer Urban Future</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          SafeLinks provides a comprehensive suite of digital tools designed for real-time 
          risk assessment, emergency response, and community collaboration.
        </p>
      </section>

      {/* Main Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        <FeatureBlock 
          icon={<Map className="w-8 h-8" />}
          title="Dynamic Risk Mapping"
          description="Interactive geospatial heatmaps that combine crime statistics and civic grievance data to visualize urban risk levels in real-time."
          badge="Core"
        />
        <FeatureBlock 
          icon={<ShieldAlert className="w-8 h-8" />}
          title="Instant SOS Protocol"
          description="A high-priority emergency trigger that instantly notifies Pune Police, Fire Brigade, and Healthcare services with precise GPS location."
          badge="Emergency"
        />
        <FeatureBlock 
          icon={<BarChart3 className="w-8 h-8" />}
          title="Predictive AI Analytics"
          description="Leveraging historical data and demographic patterns to forecast potential safety hotspots and infrastructural needs before they escalate."
          badge="AI Powered"
        />
        <FeatureBlock 
          icon={<MessageSquare className="w-8 h-8" />}
          title="Seamless Grievance Reporting"
          description="An intuitive interface for citizens to report civic issues like street lighting, road hazards, or sanitation problems directly to authorities."
          badge="Citizen"
        />
        <FeatureBlock 
          icon={<Navigation className="w-8 h-8" />}
          title="Response Prioritization"
          description="Automated resource allocation engine that helps emergency services prioritize dispatches based on regional risk scores."
          badge="Authority"
        />
        <FeatureBlock 
          icon={<Smartphone className="w-8 h-8" />}
          title="Mobile First Experience"
          description="Fully optimized mobile application interface ensuring safety tools are accessible to citizens wherever they are in the city."
          badge="Accessible"
        />
      </div>

      {/* Deep Dive Section 1: Data Integration */}
      <section className="grid lg:grid-cols-2 gap-16 items-center mb-32 bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Unified Data Governance</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Our platform doesn't just collect data; it harmonizes it. By integrating diverse datasets 
            from multiple agencies, we create a single source of truth for urban safety.
          </p>
          <div className="space-y-4">
            <FeatureListItem 
              icon={<Layers className="w-5 h-5" />} 
              text="Cross-Agency Integration (Police, PMC, Healthcare)" 
            />
            <FeatureListItem 
              icon={<Lock className="w-5 h-5" />} 
              text="Secure, Encrypted Data Handling" 
            />
            <FeatureListItem 
              icon={<Share2 className="w-5 h-5" />} 
              text="Open Data API for Public Transparency" 
            />
          </div>
        </div>
        <div className="relative">
          <div className="bg-indigo-600 h-[400px] rounded-3xl overflow-hidden shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bbbda5366a7a?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover opacity-50"
              alt="Data Visualization"
            />
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
                <Globe className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold text-white">Pune Smart Grid</h3>
                <p className="text-indigo-100 text-sm mt-2">Connecting 12k+ nodes of city safety data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Section 2: Dashboards */}
      <section className="grid lg:grid-cols-2 gap-16 items-center mb-32">
        <div className="order-2 lg:order-1 relative">
          <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl border border-slate-800">
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-800 rounded-lg w-3/4 animate-pulse"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-indigo-500/20 rounded-xl border border-indigo-500/30"></div>
                <div className="h-24 bg-slate-800 rounded-xl"></div>
                <div className="h-24 bg-slate-800 rounded-xl"></div>
              </div>
              <div className="h-32 bg-slate-800 rounded-xl"></div>
              <div className="h-20 bg-slate-800 rounded-xl"></div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 bg-indigo-600 text-white p-6 rounded-2xl shadow-xl animate-float">
             <Activity className="w-8 h-8" />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Authority & Citizen Portals</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            SafeLinks provides tailored experiences. Authorities get deep administrative controls and 
            dispatch tools, while citizens receive high-level safety insights and personal report tracking.
          </p>
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800">
               <h4 className="font-bold text-slate-900 dark:text-white mb-2">Authority Portal</h4>
               <p className="text-xs text-slate-500">Dispatch, Heatmaps, Demographic analysis, Predictive reports.</p>
             </div>
             <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800">
               <h4 className="font-bold text-slate-900 dark:text-white mb-2">Citizen Portal</h4>
               <p className="text-xs text-slate-500">SOS Trigger, Issue Reporting, Area Safety Scores, Tracking.</p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-slate-900 to-indigo-950 p-16 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <h2 className="text-4xl font-bold mb-6 relative z-10">Experience the Future of Urban Safety</h2>
        <p className="text-indigo-100/70 mb-10 max-w-2xl mx-auto relative z-10">
          Be part of Pune's journey towards a data-driven, safer environment. Explore the full suite 
          of features by creating your account today.
        </p>
        <div className="flex gap-4 justify-center relative z-10">
           <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
             Join Now
           </button>
           <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 font-bold rounded-xl transition-all">
             Contact Support
           </button>
        </div>
      </section>
    </div>
  );
};

const FeatureBlock = ({ icon, title, description, badge }) => {
  return (
    <div className="p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
          {badge}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const FeatureListItem = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
      {icon}
    </div>
    <span className="text-slate-700 dark:text-slate-300 font-medium">{text}</span>
  </div>
);

export default Features;
