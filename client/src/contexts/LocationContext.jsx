import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    // Start tracking location continuously
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setIsTracking(true);
        setError(null);
        // We can later use this data for emergency transmission
        console.log("Live Location Update:", position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setIsTracking(false);
        setError(err.message);
        console.warn('Location tracking error:', err.message);
      },
      {
        enableHighAccuracy: true, // Crucial for mobile/emergency precision
        timeout: 10000,
        maximumAge: 0 // Do not use cached position
      }
    );

    // Cleanup watcher on unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const value = {
    location,
    error,
    isTracking
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
