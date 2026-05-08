import { fetchData } from '../utils/apiHelpers';

const ISS_NOW_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json';

export const issService = {
  /**
   * Fetch current ISS location.
   * @returns {Promise<Object>} - Coordinates { latitude, longitude }.
   */
  async fetchISSLocation() {
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
    throw new Error('Unsuccessful response from ISS Location API');
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
