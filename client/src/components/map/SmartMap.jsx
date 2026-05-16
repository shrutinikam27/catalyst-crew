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

const SmartMap = ({ 
  center = [18.5204, 73.8567], // Pune Coordinates
  zoom = 12, 
  incidents = [], 
  volunteers = [],
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
      >
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
      `}</style>
    </div>
  );
};

export default SmartMap;
