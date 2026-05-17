import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, Shield, Activity, Users, 
  MapPin, AlertTriangle, CheckCircle, 
  Settings, Download, Search, Briefcase, Globe,
  MessageSquare, Mail, Clock, ChevronRight,
  ExternalLink, BadgeCheck, BarChart, X, Zap
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend
} from 'recharts';
import { cn } from '../../utils/cn';
import { useSocket } from '../../context/SocketContext';
import { 
  subscribeToAllComplaints,
  subscribeToEmergencies,
  subscribeToAnalytics,
  subscribeToCollection,
  COLLECTIONS
} from '../../services/firestoreService';
import { seedDatabase } from '../../services/seedDatabase';

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: `marker-icon-${color}`
  });
};

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const cityData = [
  { name: 'Crime Prevention', value: 400 },
  { name: 'Medical Response', value: 300 },
  { name: 'Traffic Safety', value: 300 },
  { name: 'Fire Response', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

import puneDataset from '../../data/pune_safety_dataset.json';

// Pre-defined Analytical Risk Zones for Pune
const riskZones = [
  { id: 'zone-1', center: [18.5913, 73.7389], radius: 2500, type: 'red', name: 'Hinjewadi High-Risk Area' }, 
  { id: 'zone-2', center: [18.5089, 73.9259], radius: 3000, type: 'red', name: 'Hadapsar Critical Hotspot' }, 
  { id: 'zone-3', center: [18.5074, 73.8077], radius: 2800, type: 'green', name: 'Kothrud Secured Zone' }, 
  { id: 'zone-4', center: [18.5158, 73.8822], radius: 1800, type: 'green', name: 'Camp Safe Zone' },
  { id: 'zone-5', center: [18.5580, 73.8075], radius: 2000, type: 'yellow', name: 'Aundh Monitoring Ring' }
];

const AdminDashboard = () => {
  const { notifications } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);

  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    efficiency: 94.8
  });

  // Reply Feature States
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // View Report Feature State
  const [selectedReport, setSelectedReport] = useState(null);

  // Settings Feature States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [aiSensitivity, setAiSensitivity] = useState(75);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSavingConfig(false);
    setIsSettingsOpen(false);
    alert("✅ System Configuration Synchronized! All nodes updated with new sensitivity protocols.");
  };

  const handleToggleEmergency = () => {
    setIsEmergencyMode(!isEmergencyMode);
    if (!isEmergencyMode) {
      alert("⚠️ CITY-WIDE EMERGENCY MODE ACTIVATED! All emergency units have been notified.");
    } else {
      alert("✅ City-wide Emergency Mode deactivated. Standing down units.");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setIsSending(true);
    try {
      // In a real app, we would add a 'replies' sub-collection or field
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

  const handleUpdateStatus = async (id, newStatus) => {
    if (String(id).startsWith('PUNE-') || String(id).startsWith('#SL-LOCAL-')) {
      // Simulate resolving a synthetic or local dataset item
      if (String(id).startsWith('PUNE-')) {
        const item = puneDataset.find(i => i.id === id);
        if (item) item.status = newStatus;
      } else {
        const localFallback = JSON.parse(localStorage.getItem('local_incidents') || '[]');
        const updatedLocal = localFallback.map(item => item.id === id ? { ...item, status: newStatus } : item);
        localStorage.setItem('local_incidents', JSON.stringify(updatedLocal));
      }
      
      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
      setStats(prev => ({ ...prev, resolved: prev.resolved + 1, active: prev.active - 1 }));
      return;
    }

    try {
      const incidentRef = doc(db, 'incidents', id);
      await updateDoc(incidentRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubs = [
      subscribeToAllComplaints(setComplaints),
      subscribeToEmergencies(setEmergencies),
      subscribeToAnalytics(setAnalytics),
      subscribeToCollection(COLLECTIONS.NOTIFICATIONS, setSupportRequests, [], 'createdAt', 'desc', 10),
      subscribeToCollection('volunteerRequests', (vols) => {
        // Sort in-memory to avoid composite index requirements
        const sorted = [...vols].sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return timeB - timeA;
        });
        setVolunteers(sorted);
      }, [{ field: 'status', operator: '==', value: 'pending' }], null),
    ];

    // 1. Fetch Incidents
    const qIncidents = query(
      collection(db, 'incidents'),
      orderBy('timestamp', 'desc'),
      limit(20)
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

      // Pull locally cached emergency reports (offline fallback)
      const localFallback = JSON.parse(localStorage.getItem('local_incidents') || '[]');
      const localDocs = localFallback.map(item => ({
        ...item,
        timestamp: { toDate: () => new Date(item.timestamp) }
      }));

      const mergedIncidents = [...localDocs, ...syntheticDocs, ...docs];
      setIncidents(mergedIncidents);
      
      // Calculate Stats
      const total = mergedIncidents.length;
      const resolved = mergedIncidents.filter(d => d.status === 'Resolved').length;
      const pending = mergedIncidents.filter(d => d.status === 'Pending').length;
      setStats(prev => ({
        ...prev,
        total: total * 10, // Mocking a larger scale for the admin view
        active: pending,
        resolved: resolved
      }));
    });

    // 2. Fetch Support Requests
    const qSupport = query(
      collection(db, 'support_requests'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribeSupport = onSnapshot(qSupport, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSupportRequests(requests);
    });

    return () => {
      unsubs.forEach(u => u());
      unsubscribeIncidents();
      unsubscribeSupport();
    };
  }, []);

  // Compute live stats
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
  const activeEmergencies = emergencies.filter(e => e.status === 'active').length;
  const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : '0';

  const cityData = [
    { name: 'Crime Reports', value: complaints.filter(c => c.category === 'crime' || c.department === 'police').length || 40 },
    { name: 'Medical Response', value: complaints.filter(c => c.category === 'accident' || c.department === 'hospital').length || 30 },
    { name: 'Fire Incidents', value: complaints.filter(c => c.category === 'fire' || c.department === 'fire').length || 20 },
    { name: 'Civic Issues', value: complaints.filter(c => c.category === 'civic' || c.department === 'admin').length || 25 },
  ];

  const handleVolunteerAction = async (vol, status) => {
    setActionLoading(vol.id);
    try {
      const { updateDocument, syncUserProfile } = await import('../../services/firestoreService');
      
      // 1. Update request status
      await updateDocument('volunteerRequests', vol.id, { status });
      
      // 2. If approved, update user's profile role
      if (status === 'approved') {
        await syncUserProfile(vol.uid, {
          role: 'volunteer',
          displayName: vol.name
        });
        console.log(`✅ Volunteer ${vol.name} approved and role updated.`);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* City Status Banner */}
      <div className="bg-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="relative z-10 space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-widest">
              <Globe size={12} /> Pune D7: PS-1 Operational
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-outfit font-extrabold">Smart Urban Risk Mapping &amp; Citizen Safety Platform</h1>
            <p className="text-indigo-100 font-medium max-w-xl text-sm">
              Integrating crime statistics, civic grievance reports, and demographic datasets to identify high-risk zones and prioritize emergency response planning across Pune.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={async () => {
                setSeeding(true);
                try {
                  await seedDatabase();
                  setSeedDone(true);
                  setTimeout(() => setSeedDone(false), 5000);
                } catch (err) {
                  console.error('Seed error:', err);
                }
                setSeeding(false);
              }}
              disabled={seeding}
              className="px-4 py-2 bg-white/10 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center gap-2"
              title="Populate database with Pune infrastructure data"
            >
              {seeding ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Seeding...
                </>
              ) : seedDone ? (
                "✅ Seeded!"
              ) : (
                <>
                  <Download size={14} />
                  Seed Pune Data
                </>
              )}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={cn(
                "p-3 sm:p-4 rounded-2xl border transition-all group",
                isEmergencyMode
                  ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                  : "bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white"
              )}
            >
              <Settings size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-white text-indigo-600 font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg shadow-white/10 text-sm"
            >
              <BarChart size={18} />
              <span className="hidden sm:inline">View Predictive Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </button>
          </div>
          {seedDone && (
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg animate-bounce">
              ✅ Database seeded!
            </div>
          )}
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      </div>

      {/* Live Command Map */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="h-64 sm:h-80 lg:h-[500px] w-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden z-0 border border-slate-100 dark:border-slate-800 relative">
          <MapContainer 
            center={[18.5204, 73.8567]} 
            zoom={12} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Render Risk Zones */}
            {riskZones.map(zone => (
              <Circle 
                key={zone.id}
                center={zone.center}
                radius={zone.radius}
                pathOptions={{ 
                  color: zone.type === 'red' ? '#ef4444' : zone.type === 'green' ? '#10b981' : '#f59e0b',
                  fillColor: zone.type === 'red' ? '#ef4444' : zone.type === 'green' ? '#10b981' : '#f59e0b',
                  fillOpacity: 0.2,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="font-bold text-slate-800">
                    <span className="text-[10px] uppercase text-slate-400 block">{zone.type} Zone</span>
                    {zone.name}
                  </div>
                </Popup>
              </Circle>
            ))}
            {incidents.filter(inc => inc.location?.coords).map((inc) => (
              <Marker 
                key={inc.id} 
                position={inc.location.coords}
              >
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                        inc.severity === 'high' ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"
                      )}>{inc.category}</span>
                      <span className="text-[8px] font-bold text-slate-400">{inc.status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{inc.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{inc.description}</p>
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(inc.id, 'Resolved')}
                        className="flex-1 bg-emerald-500 text-white text-[8px] font-bold py-1.5 rounded-md uppercase"
                      >
                        Resolve Now
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Map Overlay Controls */}
          <div className="absolute top-4 right-4 z-[1000] space-y-2">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Pune Emergency Regions</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">High-Risk Zones (2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Civic Issues (14)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Clear Regions (8)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard title="Total Complaints" value={totalComplaints.toString()} icon={AlertTriangle} trend={`${resolvedComplaints} resolved`} trendType="down" description="From Firestore real-time" />
        <StatCard title="Active Emergencies" value={activeEmergencies.toString()} icon={Activity} trend="Live" trendType={activeEmergencies > 3 ? "up" : "down"} description="SOS & dispatch requests" />
        <StatCard title="Resolution Rate" value={`${resolutionRate}%`} icon={CheckCircle} trend="2.1%" trendType="up" description="Across all departments" />
        <StatCard title="Live Incidents" value={notifications.length.toString()} icon={Shield} trend="Socket.IO" trendType="up" description="Real-time city pulse" />
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-5 sm:gap-8">
        <ChartCard title="Incident Analytics" subtitle="Crime vs Civic Grievances" className="lg:col-span-1">
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={80} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Crime & Civic Issue Hotspots" subtitle="Real-time emergency & grievance mapping" className="lg:col-span-2">
          <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2 scrollbar-hide">
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
      </div>

      {/* Support Inquiries Section */}
      <div className="grid lg:grid-cols-3 gap-5 sm:gap-8">
        <ChartCard title="Citizen Grievance Analysis" subtitle="Real-time civic complaint processing" className="lg:col-span-2">
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
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

        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                <MessageSquare size={80} />
              </div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Inquiry Stats</h4>
              <div className="text-4xl font-outfit font-black text-slate-900 dark:text-white mb-1">{supportRequests.length}</div>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6">New Messages</p>
              <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-indigo-600 hover:text-white transition-all">
                Manage All Messages
              </button>
           </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Settings size={24} className="text-indigo-600" /> Command Settings
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Emergency Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-rose-500/20 transition-all">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Emergency Protocol</h4>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Broadcast city-wide alert</p>
                </div>
                <button 
                  onClick={handleToggleEmergency}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    isEmergencyMode ? "bg-rose-500" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    isEmergencyMode ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* AI Sensitivity */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Sensitivity</h4>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
                    {aiSensitivity > 80 ? 'Aggressive' : aiSensitivity > 40 ? 'Balanced' : 'Conservative'} ({aiSensitivity}%)
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={aiSensitivity}
                  onChange={(e) => setAiSensitivity(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                  Higher sensitivity triggers proactive patrol deployment for even minor hazard signals.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                   {isSavingConfig ? (
                     <>
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       Synchronizing...
                     </>
                   ) : (
                     "Save System Configuration"
                   )}
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  disabled={isSavingConfig}
                  className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
                    {selectedReport.timestamp?.toDate 
                      ? (() => {
                          const date = selectedReport.timestamp.toDate();
                          return isNaN(date) ? new Date().toLocaleString() : date.toLocaleString();
                        })()
                      : 'Just Now'}
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
                    {selectedReport.location?.address || selectedReport.location || "Location not provided (Offline Submission)"}
                  </p>
                </div>

                {/* Evidence Photos Gallery */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div className="col-span-2 mt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Evidence Photos</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedReport.images.map((imgUrl, idx) => (
                        <a href={imgUrl} target="_blank" rel="noopener noreferrer" key={idx}>
                          <img 
                            src={imgUrl} 
                            alt={`evidence-${idx}`} 
                            className="h-24 w-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer" 
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
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

      {/* Department Performance */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Police Dept.', icon: Shield, efficiency: 98, color: 'text-indigo-500' },
          { name: 'Medical Svc.', icon: Activity, efficiency: 92, color: 'text-emerald-500' },
          { name: 'Fire Dept.', icon: MapPin, efficiency: 88, color: 'text-rose-500' },
          { name: 'Civic Svc.', icon: Briefcase, efficiency: 75, color: 'text-amber-500' },
        ].map((dept) => (
          <div key={dept.name} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800", dept.color)}>
                <dept.icon size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{dept.name}</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Efficiency</span>
                <span className="text-lg font-outfit font-bold text-slate-900 dark:text-white">{dept.efficiency}%</span>
              </div>
              <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.efficiency}%` }}
                  className={cn("h-full rounded-full", dept.color.replace('text', 'bg'))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Volunteer Verification Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white">Volunteer Verification Hub</h3>
            <p className="text-sm text-slate-500 font-medium">Review government IDs and expertise of applicants.</p>
          </div>
          <div className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
            {volunteers.length} Pending Requests
          </div>
        </div>

        {volunteers.length === 0 ? (
          <div className="p-10 sm:p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
              <BadgeCheck size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">All volunteers verified</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Proof</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black text-xs">
                          {vol.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{vol.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{vol.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {(vol.expertise || []).map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {vol.idProofUrl && vol.idProofUrl !== 'Not provided' ? (
                        <button 
                          onClick={() => setSelectedProof({ url: vol.idProofUrl, name: vol.name })}
                          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-[10px] font-black uppercase tracking-widest"
                        >
                          <ExternalLink size={14} /> View Document
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-bold uppercase italic">No Proof Uploaded</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleVolunteerAction(vol, 'approved')}
                          disabled={actionLoading === vol.id}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-emerald-100 dark:shadow-none disabled:opacity-50"
                        >
                          {actionLoading === vol.id ? '...' : 'APPROVE'}
                        </button>
                        <button 
                          onClick={() => handleVolunteerAction(vol, 'rejected')}
                          disabled={actionLoading === vol.id}
                          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-[10px] font-black rounded-xl transition-all disabled:opacity-50"
                        >
                          REJECT
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Premium Glassmorphic Image Preview Modal */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md"
            onClick={() => setSelectedProof(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">Document Verification Proof</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Submitted by {selectedProof.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedProof(null)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex items-center justify-center min-h-[300px] max-h-[60vh] bg-slate-50 dark:bg-slate-950/50 rounded-2xl overflow-y-auto p-4 border border-slate-100 dark:border-slate-800">
                {selectedProof.url.startsWith('data:') || selectedProof.url.startsWith('http') ? (
                  <img 
                    src={selectedProof.url} 
                    alt="ID Proof Document" 
                    className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm font-bold text-rose-500">{selectedProof.url}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">The upload was blocked by CORS or Network constraints. Verify manually via phone or email.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
