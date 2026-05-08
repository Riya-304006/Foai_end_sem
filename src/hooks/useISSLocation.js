import { useState, useEffect, useCallback } from 'react';
import { issService } from '../services/issService';

const POLL_INTERVAL = 15000; // 15 seconds

/**
 * Hook to manage live ISS location polling.
 * @returns {Object} { location: { latitude, longitude }, loading, error, lastUpdated, refreshLocation }
 */
export function useISSLocation() {
  const [location, setLocation] = useState({ 
    latitude: null, 
    longitude: null, 
    velocity: null, 
    altitude: null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      const data = await issService.fetchISSLocation();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        velocity: data.velocity,
        altitude: data.altitude,
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
