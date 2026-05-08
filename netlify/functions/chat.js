import { HfInference } from '@huggingface/inference';

const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  try {
    const { messages, contextData } = JSON.parse(event.body);
    const token = process.env.VITE_AI_TOKEN;

    if (!token) {
      return { 
        statusCode: 500, headers,
        body: JSON.stringify({ error: 'VITE_AI_TOKEN missing on server.' }) 
      };
    }

    const hf = new HfInference(token);
    
    // Prepare data for the system message
    const { location, speed, astronautsCount, newsArticles } = contextData || {};
    const locationStr = location?.latitude ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Unknown';
    const speedStr = speed ? `${speed} km/h` : 'Unknown';
    const headlines = (newsArticles || []).slice(0, 3).map(a => `- ${a.title}`).join('\n');

    const systemMessage = {
      role: 'system',
      content: `You are the Space Dashboard AI. Your ONLY knowledge is the following live telemetry:
- ISS: ${locationStr}, Speed: ${speedStr}
- Astronauts: ${astronautsCount || 0}
- Recent News: ${headlines || 'No news available'}

RULES:
1. Answer ONLY using the data above.
2. If the data is missing or question is unrelated, say: "I can only answer based on live Space Dashboard data."
3. Keep it brief.`
    };

    // Construct full message history for the conversational task
    const chatMessages = [
      systemMessage,
      ...messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
    ];

    const result = await hf.chatCompletion({
      model: MODEL_ID,
      messages: chatMessages,
      max_tokens: 150,
      temperature: 0.1,
    });

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ generated_text: result.choices[0].message.content }),
    };

  } catch (err) {
    console.error('AI Function Error:', err);
    return { 
      statusCode: 500, headers,
      body: JSON.stringify({ error: err.message || 'Internal AI Error' }) 
    };
  }
}
