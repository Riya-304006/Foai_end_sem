import { fetchData } from '../utils/apiHelpers';

const ISS_NOW_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json';

// Simple rate limit protection
let lastFetchTime = 0;
const MIN_FETCH_INTERVAL = 2000; // 2 seconds minimum between any calls

export const issService = {
  /**
   * Fetch current ISS location.
   */
  async fetchISSLocation() {
    const now = Date.now();
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      console.warn('ISS API: Throttling request to stay under rate limit.');
      return null; // Skip this poll, wait for next one
    }
    
    lastFetchTime = now;
    
    try {
      const data = await fetchData(ISS_NOW_URL);
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
      if (err.message.includes('429')) {
        console.error('ISS API: Rate limited. Suggest increasing polling interval.');
      }
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
