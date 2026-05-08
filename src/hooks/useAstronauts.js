import { useState, useEffect, useCallback } from 'react';
import { issService } from '../services/issService';

/**
 * Hook to manage the list of astronauts currently in space.
 * @returns {Object} { count, people, loading, error, refresh }
 */
export function useAstronauts() {
  const [data, setData] = useState({ count: 0, people: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrew = useCallback(async () => {
    setLoading(true);
    try {
      const result = await issService.fetchAstronauts();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch astronauts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrew();
  }, [fetchCrew]);

  return { ...data, loading, error, refresh: fetchCrew };
}
