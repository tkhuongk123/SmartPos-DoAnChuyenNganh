import { createContext, useEffect } from "react";
import socket from "../socket/socket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};