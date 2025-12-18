import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { paraphraseText } from "../../api/paraphraser";
import InputBox from "../../components/InputBox";
import OutputBox from "../../components/OutputBox";
import Loading from "../../components/Loading";
import { toast } from "react-hot-toast";

const LS_MESSAGES = "paraphraser_messages";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Paraphraser = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("same");
  const [creativity, setCreativity] = useState(0.3);

  useEffect(() => {
    const saved = localStorage.getItem(LS_MESSAGES);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  const appendMessage = (msg) => {
    setMessages(prev => {
      const next = [...prev, msg];
      localStorage.setItem(LS_MESSAGES, JSON.stringify(next));
      return next;
    });
  };

  const reset = () => {
    setMessages([]);
    localStorage.removeItem(LS_MESSAGES);
    toast.success("Paraphraser session reset");
  };

  const handleParaphrase = async () => {
    if (!input.trim()) {
      toast.error("Please enter text to paraphrase");
      return;
    }

    const userText = input;
    setInput("");

    appendMessage({ sender: "user", text: userText });
    setLoading(true);

    try {
      const res = await paraphraseText({
        text: userText,
        tone,
        length,
        creativity,
      });

      appendMessage({ sender: "ai", text: res.output });
      toast.success("Paraphrase generated");
    } catch {
      appendMessage({ sender: "ai", text: "Error generating paraphrase." });
      toast.error("Failed to generate paraphrase");
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
          Paraphraser
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
        Rewrite text while preserving its original meaning.
        Control tone, length, and creativity to suit different
        writing contexts and professional needs.
      </p>

      {/* CONTROLS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-4 mb-6 text-sm"
      >
        <select
          value={tone}
          onChange={e => setTone(e.target.value)}
          className="px-3 py-2 rounded-lg
                     bg-white/20 border border-white/20
                     text-white focus:outline-none
                     hover:border-orange-500/40 transition"
        >
          <option value="neutral" className="text-black">Neutral</option>
          <option value="formal" className="text-black">Formal</option>
          <option value="casual" className="text-black">Casual</option>
          <option value="professional" className="text-black">Professional</option>
        </select>

        <select
          value={length}
          onChange={e => setLength(e.target.value)}
          className="px-3 py-2 rounded-lg
                     bg-white/20 border border-white/20
                     text-white focus:outline-none
                     hover:border-orange-500/40 transition"
        >
          <option value="same" className="text-black">Same Length</option>
          <option value="shorter" className="text-black">Shorter</option>
          <option value="longer" className="text-black">Longer</option>
        </select>

        <div className="flex items-center gap-3">
          <span className="text-gray-300">Creativity</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={creativity}
            className="accent-orange-500"
            onChange={e => setCreativity(Number(e.target.value))}
          />
          <span className="text-gray-300">{creativity}</span>
        </div>
      </motion.div>

      {/* OUTPUT */}
      <div className="flex-grow overflow-y-auto">
        <OutputBox messages={messages} />
        {loading && <Loading />}
      </div>

      {/* INPUT */}
      <InputBox
        value={input}
        onChange={setInput}
        onSubmit={handleParaphrase}
        placeholder="Enter text to paraphrase..."
      />

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260 }}
          onClick={handleParaphrase}
          disabled={loading}
          className="flex-1 bg-orange-600 px-4 py-2 rounded-lg
                     hover:bg-orange-700 transition disabled:opacity-50"
        >
          Paraphrase
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

export default Paraphraser;
