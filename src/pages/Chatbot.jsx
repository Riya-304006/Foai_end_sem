import { Bot, Send, Trash2, Sparkles, MessageSquare } from 'lucide-react';

const DUMMY_MESSAGES = [
  { role: 'assistant', text: 'Hello! I\'m your Space Dashboard AI. Ask me about the ISS location, speed, current crew, or the latest news headlines. I answer only from live dashboard data! 🚀' },
  { role: 'user', text: 'Where is the ISS right now?' },
  { role: 'assistant', text: 'Based on dashboard data: The ISS is currently over India near New Delhi at latitude 28.61°N, longitude 77.21°E, orbiting at an altitude of 408 km with a speed of 27,576 km/h.' },
];

export default function Chatbot() {
  return (
    <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ padding: 8, borderRadius: 12, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
              <Bot size={22} style={{ color: '#22d3ee' }} />
            </div>
            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 700 }}>AI Chatbot</h1>
            <span className="badge badge-cyan">Mistral-7B</span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Powered by Hugging Face — answers only from dashboard data
          </p>
        </div>
        <button className="btn btn-ghost" id="clear-chat-btn">
          <Trash2 size={15} />
          Clear Chat
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Chat Window */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '65vh' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {DUMMY_MESSAGES.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginRight: 10, marginTop: 2,
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Bot size={16} style={{ color: 'white' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '72%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
                    : 'var(--color-bg-secondary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} style={{ color: 'white' }} />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#60a5fa',
                    animation: 'pulse 1.2s ease-in-out infinite',
                    animationDelay: `${d}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: 16, borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                id="chat-input"
                placeholder="Ask about ISS location, speed, crew, or news..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button className="btn btn-primary" id="chat-send-btn" style={{ padding: '12px 16px', borderRadius: 12 }}>
                <Send size={16} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, textAlign: 'center' }}>
              AI context includes live ISS data + latest news headlines
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Model Info */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sparkles size={16} style={{ color: '#f59e0b' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Model Info</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Model', value: 'Mistral-7B-Instruct' },
                { label: 'Provider', value: 'Hugging Face' },
                { label: 'Context', value: 'Dashboard Data Only' },
                { label: 'History', value: 'Last 30 chats' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'var(--color-bg-secondary)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <MessageSquare size={16} style={{ color: '#a78bfa' }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Try Asking</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Where is the ISS right now?',
                'How fast is the ISS moving?',
                'Who is in space currently?',
                'What is the latest space news?',
                'Summarize today\'s top headlines',
              ].map((q, i) => (
                <button
                  key={i}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
