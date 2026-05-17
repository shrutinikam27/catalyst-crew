import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, MapPin, Clock, Navigation,
  Phone, ShieldAlert, Heart, User,
  CheckCircle, ArrowRight, Activity, Filter,
  Flame, Shield, AlertTriangle, Loader2, ExternalLink
} from 'lucide-react';
import SmartMap from '../../components/map/SmartMap';
import { useAuth } from '../../firebase/AuthContext';
import { db } from '../../firebase/config';
import {
  subscribeToSosAlertsForVolunteer,
  acceptSosAlert,
  resolveSosAlert,
  buildGoogleMapsUrl,
} from '../../firebase/sosService';
import { cn } from '../../utils/cn';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useLocationContext } from '../../contexts/LocationContext';

// Maps emergency type to a nice color + icon
const TYPE_META = {
  Fire:     { color: 'bg-orange-500', label: 'Fire Emergency',     Icon: Flame },
  Crime:    { color: 'bg-blue-600',   label: 'Crime Emergency',    Icon: Shield },
  Medical:  { color: 'bg-rose-500',   label: 'Medical Emergency',  Icon: Heart },
  Accident: { color: 'bg-purple-600', label: 'Accident Emergency', Icon: AlertTriangle },
};

// Derive distance (km) from two lat/lng pairs — Haversine approximation
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

// Format Firestore timestamp
function formatTime(ts) {
  if (!ts) return 'Just now';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const NearbyEmergencies = () => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volunteerExpertise, setVolunteerExpertise] = useState(null); // will be loaded from Firestore
  const { location: contextLocation } = useLocationContext();
  const myLocation = contextLocation ? { latitude: contextLocation.latitude, longitude: contextLocation.longitude } : null;
  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptedAlerts, setAcceptedAlerts] = useState({}); // alertId → volunteerLocation snapshot
  const [selectedAlert, setSelectedAlert] = useState(null);

  // ─── 2. Fetch volunteer's expertise from Firestore volunteerRequests ─────────
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const q = query(
          collection(db, 'volunteerRequests'),
          where('uid', '==', currentUser.uid),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          // expertise is an array like ['medical','firebrigade']
          // Use the first entry to subscribe; we'll use all entries below
          setVolunteerExpertise(data.expertise || []);
        } else {
          // Default: show all types if no record found
          setVolunteerExpertise(['firebrigade', 'medical', 'crime']);
        }
      } catch {
        setVolunteerExpertise(['firebrigade', 'medical', 'crime']);
      }
    })();
  }, [currentUser]);

  // ─── 3. Subscribe to Firestore SOS alerts matching volunteer expertise ───────
  useEffect(() => {
    if (!volunteerExpertise || volunteerExpertise.length === 0) return;
    setLoading(true);

    // Subscribe once per expertise tag and merge results
    const allAlerts = {};
    const unsubs = volunteerExpertise.map((tag) =>
      subscribeToSosAlertsForVolunteer(tag, (tagAlerts) => {
        tagAlerts.forEach((a) => { allAlerts[a.id] = a; });
        setAlerts(Object.values(allAlerts).sort((a, b) => {
          const ta = a.createdAt?.seconds ?? 0;
          const tb = b.createdAt?.seconds ?? 0;
          return tb - ta;
        }));
        setLoading(false);
      })
    );

    return () => unsubs.forEach((u) => u());
  }, [volunteerExpertise]);

  // ─── 4. Accept an SOS alert ───────────────────────────────────────────────
  const handleAccept = async (alert) => {
    if (!currentUser) return;
    setAcceptingId(alert.id);
    try {
      await acceptSosAlert(
        alert.id,
        currentUser.uid,
        currentUser.displayName || currentUser.email || 'Volunteer'
      );
      // Store the volunteer's current location so we can open Google Maps immediately
      setAcceptedAlerts((prev) => ({
        ...prev,
        [alert.id]: myLocation || { latitude: 18.5204, longitude: 73.8567 },
      }));
      setSelectedAlert(alert);
    } finally {
      setAcceptingId(null);
    }
  };

  // ─── 5. Open Google Maps ──────────────────────────────────────────────────
  const openGoogleMaps = (alert) => {
    // Prioritize myLocation (live stream) so navigation uses the latest coordinates.
    const from = myLocation || acceptedAlerts[alert.id] || { latitude: 18.5204, longitude: 73.8567 };
    const to   = { latitude: alert.location?.latitude, longitude: alert.location?.longitude };
    window.open(buildGoogleMapsUrl(from, to), '_blank');
  };

  // ─── 6. Resolve alert ────────────────────────────────────────────────────
  const handleResolve = async (alertId) => {
    await resolveSosAlert(alertId);
    setSelectedAlert(null);
    setAcceptedAlerts((prev) => { const n = {...prev}; delete n[alertId]; return n; });
  };

  // Selected alert for map display
  const mapAlert = selectedAlert || alerts[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">
            Nearby Emergencies
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Live SOS alerts matched to your expertise — respond instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Status</span>
            <span className="text-emerald-500 font-black flex items-center gap-1 uppercase tracking-tighter">
              <Activity size={12} className="animate-pulse" /> Active &amp; Online
            </span>
          </div>
          {myLocation && (
            <div className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} /> Location Active
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6 lg:gap-8">
        {/* ── Alert List ── */}
        <div className="space-y-4 max-h-[50vh] lg:max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 size={36} className="text-indigo-500 animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Listening for SOS alerts…</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={24} className="text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">No Active Alerts</h4>
              <p className="text-xs text-slate-500">
                Live SOS alerts matching your expertise will appear here in real-time.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {alerts.map((alert, idx) => {
                const meta = TYPE_META[alert.emergencyType] || TYPE_META.Medical;
                const Icon = meta.Icon;
                const isAccepted = !!acceptedAlerts[alert.id];
                const dist = myLocation && alert.location
                  ? `${distanceKm(myLocation.latitude, myLocation.longitude, alert.location.latitude, alert.location.longitude)} km`
                  : '—';

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={cn(
                      'bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm hover:shadow-xl transition-all group cursor-pointer',
                      selectedAlert?.id === alert.id
                        ? 'border-indigo-400 ring-2 ring-indigo-500/20 dark:border-indigo-500'
                        : 'border-slate-100 dark:border-slate-800'
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn('p-3 rounded-2xl shadow-lg text-white', meta.color)}>
                        <Icon size={20} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {formatTime(alert.createdAt)}
                        </span>
                        {isAccepted && (
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[9px] font-black rounded-full uppercase tracking-widest">
                            Accepted
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {meta.label}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        By: <span className="font-bold text-slate-700 dark:text-slate-300">{alert.userName}</span>
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                          <MapPin size={12} />
                          {alert.location
                            ? `${alert.location.latitude.toFixed(4)}, ${alert.location.longitude.toFixed(4)}`
                            : 'Location unavailable'}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                          <Navigation size={12} /> {dist}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      {isAccepted ? (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); openGoogleMaps(alert); }}
                            className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-1"
                          >
                            <ExternalLink size={12} /> Open in Maps
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleResolve(alert.id); }}
                            className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-bold uppercase rounded-xl hover:bg-emerald-100 transition-all"
                          >
                            Resolved
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAccept(alert); }}
                            disabled={acceptingId === alert.id}
                            className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-1 disabled:opacity-60"
                          >
                            {acceptingId === alert.id
                              ? <Loader2 size={12} className="animate-spin" />
                              : <CheckCircle size={12} />
                            }
                            Respond
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); }}
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded-xl hover:bg-slate-100 transition-all"
                          >
                            View
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* ── Map + Action Panel ── */}
        <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[350px] lg:min-h-[500px]">
          <SmartMap
            center={
              mapAlert?.location
                ? [mapAlert.location.latitude, mapAlert.location.longitude]
                : [18.5204, 73.8567]
            }
            zoom={14}
            incidents={
              mapAlert?.location
                ? [{
                    id: mapAlert.id,
                    type: mapAlert.emergencyType,
                    severity: 'high',
                    coords: [mapAlert.location.latitude, mapAlert.location.longitude],
                  }]
                : []
            }
            volunteers={
              myLocation
                ? [{ id: 'me', name: 'You', coords: [myLocation.latitude, myLocation.longitude] }]
                : []
            }
          />

          {/* Map Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
            {mapAlert ? (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 pointer-events-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-white',
                      (TYPE_META[mapAlert.emergencyType] || TYPE_META.Medical).color
                    )}>
                      {(() => { const M = TYPE_META[mapAlert.emergencyType] || TYPE_META.Medical; return <M.Icon size={20} />; })()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {(TYPE_META[mapAlert.emergencyType] || TYPE_META.Medical).label}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        By: {mapAlert.userName}
                      </p>
                    </div>
                  </div>
                  {myLocation && mapAlert.location && (
                    <div className="text-right">
                      <p className="text-lg font-outfit font-black text-rose-500">
                        {distanceKm(
                          myLocation.latitude, myLocation.longitude,
                          mapAlert.location.latitude, mapAlert.location.longitude
                        )} KM
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Incident</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {acceptedAlerts[mapAlert.id] ? (
                    <>
                      <button
                        onClick={() => openGoogleMaps(mapAlert)}
                        className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                      >
                        <ExternalLink size={14} /> Navigate in Google Maps
                      </button>
                      <button
                        onClick={() => handleResolve(mapAlert.id)}
                        className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-bold uppercase rounded-xl hover:bg-emerald-100 transition-all"
                      >
                        Resolved
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAccept(mapAlert)}
                        disabled={acceptingId === mapAlert.id}
                        className="flex-1 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-60"
                      >
                        {acceptingId === mapAlert.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <CheckCircle size={14} />
                        }
                        Accept &amp; Respond
                      </button>
                      <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl">
                        <Phone size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-slate-800 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monitoring for live SOS alerts…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyEmergencies;
