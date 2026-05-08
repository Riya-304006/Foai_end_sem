/**
 * Reverse geocode latitude and longitude to find the nearest place.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<string>} - Name of the location or description.
 */
export async function getNearestPlace(lat, lon) {
  if (lat === null || lon === null) return 'Determining...';

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SpaceDashboard/1.0'
      }
    });
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    
    if (data.error) return 'Over ocean / remote area';
    
    const addr = data.address;
    const place = addr.city || addr.town || addr.village || addr.county || addr.state || addr.country;
    
    if (!place) return 'Over ocean / remote area';
    
    const country = addr.country || '';
    return country ? `${place}, ${country}` : place;

  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return 'Over ocean / remote area';
  }
}
