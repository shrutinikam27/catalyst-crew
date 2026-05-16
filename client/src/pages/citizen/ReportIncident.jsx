import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, AlertTriangle, Send, 
  ChevronDown, Info, Shield, ShieldAlert,
  CheckCircle2, X
} from 'lucide-react';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../firebase/AuthContext';
import { useLocationContext } from '../../contexts/LocationContext';
import { cn } from '../../utils/cn';

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
  const { location: userLocation } = useLocationContext();
  const [category, setCategory] = useState('Crime / Theft');
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  const fileInputRef = React.useRef(null);
  
  // Map State
  const [markerPos, setMarkerPos] = useState([18.5204, 73.8567]); // Default Pune
  const [address, setAddress] = useState("Shivaji Nagar, Pune");

  // Sync with user location once it's available
  React.useEffect(() => {
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
    React.useEffect(() => {
      map.setView(pos);
    }, [pos]);
    return null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files selected:", files);
    alert(`Detected ${files.length} images! Generating previews...`);
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImages = async () => {
    const imageUrls = [];
    for (const img of images) {
      try {
        const storageRef = ref(storage, `incidents/${Date.now()}_${img.file.name}`);
        const snapshot = await uploadBytes(storageRef, img.file);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      } catch (err) {
        console.warn("Storage upload failed, using base64 fallback:", err);
        // Fallback: Convert to base64 string (note: this can be heavy)
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(img.file);
        });
        imageUrls.push(base64);
      }
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return;

    setLoading(true);
    setStatus(null);

    try {
      const uploadedUrls = await uploadImages();
      const incidentId = `#INC-${Math.floor(1000 + Math.random() * 9000)}`;
      const incidentData = {
        id: incidentId,
        userId: currentUser?.uid || 'anonymous',
        userName: currentUser?.displayName || 'Anonymous Citizen',
        category,
        severity,
        description,
        images: uploadedUrls,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: new Date().toISOString(),
        location: {
          address: address,
          coords: markerPos
        }
      };

      try {
        // Attempt Firestore
        const docRef = await addDoc(collection(db, 'incidents'), {
          ...incidentData,
          timestamp: serverTimestamp() // Use Firestore server time if possible
        });
        console.log("Successfully stored in Firestore with ID:", docRef.id);
        alert("Success: Stored in Hackonate Cloud!");
      } catch (dbError) {
        console.error("CRITICAL: Firestore failed!", dbError);
        // Fallback to LocalStorage
        const localIncidents = JSON.parse(localStorage.getItem('local_incidents') || '[]');
        localIncidents.unshift(incidentData);
        localStorage.setItem('local_incidents', JSON.stringify(localIncidents));
        
        // Alert the user about the specific error to help debug
        if (dbError.code === 'permission-denied') {
          alert("Firestore Error: Permission Denied. Please check your Security Rules in the Hackonate console.");
        } else {
          alert("Firestore failed (" + dbError.message + "). Data saved locally on your computer instead.");
        }
      }
      
      setStatus('success');
      setDescription('');
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error("Error reporting incident:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Notifications */}
      <AnimatePresence>
        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]",
              status === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
            )}
          >
            {status === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            <div>
              <p className="font-bold text-sm">
                {status === 'success' ? "Report Submitted Successfully!" : "Submission Failed"}
              </p>
              <p className="text-[10px] opacity-80 font-medium">
                {status === 'success' ? "Authorities have been notified and will respond shortly." : "There was an error connecting to Firestore."}
              </p>
            </div>
            <button onClick={() => setStatus(null)} className="ml-auto opacity-70 hover:opacity-100">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-3xl font-outfit font-extrabold text-slate-900 dark:text-white">Report an Incident</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Your reports help authorities respond faster and keep the city safe.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Incident Category</label>
                <div className="relative group">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold appearance-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all cursor-pointer"
                  >
                    <option>Crime / Theft</option>
                    <option>Accident / Medical</option>
                    <option>Fire Emergency</option>
                    <option>Civic / Infrastructure</option>
                    <option>Harassment</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Severity Level</label>
                <div className="flex gap-2">
                  {['low', 'moderate', 'high'].map((lvl) => (
                    <button 
                      type="button"
                      key={lvl}
                      onClick={() => setSeverity(lvl)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border-2 transition-all",
                        severity === lvl 
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe the incident in detail..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Evidence / Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-slate-100 dark:border-slate-800">
                    <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 group hover:border-indigo-500 transition-all cursor-pointer"
                >
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <Camera size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Add Photos</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 transition-all group active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Submit Report
              </>
            )}
          </button>
        </form>

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
                'Report genuine incidents',
                'False reporting is illegal'
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-indigo-500">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
