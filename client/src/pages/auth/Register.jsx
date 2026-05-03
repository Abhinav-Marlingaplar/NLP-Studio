import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      api.post("/auth/register", { name, email, password });
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
         style={{ fontFamily: "'DM Sans', sans-serif", background: '#080808' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus {
          border-color: rgba(245,200,66,0.5);
          background: rgba(245,200,66,0.04);
          box-shadow: 0 0 0 3px rgba(245,200,66,0.08);
        }
        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, #F5C842 0%, #E8A020 100%);
          color: #080808;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .submit-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(245,200,66,0.25);
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30"
           style={{ backgroundImage: `url(${assets.background})` }} />
      <div className="absolute inset-0"
           style={{ background: 'radial-gradient(ellipse at center, rgba(245,200,66,0.05) 0%, rgba(8,8,8,0.97) 70%)' }} />

      {/* Card */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}
                  className="relative w-full max-w-[420px] rounded-2xl p-8 sm:p-10"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(32px)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(245,200,66,0.4), transparent)' }} />

        {/* Logo */}
        <motion.div variants={fadeUp} transition={{ delay: 0.1 }} className="flex justify-center mb-8">
          <Link to="/">
            <img src={assets.nlpstudio} alt="logo" className="w-28 opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>

        <motion.h2 variants={fadeUp} transition={{ delay: 0.2 }}
                   className="font-display text-3xl font-bold text-center mb-2 text-white">
          Create Account
        </motion.h2>
        <motion.p variants={fadeUp} transition={{ delay: 0.25 }}
                  className="text-center text-sm mb-8 font-light"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
          Join NLP-Studio and start exploring AI-powered text tools
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={fadeUp} transition={{ delay: 0.3 }}>
            <label className="block text-xs font-medium mb-2 tracking-wide uppercase"
                   style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name</label>
            <input type="text" placeholder="Your name" value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="input-field" required />
          </motion.div>

          <motion.div variants={fadeUp} transition={{ delay: 0.38 }}>
            <label className="block text-xs font-medium mb-2 tracking-wide uppercase"
                   style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
            <input type="email" placeholder="you@example.com" value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="input-field" required />
          </motion.div>

          <motion.div variants={fadeUp} transition={{ delay: 0.46 }}>
            <label className="block text-xs font-medium mb-2 tracking-wide uppercase"
                   style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="input-field" required />
          </motion.div>

          <motion.div variants={fadeUp} transition={{ delay: 0.54 }}>
            <button type="submit" className="submit-btn">Create Account</button>
          </motion.div>
        </form>

        <motion.p variants={fadeUp} transition={{ delay: 0.62 }}
                  className="text-center text-xs mt-6 font-light"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: '#F5C842' }}
                className="font-medium hover:opacity-80 transition-opacity">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
