import React, { createContext, useContext } from "react";
import { useLiveAPI } from "../hooks/use-live-api";

const LiveAPIContext = createContext(undefined);

export const LiveAPIProvider = ({ url, apiKey, children }) => {
  const liveAPI = useLiveAPI({ url, apiKey });

  return (
    <LiveAPIContext.Provider value={liveAPI}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPIContext = () => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error("useLiveAPIContext must be used within a LiveAPIProvider");
  }
  return context;
};
