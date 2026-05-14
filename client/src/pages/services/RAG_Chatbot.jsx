import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { sendChatMessage } from "../../api/chat";
import { uploadFilesForIndexing } from "../../api/upload";
import InputBox from "../../components/InputBox";
import FileUpload from "../../components/FileUpload";
import Loading from "../../components/Loading";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const RAG_Chatbot = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?.id;
  const chatEndRef = useRef(null); // 👈 auto-scroll to latest message

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [turnCount, setTurnCount] = useState(0); // 👈 track conversation turns

  const SESSION_KEY = useMemo(() => userId ? `rag_session_id_${userId}` : null, [userId]);

  useEffect(() => {
    if (!userId) return;
    const urlSession = new URLSearchParams(location.search).get("session");
    if (urlSession) {
      setSessionId(urlSession);
    } else {
      const newSession = crypto.randomUUID();
      setSessionId(newSession);
    }
  }, [location.search, userId]);

  const LS_MESSAGES = useMemo(
    () => (userId && sessionId) ? `rag_messages_${userId}_${sessionId}` : null,
    [userId, sessionId]
  );

  useEffect(() => {
    if (!LS_MESSAGES) return;
    const urlSession = new URLSearchParams(location.search).get("session");
    if (!urlSession) { setMessages([]); setTurnCount(0); return; }
    const saved = localStorage.getItem(LS_MESSAGES);
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
      // Restore turn count from saved messages
      setTurnCount(parsed.filter(m => m.sender === "user").length);
    }
  }, [LS_MESSAGES]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const appendMessage = (msg) => {
    setMessages(prev => {
      const next = [...prev, msg];
      if (LS_MESSAGES) localStorage.setItem(LS_MESSAGES, JSON.stringify(next));
      return next;
    });
  };

  const resetSession = () => {
    if (LS_MESSAGES) localStorage.removeItem(LS_MESSAGES);
    if (SESSION_KEY) localStorage.removeItem(SESSION_KEY);
    const newSession = crypto.randomUUID();
    setSessionId(newSession);
    setMessages([]);
    setAttachedFiles([]);
    setTurnCount(0);
    toast.success("Session reset");
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return toast.error("Please enter a message");
    if (uploading) return toast.loading("Indexing in progress…");
    if (!sessionId) return toast.error("Upload documents first");

    const userText = input;
    setInput("");
    appendMessage({ sender: "user", text: userText });
    setLoading(true);

    try {
      const res = await sendChatMessage({ message: userText, sessionId });
      appendMessage({
        sender: "ai",
        text: res.reply,
        sources: res.sources || []  // 👈 attach sources to message
      });
      setTurnCount(prev => prev + 1); // 👈 increment turn counter
    } catch {
      appendMessage({ sender: "ai", text: "Error contacting chatbot.", sources: [] });
    }
    setLoading(false);
  };

  const handleFilesSelect = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    toast.loading("Uploading & indexing…", { id: "upload" });
    appendMessage({ sender: "system", text: `Uploading ${files.length} document(s)...` });

    try {
      const res = await uploadFilesForIndexing(files);
      setSessionId(res.sessionId);
      if (SESSION_KEY) localStorage.setItem(SESSION_KEY, res.sessionId);
      setAttachedFiles(files.map(f => f.name));
      toast.success("Documents indexed", { id: "upload" });
      appendMessage({ sender: "system", text: "Documents indexed successfully. You can now ask questions." });
    } catch {
      toast.error("Indexing failed", { id: "upload" });
    }
    setUploading(false);
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
        .chat-bubble-user {
          background: linear-gradient(135deg, rgba(245,200,66,0.15), rgba(232,160,32,0.1));
          border: 1px solid rgba(245,200,66,0.2);
          border-radius: 16px 16px 4px 16px;
          padding: 12px 16px;
          max-width: 80%;
          margin-left: auto;
          color: rgba(255,255,255,0.9);
          font-size: 13px;
          line-height: 1.6;
        }
        .chat-bubble-ai {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px 16px 16px 4px;
          padding: 12px 16px;
          max-width: 85%;
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          line-height: 1.7;
        }
        .chat-bubble-system {
          background: rgba(245,200,66,0.04);
          border: 1px solid rgba(245,200,66,0.1);
          border-radius: 10px;
          padding: 8px 14px;
          color: rgba(245,200,66,0.6);
          font-size: 11px;
          text-align: center;
          margin: 4px auto;
        }
        .source-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(245,200,66,0.08);
          border: 1px solid rgba(245,200,66,0.15);
          color: rgba(245,200,66,0.7);
          font-size: 10px;
          font-weight: 500;
          margin-top: 8px;
          margin-right: 4px;
        }
        .memory-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(245,200,66,0.06);
          border: 1px solid rgba(245,200,66,0.12);
          color: rgba(245,200,66,0.5);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
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
          <h2 className="font-display text-2xl font-bold gold-text">AI Chatbot</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* ✅ Memory indicator — shows user context is being retained */}
          {turnCount > 0 && (
            <div className="memory-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5C842', display: 'inline-block' }} />
              {turnCount} turn{turnCount !== 1 ? 's' : ''} in memory
            </div>
          )}
          <Link to="/app/dashboard"
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <p className="text-xs leading-relaxed mb-5 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Ask intelligent questions over your uploaded documents using Retrieval-Augmented Generation.
        Ideal for document-based Q&A, research, and knowledge exploration.
      </p>

      <FileUpload onFilesSelect={handleFilesSelect} />

      {attachedFiles.length > 0 && (
        <div className="mt-3 p-3 rounded-xl text-xs font-light"
             style={{ background: 'rgba(245,200,66,0.05)', border: '1px solid rgba(245,200,66,0.15)', color: 'rgba(255,255,255,0.6)' }}>
          <span className="font-semibold" style={{ color: '#F5C842' }}>Indexed:</span>{" "}
          {attachedFiles.join(", ")}
        </div>
      )}

      {/* ✅ Custom chat renderer replacing OutputBox */}
      <div className="flex-grow overflow-y-auto mt-5 space-y-3 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : msg.sender === 'system' ? 'items-center' : 'items-start'}`}>

              {/* Sender label */}
              {msg.sender !== 'system' && (
                <span className="text-[10px] font-semibold tracking-widest uppercase mb-1 px-1"
                      style={{ color: msg.sender === 'user' ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.25)' }}>
                  {msg.sender === 'user' ? 'You' : 'NLP Studio'}
                </span>
              )}

              {/* Bubble */}
              <div className={
                msg.sender === 'user' ? 'chat-bubble-user' :
                msg.sender === 'system' ? 'chat-bubble-system' :
                'chat-bubble-ai'
              }>
                {msg.text}

                {/* ✅ Source tags under AI messages */}
                {msg.sender === 'ai' && msg.sources?.length > 0 && (
                  <div className="flex flex-wrap mt-2">
                    {msg.sources.map((src, j) => (
                      <span key={j} className="source-tag">
                        ◈ {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {(loading || uploading) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-start gap-2">
            <div className="chat-bubble-ai flex items-center gap-2">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Thinking</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.span key={i}
                               animate={{ opacity: [0.3, 1, 0.3] }}
                               transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                               style={{ width: 4, height: 4, borderRadius: '50%', background: '#F5C842', display: 'inline-block' }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      <InputBox value={input} onChange={setInput} onSubmit={handleSendMessage}
                disabled={loading || uploading || !sessionId}
                placeholder="Ask a question about your documents…" />

      <div className="flex gap-2 mt-3">
        <button onClick={handleSendMessage} className="action-btn-primary"
                disabled={loading || uploading || !sessionId}>
          Send Message
        </button>
        <button onClick={resetSession} className="action-btn-secondary">
          New Session
        </button>
      </div>
    </motion.div>
  );
};

export default RAG_Chatbot;