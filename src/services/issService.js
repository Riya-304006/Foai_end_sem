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
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `ISS API failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Handle OpenNotify format
      if (data && data.iss_position) {
        return {
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          velocity: 27550 + Math.random() * 100, // Simulated
          altitude: 408 + Math.random() * 5,    // Simulated
          timestamp: data.timestamp,
        };
      }

      // Handle Wheretheiss format (fallback)
      if (data && data.latitude !== undefined) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          velocity: parseFloat(data.velocity),
          altitude: parseFloat(data.altitude),
          timestamp: data.timestamp,
        };
      }
      throw new Error('Invalid data format from ISS API');
    } catch (err) {
      console.error('ISS Fetch Error:', err.message);
      throw err;
    }
  },

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
