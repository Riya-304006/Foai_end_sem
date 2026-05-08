import { useState, useEffect } from 'react';

const MAX_HISTORY = 15;

/**
 * Hook to manage the history of ISS positions.
 * @param {Object} currentLocation - The current position { latitude, longitude }.
 * @returns {Array} - Array of the last 15 positions.
 */
export function useISSHistory(currentLocation) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentLocation && currentLocation.latitude !== null) {
      setHistory(prev => {
        const newHistory = [...prev, currentLocation];
        if (newHistory.length > MAX_HISTORY) {
          return newHistory.slice(newHistory.length - MAX_HISTORY);
        }
        return newHistory;
      });
    }
  }, [currentLocation]);

  return history;
}
