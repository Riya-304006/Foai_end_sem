// useISSData — stub for Phase 1 (real API integration in Phase 2)
import { useState, useEffect, useRef, useCallback } from 'react';

const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const PEOPLE_API = 'http://api.open-notify.org/astros.json';
const MAX_POSITIONS = 15;

function haversineDistance(pos1, pos2) {
  const R = 6371;
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const dLon = ((pos2.lon - pos1.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useISSData() {
  const [data, setData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const prevPos = useRef(null);
  const prevTime = useRef(null);

  const fetchISS = useCallback(async () => {
    try {
      const res = await fetch(ISS_API);
      if (!res.ok) throw new Error('ISS API error');
      const json = await res.json();

      const pos = { lat: json.latitude, lon: json.longitude };
      const now = Date.now();

      let speed = json.velocity || 27600;
      if (prevPos.current && prevTime.current) {
        const dist = haversineDistance(prevPos.current, pos);
        const dt = (now - prevTime.current) / 3600000; // hours
        if (dt > 0) speed = dist / dt;
      }

      prevPos.current = pos;
      prevTime.current = now;

      setData({ ...json, computedSpeed: Math.round(speed) });
      setPositions(prev => [...prev.slice(-(MAX_POSITIONS - 1)), pos]);
      setSpeeds(prev => [...prev.slice(-14), Math.round(speed)]);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const res = await fetch(PEOPLE_API);
      const json = await res.json();
      setAstronauts(json.people || []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchISS();
    fetchAstronauts();
    const interval = setInterval(fetchISS, 15000);
    return () => clearInterval(interval);
  }, [fetchISS, fetchAstronauts]);

  return { data, positions, speeds, astronauts, loading, error, lastUpdated, refresh: fetchISS };
}
