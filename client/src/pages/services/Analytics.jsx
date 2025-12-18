import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { analyzeText } from "../../api/analytics";
import InputBox from "../../components/InputBox";
import OutputBox from "../../components/OutputBox";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";

const LS_MESSAGES = "analytics_messages";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Analytics = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- LOAD ----------
  useEffect(() => {
    const saved = localStorage.getItem(LS_MESSAGES);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // ---------- APPEND ----------
  const appendMessage = (msg) => {
    setMessages(prev => {
      const next = [...prev, msg];
      localStorage.setItem(LS_MESSAGES, JSON.stringify(next));
      return next;
    });
  };

  // ---------- RESET ----------
  const reset = () => {
    setMessages([]);
    localStorage.removeItem(LS_MESSAGES);
    toast.success("Analysis history cleared");
  };

  // ---------- ANALYZE ----------
  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error("Please enter text to analyze");
      return;
    }

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
        ? res.aspects
            .map(
              a =>
                `• **${a.aspect}** — ${a.sentiment} (${Math.round(
                  a.confidence * 100
                )}%, Severity: ${a.severity})
${a.analysis}`
            )
            .join("\n\n")
        : "None"
      }

**⚠️ Identified Issues**
${res.keyIssues?.length
        ? res.keyIssues
            .map(
              i =>
                `• **${i.issue}**
Severity: ${i.severity}
Impact: ${i.impact}`
            )
            .join("\n\n")
        : "None"
      }

**✅ Key Strengths**
${res.strengths?.length
        ? res.strengths
            .map(
              s =>
                `• **${s.point}**
Why it matters: ${s.explanation}`
            )
            .join("\n\n")
        : "None"
      }

**🚨 Potential Risks**
${res.risks?.length
        ? res.risks
            .map(
              r =>
                `• **${r.risk}**
Reason: ${r.reason}`
            )
            .join("\n\n")
        : "None"
      }

**🛠️ Recommendations**
${res.recommendations?.length
        ? res.recommendations
            .map(
              r =>
                `• **${r.action}**
Justification: ${r.justification}`
            )
            .join("\n\n")
        : "None"
      }

**🔍 Supporting Evidence**
${res.evidence?.length
        ? res.evidence.map(e => `• “${e}”`).join("\n")
        : "None"
      }
`.trim();

      appendMessage({ sender: "ai", text: formatted });
      toast.success("Text analysis completed");
    } catch {
      appendMessage({ sender: "ai", text: "Error analyzing text." });
      toast.error("Text analysis failed");
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col rounded-2xl
                 bg-white/5 backdrop-blur-xl
                 border border-white/20
                 shadow-xl shadow-black/40
                 p-6 text-white"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-orange-500">
          Text Analytics
        </h2>
        <Link
          to="/app/dashboard"
          className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 transition"
        >
          Back
        </Link>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-300 mb-6 max-w-3xl">
        Perform deep analysis of textual content to extract sentiment,
        insights, strengths, risks, and actionable recommendations.
        Ideal for reviews, feedback, and narrative-driven data.
      </p>

      {/* OUTPUT */}
      <div className="flex-grow overflow-y-auto mt-2">
        <OutputBox messages={messages} />
        {loading && <Loading />}
      </div>

      {/* INPUT */}
      <InputBox
        value={input}
        onChange={setInput}
        onSubmit={handleAnalyze}
        placeholder="Enter text to analyze..."
      />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260 }}
          onClick={handleAnalyze}
          disabled={loading}
          className="flex-1 bg-orange-600 px-4 py-2 rounded-lg
                     hover:bg-orange-700 transition disabled:opacity-50"
        >
          Analyze
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260 }}
          onClick={reset}
          disabled={loading}
          className="bg-white/20 px-4 py-2 rounded-lg
                     hover:bg-white/20 transition"
        >
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Analytics;
