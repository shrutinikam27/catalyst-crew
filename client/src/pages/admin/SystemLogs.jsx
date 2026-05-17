import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Search, Filter, Download, 
  Terminal, Shield, AlertCircle, CheckCircle2,
  Clock, Cpu, Globe, Database, X
} from 'lucide-react';
import { cn } from '../../utils/cn';

const SystemLogs = () => {
  const [logs] = useState([
    { id: 1, type: 'Security', event: 'New Admin Login', user: 'priya.p@safelink.gov', ip: '192.168.1.45', time: 'Just Now', status: 'Success' },
    { id: 2, type: 'Database', event: 'Incident #SL-9842 Created', user: 'Citizen #420', ip: '103.42.11.9', time: '2m ago', status: 'Success' },
    { id: 3, type: 'Emergency', event: 'SOS Triggered (High Priority)', user: 'Rahul D.', ip: 'GPS: 18.52, 73.85', time: '5m ago', status: 'Alert' },
    { id: 4, type: 'System', event: 'API Quota Refresh', user: 'System-Bot', ip: 'internal-cluster', time: '12m ago', status: 'Success' },
    { id: 5, type: 'Auth', event: 'Failed Login Attempt', user: 'unknown@user.com', ip: '45.122.3.90', time: '15m ago', status: 'Failed' },
    { id: 6, type: 'Security', event: 'Firestore Rules Update', user: 'System-Admin', ip: 'internal', time: '20m ago', status: 'Success' },
    { id: 7, type: 'Cloud', event: 'Storage Bucket Cleanup', user: 'Cloud-Worker', ip: 'us-east-1', time: '45m ago', status: 'Success' },
  ]);

  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleLines, setConsoleLines] = useState([]);

  const handleExportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Type,Event,User,IP,Time,Status\n" 
      + logs.map(l => `${l.id},${l.type},"${l.event}",${l.user},${l.ip},${l.time},${l.status}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SafeLink_Audit_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenConsole = () => {
    setIsConsoleOpen(true);
    setConsoleLines([
      '> INITIALIZING SAFELINK SECURE CONSOLE...', 
      '> CONNECTING TO CITY MAINFRAME...', 
      '> CONNECTION ESTABLISHED. STREAMING LIVE SYSTEM EVENTS...'
    ]);
    
    // Simulate streaming events
    let count = 0;
    const interval = setInterval(() => {
        if(count > 15) {
          clearInterval(interval);
          return;
        }
        const randEvent = logs[Math.floor(Math.random() * logs.length)];
        setConsoleLines(prev => [...prev, `[${new Date().toISOString()}] [${randEvent.type.toUpperCase()}] ${randEvent.event} (IP: ${randEvent.ip}) - STATUS: ${randEvent.status}`]);
        count++;
    }, 1500);

    // Store interval to clear on close if needed, but keeping it simple for now.
  };

  return (
    <div className="space-y-8 pb-12 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">System Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time immutable ledger of all platform activities.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenConsole}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl"
          >
            <Terminal size={14} /> Live Console
          </button>
          <button 
            onClick={handleExportLogs}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={14} /> Export Logs
          </button>
        </div>
      </div>

      {/* Monitoring Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Uptime', value: '99.98%', icon: Cpu, color: 'text-emerald-500' },
          { label: 'Server Load', value: '24%', icon: Database, color: 'text-indigo-500' },
          { label: 'Active Sessions', value: '1,482', icon: Globe, color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-outfit font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Streaming Logs</span>
           </div>
           <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter logs..."
                  className="bg-slate-800 border-none ring-1 ring-slate-700 p-2 pl-10 rounded-lg text-xs text-white focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-64"
                />
              </div>
              <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors">
                <Filter size={14} />
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Event Description</th>
                <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Actor / Origin</th>
                <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                      <Clock size={12} className="text-slate-600" />
                      {log.time}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                      log.type === 'Security' ? "bg-rose-900/30 text-rose-400" :
                      log.type === 'Database' ? "bg-indigo-900/30 text-indigo-400" :
                      log.type === 'Emergency' ? "bg-amber-900/30 text-amber-400" : "bg-slate-700 text-slate-300"
                    )}>
                      {log.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-[11px] font-bold text-slate-200">
                      {log.event}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-bold text-slate-300">{log.user}</div>
                      <div className="text-[9px] font-medium text-slate-600 font-mono">{log.ip}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest",
                      log.status === 'Success' ? "text-emerald-500" :
                      log.status === 'Alert' ? "text-amber-500" : "text-rose-500"
                    )}>
                      {log.status === 'Success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {log.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Console Modal */}
      {isConsoleOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsConsoleOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0a0a0a] w-full max-w-4xl h-[70vh] rounded-[2rem] shadow-2xl relative z-10 border border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="bg-[#111] p-4 flex justify-between items-center border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">SafeLink Secure Console / root@mainframe</span>
              </div>
              <button 
                onClick={() => setIsConsoleOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-md text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-[11px] md:text-xs text-emerald-400 overflow-y-auto flex-1 custom-scrollbar space-y-2">
              {consoleLines.map((line, idx) => (
                <div key={idx} className="leading-relaxed opacity-90 break-words">
                  {line}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4 animate-pulse">
                <span className="text-emerald-500">_</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;
