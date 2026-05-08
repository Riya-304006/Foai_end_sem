import { NavLink, useLocation } from 'react-router-dom';
import { Satellite, Newspaper, Bot, BarChart2, X, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',        icon: Satellite,   label: 'ISS Tracker',    badge: 'Live' },
  { to: '/news',    icon: Newspaper,   label: 'News Dashboard', badge: null },
  { to: '/chatbot', icon: Bot,         label: 'AI Chatbot',     badge: 'AI' },
  { to: '/charts',  icon: BarChart2,   label: 'Analytics',      badge: null },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '240px',
          zIndex: 40,
          background: 'var(--color-bg-secondary)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          paddingTop: '64px', // height of navbar
        }}
        className="md:translate-x-0 md:static md:h-auto"
      >
        {/* Mobile close */}
        <button
          onClick={onClose}
          className="md:hidden"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            padding: 6,
          }}
        >
          <X size={20} />
        </button>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 12 }}>
            Navigation
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  <Icon size={18} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge && (
                    <span className="badge badge-blue">{badge}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: 'rgba(59,130,246,0.08)' }}>
            <Zap size={16} style={{ color: '#f59e0b' }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>Space Dashboard</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Phase 1 – Base UI</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
