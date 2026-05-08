import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#22d3ee', '#a78bfa']; // Cyan (Space), Purple (Tech)

export default function NewsPieChart({ spaceCount, techCount }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const data = [
    { name: 'Space News', value: spaceCount, color: COLORS[0] },
    { name: 'Tech News', value: techCount, color: COLORS[1] },
  ].filter(d => d.value > 0); // Don't show empty slices

  if (data.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No data available</p>
      </div>
    );
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={45}
          outerRadius={70}
          paddingAngle={4}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          stroke="none"
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              opacity={activeIndex === index ? 1 : activeIndex === -1 ? 0.9 : 0.6}
              style={{ transition: 'opacity 0.2s ease, transform 0.2s ease', outline: 'none' }}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f8fafc' }}
          itemStyle={{ fontWeight: 600 }}
          formatter={(value) => [`${value} Articles`, 'Count']}
        />
        <Legend 
          verticalAlign="bottom" 
          height={30}
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 10 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
