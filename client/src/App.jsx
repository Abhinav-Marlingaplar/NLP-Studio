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
  const { token } = useAuth();

  // Route protector
  const ProtectedRoute = ({ children }) => {
    const savedToken = localStorage.getItem("authToken");
    if (!token && !savedToken) return <Navigate to="/" replace />; // redirect to landing page
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
            background: "#1f1f1f",
            color: "#fff",
            border: "1px solid #f97316",
          },
          success: {
            iconTheme: {
              primary: "#f97316",
              secondary: "#000",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#000",
            },
          },
        }}
      />

      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/app/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/app/dashboard" /> : <Register />}
        />

        {/* ---------------- PROTECTED ROUTES (LAYOUT) ---------------- */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* DEFAULT PAGE INSIDE LAYOUT */}
          <Route index element={<Dashboard />} />

          {/* USER PAGES */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* NLP SERVICES */}
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="paraphraser" element={<Paraphraser />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* ---------------- NOT FOUND → REDIRECT ---------------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </div>
  );
};

export default App;
