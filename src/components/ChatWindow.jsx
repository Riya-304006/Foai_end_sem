import { Bot, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

export default function ChatWindow() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        id="chatbot-float-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px rgba(6,182,212,0.5)',
          zIndex: 100,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Open AI Chatbot"
      >
        {open ? <X size={22} color="white" /> : <Bot size={22} color="white" />}
        {!open && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 16, height: 16, borderRadius: '50%',
            background: '#10b981',
            border: '2px solid var(--color-bg-primary)',
            fontSize: 9, color: 'white', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>1</span>
        )}
      </button>

      {/* Floating Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 96,
          right: 28,
          width: 340,
          height: 420,
          borderRadius: 20,
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInUp 0.2s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1))',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700 }}>Space AI Assistant</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                <span style={{ fontSize: 11, color: '#34d399' }}>Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={13} color="white" />
              </div>
              <div style={{ padding: '10px 12px', borderRadius: '14px 14px 14px 4px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', fontSize: 13, lineHeight: 1.5, maxWidth: '82%' }}>
                Hi! Ask me about the ISS or latest news. 🚀
              </div>
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8 }}>
            <input
              placeholder="Ask about space..."
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
                fontSize: 13, outline: 'none',
              }}
            />
            <button className="btn btn-primary" style={{ padding: '9px 12px', borderRadius: 10, minWidth: 0 }}>
              <MessageSquare size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
