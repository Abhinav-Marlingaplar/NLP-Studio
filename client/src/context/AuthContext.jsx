import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { setAccessToken } from "../api/axiosClient"; // 👈 import

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
        setAccessToken(res.data.accessToken); // 👈 set in axiosClient memory
        const savedUser = sessionStorage.getItem("authUser");
        if (savedUser) setUser(JSON.parse(savedUser));
      })
      .catch(() => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("authUser");
        setToken(null);
        setAccessToken(null); // 👈 clear in axiosClient memory
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (tokenValue, userData = null) => {
    setToken(tokenValue);
    setAccessToken(tokenValue); // 👈 set in axiosClient memory
    sessionStorage.setItem("isLoggedIn", "true");
    if (userData) {
      setUser(userData);
      sessionStorage.setItem("authUser", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setToken(null);
    setAccessToken(null); // 👈 clear in axiosClient memory
    setUser(null);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("authUser");
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};