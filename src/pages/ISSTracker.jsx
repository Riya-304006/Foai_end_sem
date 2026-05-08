import { Satellite, RefreshCw, MapPin, Zap, Users, Globe2, Clock, Navigation, History } from 'lucide-react';
import ISSCard from '../components/ISSCard';
import { useISSLocation } from '../hooks/useISSLocation';
import { useISSHistory } from '../hooks/useISSHistory';
import { useAstronauts } from '../hooks/useAstronauts';
import ISSMap from '../map/ISSMap';
import VelocityChart from '../components/VelocityChart';

export default function ISSTracker() {
  const { location, loading: locationLoading, error: locationError, lastUpdated, refreshLocation } = useISSLocation();
  const history = useISSHistory(location);
  const { count, people, loading: crewLoading, error: crewError, refresh: refreshCrew } = useAstronauts();

  const handleRefresh = () => {
    refreshLocation();
    refreshCrew();
  };

  const formattedTime = lastUpdated 
    ? lastUpdated.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '---';

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
            <span className="badge badge-green animate-pulse-soft">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              Live
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Real-time International Space Station tracking — Updated at: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{formattedTime}</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleRefresh} id="iss-refresh-btn" disabled={locationLoading}>
          <RefreshCw size={15} className={locationLoading ? 'animate-spin' : ''} />
          {locationLoading ? 'Updating...' : 'Refresh Now'}
        </button>
      </div>

      {locationError && (
        <div className="card" style={{ padding: 14, background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={18} />
          <span>Error loading ISS data: {locationError}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <ISSCard icon={<MapPin size={18} style={{ color: '#60a5fa' }} />} label="Latitude"  value={location.latitude !== null ? `${location.latitude.toFixed(4)}°` : '---'}   sub="North/South" color="blue" />
        <ISSCard icon={<Navigation size={18} style={{ color: '#a78bfa' }} />} label="Longitude" value={location.longitude !== null ? `${location.longitude.toFixed(4)}°` : '---'}  sub="East/West"  color="purple" />
        <ISSCard icon={<Zap size={18} style={{ color: '#34d399' }} />}    label="Velocity"  value={location.velocity !== null ? `${Math.round(location.velocity).toLocaleString()} km/h` : '---'} sub="Orbital Speed" color="green" />
        <ISSCard icon={<Globe2 size={18} style={{ color: '#22d3ee' }} />}  label="Altitude"  value={location.altitude !== null ? `${Math.round(location.altitude).toLocaleString()} km` : '---'}  sub="Above Sea Level"  color="cyan" />
      </div>

      {/* Map + Velocity Chart + Location Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 340px', gap: 20 }}>
        {/* MAP COLUMN */}
        <div className="card" style={{ minHeight: 450, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-bg-primary)', zIndex: 10 }}>
            <Globe2 size={16} style={{ color: '#60a5fa' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Live Leaflet Map</span>
            <div className="badge badge-green animate-pulse-soft" style={{ marginLeft: 'auto', fontSize: 10 }}>Interactive Mode</div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <ISSMap location={location} history={history} lastUpdated={lastUpdated} />
          </div>
        </div>

        {/* VELOCITY CHART COLUMN [NEW] */}
        <div style={{ minHeight: 450 }}>
          <VelocityChart history={history} />
        </div>

        {/* Right column: Stats & Path */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Detailed Position */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <History size={16} style={{ color: '#60a5fa' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Real-Time Telemetry</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Latitude</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: '#60a5fa' }}>{location.latitude?.toFixed(6) || '---'}°</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{location.latitude > 0 ? 'NORTH' : 'SOUTH'}</span>
                </div>
              </div>
              
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.1)' }}>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Longitude</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: '#a78bfa' }}>{location.longitude?.toFixed(6) || '---'}°</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{location.longitude > 0 ? 'EAST' : 'WEST'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
                <Clock size={12} />
                <span>Next refresh in: <span style={{ color: 'var(--color-text-primary)' }}>15s</span></span>
              </div>
            </div>
          </div>

          {/* Historical Breadcrumbs */}
          <div className="card" style={{ padding: 20, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Clock size={16} style={{ color: '#f59e0b' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Tracking Path</span>
              <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>{history.length} Points</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
              {history.length > 0 ? (
                [...history].reverse().map((pos, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: i === 0 ? 'rgba(59,130,246,0.1)' : 'var(--color-bg-secondary)',
                    border: i === 0 ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? '#3b82f6' : 'var(--color-text-muted)', boxShadow: i === 0 ? '0 0 8px #3b82f6' : 'none' }} />
                    <span style={{ fontSize: 12, color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontFamily: 'monospace', fontWeight: i === 0 ? 700 : 400 }}>
                      {pos.latitude.toFixed(3)}°, {pos.longitude.toFixed(3)}°
                    </span>
                    {i === 0 && <span style={{ marginLeft: 'auto', fontSize: 9, color: '#3b82f6', fontWeight: 800 }}>LATEST</span>}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Waiting for telemetry...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Crew in Space */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(167,139,250,0.15)' }}>
              <Users size={20} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Personnel in Orbit</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Current active crew members across all crafts</p>
            </div>
          </div>
          <div className="badge badge-purple" style={{ padding: '6px 16px', fontSize: 14 }}>{crewLoading ? '...' : count} Total</div>
        </div>

        {crewError ? (
          <div style={{ padding: 20, borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px dashed rgba(239,68,68,0.2)', textAlign: 'center', color: '#ef4444' }}>
            <p>Failed to retrieve crew roster. Please check connection.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {crewLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 70, borderRadius: 14 }} />
              ))
            ) : (
              people.map((astronaut, i) => (
                <div key={i} className="card" style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(59,130,246,0.2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                    border: '1px solid rgba(167,139,250,0.2)',
                  }}>
                    👨‍🚀
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {astronaut.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Satellite size={10} style={{ color: 'var(--color-text-muted)' }} />
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>{astronaut.craft}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
