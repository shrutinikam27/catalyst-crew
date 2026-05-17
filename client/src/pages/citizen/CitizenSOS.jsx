import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ShieldAlert, Phone, MapPin, 
  Clock, CheckCircle, Navigation, AlertTriangle,
  User, MessageSquare, Heart, Shield
} from 'lucide-react';
import SmartMap from '../../components/map/SmartMap';
import { cn } from '../../utils/cn';
import { useAuth } from '../../firebase/AuthContext';
import { createEmergencyRequest, sendNotification } from '../../services/firestoreService';

const CitizenSOS = () => {
  const { currentUser } = useAuth();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState('idle'); // idle, counting, active, responding, resolved
  const [userLocation, setUserLocation] = useState(null);
  const [emergencyId, setEmergencyId] = useState(null);
  const [selectedType, setSelectedType] = useState('Medical');

  useEffect(() => {
    let timer;
    if (status === 'counting' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (status === 'counting' && countdown === 0) {
      setStatus('active');
      // Create emergency request in Firestore
      triggerSOS();
    }
    return () => clearInterval(timer);
  }, [status, countdown]);

  // Detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 18.5204, lng: 73.8567 })
      );
    }
  }, []);

  const triggerSOS = async () => {
    try {
      const loc = userLocation || { lat: 18.5204, lng: 73.8567 };
      const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anonymous';
      
      console.log(`🚨 Triggering SOS (${selectedType}) directly to backend server...`);

      // 1. Call the Node.js backend to trigger Emails / Push Notifications IMMEDIATELY
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await fetch(`${API_BASE}/api/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyType: selectedType,
          location: { latitude: loc.lat, longitude: loc.lng },
          userId: currentUser?.uid || 'anonymous',
          userName: userName
        })
      });
      console.log('📧 SUCCESS: SOS Notification triggered to backend.');

      // 2. Create emergency request in Firestore (non-blocking)
      try {
        const id = await createEmergencyRequest({
          type: selectedType,
          description: `SOS Emergency (${selectedType}) triggered by citizen`,
          location: { ...loc, address: `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` },
          userId: currentUser?.uid || 'anonymous',
          userName: userName,
          priority: 'critical'
        });
        setEmergencyId(id);
        console.log('🚨 Firestore Emergency created:', id);
      } catch (dbErr) {
        console.warn('Firestore write skipped (permissions or offline):', dbErr.message);
      }

    } catch (err) {
      console.error('SOS submission error:', err);
    }
  };

  const handleSosTrigger = () => {
    setStatus('counting');
    setCountdown(5);
  };

  const cancelSos = () => {
    setStatus('idle');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Emergency SOS</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Instant help from nearby volunteers and authorities.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-800">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">Live Monitoring Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          {/* Main SOS Trigger Area */}
          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-12 overflow-hidden flex flex-col items-center justify-center min-h-[450px] shadow-sm">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-8"
                >
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">1. Select Emergency Type</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
                      {[
                        { id: 'Medical', label: '🚑 Medical', activeBg: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' },
                        { id: 'Fire', label: '🚒 Fire', activeBg: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' },
                        { id: 'Crime', label: '🚨 Crime', activeBg: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' },
                        { id: 'Accident', label: '⚠️ Accident', activeBg: 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedType(t.id)}
                          className={cn(
                            "px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all border",
                            selectedType === t.id 
                              ? t.activeBg + " border-transparent scale-105" 
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-rose-500/10 rounded-full blur-3xl"
                    />
                    <button 
                      onClick={handleSosTrigger}
                      className="relative w-48 h-48 bg-rose-500 hover:bg-rose-600 rounded-full shadow-2xl shadow-rose-200 dark:shadow-none flex items-center justify-center group transition-all active:scale-95 mx-auto"
                    >
                      <Zap size={64} className="text-white group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter">
                      Press to Trigger {selectedType} SOS
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Click once to start the countdown. Authorities & volunteers will be notified.</p>
                  </div>
                </motion.div>
              )}

              {status === 'counting' && (
                <motion.div 
                  key="counting"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-8"
                >
                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle 
                        cx="96" cy="96" r="88" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="8"
                        className="text-slate-100 dark:text-slate-800"
                      />
                      <motion.circle 
                        cx="96" cy="96" r="88" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="8"
                        strokeDasharray="553"
                        initial={{ strokeDashoffset: 0 }}
                        animate={{ strokeDashoffset: 553 }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="text-rose-500"
                      />
                    </svg>
                    <span className="text-6xl font-outfit font-black text-rose-500">{countdown}</span>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter">Initiating Emergency Protocol...</h2>
                    <button 
                      onClick={cancelSos}
                      className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                    >
                      Cancel Trigger
                    </button>
                  </div>
                </motion.div>
              )}

              {status === 'active' && (
                <motion.div 
                  key="active"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-8"
                >
                  <div className="flex items-center gap-6 p-6 bg-rose-50 dark:bg-rose-900/20 rounded-3xl border border-rose-100 dark:border-rose-800">
                    <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce">
                      <ShieldAlert size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">SOS SIGNAL ACTIVE</h3>
                      <p className="text-sm text-rose-500 font-medium tracking-tight">Your location is being broadcasted to authorities and nearby responders.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Police Notified', time: 'Just Now', status: 'In Route', icon: Shield },
                      { label: 'EMS Dispatched', time: '1m ago', status: 'Assigned', icon: Heart },
                      { label: 'Volunteers Alerted', time: 'Just Now', status: '3 Nearby', icon: Zap },
                      { label: 'CCTV Active', time: 'Active', status: 'Live Feed', icon: MapPin },
                    ].map((step, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-600 shadow-sm">
                            <step.icon size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{step.label}</h4>
                              <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">{step.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-100 dark:shadow-none flex items-center justify-center gap-2">
                      <Phone size={18} /> Call Emergency
                    </button>
                    <button className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2">
                      <MessageSquare size={18} /> Message Help
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Quick Contacts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Police', number: '100', icon: Shield },
              { name: 'Ambulance', number: '108', icon: Heart },
              { name: 'Fire', number: '101', icon: ShieldAlert },
              { name: 'Women', number: '1091', icon: User },
            ].map((contact) => (
              <button key={contact.name} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors mb-3 mx-auto">
                  <contact.icon size={20} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.name}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{contact.number}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Tracking Map */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">Responder Tracking</h3>
              <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-extrabold uppercase rounded-lg">
                Live
              </div>
            </div>
            <div className="h-80 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <SmartMap 
                center={[18.5204, 73.8567]} 
                zoom={14}
                incidents={status === 'active' ? [{ id: 'sos', type: 'YOUR SOS', severity: 'high', coords: [18.5204, 73.8567] }] : []}
                volunteers={[{ id: 1, name: 'Responder 1', coords: [18.5250, 73.8500] }]}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 font-bold">
                  JS
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">John Smith</h4>
                  <p className="text-xs text-slate-500 font-medium tracking-tight">Police Officer • 400m away</p>
                </div>
                <button className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
                  <Phone size={16} />
                </button>
              </div>
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50 flex items-center gap-3">
                <Clock size={16} className="text-indigo-600" />
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Estimated Arrival: 2 mins</p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Shield size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold font-outfit">Emergency <br /> Guidelines</h3>
              <ul className="space-y-2">
                {['Stay calm and visible', 'Keep your phone active', 'Seek a safe cover nearby', 'Follow responder info'].map(tip => (
                  <li key={tip} className="text-xs text-slate-400 font-medium flex items-center gap-2">
                    <CheckCircle size={12} className="text-emerald-500" /> {tip}
                  </li>
                ))}
              </ul>
            </div>
            <Navigation size={120} className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenSOS;
