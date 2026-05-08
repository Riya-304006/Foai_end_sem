import { BarChart2, TrendingUp, PieChart, Activity, Zap } from 'lucide-react';
import { useISSLocation } from '../hooks/useISSLocation';
import { useISSSpeed } from '../hooks/useISSSpeed';
import { useNews } from '../hooks/useNews';
import ISSSpeedChart from '../charts/ISSSpeedChart';
import NewsPieChart from '../charts/NewsPieChart';

export default function Charts() {
  const { location, lastUpdated } = useISSLocation();
  const { currentSpeed, speedHistory } = useISSSpeed(location, lastUpdated);
  const { articles } = useNews();

  // Calculate statistics from real data
  const spaceCount = articles.filter(a => a.category === 'space').length;
  const techCount = articles.filter(a => a.category === 'tech').length;
  const totalArticles = articles.length;

  const validSpeeds = speedHistory.map(d => d.speed).filter(s => s > 0);
  const avgSpeed = validSpeeds.length > 0 ? Math.round(validSpeeds.reduce((a, b) => a + b) / validSpeeds.length) : 0;
  const maxSpeed = validSpeeds.length > 0 ? Math.max(...validSpeeds) : 0;
  const minSpeed = validSpeeds.length > 0 ? Math.min(...validSpeeds) : 0;

  return (
    <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ padding: 8, borderRadius: 12, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <BarChart2 size={22} style={{ color: '#fbbf24' }} />
          </div>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 700 }}>Analytics Dashboard</h1>
          <span className="badge badge-green animate-pulse-soft">Live Data</span>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Real-time ISS orbital velocity and news distribution analysis
        </p>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {[
          { label: 'Avg Speed', value: `${avgSpeed > 0 ? avgSpeed.toLocaleString() : '---'} km/h`, icon: <Activity size={16} />, color: '#60a5fa' },
          { label: 'Peak Speed', value: `${maxSpeed > 0 ? maxSpeed.toLocaleString() : '---'} km/h`, icon: <TrendingUp size={16} />, color: '#34d399' },
          { label: 'Data Points', value: `${speedHistory.length} readings`, icon: <Zap size={16} />, color: '#f59e0b' },
          { label: 'News Articles', value: `${totalArticles} total`, icon: <PieChart size={16} />, color: '#a78bfa' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ color }}>{icon}</div>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{label}</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
        {/* ISS Speed Chart */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Activity size={16} style={{ color: '#60a5fa' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>ISS Velocity Over Time</span>
            <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>Live Update</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Real-time orbital speed calculated via Haversine formula
          </p>
          <div style={{ height: 240, width: '100%' }}>
            <ISSSpeedChart data={speedHistory} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, padding: '8px 12px', borderRadius: 8, background: 'rgba(59,130,246,0.06)' }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Min: {minSpeed.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 600 }}>Current: {currentSpeed.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Max: {maxSpeed.toLocaleString()}</span>
          </div>
        </div>

        {/* News Pie Chart */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <PieChart size={16} style={{ color: '#a78bfa' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>News Category Distribution</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Distribution of currently loaded space and tech articles
          </p>
          <div style={{ height: 240, width: '100%', position: 'relative' }}>
            <NewsPieChart spaceCount={spaceCount} techCount={techCount} />
          </div>
          
          {/* Custom Legend details below chart */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16, padding: '12px', borderRadius: 8, background: 'var(--color-bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22d3ee' }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)' }}>Space</p>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{spaceCount} articles ({totalArticles > 0 ? Math.round((spaceCount/totalArticles)*100) : 0}%)</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a78bfa' }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)' }}>Technology</p>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{techCount} articles ({totalArticles > 0 ? Math.round((techCount/totalArticles)*100) : 0}%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
