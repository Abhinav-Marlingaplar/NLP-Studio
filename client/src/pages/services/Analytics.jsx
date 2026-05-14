import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeText } from "../../api/analytics";
import { useAuth } from "../../context/AuthContext";
import InputBox from "../../components/InputBox";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Sentiment color mapping
const sentimentColor = (s) => {
  if (!s) return 'rgba(255,255,255,0.4)';
  const val = s.toLowerCase();
  if (val === 'positive') return '#4ade80';
  if (val === 'negative') return '#f87171';
  if (val === 'mixed') return '#F5C842';
  return 'rgba(255,255,255,0.5)';
};

const severityColor = (s) => {
  if (!s) return 'rgba(255,255,255,0.3)';
  const val = s.toLowerCase();
  if (val === 'high') return '#f87171';
  if (val === 'medium') return '#F5C842';
  return '#4ade80';
};

const priorityColor = (p) => {
  if (!p) return 'rgba(255,255,255,0.3)';
  const val = p.toLowerCase();
  if (val === 'high') return '#f87171';
  if (val === 'medium') return '#F5C842';
  return '#4ade80';
};

// Small badge component
const Badge = ({ label, color }) => (
  <span style={{
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '2px 7px',
    borderRadius: 4,
    background: `${color}18`,
    border: `1px solid ${color}40`,
    color,
  }}>
    {label}
  </span>
);

// Score bar — for confidence and urgency
const ScoreBar = ({ value, max = 1, color = '#F5C842' }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1,
        height: 3,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 2, background: color }}
        />
      </div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', minWidth: 28 }}>
        {pct}%
      </span>
    </div>
  );
};

// Collapsible section
const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)',
      marginBottom: 8,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {title}
        </span>
        <span style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.2)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          display: 'inline-block',
        }}>
          v
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ padding: '0 14px 14px' }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Full report renderer
const AnalyticsReport = ({ res, originalText }) => {
  const npsColor = res.npsEstimate > 30 ? '#4ade80' : res.npsEstimate < -30 ? '#f87171' : '#F5C842';

  return (
    <div style={{ marginBottom: 24 }}>

      {/* Original text */}
      <div style={{
        borderRadius: 10,
        border: '1px solid rgba(245,200,66,0.12)',
        background: 'rgba(245,200,66,0.03)',
        padding: '10px 14px',
        marginBottom: 12,
      }}>
        <p style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(245,200,66,0.4)',
          marginBottom: 6,
        }}>
          Analyzed Text
        </p>
        <p style={{
          fontSize: 12, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.45)', margin: 0,
          fontStyle: 'italic',
        }}>
          "{originalText.slice(0, 120)}{originalText.length > 120 ? '...' : ''}"
        </p>
      </div>

      {/* Score strip — top-level metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginBottom: 12,
      }}>

        {/* Sentiment */}
        <div style={{
          borderRadius: 10,
          border: `1px solid ${sentimentColor(res.overallSentiment)}30`,
          background: `${sentimentColor(res.overallSentiment)}08`,
          padding: '10px 12px',
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>
            Sentiment
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: sentimentColor(res.overallSentiment), margin: '0 0 6px' }}>
            {res.overallSentiment}
          </p>
          <ScoreBar value={res.confidence ?? 0} max={1} color={sentimentColor(res.overallSentiment)} />
        </div>

        {/* Urgency */}
        <div style={{
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          padding: '10px 12px',
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>
            Urgency
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: severityColor(res.urgencyScore > 6 ? 'high' : res.urgencyScore > 3 ? 'medium' : 'low'), margin: '0 0 6px' }}>
            {res.urgencyScore ?? 0} / 10
          </p>
          <ScoreBar value={res.urgencyScore ?? 0} max={10} color={severityColor(res.urgencyScore > 6 ? 'high' : res.urgencyScore > 3 ? 'medium' : 'low')} />
        </div>

        {/* NPS */}
        <div style={{
          borderRadius: 10,
          border: `1px solid ${npsColor}30`,
          background: `${npsColor}08`,
          padding: '10px 12px',
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>
            NPS Estimate
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: npsColor, margin: '0 0 6px' }}>
            {res.npsEstimate > 0 ? '+' : ''}{res.npsEstimate ?? 0}
          </p>
          <ScoreBar value={res.npsEstimate + 100} max={200} color={npsColor} />
        </div>
      </div>

      {/* Summary */}
      <div style={{
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        padding: '12px 14px',
        marginBottom: 8,
      }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
          Executive Summary
        </p>
        <p style={{ fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          {res.summary}
        </p>
      </div>

      {/* Aspects */}
      {res.aspects?.length > 0 && (
        <Section title="Aspect Analysis">
          {res.aspects.map((a, i) => (
            <div key={i} style={{
              padding: '10px 0',
              borderBottom: i < res.aspects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{a.aspect}</span>
                <Badge label={a.sentiment} color={sentimentColor(a.sentiment)} />
                <Badge label={a.severity} color={severityColor(a.severity)} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>
                  {Math.round((a.confidence ?? 0) * 100)}% confidence
                </span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                {a.analysis}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Issues */}
      {res.keyIssues?.length > 0 && (
        <Section title="Key Issues">
          {res.keyIssues.map((issue, i) => (
            <div key={i} style={{
              padding: '10px 0',
              borderBottom: i < res.keyIssues.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{issue.issue}</span>
                <Badge label={issue.severity} color={severityColor(issue.severity)} />
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                {issue.impact}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Strengths */}
      {res.strengths?.length > 0 && (
        <Section title="Strengths">
          {res.strengths.map((s, i) => (
            <div key={i} style={{
              padding: '10px 0',
              borderBottom: i < res.strengths.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{s.point}</p>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{s.explanation}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Risks */}
      {res.risks?.length > 0 && (
        <Section title="Potential Risks">
          {res.risks.map((r, i) => (
            <div key={i} style={{
              padding: '10px 0',
              borderBottom: i < res.risks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#f87171', marginBottom: 4 }}>{r.risk}</p>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{r.reason}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Recommendations */}
      {res.recommendations?.length > 0 && (
        <Section title="Recommendations" defaultOpen={true}>
          {res.recommendations.map((r, i) => (
            <div key={i} style={{
              padding: '10px 0',
              borderBottom: i < res.recommendations.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{r.action}</span>
                <Badge label={`${r.priority} priority`} color={priorityColor(r.priority)} />
                <Badge label={`${r.effort} effort`} color="rgba(255,255,255,0.3)" />
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                {r.justification}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Evidence */}
      {res.evidence?.length > 0 && (
        <Section title="Supporting Evidence">
          {res.evidence.map((e, i) => (
            <p key={i} style={{
              fontSize: 12, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.35)',
              fontStyle: 'italic',
              padding: '6px 0',
              borderBottom: i < res.evidence.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              margin: 0,
            }}>
              "{e}"
            </p>
          ))}
        </Section>
      )}
    </div>
  );
};

const Analytics = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const LS_KEY = useMemo(
    () => userId ? `analytics_history_${userId}` : null,
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
    toast.success("Analysis history cleared");
  };

  const handleAnalyze = async () => {
    if (!input.trim()) { toast.error("Please enter text to analyze"); return; }
    const userText = input;
    setInput("");
    setLoading(true);

    try {
      const res = await analyzeText({ text: userText });
      const entry = { original: userText, result: res };
      const updated = [entry, ...history];
      setHistory(updated);
      saveHistory(updated);
      toast.success("Analysis complete");
    } catch {
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
      `}</style>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1"
             style={{ color: 'rgba(245,200,66,0.7)' }}>Tool</p>
          <h2 className="font-display text-2xl font-bold gold-text">Text Analytics</h2>
        </div>
        <Link to="/app/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          Dashboard
        </Link>
      </div>

      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <p className="text-xs leading-relaxed mb-5 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Perform deep analysis of textual content to extract sentiment, urgency, NPS estimate,
        strengths, risks, and prioritised recommendations.
      </p>

      {/* INPUT */}
      <InputBox value={input} onChange={setInput} onSubmit={handleAnalyze}
                placeholder="Enter text to analyze..." />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3 mb-5">
        <button onClick={handleAnalyze} disabled={loading} className="action-btn-primary">
          {loading ? "Analyzing..." : "Analyze Text"}
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
            Running deep analysis...
          </span>
        </motion.div>
      )}

      {/* REPORTS — newest first */}
      <div className="flex-grow overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {history.map((entry, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
              <AnalyticsReport res={entry.result} originalText={entry.original} />
              {i < history.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 24 }} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {history.length === 0 && !loading && (
          <div style={{
            textAlign: 'center', padding: '32px 0',
            color: 'rgba(255,255,255,0.15)', fontSize: 12,
          }}>
            Enter text above to run analysis
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Analytics;