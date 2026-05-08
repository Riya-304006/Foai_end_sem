import { Menu, Sun, Moon, Satellite, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 50,
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
      }}
      className="light-navbar"
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="btn btn-ghost md:hidden"
        style={{ padding: '8px', borderRadius: 10 }}
        id="menu-toggle"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(59,130,246,0.4)',
        }}>
          <Satellite size={20} style={{ color: 'white' }} />
        </div>
        <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 16, letterSpacing: '0.05em' }} className="gradient-text">
          SPACE<span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>OS</span>
        </span>
      </div>

      {/* Live status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
        <span className="pulse-dot" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>LIVE</span>
      </div>

      {/* Notification bell */}
      <button className="btn btn-ghost" style={{ padding: 8, borderRadius: 10, position: 'relative' }} id="notification-bell">
        <Bell size={18} />
        <span style={{
          position: 'absolute', top: 4, right: 4,
          width: 8, height: 8, borderRadius: '50%',
          background: '#ef4444', border: '2px solid var(--color-bg-primary)',
        }} />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn btn-ghost"
        style={{ padding: 8, borderRadius: 10 }}
        id="theme-toggle"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark'
          ? <Sun size={18} style={{ color: '#f59e0b' }} />
          : <Moon size={18} style={{ color: '#3b82f6' }} />
        }
      </button>
    </header>
  );
}
