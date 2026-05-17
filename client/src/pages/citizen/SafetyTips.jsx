import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, ShieldCheck, MapPin, 
  Heart, Phone, AlertTriangle, Lightbulb,
  Search, BookOpen, ChevronRight, Users,
  X, CheckCircle2, ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/cn';

const categories = [
  { id: 'general', name: 'General Safety', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 'emergency', name: 'Emergency Response', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'travel', name: 'Travel & Commute', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'medical', name: 'Medical Help', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

const tips = [
  {
    category: 'travel',
    title: "Safe Commute Checklist",
    content: "Before traveling late at night, ensure your phone is fully charged and you have shared your live location.",
    impact: "High",
    icon: MapPin,
    protocol: [
      "Verify vehicle details and driver identity before boarding.",
      "Share your live location with at least two trusted contacts.",
      "Keep emergency SOS triggers accessible on your home screen.",
      "Avoid poorly lit shortcuts; stick to primary urban arteries.",
      "Stay awake and alert; avoid using headphones in transit."
    ]
  },
  {
    category: 'emergency',
    title: "Fire Safety Basics",
    content: "If you smell smoke, stay low to the ground where the air is clearer. Never use elevators during a fire.",
    impact: "Critical",
    icon: Zap,
    protocol: [
      "Test doors for heat with the back of your hand before opening.",
      "If smoke is present, crawl on your hands and knees to the nearest exit.",
      "Close doors behind you to compartmentalize the fire.",
      "Once outside, stay out and call 101 immediately.",
      "Use stairs only; elevators can become death traps during power failures."
    ]
  },
  {
    category: 'general',
    title: "Digital Awareness",
    content: "Be cautious about the information you share on social media. Avoid posting about being alone or routines.",
    impact: "Medium",
    icon: ShieldCheck,
    protocol: [
      "Review privacy settings on all social platforms monthly.",
      "Disable 'Precise Location' for non-navigation apps.",
      "Avoid posting photos that identify your home's exterior or street name.",
      "Don't check-in to locations until after you have left.",
      "Use two-factor authentication (2FA) for all critical accounts."
    ]
  },
  {
    category: 'medical',
    title: "Heatstroke Prevention",
    content: "During heatwaves, stay hydrated and avoid strenuous activities during peak sun hours (12 PM - 4 PM).",
    impact: "Medium",
    icon: Heart,
    protocol: [
      "Drink at least 3-4 liters of water daily during high alerts.",
      "Wear light-colored, loose-fitting cotton clothing.",
      "Recognize symptoms: dizziness, rapid pulse, or lack of sweating.",
      "If affected, move to a cool area and apply wet cloths to skin.",
      "Seek medical attention if body temperature exceeds 103°F (39.4°C)."
    ]
  },
  {
    category: 'travel',
    title: "Public Transport Safety",
    content: "Wait for public transport in well-lit areas with other people. Move closer to the driver if uncomfortable.",
    impact: "Medium",
    icon: Users,
    protocol: [
      "Check official schedules to minimize waiting time at stops.",
      "Stand behind the safety line on platforms and near well-lit exits.",
      "Maintain a 'Safe Space' bubble and be aware of pickpockets in crowds.",
      "Identify 'Assistance Buttons' or intercoms upon boarding.",
      "Trust your instincts; if a situation feels wrong, disembark at the next safe stop."
    ]
  },
  {
    category: 'emergency',
    title: "Natural Disaster Prep",
    content: "Keep an emergency kit ready with essential documents, medicines, and a 3-day supply of water.",
    impact: "High",
    icon: AlertTriangle,
    protocol: [
      "Secure heavy furniture and appliances to walls (earthquake prep).",
      "Identify the highest and safest points in your building (flood prep).",
      "Keep a physical list of emergency contacts in your go-bag.",
      "Establish a family meeting point outside the immediate neighborhood.",
      "Monitor official SafeLink alerts for evacuation orders."
    ]
  }
];

const ProtocolModal = ({ tip, isOpen, onClose }) => {
  if (!tip) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  categories.find(c => c.id === tip.category)?.bg || "bg-slate-100"
                )}>
                  <tip.icon size={28} className={categories.find(c => c.id === tip.category)?.color || "text-slate-600"} />
                </div>
                <div>
                  <h2 className="text-2xl font-outfit font-black text-slate-900 dark:text-white leading-tight">
                    Full Protocol
                  </h2>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    {tip.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {tip.protocol.map((step, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={onClose}
                className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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

const SafetyTips = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTip, setSelectedTip] = React.useState(null);

  const filteredTips = tips.filter(tip => {
    const matchesCategory = activeCategory === 'all' || tip.category === activeCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      <ProtocolModal 
        tip={selectedTip} 
        isOpen={!!selectedTip} 
        onClose={() => setSelectedTip(null)} 
      />

      {/* Header section */}
      <div className="relative p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-indigo-600 overflow-hidden text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
              <Lightbulb size={24} />
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-100">Knowledge Base</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black mb-4 leading-tight"
          >
            Urban Safety <br /> Handbook
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-100/80 text-lg font-medium leading-relaxed"
          >
            Empowering citizens with proactive intelligence and actionable safety protocols for a smarter, safer city.
          </motion.p>
        </div>
        
        {/* Abstract Background Shapes */}
        <Shield size={240} className="absolute -right-20 -top-20 text-white/5 rotate-12" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-[100px]"></div>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('all')}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
              activeCategory === 'all' 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" 
                : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-indigo-200"
            )}
          >
            All Tips
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                activeCategory === cat.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" 
                  : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-indigo-200"
              )}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search safety tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-indigo-600 transition-all outline-none dark:text-white font-medium"
          />
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip, index) => (
          <motion.div 
            key={tip.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
              categories.find(c => c.id === tip.category)?.bg || "bg-slate-100"
            )}>
              <tip.icon size={24} className={categories.find(c => c.id === tip.category)?.color || "text-slate-600"} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                  tip.impact === 'Critical' ? "bg-rose-100 text-rose-600" : 
                  tip.impact === 'High' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                )}>
                  {tip.impact} Priority
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {tip.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {tip.content}
              </p>
            </div>

            <button 
              onClick={() => setSelectedTip(tip)}
              className="mt-8 flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:gap-3 transition-all"
            >
              Full Protocol <ChevronRight size={14} />
            </button>
            
            {/* Decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </motion.div>
        ))}
      </div>

      {/* Citizen Safety Charter */}
      <div className="mt-12 p-10 rounded-[2.5rem] bg-slate-900 dark:bg-indigo-900/10 border border-slate-800 dark:border-indigo-500/20 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 md:gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-2xl font-outfit font-black uppercase tracking-wider">Citizen Safety Charter</h2>
            </div>
            <p className="text-slate-400 dark:text-indigo-200/60 font-medium leading-relaxed">
              SafeLink is built on the foundation of community vigilance. By adhering to these protocols, you contribute to a resilient urban ecosystem. Our charter outlines the commitment between the city and its citizens.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Proactive Alert Reporting",
                "Community Vulnerability Mapping",
                "Emergency Protocol Compliance",
                "Verified Information Sharing"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300 dark:text-indigo-100">
                  <CheckCircle2 size={16} className="text-indigo-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="p-6 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-sm text-center space-y-4">
              <div className="text-4xl font-black font-outfit text-indigo-400">100%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Commitment to Privacy</div>
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                Download Full Charter
              </button>
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Emergency Contacts Section (Merged from incoming branch) */}
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

export default SafetyTips;
