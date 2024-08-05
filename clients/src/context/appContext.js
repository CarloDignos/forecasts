import { io } from "socket.io-client";
import React, { useState } from "react";

const SOCKET_URL = "http://localhost:5001";
export const socket = io(SOCKET_URL);

// App context
export const AppContext = React.createContext();

// App context provider component
export function AppContextProvider({ children }) {
  // State to store the userType
  const [userType, setUserType] = useState(null);

  // You can add other states and functions related to the context here if needed.

  return (
    // Provide the context values to the children components
    <AppContext.Provider value={{ userType, setUserType }}>
      {children}
    </AppContext.Provider>
  );
}
