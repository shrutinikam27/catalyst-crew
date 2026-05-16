import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, TrendingUp, AlertTriangle, Shield, 
  MapPin, Clock, Brain, Activity, Zap,
  BarChart3, LineChart as LineIcon, Info, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { cn } from '../../utils/cn';

const forecastData = [
  { hour: '00:00', risk: 12 },
  { hour: '04:00', risk: 8 },
  { hour: '08:00', risk: 45 },
  { hour: '12:00', risk: 32 },
  { hour: '16:00', risk: 65 },
  { hour: '20:00', risk: 88 },
  { hour: '23:00', risk: 72 },
];

const zoneRiskData = [
  { zone: 'Sector 1', risk: 85 },
  { zone: 'Sector 2', risk: 42 },
  { zone: 'Sector 3', risk: 15 },
  { zone: 'Sector 4', risk: 68 },
  { zone: 'Sector 5', risk: 33 },
];

const AIForecasts = () => {
  const [isRetraining, setIsRetraining] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [isDeployed, setIsDeployed] = React.useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeploying(false);
    setIsDeployed(true);
  };

  const handleRetrain = () => {
    setIsRetraining(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          alert("Neural Models Retrained Successfully with 98.4% Accuracy!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-8 pb-12 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Brain size={20} />
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
              {isRetraining ? `Training Neural Engine... ${progress}%` : "Neural Engine v4.2 Active"}
            </span>
          </div>
          <h1 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">Predictive Intelligence Forecasts</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">AI-driven crime prediction and hazard forecasting models.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRetrain}
            disabled={isRetraining}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {isRetraining ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Zap size={18} />
            )}
            {isRetraining ? "Training..." : "Retrain Models"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Risk Prediction Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">24h Risk Probability Forecast</h3>
              <p className="text-xs text-slate-500 font-medium">Predicted incident density for the next 24 hours</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-indigo-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="risk" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
            <Cpu size={120} />
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-widest mb-4">
                <AlertTriangle size={14} /> Critical Insight
              </div>
              <h4 className="text-xl font-bold mb-4">High Risk Detected in Sector 4 (Wakad)</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Based on historical patterns and current weather conditions, our AI predicts an 85% probability of traffic-related incidents between 18:00 and 20:00 today.
              </p>
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || isDeployed}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2",
                  isDeployed 
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 text-white" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 text-white disabled:opacity-50"
                )}
              >
                {isDeploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deploying...
                  </>
                ) : isDeployed ? (
                  <>
                    <CheckCircle2 size={16} /> Units Dispatched
                  </>
                ) : (
                  "Deploy Preventive Patrol"
                )}
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
              <Brain size={120} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Zone Risk Ranking */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <MapPin size={20} className="text-indigo-600" /> Zone Risk Ranking
          </h3>
          <div className="space-y-6">
            {zoneRiskData.map((zone, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{zone.zone}</span>
                  <span className={cn(
                    "text-xs font-black",
                    zone.risk > 70 ? "text-rose-500" : 
                    zone.risk > 40 ? "text-amber-500" : "text-emerald-500"
                  )}>{zone.risk}% Risk</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.risk}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn(
                      "h-full rounded-full",
                      zone.risk > 70 ? "bg-rose-500" : 
                      zone.risk > 40 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Accuracy Tracking */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <Activity size={20} className="text-emerald-600" /> Model Accuracy & Training
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-transparent hover:border-emerald-500/20 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Precision</p>
                <div className="text-3xl font-outfit font-black text-emerald-600">94.2%</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-2">
                  <TrendingUp size={10} /> +1.4%
                </div>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-transparent hover:border-indigo-500/20 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Points</p>
                <div className="text-3xl font-outfit font-black text-indigo-600">1.2M</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-2">
                  <Clock size={10} /> Updated 5m ago
                </div>
             </div>
          </div>
          <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-indigo-600 rounded-lg text-white mt-1">
              <Info size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-widest mb-1">Model Recommendation</h5>
              <p className="text-xs text-indigo-800 dark:text-indigo-300/70 font-medium leading-relaxed">
                Platform suggests increasing patrol density in the Eastern Corridor due to a significant rise in multi-source hazard signals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIForecasts;
