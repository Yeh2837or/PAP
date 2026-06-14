import React, { createContext, useContext, useState } from 'react';
import { SESSION_KEY } from '../core/config';

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });

  return (
    <AppCtx.Provider value={{ user, setUser }}>
      {children}
    </AppCtx.Provider>
  );
}