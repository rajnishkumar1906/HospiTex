import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [IsLoggedIn , setIsLoggedIn] = useState(false);
  const [UserRole , setUserRole] = useState('patient');
  const [User, setUser] = useState(null);
  
  const value = { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, User, setUser };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
