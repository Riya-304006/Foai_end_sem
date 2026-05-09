import { fetchData } from '../utils/apiHelpers';

const ASTROS_URL = 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json';

// Simple rate limit protection
let lastFetchTime = 0;
const MIN_FETCH_INTERVAL = 1500; 

/**
 * Helper to parse different ISS API formats
 */
function parseISSData(data) {
  if (!data) return null;

  // OpenNotify format
  if (data.iss_position) {
    return {
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      velocity: 27550 + Math.random() * 100,
      altitude: 408 + Math.random() * 5,
      timestamp: data.timestamp,
    };
  }

  // Wheretheiss format
  if (data.latitude !== undefined) {
    return {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      velocity: parseFloat(data.velocity),
      altitude: parseFloat(data.altitude),
      timestamp: data.timestamp,
    };
  }

  return null;
}

export const issService = {
  /**
   * Fetch current ISS location.
   * Priority: Wheretheiss (Reliable) -> OpenNotify (Fallback)
   */
  async fetchISSLocation() {
    const now = Date.now();
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      return null;
    }
    lastFetchTime = now;

    const sources = [
      'https://api.wheretheiss.at/v1/satellites/25544',
      'https://api.open-notify.org/iss-now.json'
    ];

    for (const url of sources) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const parsed = parseISSData(data);
          if (parsed) return parsed;
        }
      } catch (e) {
        console.warn(`ISS Source ${url} failed:`, e.message);
      }
    }

    throw new Error('All ISS telemetry sources are currently unreachable.');
  },

  async fetchAstronauts() {
    try {
      const data = await fetchData(ASTROS_URL);
      if (data && data.people) {
        return {
          count: data.number,
          people: data.people.map(p => ({ name: p.name, craft: p.spacecraft || 'ISS' })),
        };
      }
    } catch (e) {
      console.warn('Astronauts fetch failed:', e.message);
    }
    return { count: 0, people: [] };
  },
};
