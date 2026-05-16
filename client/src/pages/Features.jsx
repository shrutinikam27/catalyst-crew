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
import PublicNavbar from '../components/PublicNavbar';

const Features = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] transition-colors duration-300">
      <PublicNavbar />
      <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <section className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold ring-1 ring-indigo-100 dark:ring-indigo-800 mb-6">
            Advanced Core Features
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">
            Tools for a <span className="text-gradient">Safer Urban Future</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            SafeLink provides a comprehensive suite of digital tools designed for real-time
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
          <div className="order-2 lg:order-1 relative group">
            {/* Background Decorative Glow */}
            <div className="absolute -inset-10 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Live</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 bg-slate-800/40 rounded-xl border border-slate-800/50 flex items-center justify-center">
                      <div className="w-1/2 h-1 bg-slate-700 rounded-full"></div>
                    </div>
                  ))}
                </div>

                {/* Charts & Map Grid */}
                <div className="grid grid-cols-[1fr_1.2fr] gap-4">
                  <div className="space-y-4">
                    <div className="h-32 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <Activity size={16} className="text-indigo-500" />
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-indigo-500"></div>
                        </div>
                        <div className="h-1 w-1/2 bg-slate-800 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-32 bg-slate-800/30 rounded-2xl border border-slate-800 p-4 flex flex-col gap-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                          <div className="flex-1 h-1 bg-slate-700 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/20 rounded-2xl border border-slate-800 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-20 h-2 bg-slate-700 rounded-full"></div>
                        <div className="w-4 h-4 bg-indigo-500/20 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="w-1/2 h-1 bg-slate-800 rounded-full"></div>
                            <div className="w-4 h-1 bg-indigo-500 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-12 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center">
                        <div className="w-1/3 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom List/Feed */}
                <div className="h-28 bg-slate-800/30 rounded-2xl border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full"></div>
                    <div className="w-10 h-1.5 bg-indigo-500/30 rounded-full"></div>
                  </div>
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <div className="flex-1 h-1 bg-slate-800 rounded-full"></div>
                      <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 bg-indigo-600 text-white p-6 rounded-[2rem] shadow-2xl animate-float border-4 border-slate-900 z-10 hover:scale-110 transition-transform cursor-pointer">
              <Activity className="w-8 h-8" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Authority & Citizen Portals</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              SafeLink provides tailored experiences. Authorities get deep administrative controls and
              dispatch tools, while citizens receive high-level safety insights and personal report tracking.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 transition-all shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <Lock size={24} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xl">Authority Portal</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Dispatch, Heatmaps, Demographic analysis, and AI-driven predictive reports for municipal oversight.
                </p>
              </div>
              <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 transition-all shadow-sm">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                  <Smartphone size={24} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xl">Citizen Portal</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  SOS Trigger, Issue Reporting, real-time safety scores, and personal status tracking.
                </p>
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
