import { ExternalLink, User, Calendar, Tag } from 'lucide-react';

const CATEGORY_COLORS = {
  space: { bg: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
  tech:  { bg: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
};

const CATEGORY_EMOJI = { space: '🚀', tech: '💻' };

export default function NewsCard({ article }) {
  const { title, description, author, source, date, category } = article;
  const cc = CATEGORY_COLORS[category] || CATEGORY_COLORS.tech;
  const emoji = CATEGORY_EMOJI[category] || '📰';

  const formatted = date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <article
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Image area */}
      <div style={{
        height: 140,
        background: `linear-gradient(135deg, ${cc.bg.replace('0.1', '0.2')}, rgba(17,24,39,0.8))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.08), transparent 70%)',
        }} />
        <span style={{ position: 'relative', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{emoji}</span>

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
          background: cc.bg, color: cc.color, border: `1px solid ${cc.border}`,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{
          fontSize: 14, fontWeight: 700, lineHeight: 1.4,
          color: 'var(--color-text-primary)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          flex: 1,
        }}>
          {description}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <User size={11} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {author || 'Staff Reporter'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={11} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formatted}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Tag size={11} style={{ color: cc.color }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: cc.color }}>{source}</span>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: cc.color, fontWeight: 600, padding: '2px 6px',
              borderRadius: 6, transition: 'background 0.15s',
            }}>
              Read <ExternalLink size={10} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
