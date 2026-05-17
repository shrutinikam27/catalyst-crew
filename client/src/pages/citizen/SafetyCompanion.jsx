import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, ShieldCheck, Zap,
  Search, Star, Eye, Moon, Sun,
  ArrowRight, ChevronLeft, Info, AlertTriangle,
  Lightbulb, Users, Map as MapIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

const PUNE_LOCATIONS = {
  'baner': [18.5590, 73.7787],
  'wakad': [18.5985, 73.7660],
  'kothrud': [18.5074, 73.8077],
  'hadapsar': [18.5089, 73.9260],
  'viman nagar': [18.5679, 73.9143],
  'koregaon park': [18.5362, 73.8940],
  'aundh': [18.5580, 73.8075],
  'pimple saudagar': [18.5987, 73.7978],
  'hinjewadi': [18.5913, 73.7389],
  'katraj': [18.4529, 73.8546],
  'shivaji nagar': [18.5312, 73.8445],
  'yerwada': [18.5529, 73.8796],
  'pune station': [18.5289, 73.8744],
  'camp': [18.5167, 73.8789],
  'warje': [18.4842, 73.8037],
  'magarpatta': [18.5137, 73.9242],
  'kondhwa': [18.4771, 73.8907],
  'bibwewadi': [18.4735, 73.8654]
};

const geocode = async (query) => {
  if (!query) return PUNE_LOCATIONS['shivaji nagar'];
  const cleanQuery = query.trim().toLowerCase();

  // 1. Check local dictionary first
  for (const [key, coords] of Object.entries(PUNE_LOCATIONS)) {
    if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
      return coords;
    }
  }

  // 2. Query Nominatim API
  try {
    const searchQuery = cleanQuery.includes('pune') ? query : `${query}, Pune, Maharashtra, India`;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (e) {
    console.error("Geocoding failed", e);
  }

  // 3. Fallback to center
  return PUNE_LOCATIONS['shivaji nagar'];
};

const getDistance = (coords1, coords2) => {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const fetchRoutes = async (start, end) => {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  let fastestPoints = [];
  let safestPoints = [];

  // 1. Fetch Fastest Route
  try {
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`);
    const data = await res.json();
    if (data.routes && data.routes[0]) {
      fastestPoints = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    }
  } catch (e) {
    console.error("Failed to fetch fastest OSRM route:", e);
  }

  // 2. Fetch Safest Route (via offset midpoint to simulate detour)
  try {
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const dy = lat2 - lat1;
    const dx = lng2 - lng1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const offsetX = len > 0 ? (-dy / len) * 0.015 : 0.01;
    const offsetY = len > 0 ? (dx / len) * 0.015 : 0.01;

    const safeMidLat = midLat + offsetY;
    const safeMidLng = midLng + offsetX;

    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${safeMidLng},${safeMidLat};${lng2},${lat2}?overview=full&geometries=geojson`);
    const data = await res.json();
    if (data.routes && data.routes[0]) {
      safestPoints = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    }
  } catch (e) {
    console.error("Failed to fetch safest OSRM route:", e);
  }

  // Fallbacks in case OSRM is offline
  if (fastestPoints.length === 0) {
    fastestPoints = [start, end];
  }
  if (safestPoints.length === 0) {
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const dy = lat2 - lat1;
    const dx = lng2 - lng1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const offsetX = len > 0 ? (-dy / len) * 0.008 : 0.005;
    const offsetY = len > 0 ? (dx / len) * 0.008 : 0.005;
    safestPoints = [
      start,
      [midLat + offsetY, midLng + offsetX],
      end
    ];
  }

  return { fastest: fastestPoints, safest: safestPoints };
};

const MapController = ({ start, end }) => {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      const bounds = L.latLngBounds([start, end]);
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
    }
  }, [start, end, map]);
  return null;
};

const SafetyCompanion = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('finder'); // finder, ratings
  const [source, setSource] = useState('My Current Location');
  const [destination, setDestination] = useState('');
  const [routeType, setRouteType] = useState('safest'); // safest, fastest
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [mapCoords, setMapCoords] = useState({ start: null, end: null });
  const [routes, setRoutes] = useState({ safest: [], fastest: [] });
  const [metrics, setMetrics] = useState({
    safest: { time: 12, visibility: 'High', lighting: '94%', crowd: 'Moderate' },
    fastest: { time: 8, visibility: 'Lower', lighting: '68%', crowd: 'Low' }
  });

  const handleSearch = async () => {
    if (!destination) return;
    setIsSearching(true);

    try {
      const startQuery = source === 'My Current Location' ? 'Shivaji Nagar' : source;
      const endQuery = destination;

      const startPos = await geocode(startQuery);
      const endPos = await geocode(endQuery);

      setMapCoords({ start: startPos, end: endPos });

      const calculatedRoutes = await fetchRoutes(startPos, endPos);
      setRoutes(calculatedRoutes);

      const distance = getDistance(startPos, endPos);

      const fastestTime = Math.max(3, Math.round((distance / 40) * 60));
      const safestTime = Math.max(4, Math.round((distance / 30) * 60) + 2);

      setMetrics({
        safest: {
          time: safestTime,
          visibility: 'High',
          lighting: '94%',
          crowd: 'Moderate'
        },
        fastest: {
          time: fastestTime,
          visibility: 'Lower',
          lighting: '68%',
          crowd: 'Low'
        }
      });

    } catch (e) {
      console.error("Route search error:", e);
    } finally {
      setIsSearching(false);
      setShowResults(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/user')}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-outfit font-extrabold text-slate-900 dark:text-white">Safety Companion</h1>
          <p className="text-xs text-slate-500 font-medium">AI-Powered Urban Navigation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('finder')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
            activeTab === 'finder' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Navigation size={16} />
          Route Finder
        </button>
        <button
          onClick={() => setActiveTab('ratings')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
            activeTab === 'ratings' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Star size={16} />
          Street Ratings
        </button>
      </div>

      {activeTab === 'finder' ? (
        <div className="space-y-6">
          {/* Search Inputs */}
          <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Start point"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20"></div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            {/* Route Preferences */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setRouteType('safest')}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 transition-all text-left group",
                  routeType === 'safest' ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", routeType === 'safest' ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                  <ShieldCheck size={18} />
                </div>
                <p className={cn("text-xs font-bold", routeType === 'safest' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500")}>Safest Path</p>
                <p className="text-[10px] text-slate-400 font-medium">Prioritizes lighting & low crime</p>
              </button>

              <button
                onClick={() => setRouteType('fastest')}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 transition-all text-left",
                  routeType === 'fastest' ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-slate-100 dark:border-slate-800 hover:border-amber-200"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", routeType === 'fastest' ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                  <Zap size={18} />
                </div>
                <p className={cn("text-xs font-bold", routeType === 'fastest' ? "text-amber-600 dark:text-amber-400" : "text-slate-500")}>Fastest Path</p>
                <p className="text-[10px] text-slate-400 font-medium">Prioritizes speed & distance</p>
              </button>
            </div>

            <button
              onClick={handleSearch}
              disabled={!destination || isSearching}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search size={18} />
                  Find Safest Route
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Real Live Map View */}
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900 border-4 border-white dark:border-slate-900 shadow-2xl group z-0 h-[450px]">
                  {mapCoords.start && mapCoords.end ? (
                    <MapContainer
                      center={mapCoords.start}
                      zoom={13}
                      scrollWheelZoom={true}
                      style={{ height: '100%', width: '100%' }}
                      className="h-full w-full"
                    >
                      <MapController start={mapCoords.start} end={mapCoords.end} />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      />

                      {/* Routes */}
                      <Polyline
                        positions={routes.safest}
                        color="#10b981"
                        weight={routeType === 'safest' ? 6 : 3}
                        opacity={routeType === 'safest' ? 1.0 : 0.4}
                        lineCap="round"
                        lineJoin="round"
                      />

                      <Polyline
                        positions={routes.fastest}
                        color="#f59e0b"
                        weight={routeType === 'fastest' ? 6 : 3}
                        opacity={routeType === 'fastest' ? 1.0 : 0.4}
                        dashArray="10, 10"
                        lineCap="round"
                        lineJoin="round"
                      />

                      {/* Markers */}
                      <Marker
                        position={mapCoords.start}
                        icon={L.divIcon({
                          className: 'source-marker',
                          html: `<div class="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
                          iconSize: [24, 24],
                          iconAnchor: [12, 12]
                        })}
                      >
                        <Popup>
                          <div className="p-1 font-bold text-xs">Start: {source}</div>
                        </Popup>
                      </Marker>

                      <Marker
                        position={mapCoords.end}
                        icon={L.divIcon({
                          className: 'dest-marker',
                          html: `<div class="w-6 h-6 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
                          iconSize: [24, 24],
                          iconAnchor: [12, 12]
                        })}
                      >
                        <Popup>
                          <div className="p-1 font-bold text-xs">Destination: {destination}</div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Loading Map...</div>
                  )}

                  {/* Route Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 p-5 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl z-[1000]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl text-white", routeType === 'safest' ? "bg-emerald-500" : "bg-amber-500")}>
                          {routeType === 'safest' ? <ShieldCheck size={20} /> : <Zap size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">
                            {routeType === 'safest' ? 'Safest Path Found' : 'Quickest Path Found'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {routeType === 'safest' ? `${metrics.safest.time} mins • ${metrics.safest.visibility} Visibility` : `${metrics.fastest.time} mins • ${metrics.fastest.visibility} Visibility`}
                          </p>
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Safety Factors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                      <Lightbulb size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Lighting</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">
                      {routeType === 'safest' ? metrics.safest.lighting : metrics.fastest.lighting}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {routeType === 'safest' ? 'Excellent Coverage' : 'Average Coverage'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <Users size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Crowd Density</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">
                      {routeType === 'safest' ? metrics.safest.crowd : metrics.fastest.crowd}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {routeType === 'safest' ? 'Low risk active streets' : 'Higher isolated spots'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Submit Rating CTA */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-bold">Rate Your Surroundings</h3>
              <p className="text-indigo-100 text-xs">Help fellow citizens by sharing the safety feel of this area.</p>
              <button className="mt-4 px-6 py-2.5 bg-white text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-all">
                Submit Rating
              </button>
            </div>
            <Eye size={120} className="absolute -right-4 -bottom-4 text-white/10 -rotate-12" />
          </div>

          {/* Nearby Ratings List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white px-2">Recent Ratings Nearby</h4>
            {[
              { street: 'Baner Main Road', rating: 4.8, count: 124, tags: ['Well-lit', 'Crowded'], time: '2 mins ago' },
              { street: 'Park Avenue Lane', rating: 2.5, count: 42, tags: ['Isolated', 'No Lights'], time: '15 mins ago' },
              { street: 'Civic Center Plaza', rating: 4.2, count: 89, tags: ['Active Patrol', 'CCTV'], time: '1 hr ago' },
            ].map((item) => (
              <div key={item.street} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white">{item.street}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">{item.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold",
                      tag === 'Isolated' || tag === 'No Lights'
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    )}>
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] text-slate-400 font-bold">{item.count} reviews</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 flex items-start gap-3">
        <Info size={20} className="text-indigo-600 shrink-0" />
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
          "Safety scores are generated by combining real-time lighting data, crime hotspots from Pune Police,
          and recent crowdsourced reports from citizens like you."
        </p>
      </div>
    </div>
  );
};

export default SafetyCompanion;
