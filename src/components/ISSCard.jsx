export default function ISSCard({ icon, label, value, sub, color }) {
  const colorMap = {
    blue:   { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  val: '#60a5fa' },
    purple: { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.2)',  val: '#a78bfa' },
    green:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  val: '#34d399' },
    cyan:   { bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.2)',   val: '#22d3ee' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className="card"
      style={{
        padding: '20px',
        background: c.bg,
        borderColor: c.border,
        transition: 'all 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: c.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize: 22, fontWeight: 800, color: c.val, fontFamily: "'Orbitron', monospace", letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{sub}</p>
    </div>
  );
}
