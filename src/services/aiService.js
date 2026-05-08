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

// ... buildSystemPrompt and formatHistory stay the same ...

export const aiService = {
  /**
   * Send a chat request. 
   * Uses an internal Netlify function in production, and HfInference SDK in local dev.
   */
  async sendChat(messages, contextData) {
    try {
      const isLocal = window.location.hostname === 'localhost';
      
      if (isLocal) {
        const token = import.meta.env.VITE_AI_TOKEN?.trim();
        if (!token || token === 'your_huggingface_token') {
          throw new Error('AI Token is missing. Please add VITE_AI_TOKEN to your .env file.');
        }

        const hf = new HfInference(token);
        const prompt = formatHistory(messages, contextData);

        const result = await hf.textGeneration({
          model: MODEL_ID,
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.1,
            return_full_text: false,
          },
        });
        return result.generated_text.trim();
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
      console.error('AI Service Error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Connection error. If you have an ad-blocker, please disable it for this site.');
      }
      throw error;
    }
  }
};
