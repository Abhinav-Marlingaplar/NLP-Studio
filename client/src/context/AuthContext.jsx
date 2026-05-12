import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shouldRestore = sessionStorage.getItem("isLoggedIn");

    if (!shouldRestore) {
      setLoading(false);
      return;
    }

    axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true }
    )
      .then(res => {
        setToken(res.data.accessToken);
        const savedUser = sessionStorage.getItem("authUser");
        if (savedUser) setUser(JSON.parse(savedUser));
      })
      .catch(() => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("authUser");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (tokenValue, userData = null) => {
    setToken(tokenValue);
    sessionStorage.setItem("isLoggedIn", "true");
    if (userData) {
      setUser(userData);
      sessionStorage.setItem("authUser", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("authUser");
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  };

  // ✅ REMOVED the early null return — always render the Provider
  // ✅ ADDED loading to the value object so App.jsx can read it
  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    loading,  // 👈 this was missing
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};