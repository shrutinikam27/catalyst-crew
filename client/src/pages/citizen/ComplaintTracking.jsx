import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, Clock, 
  CheckCircle, AlertTriangle, ArrowRight,
  MessageSquare, MapPin, Calendar, MoreHorizontal,
  Loader2, Inbox
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../firebase/AuthContext';
import { subscribeToUserComplaints } from '../../services/firestoreService';

const ComplaintTracking = () => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Real-time subscription to user's complaints from Firestore
  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    // Timeout fallback in case Firestore index isn't created yet
    const timeout = setTimeout(() => setLoading(false), 3000);

    const unsubscribe = subscribeToUserComplaints(currentUser.uid, (docs) => {
      clearTimeout(timeout);
      setComplaints(docs);
      setLoading(false);
      // Auto-select first complaint for timeline
      if (docs.length > 0 && !selectedComplaint) {
        setSelectedComplaint(docs[0]);
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [currentUser?.uid]);

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = searchQuery 
      ? (c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || c.id?.includes(searchQuery))
      : true;
    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats from real data
  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    inProgress: complaints.filter(c => c.status === 'assigned' || c.status === 'investigating').length,
    pending: complaints.filter(c => c.status === 'pending').length,
  };

  // Generate timeline for selected complaint
  const getTimeline = (complaint) => {
    if (!complaint) return [];
    const timeline = [];
    
    if (complaint.createdAt) {
      const created = complaint.createdAt?.toDate ? complaint.createdAt.toDate() : new Date(complaint.createdAt);
      timeline.push({ status: 'Complaint Registered', time: created.toLocaleString(), done: true });
    }
    
    if (complaint.status === 'assigned' || complaint.status === 'investigating' || complaint.status === 'resolved') {
      timeline.push({ status: `Assigned to ${complaint.department || 'Department'}`, time: complaint.updatedAt?.toDate ? complaint.updatedAt.toDate().toLocaleString() : 'Recently', done: true });
    } else {
      timeline.push({ status: 'Awaiting Assignment', time: 'Pending', done: false });
    }

    if (complaint.status === 'investigating' || complaint.status === 'resolved') {
      timeline.push({ status: 'Under Investigation', time: 'In Progress', done: true });
    } else {
      timeline.push({ status: 'Investigation', time: 'Pending', done: false });
    }

    if (complaint.status === 'resolved') {
      const resolved = complaint.resolvedAt?.toDate ? complaint.resolvedAt.toDate() : new Date();
      timeline.push({ status: 'Resolved', time: resolved.toLocaleString(), done: true });
    } else {
      timeline.push({ status: 'Resolution', time: 'Pending', done: false });
    }

    return timeline.reverse();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600';
      case 'assigned': case 'investigating': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600';
      default: return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-rose-500';
      case 'moderate': return 'bg-amber-500';
      default: return 'bg-indigo-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <p className="text-sm font-bold text-slate-500">Loading your complaints...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Track Complaints</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Monitor the status of your reported issues in real-time.
            {complaints.length > 0 && <span className="text-indigo-600 font-bold"> ({complaints.length} filed)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complaints..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-48 transition-all dark:text-white"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Filed', value: stats.total, color: 'text-indigo-600' },
              { label: 'Resolved', value: stats.resolved, color: 'text-emerald-500' },
              { label: 'In Progress', value: stats.inProgress, color: 'text-amber-500' },
              { label: 'Pending', value: stats.pending, color: 'text-rose-500' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <span className={cn("text-2xl font-outfit font-black", stat.color)}>{String(stat.value).padStart(2, '0')}</span>
              </div>
            ))}
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <Inbox size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-400">No complaints found</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {complaints.length === 0 
                    ? 'You haven\'t filed any complaints yet. Go to "Report Incident" to file one.'
                    : 'No complaints match your search filters.'
                  }
                </p>
              </div>
            ) : (
              filteredComplaints.map((comp, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={comp.id} 
                  onClick={() => setSelectedComplaint(comp)}
                  className={cn(
                    "bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm hover:shadow-xl transition-all group cursor-pointer",
                    selectedComplaint?.id === comp.id 
                      ? "border-indigo-300 dark:border-indigo-600 ring-2 ring-indigo-100 dark:ring-indigo-900/30" 
                      : "border-slate-100 dark:border-slate-800"
                  )}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0",
                        getSeverityColor(comp.severity)
                      )}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 dark:text-white">{comp.title || comp.category}</h3>
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                            #{comp.id?.slice(0, 8)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          {comp.location?.address && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin size={10} /> {comp.location.address}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar size={10} /> {comp.createdAt?.toDate ? comp.createdAt.toDate().toLocaleDateString() : 'Recently'}
                          </span>
                          {comp.category && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{comp.category}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest",
                        getStatusColor(comp.status)
                      )}>
                        {comp.status}
                      </span>
                    </div>
                  </div>

                  {comp.imageUrl && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <img src={comp.imageUrl} alt="Evidence" className="w-20 h-20 rounded-xl object-cover" />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Status Tracker Sidebar */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">
              {selectedComplaint ? 'Live Timeline' : 'Select a complaint'}
            </h3>
            {selectedComplaint ? (
              <div className="space-y-8 relative">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                {getTimeline(selectedComplaint).map((update, i) => (
                  <div key={i} className="relative pl-10">
                    <div className={cn(
                      "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm",
                      update.done ? "bg-emerald-500" : "bg-slate-200"
                    )}>
                      {update.done ? <CheckCircle size={10} className="text-white" /> : <Clock size={10} className="text-slate-500" />}
                    </div>
                    <div>
                      <h4 className={cn(
                        "text-sm font-bold",
                        update.done ? "text-slate-900 dark:text-white" : "text-slate-400"
                      )}>{update.status}</h4>
                      <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">Click on a complaint to view its timeline</p>
            )}
          </div>

          {/* Information Card */}
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <AlertTriangle size={24} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold font-outfit">Citizen <br />Rights</h3>
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
// SafeLink Pune Citizen Support Feed HMR Refresh Hook
