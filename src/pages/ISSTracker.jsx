import { Satellite, RefreshCw, MapPin, Zap, Users, Globe2, Clock, Navigation } from 'lucide-react';
import ISSCard from '../components/ISSCard';
import { useISSContext } from '../context/ISSContext';
import { useAstronauts } from '../hooks/useAstronauts';
import ISSMap from '../map/ISSMap';
import VelocityChart from '../components/VelocityChart';
import { useNews } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';
import { Search } from 'lucide-react';

export default function ISSTracker() {
  const { location, history, loading: locationLoading, error: locationError, lastUpdated, refreshLocation } = useISSContext();
  const { count, people, loading: crewLoading, error: crewError, refresh: refreshCrew } = useAstronauts();
  const { filteredArticles, loading: newsLoading, search: newsSearch, setSearch: setNewsSearch, sortBy: newsSortBy, setSortBy: setNewsSortBy, refresh: refreshNews } = useNews();

  const handleRefresh = () => {
    refreshLocation();
    refreshCrew();
    refreshNews();
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

      {/* Map + Velocity Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
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

        {/* VELOCITY CHART COLUMN */}
        <div style={{ minHeight: 450 }}>
          <VelocityChart history={history} />
        </div>
      </div>

      {/* Breaking News Section [NEW] */}
      <div className="card" style={{ padding: 24, background: 'var(--color-bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Orbitron', monospace" }}>Breaking News</h2>
          <button className="btn btn-ghost" onClick={refreshNews} disabled={newsLoading} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20 }}>
            <RefreshCw size={12} className={newsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Search & Sort Row */}
        <div className="news-search-container">
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              className="news-search-input" 
              style={{ paddingLeft: 44 }}
              placeholder="Search title, source, author..." 
              value={newsSearch}
              onChange={(e) => setNewsSearch(e.target.value)}
            />
          </div>
          <select 
            className="news-sort-select"
            value={newsSortBy}
            onChange={(e) => setNewsSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="source">Sort by Source</option>
          </select>
        </div>

        {/* News List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {newsLoading && filteredArticles.length === 0 ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="card skeleton" style={{ height: 60, marginBottom: 12, borderRadius: 12 }} />
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <NewsCard key={article.id || index} article={article} index={index} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              No matching articles found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
