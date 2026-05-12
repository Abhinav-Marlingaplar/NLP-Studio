import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { fetchHistory } from "../../api/history";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const toolCards = [
  {
    to: "/app/chatbot",
    title: "AI Chatbot",
    icon: "◈",
    desc: "Intelligent document Q&A using Retrieval-Augmented Generation for context-aware responses.",
    tag: "RAG",
  },
  {
    to: "/app/paraphraser",
    title: "Paraphraser",
    icon: "◇",
    desc: "Rewrite and refine text while preserving meaning and adapting tone and length.",
    tag: "NLP",
  },
  {
    to: "/app/analytics",
    title: "Text Analytics",
    icon: "◉",
    desc: "Extract sentiment, key insights, strengths, risks, and actionable recommendations.",
    tag: "Analysis",
  },
];

const routeMap = { rag: "/app/chatbot", chat: "/app/chatbot", paraphrase: "/app/paraphraser", analyze: "/app/analytics" };
const labelMap = { rag: "AI Chatbot", chat: "AI Chatbot", paraphrase: "Paraphraser", analyze: "Text Analytics" };
const iconMap = { rag: "◈", chat: "◈", paraphrase: "◇", analyze: "◉" };

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const handleBackHome = () => {
    toast.success("Logged out successfully");
    setTimeout(() => { toast.dismiss(); logout(); navigate("/", { replace: true }); }, 500);
  };

  useEffect(() => {
    fetchHistory()
      .then((res) => { const data = Array.isArray(res) ? res : res?.history || []; setHistory(data); })
      .catch(() => setHistory([]));
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}
      style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .gold-text {
          background: linear-gradient(135deg, #F5C842 0%, #E8A020 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tool-card {
          border-radius: 16px;
          padding: 28px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .tool-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,200,66,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .tool-card:hover {
          border-color: rgba(245,200,66,0.2);
          background: rgba(245,200,66,0.03);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }
        .tool-card:hover::before { opacity: 1; }
        .history-item {
          border-radius: 12px;
          padding: 18px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.2s ease;
        }
        .history-item:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(245,200,66,0.15);
        }
      `}</style>

      {/* HEADER */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(245,200,66,0.7)' }}>
            Dashboard
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Welcome back{user?.name && <span className="gold-text">, {user.name}</span>}
          </h1>
          <p className="text-sm mt-1 font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Choose a tool to get started.
          </p>
        </div>

        <button onClick={handleBackHome}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
          Sign Out
        </button>
      </motion.div>

      {/* TOOL CARDS */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {toolCards.map((item, i) => (
          <motion.button key={i} onClick={() => navigate(item.to)}
            whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}
            className="tool-card">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.2)', color: '#F5C842' }}>
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {item.tag}
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-xs leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {item.desc}
            </p>
          </motion.button>
        ))}
      </motion.div>

      {/* DIVIDER */}
      <div className="h-px mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* HISTORY */}
      <motion.section variants={fadeUp}>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Recent Activity</h2>
          {history.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(245,200,66,0.1)', color: '#F5C842', border: '1px solid rgba(245,200,66,0.2)' }}>
              {history.length}
            </span>
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-xl p-8 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No recent activity yet. Use a tool to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`${routeMap[item.type]}?sessionId=${item.sessionId}`)} // 👈 changed
                className="history-item">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm shrink-0" style={{ color: '#F5C842' }}>
                      {iconMap[item.type] || "◦"}
                    </span>
                    <span className="text-sm font-medium text-white truncate">
                      {labelMap[item.type] || item.type}
                    </span>
                    <span className="text-xs truncate font-light hidden sm:block" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      — {item.input?.slice(0, 60)}…
                    </span>
                  </div>
                  <span className="text-[11px] shrink-0 font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;
