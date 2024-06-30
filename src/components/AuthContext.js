import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  userType: null,
  setIsLoggedIn: () => {},
  setUserType: () => {},
});

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const login = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
