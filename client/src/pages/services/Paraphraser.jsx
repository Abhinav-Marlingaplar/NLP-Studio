import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { paraphraseText } from "../../api/paraphraser";
import { useAuth } from "../../context/AuthContext";   // 👈 added
import InputBox from "../../components/InputBox";
import OutputBox from "../../components/OutputBox";
import Loading from "../../components/Loading";
import { toast } from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Paraphraser = () => {
  const { user } = useAuth();                          // 👈 added
  const userId = user?.id;                             // 👈 added

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("same");
  const [creativity, setCreativity] = useState(0.3);

  // ✅ Key scoped to userId — different users never share messages
  const LS_MESSAGES = useMemo(
    () => userId ? `paraphraser_messages_${userId}` : null,
    [userId]
  );

  useEffect(() => {
    if (!LS_MESSAGES) return;
    // ✅ Only load if userId is known — never load on cold/unauthenticated open
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
    toast.success("Session reset");
  };

  const handleParaphrase = async () => {
    if (!input.trim()) { toast.error("Please enter text to paraphrase"); return; }
    const userText = input;
    setInput("");
    appendMessage({ sender: "user", text: userText });
    setLoading(true);

    try {
      const res = await paraphraseText({ text: userText, tone, length, creativity });
      appendMessage({ sender: "ai", text: res.output });
      toast.success("Paraphrase generated");
    } catch {
      appendMessage({ sender: "ai", text: "Error generating paraphrase." });
      toast.error("Failed to generate paraphrase");
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
        .control-select {
          padding: 8px 14px;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
          appearance: none;
          -webkit-appearance: none;
          padding-right: 28px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.3)' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        .control-select:hover { border-color: rgba(245,200,66,0.3); }
        .control-select:focus { border-color: rgba(245,200,66,0.5); box-shadow: 0 0 0 3px rgba(245,200,66,0.08); }
        .control-select option { background: #1a1a1a; color: white; }
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
        .creativity-track { -webkit-appearance: none; appearance: none; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; outline: none; cursor: pointer; }
        .creativity-track::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: linear-gradient(135deg, #F5C842, #E8A020); cursor: pointer; box-shadow: 0 0 8px rgba(245,200,66,0.4); }
      `}</style>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'rgba(245,200,66,0.7)' }}>
            Tool
          </p>
          <h2 className="font-display text-2xl font-bold gold-text">Paraphraser</h2>
        </div>
        <Link to="/app/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <p className="text-xs leading-relaxed mb-5 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Rewrite text while preserving its original meaning. Control tone, length, and creativity
        to suit different writing contexts and professional needs.
      </p>

      {/* CONTROLS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                  className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value)} className="control-select">
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Length</label>
          <select value={length} onChange={e => setLength(e.target.value)} className="control-select">
            <option value="same">Same</option>
            <option value="shorter">Shorter</option>
            <option value="longer">Longer</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-[160px]">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Creativity</label>
            <span className="text-xs font-semibold" style={{ color: '#F5C842' }}>{creativity}</span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value={creativity}
                 onChange={e => setCreativity(Number(e.target.value))}
                 className="creativity-track w-full" />
        </div>
      </motion.div>

      {/* OUTPUT */}
      <div className="flex-grow overflow-y-auto">
        <OutputBox messages={messages} icon="◇" />
        {loading && <Loading />}
      </div>

      {/* INPUT */}
      <InputBox value={input} onChange={setInput} onSubmit={handleParaphrase}
                placeholder="Enter text to paraphrase..." />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">
        <button onClick={handleParaphrase} disabled={loading} className="action-btn-primary">
          Paraphrase
        </button>
        <button onClick={reset} disabled={loading} className="action-btn-secondary">
          Reset
        </button>
      </div>
    </motion.div>
  );
};

export default Paraphraser;
