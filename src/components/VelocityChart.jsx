import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Zap } from 'lucide-react';

/**
 * Component to display ISS velocity over time.
 * @param {Array} history - Array of historical telemetry data.
 */
export default function VelocityChart({ history }) {
  // Format data for Recharts
  const chartData = (history || []).map((point, index) => ({
    name: index,
    velocity: Math.round(point.velocity || 27600),
    time: point.timestamp ? new Date(point.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''
  }));

  return (
    <div className="card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ padding: 8, borderRadius: 10, background: 'rgba(52,211,153,0.15)' }}>
          <Zap size={18} style={{ color: '#34d399' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Velocity Trends</h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Orbital speed over time (km/h)</p>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 200, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              hide={true}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']}
              stroke="var(--color-text-muted)"
              fontSize={10}
              tickFormatter={(value) => `${value}`}
              width={45}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#34d399' }}
              labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}
              formatter={(value) => [`${value} km/h`, 'Velocity']}
            />
            <Area 
              type="monotone" 
              dataKey="velocity" 
              stroke="#34d399" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVel)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Live updates every 15s</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399' }}>STABLE ORBIT</span>
      </div>
    </div>
  );
}
