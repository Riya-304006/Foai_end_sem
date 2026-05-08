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
    <div style={{ flex: 1, minHeight: 250, width: '100%', background: '#fff', borderRadius: 8, padding: 10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#999"
            fontSize={9}
            tick={{ fill: '#999' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['dataMin - 100', 'dataMax + 100']}
            stroke="#999"
            fontSize={9}
            tick={{ fill: '#999' }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              background: '#fff', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '11px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ color: '#ef4444' }}
            formatter={(value) => [`${value} km/h`, 'ISS Speed']}
          />
          <Area 
            type="monotone" 
            dataKey="velocity" 
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorVel)" 
            animationDuration={800}
            dot={{ r: 2, fill: '#ef4444', strokeWidth: 0 }}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
