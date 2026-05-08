/**
 * A generic fetch wrapper to handle API requests and standardize error handling.
 * @param {string} url - The endpoint to fetch data from.
 * @param {Object} options - Standard fetch options (method, headers, body, etc.).
 * @returns {Promise<any>} - The parsed JSON response.
 */
export async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}
