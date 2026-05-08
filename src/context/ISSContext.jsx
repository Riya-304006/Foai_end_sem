import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { issService } from '../services/issService';

const ISSContext = createContext();

const POLL_INTERVAL = 20000; // 20 seconds
const MAX_HISTORY = 20;

export function ISSProvider({ children }) {
  const [location, setLocation] = useState({ 
    latitude: null, 
    longitude: null, 
    velocity: null, 
    altitude: null 
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      const data = await issService.fetchISSLocation();
      
      // If service throttled the request, just skip this cycle
      if (!data) return;

      const newLoc = {
        latitude: data.latitude,
        longitude: data.longitude,
        velocity: data.velocity,
        altitude: data.altitude,
        timestamp: data.timestamp
      };
      
      setLocation(newLoc);
      setLastUpdated(new Date());
      setError(null);

      // Manage history here to keep it central
      setHistory(prev => {
        const updated = [...prev, newLoc];
        return updated.slice(-MAX_HISTORY);
      });
    } catch (err) {
      console.error('ISS Poll Error:', err);
      // Don't set loading false here if we already have data, just update error
      setError(err.message || 'API error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
    const intervalId = setInterval(fetchLocation, POLL_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchLocation]);

  const value = {
    location,
    history,
    loading,
    error,
    lastUpdated,
    refreshLocation: fetchLocation
  };

  return <ISSContext.Provider value={value}>{children}</ISSContext.Provider>;
}

export function useISSContext() {
  const context = useContext(ISSContext);
  if (!context) {
    throw new Error('useISSContext must be used within an ISSProvider');
  }
  return context;
}
