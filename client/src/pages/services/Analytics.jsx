import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { analyzeText } from "../../api/analytics";
import { useAuth } from "../../context/AuthContext";   // 👈 added
import InputBox from "../../components/InputBox";
import OutputBox from "../../components/OutputBox";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Analytics = () => {
  const { user } = useAuth();                          // 👈 added
  const userId = user?.id;                             // 👈 added

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Key scoped to userId
  const LS_MESSAGES = useMemo(
    () => userId ? `analytics_messages_${userId}` : null,
    [userId]
  );

  useEffect(() => {
    if (!LS_MESSAGES) return;
    // ✅ Only loads this user's own messages
    const saved = localStorage.getItem(LS_MESSAGES);
    if (saved) setMessages(JSON.parse(saved));
  }, [LS_MESSAGES]);

  const appendMessage = (msg) => {
    setMessages(prev => {
      const next = [...prev, msg];
      if (LS_MESSAGES) localStorage.setItem(LS_MESSAGES, JSON.stringify(next));
      return next;
    });
  };

  const reset = () => {
    setMessages([]);
    if (LS_MESSAGES) localStorage.removeItem(LS_MESSAGES);  // ✅ only clears this user's data
    toast.success("Analysis history cleared");
  };

  const handleAnalyze = async () => {
    if (!input.trim()) { toast.error("Please enter text to analyze"); return; }

    const userText = input;
    setInput("");
    appendMessage({ sender: "user", text: userText });
    setLoading(true);

    try {
      const res = await analyzeText({ text: userText });

      const formatted = `
**📊 Sentiment Overview**
Overall Sentiment: ${res.overallSentiment ?? "N/A"}
Confidence Score: ${res.confidence != null ? Math.round(res.confidence * 100) : "N/A"}%

**📝 Executive Summary**
${res.summary ?? "No summary available."}

**📌 Aspect-Level Analysis**
${res.aspects?.length
        ? res.aspects.map(a => `• **${a.aspect}** — ${a.sentiment} (${Math.round(a.confidence * 100)}%, Severity: ${a.severity})\n${a.analysis}`).join("\n\n")
        : "None"}

**⚠️ Identified Issues**
${res.keyIssues?.length
        ? res.keyIssues.map(i => `• **${i.issue}**\nSeverity: ${i.severity}\nImpact: ${i.impact}`).join("\n\n")
        : "None"}

**✅ Key Strengths**
${res.strengths?.length
        ? res.strengths.map(s => `• **${s.point}**\nWhy it matters: ${s.explanation}`).join("\n\n")
        : "None"}

**🚨 Potential Risks**
${res.risks?.length
        ? res.risks.map(r => `• **${r.risk}**\nReason: ${r.reason}`).join("\n\n")
        : "None"}

**🛠️ Recommendations**
${res.recommendations?.length
        ? res.recommendations.map(r => `• **${r.action}**\nJustification: ${r.justification}`).join("\n\n")
        : "None"}

**🔍 Supporting Evidence**
${res.evidence?.length ? res.evidence.map(e => `• "${e}"`).join("\n") : "None"}
`.trim();

      appendMessage({ sender: "ai", text: formatted });
      toast.success("Analysis complete");
    } catch {
      appendMessage({ sender: "ai", text: "Error analyzing text." });
      toast.error("Text analysis failed");
    }

    setLoading(false);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
                className="h-full flex flex-col rounded-2xl p-6"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .gold-text {
          background: linear-gradient(135deg, #F5C842, #E8A020);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .action-btn-primary {
          flex: 1;
          padding: 11px;
          border-radius: 10px;
          background: linear-gradient(135deg, #F5C842 0%, #E8A020 100%);
          color: #080808;
          font-weight: 600;
          font-size: 13px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .action-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,200,66,0.25); }
        .action-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .action-btn-secondary {
          padding: 11px 20px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .action-btn-secondary:hover { background: rgba(255,255,255,0.08); color: white; }
      `}</style>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'rgba(245,200,66,0.7)' }}>
            Tool
          </p>
          <h2 className="font-display text-2xl font-bold gold-text">Text Analytics</h2>
        </div>
        <Link to="/app/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <p className="text-xs leading-relaxed mb-5 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Perform deep analysis of textual content to extract sentiment, insights, strengths, risks,
        and actionable recommendations. Ideal for reviews, feedback, and narrative-driven data.
      </p>

      {/* OUTPUT */}
      <div className="flex-grow overflow-y-auto mt-2">
        <OutputBox messages={messages} icon="◉" />
        {loading && <Loading />}
      </div>

      {/* INPUT */}
      <InputBox value={input} onChange={setInput} onSubmit={handleAnalyze}
                placeholder="Enter text to analyze..." />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">
        <button onClick={handleAnalyze} disabled={loading} className="action-btn-primary">
          Analyze Text
        </button>
        <button onClick={reset} disabled={loading} className="action-btn-secondary">
          Reset
        </button>
      </div>
    </motion.div>
  );
};

export default Analytics;
