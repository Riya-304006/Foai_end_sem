import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts';

export default function ISSSpeedChart({ data }) {
  // If no data, show a placeholder
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Waiting for speed data...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="time" 
          stroke="var(--color-border)" 
          tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} 
          tickMargin={10}
          minTickGap={30}
        />
        <YAxis 
          domain={['dataMin - 1000', 'dataMax + 1000']} 
          stroke="var(--color-border)" 
          tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
          tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f8fafc' }}
          itemStyle={{ color: '#60a5fa', fontWeight: 600 }}
          formatter={(value) => [`${value} km/h`, 'Velocity']}
          labelStyle={{ color: '#94a3b8', marginBottom: 4, fontSize: 12 }}
        />
        <Area 
          type="monotone" 
          dataKey="speed" 
          stroke="#3b82f6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorSpeed)" 
          isAnimationActive={true}
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
