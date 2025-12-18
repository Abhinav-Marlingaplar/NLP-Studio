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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const handleBackHome = () => {
    toast.success("Logged out successfully");
    setTimeout(() => {
      toast.dismiss();
      logout();
      navigate("/", { replace: true });
    }, 500);
  };

  useEffect(() => {
    fetchHistory()
      .then((res) => {
        const data = Array.isArray(res) ? res : res?.history || [];
        setHistory(data);
      })
      .catch(() => setHistory([]));
  }, []);

  const routeMap = {
    rag: "/app/chatbot",
    chat: "/app/chatbot",
    paraphrase: "/app/paraphraser",
    analyze: "/app/analytics",
  };

  const labelMap = {
    rag: "AI Chatbot",
    chat: "AI Chatbot",
    paraphrase: "Paraphraser",
    analyze: "Text Analytics",
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.5 }}
      className="rounded-2xl
                 bg-white/5 backdrop-blur-xl
                 border border-white/20
                 shadow-xl shadow-black/40
                 p-5 sm:p-8 text-white"
    >

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row
                justify-between items-start sm:items-center
                gap-4 mb-5">
        <h1 className="text-2xl sm:text-4xl font-bold">
          Welcome,
          {user?.name && (
            <span className="text-orange-500"> {user.name}</span>
          )}
        </h1>

        <button
          onClick={handleBackHome}
          className="px-4 py-2 rounded-lg
          w-full sm:w-auto bg-orange-600 hover:bg-orange-700 transition"
        >
          Back to Home
        </button>
      </div>

      <p className="text-gray-300 mb-5">
        Choose a tool to get started with NLP-Studio.
      </p>

      {/* TOOL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {[
          {
            to: "/app/chatbot",
            title: "AI Chatbot",
            desc: "An intelligent conversational assistant for answering queries and generating context-aware responses.",
          },
          {
            to: "/app/paraphraser",
            title: "Paraphraser",
            desc: "Rewrite and refine text while preserving meaning and improving clarity.",
          },
          {
            to: "/app/analytics",
            title: "Text Analytics",
            desc: "Analyze text to extract sentiment, insights, and useful information.",
          },
        ].map((item, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(item.to)}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="group p-6 rounded-2xl
                       bg-white/5 backdrop-blur
                       border border-white/20
                       hover:border-orange-500/40
                       transition"
          >
            <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-300">{item.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* HISTORY */}
      <section className="mt-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-6">
          Recent Activity
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-400">No recent activity yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(routeMap[item.type])}
                className="w-full text-left p-5 rounded-xl
                           bg-white/5 backdrop-blur
                           border border-white/20
                           hover:border-orange-500/40
                           transition"
              >
                <div className="flex flex-col sm:flex-row
                justify-between sm:items-center gap-2">
                  <span className="font-semibold">
                    {labelMap[item.type] || item.type}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="mt-2 text-gray-300 text-sm">
                  {item.input?.slice(0, 100)}…
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Dashboard;
