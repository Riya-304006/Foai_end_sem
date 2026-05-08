import React from 'react';
import { Satellite, RefreshCw, MapPin, Zap, Globe2, Clock, History, Search, ArrowUpDown, Newspaper } from 'lucide-react';
import { useISSLocation } from '../hooks/useISSLocation';
import { useISSHistory } from '../hooks/useISSHistory';
import { useNews } from '../hooks/useNews';
import { useTheme } from '../context/ThemeContext';
import ISSMap from '../map/ISSMap';
import VelocityChart from '../components/VelocityChart';
import NewsCard from '../components/NewsCard';

export default function MissionControl() {
  const { location, loading: issLoading, refreshLocation } = useISSLocation();
  const history = useISSHistory(location);
  const { filteredArticles, loading: newsLoading, search, setSearch, sortBy, setSortBy, refresh: refreshNews } = useNews();
  const { theme, toggleTheme } = useTheme();

  const handleRefresh = () => {
    refreshLocation();
    refreshNews();
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px 40px' }} className="animate-fadeInUp">
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, marginTop: 10 }}>
        <div>
          <p style={{ color: '#3182ce', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', marginBottom: 6 }}>MISSION CONTROL DASHBOARD</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-primary)' }}>Real-Time ISS and News Intelligence</h1>
        </div>
        <button 
          onClick={toggleTheme}
          style={{ 
            padding: '10px 20px', 
            borderRadius: 999, 
            background: 'var(--color-bg-card)', 
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          Switch to {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      {/* 2. Main Tracking Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, marginBottom: 40 }}>
        {/* Left Column: ISS Tracking */}
        <div className="card" style={{ padding: '24px 0 0', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-card)' }}>
          {/* Section Header */}
          <div style={{ padding: '0 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>ISS Live Tracking</h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={refreshLocation} style={{ borderRadius: 8, padding: '6px 12px', fontSize: 12, background: 'var(--color-bg-secondary)' }}>
                Refresh Now
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', fontSize: 12, fontWeight: 600 }}>
                Auto-Refresh: <span style={{ color: '#10b981' }}>ON</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--color-border)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
            <StatBox label="Latitude / Longitude" value={location.latitude ? `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}` : '---'} />
            <StatBox label="Speed" value={location.velocity ? `${Math.round(location.velocity).toLocaleString()} km/h` : '---'} />
            <StatBox label="Nearest Place" value={location.nearestPlace || 'Open ocean / remote'} />
            <StatBox label="Tracked Positions" value={history.length} />
          </div>

          {/* Map Area */}
          <div style={{ height: 450, position: 'relative' }}>
             <ISSMap location={location} history={history} />
          </div>
        </div>

        {/* Right Column: Speed Trend */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>ISS Speed Trend</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>Real-time velocity tracking</p>
            
            <div style={{ flex: 1 }}>
              <VelocityChart history={history} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. News Section */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Breaking News</h2>
          <button className="btn btn-ghost" onClick={refreshNews} style={{ borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
            Refresh
          </button>
        </div>

        {/* Search & Filter Row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              placeholder="Search title, source, author..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 16px 12px 42px', borderRadius: 8, 
                border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', 
                color: 'var(--color-text-primary)', fontSize: 14, outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600, outline: 'none', cursor: 'pointer' }}
            >
              <option value="date">Date</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>

        {/* News Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {newsLoading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="card skeleton" style={{ height: 120 }} />)
          ) : (
            filteredArticles.slice(0, 8).map(article => (
              <NewsCard key={article.id} article={article} compact={true} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ padding: '16px 24px', background: 'var(--color-bg-card)' }}>
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</p>
    </div>
  );
}
