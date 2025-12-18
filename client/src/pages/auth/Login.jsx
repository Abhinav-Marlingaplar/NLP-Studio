import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      login(data.accessToken, data.user);

      toast.success("Login successful");
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `url(${assets.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md rounded-2xl 
                   bg-black/60 backdrop-blur-xl
                   border border-white/10 shadow-2xl p-8"
      >
        {/* Logo */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <Link to="/">
            <img src={assets.nlpstudio} alt="logo" className="w-32" />
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white text-center mb-2"
        >
          Welcome Back
        </motion.h2>

        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.25 }}
          className="text-center text-gray-400 mb-6 text-sm"
        >
          Sign in to continue to NLP-Studio
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={fadeUp} transition={{ delay: 0.3 }}>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl
                         bg-[#141414] border border-white/10
                         text-white placeholder-gray-500
                         focus:outline-none focus:border-orange-500
                         transition-all"
              required
            />
          </motion.div>

          <motion.div variants={fadeUp} transition={{ delay: 0.4 }}>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl
                         bg-[#141414] border border-white/10
                         text-white placeholder-gray-500
                         focus:outline-none focus:border-orange-500
                         transition-all"
              required
            />
          </motion.div>

          <motion.button
            variants={fadeUp}
            transition={{ delay: 0.5 }}
            type="submit"
            className="w-full py-3 text-white rounded-xl font-semibold
                       bg-gradient-to-r from-orange-500 to-orange-700
                       hover:opacity-90 transition
                       shadow-lg shadow-orange-500/20"
          >
            Login
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-400 mt-6"
        >
          New here?{" "}
          <Link to="/register" className="text-orange-500 hover:underline">
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
