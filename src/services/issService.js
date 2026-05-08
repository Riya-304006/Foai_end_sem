import { fetchData } from '../utils/apiHelpers';

const ISS_NOW_URL = 'https://api.open-notify.org/iss-now.json';
const ASTROS_URL = 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json';

// Simple rate limit protection
let lastFetchTime = 0;
const MIN_FETCH_INTERVAL = 2000; // 2 seconds minimum between any calls

export const issService = {
  /**
   * Fetch current ISS location.
   */
  async fetchISSLocation() {
    const isLocal = window.location.hostname === 'localhost';
    const endpoint = isLocal ? ISS_NOW_URL : '/.netlify/functions/iss-location';

    const now = Date.now();
    // Only throttle locally; production is handled by Edge Cache
    if (isLocal && (now - lastFetchTime < MIN_FETCH_INTERVAL)) {
      return null;
    }
    
    lastFetchTime = now;
    
    try {
      // 1. Try Proxy (with Edge Caching)
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          return parseISSData(data);
        }
      } catch (e) {
        console.warn('Proxy failed, trying direct fetch...', e.message);
      }

      // 2. Try Direct OpenNotify (Very lenient)
      try {
        const response = await fetch('https://api.open-notify.org/iss-now.json');
        if (response.ok) {
          const data = await response.json();
          return parseISSData(data);
        }
      } catch (e) {
        console.warn('Direct OpenNotify failed, trying direct fallback...', e.message);
      }

      // 3. Last Resort: Direct Wheretheiss
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      if (response.ok) {
        const data = await response.json();
        return parseISSData(data);
      }
      
      throw new Error(`All ISS API sources failed (Last status: ${response.status})`);

    } catch (err) {
      console.error('ISS Fetch Fatal Error:', err.message);
      throw err;
    }
  },
};

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

  /**
   * Fetch list of people currently in space.
   * @returns {Promise<Object>} - { count, people: [{ name, craft }, ...] }.
   */
  async fetchAstronauts() {
    const data = await fetchData(ASTROS_URL);
    if (data && data.people) {
      return {
        count: data.number,
        people: data.people.map(p => ({ name: p.name, craft: p.spacecraft || 'ISS' })),
      };
    }
    throw new Error('Unsuccessful response from Astronauts API');
  },
};
