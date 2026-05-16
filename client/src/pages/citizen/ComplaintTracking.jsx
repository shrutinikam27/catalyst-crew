import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Search, Filter, Clock, 
  CheckCircle, AlertTriangle, ArrowRight,
  MessageSquare, MapPin, Calendar, MoreHorizontal
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';

const initialComplaints = [
  { 
    id: '#CMP-4829', 
    type: 'Street Light Out', 
    status: 'In Progress', 
    date: '12 May, 2026', 
    location: 'Baner, Sector 4', 
    severity: 'low',
    source: 'Mock',
    updates: [
      { status: 'Resolved', time: 'Pending' },
      { status: 'Technician Assigned', time: '14 May, 10:30 AM' },
      { status: 'Complaint Registered', time: '12 May, 09:15 AM' }
    ]
  }
];

const ComplaintTracking = () => {
  const [activeComplaints, setActiveComplaints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let allComplaints = [...initialComplaints];

      // 1. Fetch from LocalStorage
      const localIncidents = JSON.parse(localStorage.getItem('local_incidents') || '[]');
      const formattedLocal = localIncidents.map(inc => ({
        ...inc,
        type: inc.category,
        source: 'Local',
        updates: [{ status: 'Complaint Registered', time: inc.date }]
      }));
      allComplaints = [...formattedLocal, ...allComplaints];

      // 2. Fetch from Firestore
      try {
        const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const firestoreIncidents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id.substring(0, 8).toUpperCase(),
          type: doc.data().category,
          source: 'Cloud',
          updates: [{ status: 'Complaint Registered', time: doc.data().date || 'Today' }]
        }));
        
        // Merge Cloud data (avoid duplicates if they were also in local)
        const cloudIds = new Set(firestoreIncidents.map(fi => fi.timestamp)); // Using timestamp as a loose key
        allComplaints = [...firestoreIncidents, ...allComplaints.filter(c => c.source !== 'Cloud')];
      } catch (err) {
        console.error("Firestore fetch error:", err);
      }

      setActiveComplaints(allComplaints);
      setLoading(false);
    };

    fetchData();
  }, []);

  const stats = {
    total: activeComplaints.length,
    resolved: activeComplaints.filter(c => c.status === 'Resolved').length,
    pending: activeComplaints.filter(c => c.status !== 'Resolved').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Track Complaints</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Monitor the status of your reported civic issues and grievances.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search ID..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-48 transition-all"
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Filed', value: stats.total, color: 'text-indigo-600' },
              { label: 'Resolved', value: stats.resolved, color: 'text-emerald-500' },
              { label: 'In Progress', value: stats.pending, color: 'text-amber-500' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <span className={cn("text-2xl font-outfit font-black", stat.color)}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {activeComplaints.map((comp, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={comp.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                      comp.severity === 'high' ? "bg-rose-500" :
                      comp.severity === 'moderate' ? "bg-amber-500" : "bg-indigo-500"
                    )}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{comp.type}</h3>
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{comp.id}</span>
                        {comp.source && (
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                            comp.source === 'Cloud' ? "bg-emerald-100 text-emerald-700" : 
                            comp.source === 'Local' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                          )}>
                            {comp.source === 'Cloud' ? '☁️ Cloud' : comp.source === 'Local' ? '💻 Local' : 'Mock'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin size={10} /> {comp.location}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar size={10} /> {comp.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest",
                      comp.status === 'Resolved' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" :
                      comp.status === 'In Progress' ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600" :
                      "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
                    )}>
                      {comp.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black">
                        {i === 3 ? '+2' : <Clock size={12} className="text-slate-400" />}
                      </div>
                    ))}
                  </div>
                  <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 hover:translate-x-1 transition-transform">
                    View Full Timeline <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Status Tracker Sidebar */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">Live Timeline</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
              {complaints[0].updates.map((update, i) => (
                <div key={i} className="relative pl-10">
                  <div className={cn(
                    "absolute left-0 top-1.5 w-6.5 h-6.5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm",
                    update.time === 'Pending' ? "bg-slate-200" : "bg-emerald-500"
                  )}>
                    {update.time === 'Pending' ? <Clock size={10} className="text-slate-500" /> : <CheckCircle size={10} className="text-white" />}
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-bold",
                      update.time === 'Pending' ? "text-slate-400" : "text-slate-900 dark:text-white"
                    )}>{update.status}</h4>
                    <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
              <MessageSquare size={18} /> Chat with Agent
            </button>
          </div>

          {/* Information Card */}
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <AlertTriangle size={24} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold font-outfit">Citizen <br /> Rights</h3>
              <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                As per city bylaws, category-A issues must be acknowledged within 24 hours and resolved within 7 working days.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                Download SLA Policy <ArrowRight size={12} />
              </button>
            </div>
            <FileText size={120} className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracking;
