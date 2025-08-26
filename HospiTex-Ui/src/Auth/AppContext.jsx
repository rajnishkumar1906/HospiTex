import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const demoUser = {
    name: "Rajnish Kumar",
    email: "rajnishk71249@gmail.com",
    password: "rajnish123",
    type: "Patient"
  };

  const [userState, setUserState] = useState('SignUp'); // toggle SignUp/Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [users, setUsers] = useState([demoUser]); // initial demo user
  const [currentUser, setCurrentUser] = useState(null); // store logged-in user

  const value = {
    userState,
    setUserState,
    isLoggedIn,
    setIsLoggedIn,
    userType,
    setUserType,
    users,
    setUsers,
    currentUser,
    setCurrentUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
