import React, { createContext, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [lookaheadPeriod, setLookaheadPeriod] = useState('7 days');

  return (
    <SettingsContext.Provider value={{ lookaheadPeriod, setLookaheadPeriod }}>
      {children}
    </SettingsContext.Provider>
  );
};