import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Map, Zap, Activity, ShieldAlert, BarChart3, 
  MessageSquare, Share2, Globe, Navigation, 
  Smartphone, Lock, Layers, Cpu, Bell, 
  Heart, ShieldCheck, Flame, Ambulance,
  Building2, AlertTriangle, ArrowRight, X
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import TopContactDrawer from '../components/TopContactDrawer';
import { cn } from '../utils/cn';

const Features = () => {
  const navigate = useNavigate();
  const [showDispatchLogic, setShowDispatchLogic] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <div className="pt-40 pb-20 px-6 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 ring-1 ring-indigo-100 dark:ring-indigo-800">
            <Cpu size={14} className="animate-pulse" /> Advanced Core Architecture
          </div>
          <h1 className="text-6xl md:text-7xl font-outfit font-black text-slate-900 dark:text-white leading-tight mb-8">
            Precision Tools for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500 uppercase">Urban Protection</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
            SafeLink provides a comprehensive ecosystem of digital tools designed for real-time
            risk assessment, automated emergency response, and community-driven safety governance.
          </p>
        </motion.section>

        {/* Primary Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-40">
          <FeatureCard 
            icon={<Map />}
            title="Dynamic Risk Mapping"
            desc="Interactive geospatial heatmaps that combine crime statistics and civic grievance data to visualize urban risk levels in real-time."
            badge="Geospatial"
            color="indigo"
            path="/user"
          />
          <FeatureCard 
            icon={<ShieldAlert />}
            title="Instant SOS Protocol"
            desc="A high-priority emergency trigger that instantly notifies Police, Fire Brigade, and Healthcare with precise GPS location."
            badge="Emergency"
            color="rose"
            path="/report"
          />
          <FeatureCard 
            icon={<BarChart3 />}
            title="Predictive AI"
            desc="Leveraging historical data and demographic patterns to forecast potential safety hotspots and infrastructural needs."
            badge="AI Powered"
            color="emerald"
            path="/admin"
          />
          <FeatureCard 
            icon={<MessageSquare />}
            title="Grievance Interface"
            desc="An intuitive portal for citizens to report civic issues like lighting or road hazards directly to municipal authorities."
            badge="Citizen"
            color="amber"
            path="/report"
          />
          <FeatureCard 
            icon={<Navigation />}
            title="Smart Dispatching"
            desc="Automated resource allocation engine that helps emergency services prioritize responses based on live regional risk scores."
            badge="Authority"
            color="slate"
            path="/police"
          />
          <FeatureCard 
            icon={<Smartphone />}
            title="Mobile Safety Pulse"
            desc="A fully optimized mobile interface ensuring life-saving tools are accessible to every citizen, everywhere."
            badge="Mobile First"
            color="purple"
            path="/user/safety"
          />
        </div>

        {/* Deep Dive Section: Data Integration */}
        <section className="grid lg:grid-cols-2 gap-24 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-20 h-2 bg-indigo-600 rounded-full mb-10"></div>
            <h2 className="text-5xl font-outfit font-black text-slate-900 dark:text-white leading-tight">
              Unified Data <br />
              <span className="text-indigo-600">Governance Engine</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              SafeLink harmonizes diverse datasets from multiple agencies, creating a single source of truth 
              for urban protection and response coordination.
            </p>
            
            <div className="grid gap-6">
              <DeepDiveItem icon={<ShieldCheck />} text="Direct Integration with Pune Police Crime Database" />
              <DeepDiveItem icon={<Layers />} text="Live Civic Grievance Feed from PMC Portals" />
              <DeepDiveItem icon={<Globe />} text="Open Transparency API for Civic Audit" />
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-[120px]"></div>
            <div className="bg-slate-900 rounded-[3.5rem] p-12 shadow-2xl border border-slate-800 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
               
               {/* Animated Dashboard Mock */}
               <div className="space-y-8 relative z-10">
                 <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">Analytics.Live</div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-3xl border border-white/10 p-5 flex flex-col justify-between">
                       <Activity className="text-indigo-400" size={18} />
                       <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-24 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 p-5 flex flex-col justify-between">
                       <Zap className="text-indigo-400 animate-pulse" size={18} />
                       <div className="h-2 w-16 bg-indigo-400/20 rounded-full"></div>
                    </div>
                 </div>

                 <div className="h-40 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-10 h-10 bg-indigo-500/40 rounded-full"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Feature Focus Section: Emergency Response */}
        <section className="bg-slate-900 rounded-[4rem] p-16 lg:p-24 relative overflow-hidden mb-32">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
             <div className="order-2 lg:order-1 relative">
                <div className="grid grid-cols-2 gap-6">
                   <ResponseCard icon={<Flame />} label="Fire Support" count="04 mins" color="rose" />
                   <ResponseCard icon={<ShieldAlert />} label="Police Unit" count="07 mins" color="blue" />
                   <ResponseCard icon={<Ambulance />} label="Medical Team" count="05 mins" color="emerald" />
                   <ResponseCard icon={<Bell />} label="Local Help" count="02 mins" color="amber" />
                </div>
             </div>

             <div className="order-1 lg:order-2 space-y-8 text-white">
                <h2 className="text-5xl font-outfit font-black leading-tight">
                  Accelerated <br />
                  <span className="text-rose-500 uppercase">Emergency Protocol</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Our Intelligent Response System prioritizes dispatches by analyzing demographic risk factors 
                  and live hazard density, ensuring the right help reaches the right place instantly.
                </p>
                <div className="pt-6">
                   <button 
                    onClick={() => setShowDispatchLogic(true)}
                    className="px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-sm flex items-center gap-3"
                   >
                      View Dispatch Logic <Share2 size={18} />
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-20">
           <h2 className="text-5xl font-outfit font-black text-slate-900 dark:text-white mb-8">Ready to secure your urban space?</h2>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/signup')}
                className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl transition-all shadow-2xl shadow-indigo-100 dark:shadow-none uppercase tracking-widest text-sm"
              >
                Join the Community
              </button>
              <button 
                onClick={() => setShowContactModal(true)}
                className="px-12 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-black rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest text-sm flex items-center justify-center"
              >
                Contact Support
              </button>
           </div>
        </section>
      </div>

      {/* Global Floating SOS Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-20 h-20 bg-red-600 rounded-full flex flex-col items-center justify-center text-white font-black text-xs shadow-2xl z-50 animate-pulse-sos border-4 border-white dark:border-slate-900"
      >
        <AlertTriangle size={24} className="mb-1" />
        SOS
      </motion.button>
      <Footer />

      {/* Dispatch Logic Modal */}
      <AnimatePresence>
        {showDispatchLogic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDispatchLogic(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowDispatchLogic(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">Dispatch Prioritization Logic</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">AI-Driven Response Algorithm v2.4</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 leading-relaxed block">
                    PriorityScore = (SeverityWeight * 0.4) + (RiskHotspotDensity * 0.3) + (1 / DistanceToCenter * 0.2) + (DemographicVulnerability * 0.1)
                  </code>
                </div>

                <div className="grid gap-6">
                  <LogicItem 
                    title="Severity Analysis" 
                    desc="Natural Language Processing (NLP) analyzes incident reports to categorize emergency levels from 'Routine' to 'Critical'." 
                  />
                  <LogicItem 
                    title="Hotspot Density" 
                    desc="Reports in historically high-risk zones (as identified in our safety maps) receive an immediate 30% priority boost." 
                  />
                  <LogicItem 
                    title="Proximity Sync" 
                    desc="Real-time GPS tracking identifies the nearest available certified volunteers and official responders simultaneously." 
                  />
                </div>

                <button 
                  onClick={() => setShowDispatchLogic(false)}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm"
                >
                  Close Technical Specs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Drawer (Top-Down) */}
      <TopContactDrawer 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, badge, color, path }) => {
  const navigate = useNavigate();
  const colors = {
    indigo: "bg-indigo-500 shadow-indigo-200 dark:shadow-none",
    rose: "bg-rose-500 shadow-rose-200 dark:shadow-none",
    emerald: "bg-emerald-500 shadow-emerald-200 dark:shadow-none",
    amber: "bg-amber-500 shadow-amber-200 dark:shadow-none",
    slate: "bg-slate-800 shadow-slate-200 dark:shadow-none",
    purple: "bg-purple-600 shadow-purple-200 dark:shadow-none",
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-none hover:border-indigo-500/50 transition-all group flex flex-col"
    >
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-xl", colors[color])}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <div className="mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full ring-1 ring-slate-100 dark:ring-slate-700">
          {badge}
        </span>
      </div>
      <h3 className="text-2xl font-outfit font-black text-slate-800 dark:text-white mb-4 leading-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">{desc}</p>
    </motion.div>
  );
};

const LogicItem = ({ title, desc }) => (
  <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
    <div>
      <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const DeepDiveItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{text}</span>
  </div>
);

const ResponseCard = ({ icon, label, count, color }) => {
  const colors = {
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <div className={cn("p-8 rounded-[2.5rem] border text-center space-y-4", colors[color])}>
       <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
          {React.cloneElement(icon, { size: 24 })}
       </div>
       <div>
          <div className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">{label}</div>
          <div className="text-2xl font-black text-white">{count}</div>
       </div>
    </div>
  );
};

export default Features;
