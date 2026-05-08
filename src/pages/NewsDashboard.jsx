import { Newspaper, Search, RefreshCw, SlidersHorizontal, ArrowUpDown, Calendar, LayoutGrid } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { useNews } from '../hooks/useNews';

export default function NewsDashboard() {
  const { 
    filteredArticles, 
    loading, 
    error, 
    lastUpdated,
    search, 
    setSearch, 
    sortBy, 
    setSortBy, 
    refresh 
  } = useNews();

  const spaceArticles = filteredArticles.filter(n => n.category === 'space');
  const techArticles = filteredArticles.filter(n => n.category === 'tech');

  const formattedTime = lastUpdated 
    ? lastUpdated.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
    : '---';

  return (
    <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 10, borderRadius: 14, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <Newspaper size={24} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 800 }}>News Dashboard</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span className="badge badge-purple" style={{ fontSize: 9 }}>Auto-Sync Enabled</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  Refreshed: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{formattedTime}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={refresh} 
          disabled={loading}
          style={{ minWidth: 130 }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Fetching...' : 'Force Refresh'}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              id="news-search" 
              placeholder="Search by title, topic or source..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 42px', 
                borderRadius: 12, 
                border: '1px solid var(--color-border)', 
                background: 'var(--color-bg-secondary)', 
                color: 'var(--color-text-primary)', 
                fontSize: 14, 
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#60a5fa'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-bg-secondary)', padding: '4px 12px', borderRadius: 12, border: '1px solid var(--color-border)' }}>
              <ArrowUpDown size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Sort:</span>
              <select 
                id="news-sort" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '8px 4px', 
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-primary)', 
                  fontSize: 13, 
                  fontWeight: 600,
                  outline: 'none', 
                  cursor: 'pointer' 
                }}
              >
                <option value="date">Newest First</option>
                <option value="source">Source A–Z</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="badge badge-blue" style={{ padding: '8px 14px' }}>
                <LayoutGrid size={12} />
                All ({filteredArticles.length})
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card" style={{ padding: 16, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 12 }}>
          <SlidersHorizontal size={20} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Connectivity Issue</p>
            <p style={{ fontSize: 13 }}>{error}. Articles shown may be outdated.</p>
          </div>
          <button className="btn btn-secondary" onClick={refresh} style={{ padding: '6px 12px', fontSize: 12 }}>Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* Space News Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,211,238,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🚀</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.02em' }}>Deep Space Explorations</h2>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: 10 }}>{spaceArticles.length} FOUND</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {loading && filteredArticles.length === 0 ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 300, borderRadius: 16 }} />
              ))
            ) : spaceArticles.length > 0 ? (
              spaceArticles.map(a => <NewsCard key={a.id} article={a} />)
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', background: 'rgba(59,130,246,0.02)', border: '1px dashed var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No space-related articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Tech News Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💻</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.02em' }}>Future Tech & AI</h2>
            </div>
            <span className="badge badge-purple" style={{ fontSize: 10 }}>{techArticles.length} FOUND</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {loading && filteredArticles.length === 0 ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 300, borderRadius: 16 }} />
              ))
            ) : techArticles.length > 0 ? (
              techArticles.map(a => <NewsCard key={a.id} article={a} />)
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', background: 'rgba(139,92,246,0.02)', border: '1px dashed var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No tech-related articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer Meta */}
      {!loading && filteredArticles.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid var(--color-border)', marginTop: 20 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={12} />
            Data sourced from {filteredArticles[0].url.includes('newsdata') ? 'NewsData.io' : 'NewsAPI.org'} — Total {filteredArticles.length} results indexed.
          </p>
        </div>
      )}
    </div>
  );
}
