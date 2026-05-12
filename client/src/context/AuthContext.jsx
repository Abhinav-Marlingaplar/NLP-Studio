import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Restore session on mount — but ONLY if user logged in this browser session
  useEffect(() => {
    const shouldRestore = sessionStorage.getItem("isLoggedIn"); // 👈 flag check
    if (!shouldRestore) return; // cold open = skip, force fresh login

    // Try to get a new access token using the refresh cookie
    axios.post("/api/auth/refresh", {}, { withCredentials: true })
      .then(res => {
        setToken(res.data.accessToken);

        const savedUser = sessionStorage.getItem("authUser"); // 👈 sessionStorage
        if (savedUser) setUser(JSON.parse(savedUser));
      })
      .catch(() => {
        // Refresh failed — clear everything and force login
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("authUser");
        setToken(null);
        setUser(null);
      });
  }, []);

  const login = (tokenValue, userData = null) => {
    setToken(tokenValue);
    sessionStorage.setItem("isLoggedIn", "true"); // 👈 set flag on login

    if (userData) {
      setUser(userData);
      sessionStorage.setItem("authUser", JSON.stringify(userData)); // 👈 sessionStorage
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("isLoggedIn");  // 👈 clear flag
    sessionStorage.removeItem("authUser");    // 👈 sessionStorage
    axios.post("/api/auth/logout", {}, { withCredentials: true }); // 👈 revoke server-side
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