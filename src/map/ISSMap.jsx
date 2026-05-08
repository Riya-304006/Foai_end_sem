import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create a custom pulse icon for the ISS
const pulseIcon = L.divIcon({
  className: 'custom-iss-icon',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; inset: 0; background: #3b82f6; border-radius: 50%; opacity: 0.5; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: absolute; inset: 6px; background: #2563eb; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Component to handle map centering when coordinates change
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.setView([lat, lng], map.getZoom(), { animate: true, duration: 1 });
    }
  }, [lat, lng, map]);
  return null;
}

export default function ISSMap({ location, history, lastUpdated }) {
  const [isReady, setIsReady] = useState(false);
  
  // Wait a tick to render map to avoid layout issues in some flex containers
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady || location.latitude === null || location.longitude === null) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Initializing Map Engine...</p>
      </div>
    );
  }

  // Extract coordinates for the polyline path
  const polylinePositions = history.map(pos => [pos.latitude, pos.longitude]);

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
      {/* Global style injection for the ping animation if not already defined */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
      
      <MapContainer 
        center={[location.latitude, location.longitude]} 
        zoom={3} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <RecenterMap lat={location.latitude} lng={location.longitude} />
        
        {/* Trajectory Polyline */}
        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            pathOptions={{ color: '#3b82f6', weight: 2, dashArray: '4, 8', opacity: 0.6 }} 
          />
        )}
        
        {/* Live ISS Marker */}
        <Marker position={[location.latitude, location.longitude]} icon={pulseIcon}>
          <Popup className="dark-popup">
            <div style={{ padding: '4px 8px', minWidth: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>🛰️</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>ISS Telemetry</span>
              </div>
              <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4, color: '#555' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Latitude:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{location.latitude.toFixed(4)}°</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Longitude:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{location.longitude.toFixed(4)}°</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: 4, marginTop: 2 }}>
                  <span>Logged:</span>
                  <span style={{ fontWeight: 600 }}>{lastUpdated ? lastUpdated.toLocaleTimeString() : '---'}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
