import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const AuthContext = createContext();

// Custom Hook
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // optional user details

  // Load token on mount (persistent login)
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Login function
  const login = (tokenValue, userData = null) => {
    setToken(tokenValue);
    localStorage.setItem("authToken", tokenValue);

    if (userData) {
      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
