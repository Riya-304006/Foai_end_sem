import { useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/aiService';

const CHAT_STORAGE_KEY = 'space_dashboard_chat_history';
const MAX_MESSAGES = 30;

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Initial greeting
        setMessages([
          { 
            id: 'init', 
            role: 'assistant', 
            content: 'Hello! I am your Space Dashboard AI. Ask me about the ISS location, speed, current crew, or the latest news headlines. I answer strictly from live dashboard telemetry! 🚀' 
          }
        ]);
      }
    } catch (e) {
      console.error('Failed to parse chat history', e);
    }
  }, []);

  // Save history to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = useCallback(async (content, contextData) => {
    if (!content.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: content.trim() };
    
    setMessages(prev => {
      const updated = [...prev, userMessage];
      // Keep only last N messages
      return updated.length > MAX_MESSAGES ? updated.slice(updated.length - MAX_MESSAGES) : updated;
    });
    
    setLoading(true);
    setError(null);

    try {
      // Send the active conversation (excluding the very first welcome message if it's the only one)
      const currentHistory = [...messages, userMessage].filter(m => m.id !== 'init');
      
      const responseText = await aiService.sendChat(currentHistory, contextData);
      
      const aiMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText };
      
      setMessages(prev => {
        const updated = [...prev, aiMessage];
        return updated.length > MAX_MESSAGES ? updated.slice(updated.length - MAX_MESSAGES) : updated;
      });
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to get AI response');
      
      // Optionally add an error message to chat
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), role: 'assistant', content: `Error: ${err.message}. Please try again later or check your API token.` }
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const clearChat = useCallback(() => {
    const initMessage = [
      { 
        id: 'init', 
        role: 'assistant', 
        content: 'Chat cleared. How can I help you with the Space Dashboard? 🚀' 
      }
    ];
    setMessages(initMessage);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initMessage));
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat
  };
}
