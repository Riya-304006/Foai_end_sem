const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, contextData } = JSON.parse(event.body);
    const token = process.env.VITE_AI_TOKEN;

    if (!token) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'VITE_AI_TOKEN is missing on server.' }) 
      };
    }

    // Reuse the logic from the service to build the prompt
    // For simplicity, we'll just format it here or pass it pre-formatted
    // But since we want to keep aiService clean, let's just do the fetch here.
    
    // We'll use the prompt provided in the body or build it
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

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: errData.error || 'HF API Error' }) 
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: err.message }) 
    };
  }
}

// Helper to build prompt inside the function (copied from aiService)
function buildSystemPrompt(contextData, messages) {
  const { location, speed, astronautsCount, newsArticles } = contextData;
  const locationStr = location?.latitude ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Unknown';
  const speedStr = speed ? `${speed} km/h` : 'Unknown';
  const headlines = (newsArticles || []).slice(0, 3).map(a => `- ${a.title}`).join('\n');

  const system = `[INST] You are the Space Dashboard AI. Use ONLY this data:
- ISS: ${locationStr}, Speed: ${speedStr}
- Astronauts: ${astronautsCount}
- News: ${headlines}
If asked anything else, say you only know dashboard data. [/INST]`;

  let formatted = system + '\n\n';
  messages.slice(-4).forEach(msg => {
    if (msg.role === 'user') formatted += `[INST] ${msg.content} [/INST]\n`;
    else formatted += `${msg.content}\n`;
  });
  return formatted;
}
