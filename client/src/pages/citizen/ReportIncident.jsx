import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, AlertTriangle, Send, 
  ChevronDown, Info, Shield, ShieldAlert,
  CheckCircle, CheckCircle2, Loader2, X, Image as ImageIcon
} from 'lucide-react';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../firebase/AuthContext';
import { useLocationContext } from '../../contexts/LocationContext';
import { cn } from '../../utils/cn';
import { submitComplaint, updateComplaintImageUrl } from '../../services/firestoreService';
import { uploadComplaintImage } from '../../services/storageService';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { value: 'crime', label: 'Crime / Theft' },
  { value: 'accident', label: 'Accident / Medical' },
  { value: 'fire', label: 'Fire Emergency' },
  { value: 'civic', label: 'Civic / Infrastructure' },
  { value: 'harassment', label: 'Harassment' },
];

// Leaflet Imports
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ReportIncident = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    category: 'crime',
    description: '',
    severity: 'moderate',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Map State
  const { location: userLocation } = useLocationContext();
  const [markerPos, setMarkerPos] = useState([18.5204, 73.8567]); // Default Pune
  const [address, setAddress] = useState("Shivaji Nagar, Pune");

  // Sync with user location once it's available
  useEffect(() => {
    if (userLocation) {
      setMarkerPos([userLocation.latitude, userLocation.longitude]);
      fetchAddress(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await response.json();
      setAddress(data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    } catch (err) {
      setAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarkerPos([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={markerPos} draggable={true} eventHandlers={{
      dragend: (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setMarkerPos([position.lat, position.lng]);
        fetchAddress(position.lat, position.lng);
      }
    }} />;
  };

  const RecenterMap = ({ pos }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(pos);
    }, [pos]);
    return null;
  };

  // Auto-detect user location
  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPos([lat, lng]);
          fetchAddress(lat, lng);
          setLocationLoading(false);
        },
        (err) => {
          setMarkerPos([18.5204, 73.8567]);
          fetchAddress(18.5204, 73.8567);
          setLocationLoading(false);
        }
      );
    } else {
      setMarkerPos([18.5204, 73.8567]);
      fetchAddress(18.5204, 73.8567);
      setLocationLoading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit complaint to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in title and description.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const complaintData = {
        title: form.title,
        category: form.category,
        description: form.description,
        severity: form.severity,
        priority: form.severity === 'high' ? 'high' : form.severity === 'moderate' ? 'medium' : 'low',
        imageUrl: null, 
        location: {
          lat: markerPos[0],
          lng: markerPos[1],
          address: address
        },
        userId: currentUser?.uid || 'anonymous',
        userName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anonymous User',
        userEmail: currentUser?.email || '',
        status: 'pending',
        createdAt: new Date(),
        department: form.category === 'crime' || form.category === 'harassment' ? 'police' :
                    form.category === 'fire' ? 'fire' :
                    form.category === 'accident' ? 'hospital' : 'admin',
      };

      // Save to Firestore
      const complaintId = await submitComplaint(complaintData);
      console.log("🚀 SUCCESS: Incident saved to database with ID:", complaintId);

      // Start background image upload
      if (imageFile && currentUser?.uid) {
        uploadComplaintImage(imageFile, currentUser.uid, complaintId)
          .then(async (url) => {
            console.log("📸 Image upload complete. Updating record...");
            await updateComplaintImageUrl(complaintId, url);
          })
          .catch(err => {
            console.warn("📸 Image upload failed in background.", err);
          });
      }

      setSubmitted(true);
      setTimeout(() => {
        navigate('/user/tracking');
      }, 2000);

    } catch (err) {
      console.error('Submit error:', err);
      setError('Database sync failed. Saving locally...');
      
      const incidentData = {
        id: `#INC-${Math.floor(1000 + Math.random() * 9000)}`,
        title: form.title,
        category: form.category,
        description: form.description,
        severity: form.severity,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        location: {
          address: address,
          coords: markerPos
        }
      };
      const localIncidents = JSON.parse(localStorage.getItem('local_incidents') || '[]');
      localIncidents.unshift(incidentData);
      localStorage.setItem('local_incidents', JSON.stringify(localIncidents));
      
      setSubmitted(true);
      setTimeout(() => {
        navigate('/user/tracking');
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle size={48} />
        </motion.div>
        <h2 className="text-2xl font-outfit font-extrabold text-slate-900 dark:text-white">Report Submitted!</h2>
        <p className="text-slate-500 font-medium">Your complaint has been logged and assigned to the appropriate department. You'll receive real-time updates on the tracking page.</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => navigate('/user/tracking')}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm"
          >
            Track Status
          </button>
          <button 
            onClick={() => { setSubmitted(false); setForm({ title: '', category: 'crime', description: '', severity: 'moderate' }); setImageFile(null); setImagePreview(null); }}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm"
          >
            File Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] max-w-[90vw] bg-rose-600 text-white"
          >
            <AlertTriangle size={24} className="shrink-0" />
            <p className="font-bold text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100 shrink-0">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldAlert size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Report an Incident</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">Your reports help authorities respond faster and keep the city safe.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        {/* Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <AlertTriangle size={16} /> {error}
            </motion.div>
          )}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Incident Title</label>
              <input 
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief title of the incident..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Incident Category</label>
                <div className="relative group">
                  <select 
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold appearance-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Severity Level</label>
                <div className="flex gap-2">
                  {['low', 'moderate', 'high'].map((lvl) => (
                    <button 
                      key={lvl}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, severity: lvl }))}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border-2 transition-all",
                        form.severity === lvl 
                          ? lvl === 'high' ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" :
                            lvl === 'moderate' ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200" :
                            "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                          : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the incident in detail..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Evidence / Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imagePreview ? (
                  <div className="aspect-square rounded-2xl overflow-hidden relative group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 group hover:border-indigo-500 transition-all cursor-pointer"
                  >
                    <Camera size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Upload</span>
                  </button>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect}
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full py-4 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all group active:scale-95",
              submitting 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none"
            )}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Submitting to SafeLink...
              </>
            ) : (
              <>
                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Submit Report
              </>
            )}
          </button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                <MapPin size={14} />
                Live Location
              </div>
              <div className="h-64 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative z-0">
                <MapContainer 
                  center={markerPos} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                  <RecenterMap pos={markerPos} />
                </MapContainer>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Selected Address</p>
                <p className="text-[11px] text-slate-300 font-medium leading-tight line-clamp-2">
                  {address}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                Drag the pin or click on the map to adjust the incident location.
              </p>
            </div>
            <Shield size={100} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <Info size={14} />
              Important
            </div>
            <ul className="space-y-3">
              {[
                'Provide clear descriptions',
                'Upload images if possible',
                'Reports are sent to authorities in real-time',
                'Track status on the Tracking page',
                'False reporting is illegal'
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-indigo-500">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportIncident;
