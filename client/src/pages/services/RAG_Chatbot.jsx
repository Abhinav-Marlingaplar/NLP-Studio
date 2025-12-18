import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const urlSession = new URLSearchParams(location.search).get("session");
    let s = urlSession || localStorage.getItem("rag_session_id");
    if (!s) s = crypto.randomUUID();
    setSessionId(s);
    localStorage.setItem("rag_session_id", s);
  }, [location.search]);

  const LS_MESSAGES = useMemo(
    () => (sessionId ? `rag_messages_${sessionId}` : null),
    [sessionId]
  );

  useEffect(() => {
    if (!LS_MESSAGES) return;
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
    localStorage.removeItem("rag_session_id");
    setMessages([]);
    setSessionId(null);
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

    appendMessage({
      sender: "system",
      text: `Uploading ${files.length} document(s)...`,
    });

    try {
      const res = await uploadFilesForIndexing(files);
      setSessionId(res.sessionId);
      localStorage.setItem("rag_session_id", res.sessionId);
      setAttachedFiles(files.map(f => f.name));

      toast.success("Documents indexed", { id: "upload" });
      appendMessage({
        sender: "system",
        text: "Documents indexed successfully. You can now ask questions.",
      });
    } catch {
      toast.error("Indexing failed", { id: "upload" });
    }
    setUploading(false);
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
          AI Chatbot (RAG)
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
        Ask intelligent questions over your uploaded documents using
        Retrieval-Augmented Generation. Ideal for document-based Q&A,
        research, and knowledge exploration.
      </p>

      {/* FILE UPLOAD */}
      <FileUpload onFilesSelect={handleFilesSelect} />

      {/* ATTACHED FILES */}
      {attachedFiles.length > 0 && (
        <div className="mt-3 text-sm text-gray-300">
          <strong>Attached documents:</strong>
          <ul className="list-disc ml-5 mt-1">
            {attachedFiles.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CHAT OUTPUT */}
      <div className="flex-grow overflow-y-auto mt-6">
        <OutputBox messages={messages} />
        {(loading || uploading) && <Loading />}
      </div>

      {/* INPUT */}
      <InputBox
        value={input}
        onChange={setInput}
        onSubmit={handleSendMessage}
        disabled={loading || uploading || !sessionId}
        placeholder="Ask a question about your documents…"
      />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260 }}
          onClick={handleSendMessage}
          className="flex-1 bg-orange-600 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          Send
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260 }}
          onClick={resetSession}
          className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition"
        >
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RAG_Chatbot;
