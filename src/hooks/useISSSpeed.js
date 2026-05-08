import { useState, useEffect, useRef } from 'react';
import { haversineDistance } from '../utils/distance';

const MAX_HISTORY = 30;

/**
 * Hook to calculate and track the live speed of the ISS.
 * @param {Object} location - The current location { latitude, longitude }.
 * @param {Date} lastUpdated - Timestamp of the current location.
 * @returns {Object} { currentSpeed, speedHistory: [{ time, speed }] }
 */
export function useISSSpeed(location, lastUpdated) {
  const [currentSpeed, setCurrentSpeed] = useState(27600); // Default approx orbital velocity
  const [speedHistory, setSpeedHistory] = useState([]);
  
  const prevLocation = useRef(null);
  const prevTime = useRef(null);

  useEffect(() => {
    if (!location.latitude || !location.longitude || !lastUpdated) return;

    if (prevLocation.current && prevTime.current) {
      const distanceKm = haversineDistance(
        prevLocation.current.latitude,
        prevLocation.current.longitude,
        location.latitude,
        location.longitude
      );

      // Time difference in hours
      const timeDiffMs = lastUpdated.getTime() - prevTime.current.getTime();
      const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

      // Avoid division by zero or extremely small time diffs causing spikes
      if (timeDiffHours > 0.0001) {
        let speed = distanceKm / timeDiffHours;
        
        // Sanity check: ISS speed should be roughly between 27000 and 28000
        // If there's an anomaly (like a large polling gap), cap it
        if (speed < 20000 || speed > 35000) {
          speed = 27600; // fallback to average
        }
        
        const newSpeed = Math.round(speed);
        setCurrentSpeed(newSpeed);

        const timeLabel = lastUpdated.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        setSpeedHistory(prev => {
          // Prevent exact duplicate timestamps (can happen with React strict mode or rapid renders)
          if (prev.length > 0 && prev[prev.length - 1].time === timeLabel) {
            return prev;
          }
          
          const newHistory = [...prev, { time: timeLabel, speed: newSpeed }];
          if (newHistory.length > MAX_HISTORY) {
            return newHistory.slice(newHistory.length - MAX_HISTORY);
          }
          return newHistory;
        });
      }
    } else {
      // First data point, just initialize history with average speed
      const timeLabel = lastUpdated.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSpeedHistory([{ time: timeLabel, speed: 27600 }]);
    }

    prevLocation.current = { ...location };
    prevTime.current = lastUpdated;

  }, [location.latitude, location.longitude, lastUpdated]);

  return { currentSpeed, speedHistory };
}
