import { Bot, MessageSquare, X, Send, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useISSContext } from '../context/ISSContext';
import { useISSSpeed } from '../hooks/useISSSpeed';
import { useAstronauts } from '../hooks/useAstronauts';
import { useNews } from '../hooks/useNews';

export default function ChatWindow() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Context Hooks
  const { location, lastUpdated } = useISSContext();
  const { currentSpeed } = useISSSpeed(location, lastUpdated);
  const { count: astronautsCount } = useAstronauts();
  const { articles } = useNews();

  // Chat Hook
  const { messages, loading, sendMessage, clearChat } = useChat();

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    // Gather live context
    const contextData = {
      location,
      speed: currentSpeed,
      astronautsCount,
      newsArticles: articles
    };

    sendMessage(input, contextData);
    setInput('');
  };

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
        title={open ? "Close Chatbot" : "Open AI Chatbot"}
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
          width: 360,
          height: 500,
          borderRadius: 20,
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
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
              <p style={{ fontSize: 14, fontWeight: 700 }}>Space AI Assistant</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>Mistral-7B Online</span>
              </div>
            </div>
            <button onClick={clearChat} title="Clear Chat" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 6, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#ef4444'} onMouseLeave={e => e.currentTarget.style.color='var(--color-text-muted)'}>
              <Trash2 size={16} />
            </button>
            <button onClick={() => setOpen(false)} title="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 6 }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((msg, i) => (
              <div key={msg.id || i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginRight: 8, marginTop: 4,
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Bot size={14} style={{ color: 'white' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
                    : 'var(--color-bg-secondary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} style={{ color: 'white' }} />
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#60a5fa',
                      animation: 'pulse 1.2s ease-in-out infinite',
                      animationDelay: `${d}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '12px 14px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8, background: 'var(--color-bg-primary)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about live dashboard data..."
              disabled={loading}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
                fontSize: 13, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#60a5fa'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!input.trim() || loading}
              style={{ padding: '10px', borderRadius: 12, minWidth: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
