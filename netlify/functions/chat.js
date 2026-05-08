const API_URL = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';

export async function handler(event) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { messages, contextData } = JSON.parse(event.body);
    const token = process.env.VITE_AI_TOKEN;

    if (!token) {
      console.error('SERVER ERROR: VITE_AI_TOKEN is missing in Netlify environment variables.');
      return { 
        statusCode: 500, 
        headers,
        body: JSON.stringify({ error: 'AI Token is missing on the server. Please add VITE_AI_TOKEN to your Netlify environment variables.' }) 
      };
    }

    const prompt = buildSystemPrompt(contextData, messages);

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
        }
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(`HF API ERROR [${response.status}]:`, data);
      return { 
        statusCode: response.status, 
        headers,
        body: JSON.stringify({ 
          error: (data && data.error) ? data.error : `Hugging Face API returned status ${response.status}` 
        }) 
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };

  } catch (err) {
    console.error('FUNCTION ERROR:', err);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: `Server Error: ${err.message}` }) 
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
