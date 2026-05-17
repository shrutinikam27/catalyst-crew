import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Map, AlertTriangle, TrendingUp, 
  Users, Zap, CheckCircle2, Globe, 
  BarChart3, Heart, Target, Sparkles,
  Building2, MessageSquare, Activity, X, Share2
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import TopContactDrawer from '../components/TopContactDrawer';
import safetyAnalysis from '../assets/safety-analysis.png';
import { cn } from '../utils/cn';

const AboutUs = () => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = React.useState(false);
  const stats = [
    { label: 'Citizens Protected', value: '1.2M+', icon: Users, color: 'text-indigo-600' },
    { label: 'Response Accuracy', value: '98.4%', icon: Target, color: 'text-emerald-600' },
    { label: 'Risk Zones Mapped', value: '450+', icon: Map, color: 'text-blue-600' },
    { label: 'Safety Index Score', value: '8.4', icon: Activity, color: 'text-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 selection:bg-indigo-100 selection:text-indigo-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-900/10 dark:via-slate-950 dark:to-slate-950"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 ring-1 ring-indigo-100 dark:ring-indigo-800">
              <Sparkles size={14} /> Shaping the Future of Urban Safety
            </div>
            <h1 className="text-6xl md:text-7xl font-outfit font-black text-slate-900 dark:text-white leading-[1.05] mb-8">
              Empowering Cities Through <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Data Intelligence</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              SafeLink is the next-generation Smart Urban Risk Mapping platform. We transform complex city data into life-saving insights for Pune's citizens and authorities.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-none text-center group hover:border-indigo-500/50 transition-all"
              >
                <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Origin Story Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full"></div>
            <div className="relative rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl">
              <img
                src={safetyAnalysis}
                alt="SafeLink Urban Analysis"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 max-w-xs animate-float">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-200">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white">Verified Mission</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Government Recognized</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Dedicated to resolving the urban risk challenges of high-density settlements and underserved areas in Pune.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-xs">
                <Globe size={18} /> Background & Problem
              </div>
              <h2 className="text-5xl font-outfit font-black text-slate-900 dark:text-white leading-tight">
                Our Origin Story: <br />
                Bridging the <span className="text-indigo-600">Safety Gap</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              <p>
                Rapid urban growth in cities such as Pune has increased challenges related to public safety, 
                crime monitoring, emergency response coordination, and civic infrastructure management. 
              </p>
              <p>
                High-density settlements and underserved urban areas often face delayed emergency response 
                and limited access to real-time civic support systems. SafeLink was developed as a 
                <strong> Smart City Safety Analytics Platform</strong> to resolve these critical issues.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                'High-Density Safety', 'Integrated Crime Data', 
                'Civic Grievance Maps', 'Predictive Modeling',
                'Authority Command Center', 'Citizen SOS Pulse'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">System Capabilities</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Our platform addresses the core requirements of smart urban protection through five pillars of data-driven safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CapabilityCard 
              icon={<Map />}
              title="Hotspot Mapping"
              desc="Map crime and civic issue hotspots to identify high-risk regions in real-time."
              color="bg-indigo-500"
            />
            <CapabilityCard 
              icon={<Zap />}
              title="Prioritization"
              desc="Intelligently prioritize emergency response regions based on risk density."
              color="bg-rose-500"
            />
            <CapabilityCard 
              icon={<MessageSquare />}
              title="Complaint Analysis"
              desc="Analyze citizen complaints from PMC datasets to improve infrastructure."
              color="bg-amber-500"
            />
            <CapabilityCard 
              icon={<TrendingUp />}
              title="Predictive Safety"
              desc="Generate predictive safety analytics using demographic and historical datasets."
              color="bg-emerald-500"
            />
            <CapabilityCard 
              icon={<BarChart3 />}
              title="Authority Command"
              desc="Comprehensive dashboards for police and municipal authorities to monitor trends."
              color="bg-slate-800"
            />
            <CapabilityCard 
              icon={<Heart />}
              title="Citizen Pulse"
              desc="Empowering residents with safety maps and direct emergency trigger tools."
              color="bg-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 max-w-[1400px] mx-auto text-center">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Integrated Intelligence From</h3>
        <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-3 grayscale hover:grayscale-0">
             <Shield className="text-blue-700 w-10 h-10" />
             <span className="text-2xl font-black text-slate-700 dark:text-white uppercase">Pune Police</span>
           </div>
           <div className="flex items-center gap-3">
             <Building2 className="text-indigo-600 w-10 h-10" />
             <span className="text-2xl font-black text-slate-700 dark:text-white uppercase">PMC Governance</span>
           </div>
           <div className="flex items-center gap-3">
             <Zap className="text-amber-500 w-10 h-10" />
             <span className="text-2xl font-black text-slate-700 dark:text-white uppercase">Smart City Pune</span>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>
          
          <h2 className="text-5xl font-outfit font-black mb-8 relative z-10 leading-tight">Ready to Secure Your City?</h2>
          <p className="text-indigo-100 text-lg mb-12 max-w-2xl mx-auto font-medium relative z-10 leading-relaxed">
            Join the 12,000+ citizens of Pune who are actively contributing to a safer urban environment. Together, we can build a data-driven future.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <button 
              onClick={() => navigate('/signup')}
              className="px-12 py-5 bg-white text-indigo-600 font-black rounded-3xl hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-700/20 uppercase tracking-widest text-sm"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => setShowContactModal(true)}
              className="px-12 py-5 bg-indigo-700 text-white font-black rounded-3xl hover:bg-indigo-800 transition-all border border-indigo-500/30 uppercase tracking-widest text-sm flex items-center justify-center"
            >
              Contact Admin
            </button>
          </div>
        </div>
      </section>

      {/* Contact Drawer (Top-Down) */}
      <TopContactDrawer 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />

      {/* Floating SOS Button (Global) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-20 h-20 bg-red-600 rounded-full flex flex-col items-center justify-center text-white font-black text-xs shadow-2xl z-50 animate-pulse-sos border-4 border-white dark:border-slate-900"
      >
        <AlertTriangle size={24} className="mb-1" />
        SOS
      </motion.button>
      <Footer />
    </div>
  );
};

const CapabilityCard = ({ icon, title, desc, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-none hover:border-indigo-500/50 transition-all group"
    >
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform", color)}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-2xl font-outfit font-black text-slate-800 dark:text-white mb-4 leading-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
};

export default AboutUs;
