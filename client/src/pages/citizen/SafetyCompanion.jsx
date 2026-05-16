import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Navigation, ShieldCheck, Zap, 
  Search, Star, Eye, Moon, Sun, 
  ArrowRight, ChevronLeft, Info, AlertTriangle,
  Lightbulb, Users, Map as MapIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const SafetyCompanion = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('finder'); // finder, ratings
  const [source, setSource] = useState('My Current Location');
  const [destination, setDestination] = useState('');
  const [routeType, setRouteType] = useState('safest'); // safest, fastest
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/user')}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-outfit font-extrabold text-slate-900 dark:text-white">Safety Companion</h1>
          <p className="text-xs text-slate-500 font-medium">AI-Powered Urban Navigation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('finder')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
            activeTab === 'finder' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Navigation size={16} />
          Route Finder
        </button>
        <button 
          onClick={() => setActiveTab('ratings')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
            activeTab === 'ratings' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Star size={16} />
          Street Ratings
        </button>
      </div>

      {activeTab === 'finder' ? (
        <div className="space-y-6">
          {/* Search Inputs */}
          <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
              <input 
                type="text" 
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Start point"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20"></div>
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            {/* Route Preferences */}
            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setRouteType('safest')}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 transition-all text-left group",
                  routeType === 'safest' ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", routeType === 'safest' ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                  <ShieldCheck size={18} />
                </div>
                <p className={cn("text-xs font-bold", routeType === 'safest' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500")}>Safest Path</p>
                <p className="text-[10px] text-slate-400 font-medium">Prioritizes lighting & low crime</p>
              </button>

              <button 
                onClick={() => setRouteType('fastest')}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 transition-all text-left",
                  routeType === 'fastest' ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-slate-100 dark:border-slate-800 hover:border-amber-200"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", routeType === 'fastest' ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                  <Zap size={18} />
                </div>
                <p className={cn("text-xs font-bold", routeType === 'fastest' ? "text-amber-600 dark:text-amber-400" : "text-slate-500")}>Fastest Path</p>
                <p className="text-[10px] text-slate-400 font-medium">Prioritizes speed & distance</p>
              </button>
            </div>

            <button 
              onClick={handleSearch}
              disabled={!destination || isSearching}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search size={18} />
                  Find Safest Route
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Mock Map View */}
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-2xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt="City Map"
                  />
                  {/* Mock Paths */}
                  <svg className="absolute inset-0 w-full h-full p-12 pointer-events-none">
                    <motion.path 
                      d="M 50 300 Q 150 150 350 100" 
                      fill="transparent" 
                      stroke={routeType === 'safest' ? "#10b981" : "#94a3b8"} 
                      strokeWidth="12" 
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.path 
                      d="M 50 300 L 200 280 L 350 100" 
                      fill="transparent" 
                      stroke={routeType === 'fastest' ? "#f59e0b" : "#94a3b8"} 
                      strokeWidth="12" 
                      strokeLinecap="round"
                      strokeDasharray="20 10"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </svg>

                  {/* Indicators */}
                  <div className="absolute top-12 right-12 w-4 h-4 bg-indigo-500 rounded-full ring-8 ring-indigo-500/20 animate-pulse"></div>
                  <div className="absolute bottom-12 left-12 w-4 h-4 bg-emerald-500 rounded-full ring-8 ring-emerald-500/20"></div>

                  {/* Route Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl text-white", routeType === 'safest' ? "bg-emerald-500" : "bg-amber-500")}>
                          {routeType === 'safest' ? <ShieldCheck size={20} /> : <Zap size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-white">
                            {routeType === 'safest' ? 'Safest Path Found' : 'Quickest Path Found'}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {routeType === 'safest' ? '12 mins • High Visibility' : '8 mins • Lower Visibility'}
                          </p>
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Safety Factors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                      <Lightbulb size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Lighting</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">92%</p>
                    <p className="text-[10px] text-slate-400">Excellent Coverage</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <Users size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Crowd Density</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">Moderate</p>
                    <p className="text-[10px] text-slate-400">Low risk isolated spots</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Submit Rating CTA */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-bold">Rate Your Surroundings</h3>
              <p className="text-indigo-100 text-xs">Help fellow citizens by sharing the safety feel of this area.</p>
              <button className="mt-4 px-6 py-2.5 bg-white text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-all">
                Submit Rating
              </button>
            </div>
            <Eye size={120} className="absolute -right-4 -bottom-4 text-white/10 -rotate-12" />
          </div>

          {/* Nearby Ratings List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white px-2">Recent Ratings Nearby</h4>
            {[
              { street: 'Baner Main Road', rating: 4.8, count: 124, tags: ['Well-lit', 'Crowded'], time: '2 mins ago' },
              { street: 'Park Avenue Lane', rating: 2.5, count: 42, tags: ['Isolated', 'No Lights'], time: '15 mins ago' },
              { street: 'Civic Center Plaza', rating: 4.2, count: 89, tags: ['Active Patrol', 'CCTV'], time: '1 hr ago' },
            ].map((item) => (
              <div key={item.street} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white">{item.street}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">{item.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold",
                      tag === 'Isolated' || tag === 'No Lights' 
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" 
                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    )}>
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] text-slate-400 font-bold">{item.count} reviews</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 flex items-start gap-3">
        <Info size={20} className="text-indigo-600 shrink-0" />
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
          "Safety scores are generated by combining real-time lighting data, crime hotspots from Pune Police, 
          and recent crowdsourced reports from citizens like you."
        </p>
      </div>
    </div>
  );
};

export default SafetyCompanion;
