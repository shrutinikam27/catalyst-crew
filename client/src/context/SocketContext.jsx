import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [lastPulse, setLastPulse] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('city_pulse', (pulse) => {
      setLastPulse(pulse);
      setNotifications(prev => [{
        id: pulse.id || Date.now(),
        message: pulse.message,
        type: pulse.type,
        title: pulse.title,
        severity: pulse.severity,
        coords: pulse.coords,
        location: pulse.location,
        source: pulse.source,
        sourceUrl: pulse.sourceUrl,
        isVerified: pulse.isVerified,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 50));
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, lastPulse, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};
