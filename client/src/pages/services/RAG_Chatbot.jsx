import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";   // 👈 import auth
import { sendChatMessage } from "../../api/chat";
import { uploadFilesForIndexing } from "../../api/upload";
import InputBox from "../../components/InputBox";
import OutputBox from "../../components/OutputBox";
import FileUpload from "../../components/FileUpload";
import Loading from "../../components/Loading";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const RAG_Chatbot = () => {
  const location = useLocation();
  const { user } = useAuth();                          // 👈 get current user
  const userId = user?.id;                             // 👈 scope key to this user

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ All keys now scoped to userId — different users never collide
  const SESSION_KEY = useMemo(() => userId ? `rag_session_id_${userId}` : null, [userId]);

  useEffect(() => {
    if (!userId) return;                               // 👈 wait until user is known

    const urlSession = new URLSearchParams(location.search).get("session");

    // If coming from dashboard history click — use that sessionId
    // If opening fresh from tool card — start a new session, don't load old one
    if (urlSession) {
      setSessionId(urlSession);
    } else {
      // Fresh open — generate new session, don't load previous user's session
      const newSession = crypto.randomUUID();
      setSessionId(newSession);
    }
  }, [location.search, userId]);                      // 👈 re-run if user changes

  // ✅ Message key scoped to both userId AND sessionId
  const LS_MESSAGES = useMemo(
    () => (userId && sessionId) ? `rag_messages_${userId}_${sessionId}` : null,
    [userId, sessionId]
  );

  useEffect(() => {
    if (!LS_MESSAGES) return;

    const urlSession = new URLSearchParams(location.search).get("session");

    // ✅ Only load saved messages if user explicitly clicked a history item
    // Fresh tool card open = empty chat always
    if (!urlSession) {
      setMessages([]);
      return;
    }

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

  const resetSession = () => {
    if (LS_MESSAGES) localStorage.removeItem(LS_MESSAGES);
    if (SESSION_KEY) localStorage.removeItem(SESSION_KEY);
    const newSession = crypto.randomUUID();
    setSessionId(newSession);
    setMessages([]);
    setAttachedFiles([]);
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
      appendMessage({ sender: "ai", text: res.reply });
    } catch {
      appendMessage({ sender: "ai", text: "Error contacting chatbot." });
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
      // ✅ Save new sessionId scoped to this user
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
          <h2 className="font-display text-2xl font-bold gold-text">AI Chatbot</h2>
        </div>
        <Link to="/app/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          ← Dashboard
        </Link>
      </div>

      {/* DIVIDER */}
      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* DESCRIPTION */}
      <p className="text-xs leading-relaxed mb-5 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Ask intelligent questions over your uploaded documents using Retrieval-Augmented Generation.
        Ideal for document-based Q&A, research, and knowledge exploration.
      </p>

      {/* FILE UPLOAD */}
      <FileUpload onFilesSelect={handleFilesSelect} />

      {/* ATTACHED FILES */}
      {attachedFiles.length > 0 && (
        <div className="mt-3 p-3 rounded-xl text-xs font-light"
             style={{ background: 'rgba(245,200,66,0.05)', border: '1px solid rgba(245,200,66,0.15)', color: 'rgba(255,255,255,0.6)' }}>
          <span className="font-semibold" style={{ color: '#F5C842' }}>Indexed:</span>{" "}
          {attachedFiles.join(", ")}
        </div>
      )}

      {/* CHAT OUTPUT */}
      <div className="flex-grow overflow-y-auto mt-5">
        <OutputBox messages={messages} icon="◈" />
        {(loading || uploading) && <Loading />}
      </div>

      {/* INPUT */}
      <InputBox value={input} onChange={setInput} onSubmit={handleSendMessage}
                disabled={loading || uploading || !sessionId}
                placeholder="Ask a question about your documents…" />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">
        <button onClick={handleSendMessage} className="action-btn-primary"
                disabled={loading || uploading || !sessionId}>
          Send Message
        </button>
        <button onClick={resetSession} className="action-btn-secondary">
          Reset
        </button>
      </div>
    </motion.div>
  );
};

export default RAG_Chatbot;
