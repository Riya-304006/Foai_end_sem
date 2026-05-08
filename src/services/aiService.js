const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

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

export const aiService = {
  /**
   * Send a chat request to Hugging Face
   * @param {Array} messages - Chat history [{ role: 'user'|'assistant', content: '...' }]
   * @param {Object} contextData - Current live dashboard data
   * @returns {Promise<string>} AI response text
   */
  async sendChat(messages, contextData) {
    const rawToken = import.meta.env.VITE_AI_TOKEN;
    const token = rawToken ? rawToken.trim() : null;

    if (!token || token === 'your_huggingface_token' || token === '') {
      throw new Error('AI Token is missing. Please add VITE_AI_TOKEN to your .env file (local) or Netlify Environment Variables (deployed).');
    }

    const prompt = formatHistory(messages, contextData);

    try {
      const response = await fetch(API_URL, {
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
            return_full_text: false,
          },
          options: {
            wait_for_model: true,
            use_cache: false,
          }
        }),
      });

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Fallback if response is not JSON
        }
        
        if (response.status === 503) {
          throw new Error('The AI model is currently loading. Please wait a few seconds and try again.');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data[0] && data[0].generated_text) {
        return data[0].generated_text.trim();
      }

      throw new Error('Invalid response format from AI API.');
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error: The request to Hugging Face was blocked or failed. Please check your internet connection or disable any ad-blockers.');
      }
      throw error;
    }
  }
};
