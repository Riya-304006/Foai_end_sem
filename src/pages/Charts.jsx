import { BarChart2, TrendingUp, PieChart, Activity, Zap } from 'lucide-react';

const DUMMY_SPEED_DATA = [27420, 27489, 27531, 27498, 27576, 27552, 27601, 27578, 27543, 27610, 27589, 27620, 27596, 27576, 27605];

const SPEED_MAX = Math.max(...DUMMY_SPEED_DATA);
const SPEED_MIN = Math.min(...DUMMY_SPEED_DATA);

const PIE_DATA = [
  { label: 'Space', value: 5, color: '#06b6d4', pct: 50 },
  { label: 'Tech',  value: 5, color: '#8b5cf6', pct: 50 },
];

function MiniSpeedChart() {
  const h = 120;
  const w = 100;
  const points = DUMMY_SPEED_DATA.map((v, i) => {
    const x = (i / (DUMMY_SPEED_DATA.length - 1)) * w;
    const y = h - ((v - SPEED_MIN) / (SPEED_MAX - SPEED_MIN + 1)) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 100 ${h}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="#3b82f6" strokeWidth="1.5" points={points} />
      <polygon fill="url(#speedGrad)" points={`0,${h} ${points} 100,${h}`} />
      {DUMMY_SPEED_DATA.map((v, i) => {
        const x = (i / (DUMMY_SPEED_DATA.length - 1)) * w;
        const y = h - ((v - SPEED_MIN) / (SPEED_MAX - SPEED_MIN + 1)) * (h - 10) - 5;
        return <circle key={i} cx={x} cy={y} r="1" fill="#60a5fa" />;
      })}
    </svg>
  );
}

function DonutChart() {
  const total = PIE_DATA.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 36;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" style={{ width: 140, height: 140 }}>
      {PIE_DATA.map((d, i) => {
        const pct = d.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotation = -90 + (offset / total) * 360;
        offset += d.value;
        return (
          <circle
            key={i}
            cx="50" cy="50" r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="butt"
            style={{ transformOrigin: '50px 50px', transform: `rotate(${rotation}deg)` }}
          />
        );
      })}
      <text x="50" y="46" textAnchor="middle" fill="var(--color-text-primary)" fontSize="11" fontWeight="700">10</text>
      <text x="50" y="58" textAnchor="middle" fill="var(--color-text-muted)" fontSize="7">articles</text>
    </svg>
  );
}

export default function Charts() {
  return (
    <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ padding: 8, borderRadius: 12, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <BarChart2 size={22} style={{ color: '#fbbf24' }} />
          </div>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 700 }}>Analytics</h1>
          <span className="badge badge-blue">Phase 1 Preview</span>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          ISS speed history &amp; news distribution — Recharts integration in Phase 2
        </p>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {[
          { label: 'Avg Speed', value: `${Math.round(DUMMY_SPEED_DATA.reduce((a, b) => a + b) / DUMMY_SPEED_DATA.length).toLocaleString()} km/h`, icon: <Activity size={16} />, color: '#60a5fa' },
          { label: 'Peak Speed', value: `${SPEED_MAX.toLocaleString()} km/h`, icon: <TrendingUp size={16} />, color: '#34d399' },
          { label: 'Data Points', value: `${DUMMY_SPEED_DATA.length} readings`, icon: <Zap size={16} />, color: '#f59e0b' },
          { label: 'News Articles', value: '10 total', icon: <PieChart size={16} />, color: '#a78bfa' },
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* ISS Speed Chart */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Activity size={16} style={{ color: '#60a5fa' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>ISS Speed Over Time</span>
            <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>Last 15</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Orbital velocity (km/h) • Recharts line chart in Phase 2
          </p>
          <div style={{ height: 180, position: 'relative' }}>
            <MiniSpeedChart />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>-15 min</span>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Now</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(59,130,246,0.06)' }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Min: {SPEED_MIN.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 600 }}>Current: {DUMMY_SPEED_DATA[DUMMY_SPEED_DATA.length-1].toLocaleString()}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Max: {SPEED_MAX.toLocaleString()}</span>
          </div>
        </div>

        {/* News Pie Chart */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <PieChart size={16} style={{ color: '#a78bfa' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>News Category Split</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Distribution by category • Recharts pie chart in Phase 2
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center' }}>
            <DonutChart />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PIE_DATA.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{d.value} articles • {d.pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2 Notice */}
      <div className="card" style={{ padding: 20, background: 'rgba(59,130,246,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ fontSize: 28 }}>📊</div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Full Recharts Integration — Phase 2</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Phase 2 will replace these preview charts with full interactive <strong>Recharts</strong> components:
              a real-time animated line chart for ISS speed, an interactive pie chart for news categories,
              and a Leaflet map overlay showing the ISS trajectory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
