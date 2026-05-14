import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { paraphraseText } from "../../api/paraphraser";
import { useAuth } from "../../context/AuthContext";
import InputBox from "../../components/InputBox";
import { toast } from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Single variant card with copy button
const VariantCard = ({ variant, index, selected, onSelect }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(variant.text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onSelect(index)}
      style={{
        borderRadius: 12,
        border: selected
          ? '1px solid rgba(245,200,66,0.4)'
          : '1px solid rgba(255,255,255,0.07)',
        background: selected
          ? 'rgba(245,200,66,0.06)'
          : 'rgba(255,255,255,0.02)',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: 8,
      }}>

      {/* Card header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Variant number badge */}
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            padding: '2px 7px',
            borderRadius: 4,
            background: selected ? 'rgba(245,200,66,0.2)' : 'rgba(255,255,255,0.06)',
            color: selected ? '#F5C842' : 'rgba(255,255,255,0.3)',
          }}>
            {index + 1}
          </span>
          {/* Variant label */}
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: selected ? 'rgba(245,200,66,0.8)' : 'rgba(255,255,255,0.3)',
          }}>
            {variant.label}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            fontSize: 10,
            padding: '3px 10px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            color: copied ? '#F5C842' : 'rgba(255,255,255,0.35)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'DM Sans', sans-serif",
          }}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Variant text */}
      <p style={{
        fontSize: 13,
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.8)',
        margin: 0,
      }}>
        {variant.text}
      </p>
    </motion.div>
  );
};

// Single history entry — shows original + its variants
const HistoryEntry = ({ entry }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Original text */}
      <div style={{
        borderRadius: 12,
        border: '1px solid rgba(245,200,66,0.15)',
        background: 'rgba(245,200,66,0.04)',
        padding: '12px 16px',
        marginBottom: 10,
      }}>
        <p style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(245,200,66,0.5)',
          marginBottom: 6,
        }}>
          Original
        </p>
        <p style={{
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.6)',
          margin: 0,
        }}>
          {entry.original}
        </p>
      </div>

      {/* Variants label */}
      <p style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.2)',
        marginBottom: 8,
        paddingLeft: 4,
      }}>
        Variants — click to select
      </p>

      {/* Variant cards */}
      {entry.variants.map((v, i) => (
        <VariantCard
          key={i}
          variant={v}
          index={i}
          selected={selectedVariant === i}
          onSelect={setSelectedVariant}
        />
      ))}
    </div>
  );
};

const Paraphraser = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [history, setHistory] = useState([]); // array of { original, variants }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("same");
  const [creativity, setCreativity] = useState(0.3);

  const LS_KEY = useMemo(
    () => userId ? `paraphraser_history_${userId}` : null,
    [userId]
  );

  useEffect(() => {
    if (!LS_KEY) return;
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, [LS_KEY]);

  const saveHistory = (updated) => {
    if (LS_KEY) localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  const reset = () => {
    setHistory([]);
    if (LS_KEY) localStorage.removeItem(LS_KEY);
    toast.success("Session cleared");
  };

  const handleParaphrase = async () => {
    if (!input.trim()) { toast.error("Please enter text to paraphrase"); return; }
    const userText = input;
    setInput("");
    setLoading(true);

    try {
      const res = await paraphraseText({ text: userText, tone, length, creativity });

      const entry = { original: userText, variants: res.variants };
      const updated = [entry, ...history]; // newest first
      setHistory(updated);
      saveHistory(updated);
      toast.success("3 variants generated");
    } catch {
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
          flex: 1; padding: 11px; border-radius: 10px;
          background: linear-gradient(135deg, #F5C842 0%, #E8A020 100%);
          color: #080808; font-weight: 600; font-size: 13px; border: none;
          cursor: pointer; transition: all 0.2s ease; font-family: 'DM Sans', sans-serif;
        }
        .action-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,200,66,0.25); }
        .action-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .action-btn-secondary {
          padding: 11px 20px; border-radius: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); font-size: 13px; cursor: pointer;
          transition: all 0.2s ease; font-family: 'DM Sans', sans-serif;
        }
        .action-btn-secondary:hover { background: rgba(255,255,255,0.08); color: white; }
        .creativity-track { -webkit-appearance: none; appearance: none; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; outline: none; cursor: pointer; }
        .creativity-track::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: linear-gradient(135deg, #F5C842, #E8A020); cursor: pointer; box-shadow: 0 0 8px rgba(245,200,66,0.4); }
      `}</style>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1"
             style={{ color: 'rgba(245,200,66,0.7)' }}>Tool</p>
          <h2 className="font-display text-2xl font-bold gold-text">Paraphraser</h2>
        </div>
        <Link to="/app/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          Dashboard
        </Link>
      </div>

      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <p className="text-xs leading-relaxed mb-5 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Rewrite text while preserving its original meaning. Each submission generates 3 structural
        variants — click any card to select it, copy to use it.
      </p>

      {/* CONTROLS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                  className="flex flex-wrap items-center gap-3 mb-5 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold tracking-widest uppercase"
                 style={{ color: 'rgba(255,255,255,0.35)' }}>Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value)} className="control-select">
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold tracking-widest uppercase"
                 style={{ color: 'rgba(255,255,255,0.35)' }}>Length</label>
          <select value={length} onChange={e => setLength(e.target.value)} className="control-select">
            <option value="same">Same</option>
            <option value="shorter">Shorter</option>
            <option value="longer">Longer</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-[160px]">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-semibold tracking-widest uppercase"
                   style={{ color: 'rgba(255,255,255,0.35)' }}>Creativity</label>
            <span className="text-xs font-semibold" style={{ color: '#F5C842' }}>{creativity}</span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value={creativity}
                 onChange={e => setCreativity(Number(e.target.value))}
                 className="creativity-track w-full" />
        </div>
      </motion.div>

      {/* INPUT */}
      <InputBox value={input} onChange={setInput} onSubmit={handleParaphrase}
                placeholder="Enter text to paraphrase..." />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3 mb-5">
        <button onClick={handleParaphrase} disabled={loading} className="action-btn-primary">
          {loading ? "Generating variants..." : "Generate 3 Variants"}
        </button>
        <button onClick={reset} disabled={loading} className="action-btn-secondary">
          Clear
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mb-4"
                    style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(245,200,66,0.04)', border: '1px solid rgba(245,200,66,0.1)' }}>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.span key={i}
                           animate={{ opacity: [0.3, 1, 0.3] }}
                           transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                           style={{ width: 4, height: 4, borderRadius: '50%', background: '#F5C842', display: 'inline-block' }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            Generating 3 variants...
          </span>
        </motion.div>
      )}

      {/* HISTORY — newest entry first */}
      <div className="flex-grow overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {history.map((entry, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
              <HistoryEntry entry={entry} />
              {i < history.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 24 }} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {history.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '32px 0',
            color: 'rgba(255,255,255,0.15)',
            fontSize: 12,
          }}>
            Enter text above to generate variants
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Paraphraser;