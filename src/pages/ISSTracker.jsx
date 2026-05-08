import { Satellite, RefreshCw, MapPin, Zap, Users, Globe2, Clock, Navigation } from 'lucide-react';
import ISSCard from '../components/ISSCard';

const DUMMY_ISS = {
  latitude: 28.6139,
  longitude: 77.2090,
  speed: 27576,
  altitude: 408,
  location: 'Over India (New Delhi region)',
  timestamp: new Date().toLocaleTimeString(),
};

const DUMMY_ASTRONAUTS = [
  { name: 'Sunita Williams',    craft: 'ISS', flag: '🇺🇸' },
  { name: 'Butch Wilmore',      craft: 'ISS', flag: '🇺🇸' },
  { name: 'Aleksandr Gorbunov', craft: 'ISS', flag: '🇷🇺' },
  { name: 'Oleg Kononenko',     craft: 'ISS', flag: '🇷🇺' },
  { name: 'Nikolai Chub',       craft: 'ISS', flag: '🇷🇺' },
  { name: 'Tracy Dyson',        craft: 'ISS', flag: '🇺🇸' },
  { name: 'Don Pettit',         craft: 'ISS', flag: '🇺🇸' },
];

const DUMMY_POSITIONS = [
  { lat: 22.0, lng: 65.0 },
  { lat: 24.0, lng: 68.5 },
  { lat: 26.2, lng: 72.0 },
  { lat: 28.6, lng: 77.2 },
];

export default function ISSTracker() {
  return (
    <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ padding: 8, borderRadius: 12, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <Satellite size={22} style={{ color: '#60a5fa' }} />
            </div>
            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 700 }}>ISS Live Tracker</h1>
            <span className="badge badge-green">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              Live
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Real-time International Space Station tracking — updates every 15 seconds
          </p>
        </div>
        <button className="btn btn-primary" id="iss-refresh-btn">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <ISSCard icon={<MapPin size={18} style={{ color: '#60a5fa' }} />} label="Latitude"  value={`${DUMMY_ISS.latitude}°`}   sub="North" color="blue" />
        <ISSCard icon={<Navigation size={18} style={{ color: '#a78bfa' }} />} label="Longitude" value={`${DUMMY_ISS.longitude}°`}  sub="East"  color="purple" />
        <ISSCard icon={<Zap size={18} style={{ color: '#34d399' }} />}    label="Speed"     value={`${DUMMY_ISS.speed.toLocaleString()} km/h`} sub="Orbital velocity" color="green" />
        <ISSCard icon={<Globe2 size={18} style={{ color: '#22d3ee' }} />}  label="Altitude"  value={`${DUMMY_ISS.altitude} km`}  sub="Above Earth"  color="cyan" />
      </div>

      {/* Map placeholder + Location */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Map */}
        <div className="card" style={{ minHeight: 360, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe2 size={16} style={{ color: '#60a5fa' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Live Map</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-text-muted)' }}>Leaflet.js — Phase 2</span>
          </div>
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            minHeight: 300,
          }}>
            {/* Animated ISS orbit preview */}
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: '1px dashed rgba(59,130,246,0.3)',
              }} />
              <div style={{
                position: 'absolute', inset: 20,
                borderRadius: '50%',
                border: '1px dashed rgba(139,92,246,0.2)',
              }} />
              {/* Earth */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 60, height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1d4ed8, #059669)',
                boxShadow: '0 0 20px rgba(59,130,246,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>🌍</div>
              {/* ISS dot */}
              <div className="animate-float" style={{
                position: 'absolute',
                top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 28, height: 28,
                borderRadius: '50%',
                background: 'rgba(59,130,246,0.2)',
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>🛰️</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Interactive Leaflet map with live ISS position<br/>trail will be enabled in Phase 2
            </p>
          </div>
        </div>

        {/* Right column: Location + Path */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Current Location */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <MapPin size={16} style={{ color: '#60a5fa' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Nearest Location</span>
            </div>
            <div style={{
              padding: 14,
              borderRadius: 10,
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.15)',
              marginBottom: 12,
            }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                {DUMMY_ISS.location}
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Reverse geocoded via Nominatim</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: 'var(--color-bg-secondary)', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>LAT</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#60a5fa' }}>{DUMMY_ISS.latitude}°</p>
              </div>
              <div style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: 'var(--color-bg-secondary)', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>LON</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#a78bfa' }}>{DUMMY_ISS.longitude}°</p>
              </div>
            </div>
          </div>

          {/* Recent path */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Clock size={16} style={{ color: '#f59e0b' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Recent Path</span>
              <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>Last 4</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DUMMY_POSITIONS.map((pos, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: i === DUMMY_POSITIONS.length - 1 ? 'rgba(59,130,246,0.1)' : 'var(--color-bg-secondary)',
                  border: i === DUMMY_POSITIONS.length - 1 ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === DUMMY_POSITIONS.length - 1 ? '#3b82f6' : 'var(--color-text-muted)' }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                    {pos.lat.toFixed(1)}°, {pos.lng.toFixed(1)}°
                  </span>
                  {i === DUMMY_POSITIONS.length - 1 && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#60a5fa', fontWeight: 600 }}>NOW</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Astronauts */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Users size={18} style={{ color: '#a78bfa' }} />
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Crew in Space</h2>
          <span className="badge badge-purple">{DUMMY_ASTRONAUTS.length} People</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {DUMMY_ASTRONAUTS.map((astronaut, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.2s',
            }}
              className="card"
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
                border: '2px solid rgba(139,92,246,0.3)',
              }}>
                {astronaut.flag}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{astronaut.name}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{astronaut.craft}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
