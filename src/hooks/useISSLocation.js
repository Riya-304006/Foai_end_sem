import { useState, useEffect, useCallback } from 'react';
import { issService } from '../services/issService';
import { getNearestPlace } from '../utils/geocoding';

const POLL_INTERVAL = 15000; // 15 seconds

/**
 * Hook to manage live ISS location polling.
 */
export function useISSLocation() {
  const [location, setLocation] = useState({ 
    latitude: null, 
    longitude: null, 
    velocity: null, 
    altitude: null,
    nearestPlace: 'Calculating...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      const data = await issService.fetchISSLocation();
      
      // Get nearest place (reverse geocoding)
      const place = await getNearestPlace(data.latitude, data.longitude);

      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        velocity: data.velocity,
        altitude: data.altitude,
        nearestPlace: place
      });
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching ISS location');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
    const intervalId = setInterval(fetchLocation, POLL_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchLocation]);

  return { location, loading, error, lastUpdated, refreshLocation: fetchLocation };
}
