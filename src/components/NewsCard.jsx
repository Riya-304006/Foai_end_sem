import { useState } from 'react';
import { ExternalLink, ChevronDown, Calendar, Tag, User } from 'lucide-react';

export default function NewsCard({ article, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const { title, description, author, source, date, category, url, urlToImage } = article;

  const formattedDate = date
    ? new Date(date).toLocaleString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '/')
    : 'Date Unknown';

  const sourceLocation = source?.toUpperCase() || 'WORLD';

  return (
    <div 
      className="card" 
      style={{ 
        padding: 0, 
        overflow: 'hidden', 
        marginBottom: 12,
        background: 'var(--color-bg-card)',
        borderColor: isOpen ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-border)',
        boxShadow: isOpen ? '0 4px 12px rgba(239, 68, 68, 0.05)' : 'none'
      }}
    >
      <div 
        className={`news-item-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Number Badge */}
        <div className="news-number">{index + 1}</div>

        {/* Thumbnail */}
        <div style={{ position: 'relative' }}>
          {urlToImage ? (
            <img src={urlToImage} alt="" className="news-thumbnail" />
          ) : (
            <div className="news-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(59,130,246,0.1))', fontSize: 20 }}>
              {category === 'space' ? '🚀' : '📰'}
            </div>
          )}
        </div>

        {/* Title and Metadata */}
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', letterSpacing: '0.02em' }}>{sourceLocation}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formattedDate}</span>
          </div>
          <h3 style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            color: 'var(--color-text-primary)',
            whiteSpace: isOpen ? 'normal' : 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.4
          }}>
            {title}
          </h3>
        </div>

        {/* Chevron Toggle */}
        <div className={`news-chevron ${isOpen ? 'open' : ''}`}>
          <ChevronDown size={14} strokeWidth={3} />
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`news-item-content ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
          <p style={{ 
            fontSize: 13, 
            lineHeight: 1.6, 
            color: 'var(--color-text-secondary)',
            marginBottom: 20
          }}>
            {description || "No further details available for this article."}
          </p>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={12} style={{ color: 'var(--color-text-muted)' }} />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{author || 'Anonymous'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag size={12} style={{ color: 'var(--color-text-muted)' }} />
                <span className="badge badge-blue" style={{ fontSize: 9 }}>{category}</span>
              </div>
            </div>

            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)' }}
              onClick={(e) => e.stopPropagation()}
            >
              Full Story <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
