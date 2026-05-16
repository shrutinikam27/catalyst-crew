import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '../../utils/cn';

// Fix for default marker icons in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom pulsing icon for emergencies
const createPulsingIcon = (color) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color:${color};" class="pulse"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Component to handle dynamic map view changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

const SmartMap = ({ 
  center = [18.5204, 73.8567], // Pune Coordinates
  zoom = 12, 
  incidents = [], 
  volunteers = [],
  officers = [],
  stations = [],
  hotspots = [],
  showHeatmap = false
}) => {
  const allIncidents = incidents;

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Hotspots / Heatmap Zones */}
        {hotspots.map((spot, idx) => (
          <Circle
            key={idx}
            center={spot.coords}
            radius={spot.radius || 500}
            pathOptions={{ 
              fillColor: spot.color || '#f43f5e', 
              color: spot.color || '#f43f5e',
              weight: 1,
              fillOpacity: 0.4 
            }}
          />
        ))}

        {/* Police Stations */}
        {stations.map((station) => (
          <Marker 
            key={station.id} 
            position={station.coords}
            icon={L.divIcon({
              className: 'station-marker',
              html: `<div class="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}
          >
            <Popup>
              <div className="p-1">
                <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Police Precinct</p>
                <h4 className="text-xs font-bold text-slate-900">{station.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1 italic">Authorized SafeLink Node</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Active Police Units (Officers) */}
        {officers.map((off) => (
          <Marker 
            key={off.id} 
            position={off.coords}
            icon={L.divIcon({
              className: 'officer-marker',
              html: `<div class="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl border-2 border-indigo-500 overflow-hidden">
                      <div class="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10"><rect x="1" y="10" width="22" height="8" rx="2"/><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                    </div>`,
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            })}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[9px] font-black text-emerald-500 uppercase mb-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping inline-block"></span> Live GPS Unit
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{off.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1">Status: <span className="text-indigo-600 font-bold">{off.status}</span></p>
                <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500" style={{ width: `${off.battery}%` }}></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incident Markers */}
        {allIncidents.map((incident) => (
          <Marker 
            key={incident.id} 
            position={incident.coords}
            icon={incident.severity === 'high' ? createPulsingIcon(incident.type === 'CRIME' ? '#f43f5e' : '#f59e0b') : DefaultIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("w-2 h-2 rounded-full", incident.type === 'CRIME' ? 'bg-rose-500' : 'bg-amber-500')} />
                  <h3 className="font-bold text-slate-900">{incident.title || incident.type}</h3>
                  {incident.isVerified && (
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded-sm border border-emerald-200">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{incident.location || 'Reported Location'}</p>
                {incident.source && (
                   <div className="mt-1">
                     <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                       Source: {incident.source}
                     </p>
                     {incident.sourceUrl && (
                       <a 
                         href={incident.sourceUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-[8px] text-blue-400 hover:underline block"
                       >
                         View Official Data ↗
                       </a>
                     )}
                   </div>
                )}
                {incident.message && <p className="text-[10px] text-slate-400 mt-1 italic">"{incident.message}"</p>}
                <div className="mt-2 flex gap-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    incident.severity === 'high' ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"
                  )}>
                    {incident.severity}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">
                    {new Date(incident.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Volunteer Markers */}
        {volunteers.map((vol) => (
          <Marker 
            key={vol.id} 
            position={vol.coords}
            icon={L.divIcon({
              className: 'volunteer-marker',
              html: `<div class="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-glow"></div>`,
              iconSize: [12, 12]
            })}
          >
            <Popup>
              <div className="text-xs font-bold">Volunteer: {vol.name}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .leaflet-container {
          background: #0f172a !important;
        }
        .pulse {
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 0 rgba(244, 63, 94, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(244, 63, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
        .shadow-glow {
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-marker-icon {
          transition: transform 2s linear;
        }
      `}</style>
    </div>
  );
};

export default SmartMap;
