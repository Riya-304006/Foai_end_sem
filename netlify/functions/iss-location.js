import fetch from 'node-fetch';

const ISS_NOW_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

export async function handler(event) {
  try {
    const response = await fetch(ISS_NOW_URL);
    
    if (!response.ok) {
      // If we are rate limited, return a 200 with a cached-style error or old data
      // but for now let's just pass through the error status
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `ISS API returned ${response.status}` })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // Cache this response at the edge for 10 seconds
        // This ensures the origin API is only hit once every 10s regardless of user count
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
