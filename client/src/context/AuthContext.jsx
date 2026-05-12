import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 add loading state

  useEffect(() => {
    const shouldRestore = sessionStorage.getItem("isLoggedIn");

    // ✅ Refresh = same tab = sessionStorage still has flag = restore session
    // ✅ New tab/browser open = sessionStorage cleared = skip = force login
    if (!shouldRestore) {
      setLoading(false); // 👈 nothing to restore, mark as done
      return;
    }

    // Flag exists — try to get fresh access token via cookie
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
        // Cookie expired or invalid — force fresh login
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("authUser");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false)); // 👈 always mark as done
  }, []);

  const login = (tokenValue, userData = null) => {
    setToken(tokenValue);
    sessionStorage.setItem("isLoggedIn", "true");  // ✅ set flag on login

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

  // 👇 Don't render children until auth state is resolved
  // Without this, protected routes flash as logged-out on every refresh
  if (loading) return null;

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};