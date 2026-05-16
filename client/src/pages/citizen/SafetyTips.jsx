import React, { useState } from 'react';
import {
  Heart,
  Shield,
  Phone,
  Search,
  AlertCircle,
  Navigation,
  Home,
  Smartphone,
  Sun,
  Moon,
  Wind,
  Flame,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
  {
    id: 1,
    category: 'Personal Safety',
    title: 'Safe Commuting at Night',
    content: 'Always share your live location with family or friends when traveling late. Stick to well-lit main roads and avoid isolated shortcuts.',
    icon: Navigation,
    color: 'blue'
  },
  {
    id: 2,
    category: 'Digital Safety',
    title: 'Secure Your SOS Settings',
    content: 'Ensure your SafeLink emergency contacts are up to date and your phone has the necessary permissions to share location during an SOS trigger.',
    icon: Smartphone,
    color: 'purple'
  },
  {
    id: 3,
    category: 'Road Safety',
    title: 'Monsoon Driving Precautions',
    content: 'Pune rains can be unpredictable. Check your vehicle brakes and tire pressure regularly. Avoid areas prone to waterlogging like low-lying bridges.',
    icon: Wind,
    color: 'indigo'
  },
  {
    id: 4,
    category: 'Fire Safety',
    title: 'Home Electrical Safety',
    content: 'Avoid overloading power sockets. Ensure you have a functioning fire extinguisher in your kitchen and know how to use the PASS technique.',
    icon: Flame,
    color: 'orange'
  },
  {
    id: 5,
    category: 'Community Safety',
    title: 'Reporting Suspicious Activity',
    content: 'If you notice unusual behavior or unclaimed packages in public places, use the SafeLink Report feature to notify authorities immediately.',
    icon: Shield,
    color: 'emerald'
  },
  {
    id: 6,
    category: 'Health Safety',
    title: 'Emergency Medical Prep',
    content: 'Keep a digital copy of your blood group and allergy information in the SafeLink profile for faster paramedic assistance during emergencies.',
    icon: Heart,
    color: 'rose'
  }
];

const SafetyTips = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(tips.map(tip => tip.category))];

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Safety Tips & Best Practices</h1>
          <p className="text-slate-500 dark:text-slate-400">Essential guides to stay safe in Pune's urban environment.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tips..."
            className="pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
              selectedCategory === cat
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none"
                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-indigo-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tip of the Day */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/30">
            <AlertCircle size={40} />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              Tip of the Day
            </div>
            <h2 className="text-2xl font-bold mb-2">Emergency Quick-Call Feature</h2>
            <p className="text-indigo-100 max-w-2xl">
              Did you know you can trigger a silent SOS by triple-pressing your power button in the SafeLink mobile app?
              This sends your GPS location and a 10-second audio clip directly to the nearest dispatch center.
            </p>
          </div>
          <button className="ml-auto px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shrink-0">
            Learn More
          </button>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredTips.map((tip, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              key={tip.id}
              className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm hover:shadow-xl"
            >
              <div className={`w-14 h-14 ${colorClasses[tip.color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <tip.icon size={28} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
                {tip.category}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{tip.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {tip.content}
              </p>
              <button className="flex items-center gap-2 text-indigo-600 font-bold text-xs group-hover:gap-3 transition-all">
                READ FULL GUIDE <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTips.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No tips found</h3>
          <p className="text-slate-500">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* Emergency Contacts Section */}
      <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Emergency Contacts</h2>
          <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
            View All <ExternalLink size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <ContactCard number="100" label="Police Control Room" color="rose" />
          <ContactCard number="101" label="Fire Brigade" color="orange" />
          <ContactCard number="108" label="Ambulance Service" color="emerald" />
          <ContactCard number="1091" label="Woman Helpline" color="purple" />
          <ContactCard number="112" label="National Emergency" color="indigo" />
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ number, label, color }) => {
  const colors = {
    rose: "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/10 dark:border-rose-900/30 dark:text-rose-400",
    orange: "bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-900/10 dark:border-orange-900/30 dark:text-orange-400",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-400",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/10 dark:border-indigo-900/30 dark:text-indigo-400",
    purple: "bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-900/10 dark:border-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} flex flex-col items-center justify-center text-center gap-2 hover:scale-105 transition-transform cursor-pointer`}>
      <Phone size={24} className="mb-2" />
      <span className="text-2xl font-black">{number}</span>
      <span className="text-xs font-bold uppercase tracking-tighter opacity-70">{label}</span>
    </div>
  );
};

// Helper for Tailwind classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default SafetyTips;
