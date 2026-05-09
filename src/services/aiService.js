const API_URL = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';

/**
 * Builds the system prompt restricting the AI to use only dashboard data.
 * @param {Object} contextData - Live dashboard data
 * @returns {string} The system prompt block
 */
function buildSystemPrompt(contextData) {
  const { location, speed, astronautsCount, newsArticles } = contextData;

  const locationStr = location?.latitude ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Unknown';
  const speedStr = speed ? `${speed} km/h` : 'Unknown';
  
  // Get top 3 news headlines for context to save tokens
  const headlines = (newsArticles || [])
    .slice(0, 3)
    .map(a => `- ${a.title} (Source: ${a.source})`)
    .join('\\n');

  return `[INST] You are the Space Dashboard AI Assistant. Your ONLY purpose is to answer questions using EXACTLY the live telemetry data provided below. 

CRITICAL RULES:
1. DO NOT use any outside knowledge or general knowledge.
2. If the user asks something not in the telemetry data below, you MUST reply: "I can only answer based on live Space Dashboard data."
3. Keep answers concise, factual, and space-themed.

LIVE TELEMETRY DATA:
- ISS Location: ${locationStr}
- ISS Speed: ${speedStr}
- Astronauts in Space: ${astronautsCount || 'Unknown'}
- Latest Space News Headlines:
${headlines || 'No news available right now.'}

Remember the rules! Answer the following user query based ONLY on the data above. [/INST]`;
}

/**
 * Formats chat history for the Mistral model.
 * Mistral uses [INST] query [/INST] for user, and plain text for assistant.
 */
function formatHistory(messages, contextData) {
  const systemPrompt = buildSystemPrompt(contextData);
  
  let formatted = systemPrompt + '\\n\\n';
  
  // We only send the last 4 messages to save tokens and keep context focused
  const recentMessages = messages.slice(-4);
  
  recentMessages.forEach(msg => {
    if (msg.role === 'user') {
      formatted += `[INST] ${msg.content} [/INST]\\n`;
    } else {
      formatted += `${msg.content}\\n`;
    }
  });

  return formatted;
}

import { HfInference } from '@huggingface/inference';

const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

export const aiService = {
  /**
   * Send a chat request. 
   */
  async sendChat(messages, contextData, retryCount = 0) {
    const token = import.meta.env.VITE_AI_TOKEN?.trim();
    if (!token) {
      throw new Error('VITE_AI_TOKEN is missing.');
    }

    const { location, speed, astronautsCount, newsArticles } = contextData || {};
    const locationStr = location?.latitude ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Unknown';
    const speedStr = speed ? `${speed} km/h` : 'Unknown';
    const headlines = (newsArticles || []).slice(0, 3).map(a => `- ${a.title}`).join('\n');

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const query = lastUserMessage ? lastUserMessage.content : 'Hello';

    const prompt = `[INST] You are the Space Dashboard AI. Live Data: ISS ${locationStr}, Speed ${speedStr}, Crew ${astronautsCount || 0}, News: ${headlines}. Question: ${query} [/INST]`;

    try {
      const isLocal = window.location.hostname === 'localhost';
      
      if (isLocal) {
        const response = await fetch(`/api-hf/models/${MODEL_ID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.1,
            },
            options: {
              wait_for_model: true
            }
          }),
        });

        if (!response.ok) {
          if (response.status === 503 && retryCount < 2) {
            await new Promise(r => setTimeout(r, 10000));
            return this.sendChat(messages, contextData, retryCount + 1);
          }
          throw new Error(`HTTP Error ${response.status}`);
        }

        const result = await response.json();
        const text = Array.isArray(result) ? result[0].generated_text : (result.generated_text || "");
        return text.trim() || "I'm sorry, I couldn't generate a response.";
      }

      // Production: Hit our own Netlify Function proxy
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, contextData }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.generated_text.trim();

    } catch (error) {
      console.error('Mistral Chat Error:', error);
      
      if (error.message === 'Failed to fetch') {
        if (retryCount < 2) {
          await new Promise(r => setTimeout(r, 3000));
          return this.sendChat(messages, contextData, retryCount + 1);
        }
        throw new Error('Connection blocked. Please check your internet or disable ad-blockers.');
      }
      
      throw error;
    }
  }
};
