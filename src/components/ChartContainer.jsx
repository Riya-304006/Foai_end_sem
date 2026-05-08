import { BarChart2 } from 'lucide-react';

export default function ChartContainer({ title, description, children }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <BarChart2 size={16} style={{ color: '#fbbf24' }} />
        <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
      </div>
      {description && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>{description}</p>
      )}
      <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Chart renders here (Phase 2)</p>
          </div>
        )}
      </div>
    </div>
  );
}
