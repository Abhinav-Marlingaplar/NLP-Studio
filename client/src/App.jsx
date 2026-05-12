import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Layout from "./pages/user/Layout";
import Dashboard from "./pages/user/Dashboard";

import Chatbot from "./pages/services/RAG_Chatbot";
import Paraphraser from "./pages/services/Paraphraser";
import Analytics from "./pages/services/Analytics";

import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { token, loading } = useAuth(); // 👈 pull loading from context

  const ProtectedRoute = ({ children }) => {
    // ✅ Wait for auth to resolve before making any decision
    if (loading) return null; // or a spinner — just don't redirect yet

    // ✅ Fixed: sessionStorage instead of localStorage
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!token && !isLoggedIn) return <Navigate to="/" replace />;

    return children;
  };


  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ GLOBAL TOAST INITIALIZATION (ONLY ONCE) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#141414",
            color: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "10px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#F5C842",
              secondary: "#141414",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#141414",
            },
          },
          loading: {
            iconTheme: {
              primary: "#F5C842",
              secondary: "#141414",
            },
          },
        }}
      />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            loading ? null : // 👈 don't redirect while loading
              token ? <Navigate to="/app/dashboard" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            loading ? null : // 👈 same here
              token ? <Navigate to="/app/dashboard" /> : <Register />
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="paraphraser" element={<Paraphraser />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
