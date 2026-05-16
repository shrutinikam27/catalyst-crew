import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Mail, Clock, ChevronRight, X, AlertTriangle, MapPin, CheckCircle, Activity 
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import ChartCard from '../../components/ui/ChartCard';
import { cn } from '../../utils/cn';
import puneDataset from '../../data/pune_safety_dataset.json';

const AdminReports = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [incidents, setIncidents] = useState([]);
  
  // Reply Feature States
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // View Report Feature State
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // 1. Fetch Incidents
    const qIncidents = query(
      collection(db, 'incidents'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribeIncidents = onSnapshot(qIncidents, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Inject the synthetic Pune Dataset
      const syntheticDocs = puneDataset.map(item => ({
        ...item,
        title: item.subcategory,
        timestamp: { toDate: () => new Date(item.reportedTime) },
        location: {
          address: item.location.address,
          coords: [item.location.lat, item.location.lng]
        }
      }));

      setIncidents([...syntheticDocs, ...docs]);
    });

    // 2. Fetch Support Requests
    const qSupport = query(
      collection(db, 'support_requests'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribeSupport = onSnapshot(qSupport, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSupportRequests(requests);
    });

    return () => {
      unsubscribeIncidents();
      unsubscribeSupport();
    };
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    if (String(id).startsWith('PUNE-')) {
      const item = puneDataset.find(i => i.id === id);
      if (item) item.status = newStatus;
      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
      return;
    }

    try {
      const incidentRef = doc(db, 'incidents', id);
      await updateDoc(incidentRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setIsSending(true);
    try {
      const inquiryRef = doc(db, 'support_requests', selectedInquiry.id);
      await updateDoc(inquiryRef, { 
        status: 'replied',
        reply: replyMessage,
        repliedAt: new Date()
      });
      alert("Reply sent successfully to " + selectedInquiry.name);
      setSelectedInquiry(null);
      setReplyMessage('');
    } catch (err) {
      console.error("Error sending reply:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">Citizen Reports & Replies</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Dedicated feed for incident resolution and civic grievance feedback.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Incidents Feed */}
        <ChartCard title="Crime & Civic Issue Hotspots" subtitle="Real-time emergency & grievance mapping">
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
            {incidents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                No active hotspots reported
              </div>
            ) : (
              incidents.map((log) => (
                <div key={log.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-500/20 transition-all group">
                  <div className={cn(
                    "w-1.5 h-10 rounded-full",
                    log.severity === 'high' ? "bg-rose-500" : 
                    log.severity === 'moderate' ? "bg-amber-500" : "bg-indigo-500"
                  )}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{log.category}</h4>
                      <span className="text-[10px] font-bold text-slate-400">
                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : 'Just Now'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">
                        {typeof log.location === 'object' ? log.location.address : log.location}
                      </span>
                      <span className="text-indigo-500 text-xs mx-1">•</span>
                      <span className={cn(
                        "text-[11px] font-bold",
                        log.status === 'Pending' ? "text-amber-500" : "text-emerald-500"
                      )}>{log.status}</span>
                    </div>
                  </div>
                  {log.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedReport(log)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all shadow-sm"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(log.id, 'Resolved')}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest transition-all shadow-sm"
                      >
                        Resolve
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedReport(log)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all shadow-sm"
                      >
                        View
                      </button>
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                        <CheckCircle size={16} />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ChartCard>

        {/* Support Requests Feed */}
        <ChartCard title="Citizen Grievance Analysis" subtitle="Real-time civic complaint processing">
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {supportRequests.length === 0 ? (
              <div className="py-12 text-center">
                <Mail className="mx-auto text-slate-300 mb-4" size={40} />
                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">No active grievances</p>
              </div>
            ) : (
              supportRequests.map((req) => (
                <div key={req.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase">
                        {req.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{req.name}</h4>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{req.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                    "{req.message}"
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => setSelectedInquiry(req)}
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Reply to Citizen <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ChartCard>
      </div>

      {/* Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedInquiry(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white">Reply to Citizen</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Inquiry from {selectedInquiry.name}</p>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-6 italic text-sm text-slate-600 dark:text-slate-400">
              "{selectedInquiry.message}"
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Response</label>
              <textarea 
                className="w-full h-32 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <button 
                onClick={handleSendReply}
                disabled={isSending || !replyMessage.trim()}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Mail size={18} /> Send Official Reply
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  selectedReport.severity === 'high' ? "bg-rose-100 text-rose-600" : 
                  selectedReport.severity === 'moderate' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                )}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white">{selectedReport.title || "Report Details"}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {selectedReport.category}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  "{selectedReport.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Reported Time</label>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock size={14} className="text-indigo-500" />
                    {selectedReport.timestamp?.toDate ? selectedReport.timestamp.toDate().toLocaleString() : 'Just Now'}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                  <p className={cn(
                    "text-sm font-bold flex items-center gap-2",
                    selectedReport.status === 'Pending' ? "text-amber-500" : "text-emerald-500"
                  )}>
                    <Activity size={14} />
                    {selectedReport.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Location Details</label>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                    <MapPin size={14} className="text-rose-500 mt-0.5 shrink-0" />
                    {typeof selectedReport.location === 'object' ? selectedReport.location.address : selectedReport.location}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all"
                >
                  Close
                </button>
                {selectedReport.status === 'Pending' && (
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedReport.id, 'Resolved');
                      setSelectedReport(null);
                    }}
                    className="flex-[2] py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                  >
                    Resolve Incident
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
