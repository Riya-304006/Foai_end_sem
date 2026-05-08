/**
 * A localStorage wrapper to manage data caching with an expiration time (TTL).
 */

export const storage = {
  /**
   * Set an item in localStorage with an expiration time.
   * @param {string} key - The key under which the data is stored.
   * @param {any} value - The data to store.
   * @param {number} ttl - Time to live in milliseconds.
   */
  setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  /**
   * Get an item from localStorage, checking for expiration.
   * @param {string} key - The key to retrieve.
   * @returns {any|null} - The stored data or null if expired or not found.
   */
  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      localStorage.removeItem(key);
      return null;
    }
  },

  /**
   * Remove an item from localStorage.
   * @param {string} key - The key to remove.
   */
  remove(key) {
    localStorage.removeItem(key);
  },
};
