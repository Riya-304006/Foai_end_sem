import { fetchData } from '../utils/apiHelpers';

const ISS_NOW_URL = 'http://api.open-notify.org/iss-now.json';
const ASTROS_URL = 'http://api.open-notify.org/astros.json';

export const issService = {
  /**
   * Fetch current ISS location.
   * @returns {Promise<Object>} - Coordinates { latitude, longitude }.
   */
  async fetchISSLocation() {
    const data = await fetchData(ISS_NOW_URL);
    if (data.message === 'success') {
      return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
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
    if (data.message === 'success') {
      return {
        count: data.number,
        people: data.people,
      };
    }
    throw new Error('Unsuccessful response from Astronauts API');
  },
};
