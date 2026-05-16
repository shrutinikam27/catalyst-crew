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
        id: Date.now(),
        message: pulse.message,
        type: pulse.type,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10));
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, lastPulse, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};
