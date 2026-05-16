import React from 'react';
import { Shield, Map, AlertTriangle, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Hero Section */}
      <section className="text-center mb-20 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">
          Empowering <span className="text-gradient">Citizen Safety</span> <br />
          Through Data Intelligence
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          SafeLinks is a Smart Urban Risk Mapping platform designed to transform Pune into
          a safer, more resilient city using real-time analytics and community-driven insights.
        </p>
      </section>

      {/* The Problem & Background */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full"></div>
          <img
            src="https://share.google/xhb6PjjdoojFlvOXP"
            alt="Safety Analysis"
            className="relative rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-float"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">
            <Shield className="w-5 h-5" />
            Background & Mission
          </div>
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Our Origin Story</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Rapid urban growth in cities like Pune has introduced complex challenges. High-density settlements
            and underserved areas often face delayed emergency responses and limited access to critical civic support.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            SafeLinks was born from the vision of "Data-driven Governance." By integrating crime statistics,
            civic grievance reports, and demographic datasets, we identify urban risk zones to improve
            preparedness and strengthen citizen engagement.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Targeted Response</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Real-time Visibility</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Predictive Safety</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Citizen Centric</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Capabilities */}
      <section className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">System Capabilities</h2>
          <p className="text-slate-500 dark:text-slate-400">Our platform is built on five core pillars of urban safety</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CapabilityCard
            icon={<Map className="w-8 h-8" />}
            title="Hotspot Mapping"
            description="Geospatial visualization of crime and civic issue clusters to identify high-risk regions."
            color="blue"
          />
          <CapabilityCard
            icon={<Zap className="w-8 h-8" />}
            title="Prioritization Engine"
            description="Intelligent algorithms to prioritize emergency response regions based on real-time urgency."
            color="orange"
          />
          <CapabilityCard
            icon={<AlertTriangle className="w-8 h-8" />}
            title="Grievance Analysis"
            description="Advanced processing of citizen complaints to improve infrastructure and public services."
            color="red"
          />
          <CapabilityCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Predictive Analytics"
            description="Generating safety forecasts using demographic datasets and historical crime statistics."
            color="indigo"
          />
          <CapabilityCard
            icon={<Users className="w-8 h-8" />}
            title="Dual Dashboards"
            description="Dedicated interfaces for both municipal authorities and citizens to ensure transparency."
            color="purple"
          />
          <CapabilityCard
            icon={<Shield className="w-8 h-8" />}
            title="Data Governance"
            description="A secure platform leveraging Pune's core datasets for a safer urban future."
            color="green"
          />
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-indigo-600 rounded-3xl p-12 text-center text-white overflow-hidden relative shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        <h2 className="text-4xl font-bold mb-6 relative z-10">Ready to make your city safer?</h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
          Join SafeLinks today and contribute to Pune's data-driven safety initiative.
          Together, we can build a smarter city for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl">
            Get Started
          </button>
          <button className="px-8 py-4 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition-all border border-indigo-500/30">
            View Dataset Specs
          </button>
        </div>
      </section>
    </div>
  );
};

const CapabilityCard = ({ icon, title, description, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group hover:shadow-xl hover:-translate-y-1">
      <div className={`w-16 h-16 ${colors[color]} rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default AboutUs;
