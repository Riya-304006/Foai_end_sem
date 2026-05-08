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
    const prompt = buildSystemPrompt(contextData, messages);

    const result = await hf.textGeneration({
      model: MODEL_ID,
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.1,
        return_full_text: false,
      },
    });

    return {
      statusCode: 200, headers,
      body: JSON.stringify(result),
    };

  } catch (err) {
    console.error('AI Function Error:', err);
    return { 
      statusCode: 500, headers,
      body: JSON.stringify({ error: err.message || 'Internal AI Error' }) 
    };
  }
}

function buildSystemPrompt(contextData, messages) {
  const { location, speed, astronautsCount, newsArticles } = contextData || {};
  const locationStr = location?.latitude ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Unknown';
  const speedStr = speed ? `${speed} km/h` : 'Unknown';
  const headlines = (newsArticles || []).slice(0, 3).map(a => `- ${a.title}`).join('\n');

  const system = `[INST] You are the Space Dashboard AI. Use ONLY this data:
- ISS: ${locationStr}, Speed: ${speedStr}
- Astronauts: ${astronautsCount || 0}
- News: ${headlines || 'No news'}
If asked anything else, say you only know dashboard data. [/INST]`;

  let formatted = system + '\n\n';
  (messages || []).slice(-4).forEach(msg => {
    if (msg.role === 'user') formatted += `[INST] ${msg.content} [/INST]\n`;
    else formatted += `${msg.content}\n`;
  });
  return formatted;
}
