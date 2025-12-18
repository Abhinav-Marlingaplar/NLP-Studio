import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets.js";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white overflow-hidden">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 
                flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={assets.nlpstudio} alt="logo" className="w-32 sm:w-40" />

          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/login" className="text-gray-300 hover:text-orange-500 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 hover:opacity-90 transition shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-[75vh] flex items-center justify-center 
             px-4 sm:px-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.background})` }}
      >

        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Build, Analyze & Chat with
            <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              AI-Powered Text
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300">
            NLP-Studio is a professional AI workspace for chatting with knowledge bases,
            rewriting content, and extracting deep insights — all in one clean dashboard.
          </p>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-4xl font-bold text-center mb-6"
          >
            What NLP-Studio Offers
          </motion.h2>

          <p className="text-center max-w-3xl mx-auto text-gray-400 mb-10">
            A carefully crafted suite of AI-powered tools designed to help you write better,
            understand text deeply, and interact with information intelligently.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {["AI Chatbot", "Paraphraser", "Text Analytics"].map((title, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 260 }}
                className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1A1A1A] to-[#111]
                           border border-white/10 hover:border-orange-500/40 transition"
              >
                <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-hover:opacity-100 transition" />

                <h3 className="relative text-xl sm:text-2xl font-semibold text-orange-500 mb-4">
                  {title}
                </h3>

                <p className="relative text-gray-300 leading-relaxed text-sm sm:text-base">
                  {title === "AI Chatbot" &&
                    "Chat intelligently with documents and knowledge bases using context-aware AI responses."}
                  {title === "Paraphraser" &&
                    "Rewrite and refine text professionally while preserving intent and improving clarity."}
                  {title === "Text Analytics" &&
                    "Extract sentiment, keywords, readability, and insights for data-driven decisions."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      {/* HOW IT WORKS */}
      <section
        className="relative py-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.background})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-4xl font-bold text-center mb-10"
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {["Upload Content", "Ask or Analyze", "Get Insights"].map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 backdrop-blur-xl
                     border border-white/20
                     rounded-2xl p-8"
              >
                <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center
                          rounded-full bg-orange-600/20 text-orange-500
                          text-2xl font-bold">
                  {i + 1}
                </div>

                <h3 className="text-xl font-semibold mb-3">{step}</h3>
                <p className="text-gray-300">
                  {i === 0 && "Upload documents or enter text you want to work with."}
                  {i === 1 && "Chat, paraphrase, or analyze content in real time."}
                  {i === 2 && "Receive accurate answers and actionable insights instantly."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* USE CASES */}
      <section className="py-16 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-4xl font-bold text-center mb-6"
          >
            Who Is NLP-Studio For?
          </motion.h2>

          <p className="text-center max-w-3xl mx-auto text-gray-400 mb-10">
            NLP-Studio is built as a learning-first, practice-oriented AI platform
            to help different users understand and work with NLP tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Students",
                text:
                  "Explore modern NLP systems through hands-on interaction using chat, paraphrasing, and analytics tools.",
              },
              {
                title: "Developers",
                text:
                  "Understand how AI-powered text tools fit into real full-stack applications with clean UI design.",
              },
              {
                title: "Content Creators",
                text:
                  "Practice rewriting and analyzing content while learning how NLP assists real-world writing workflows.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 260 }}
                className="group relative p-8 rounded-2xl bg-gradient-to-b from-[#1A1A1A] to-[#111]
                           border border-white/10 hover:border-orange-500/40 transition"
              >
                <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-hover:opacity-100 transition" />

                <h3 className="relative text-xl font-semibold text-orange-500 mb-3">
                  {item.title}
                </h3>
                <p className="relative text-gray-300 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      {/* FOOTER */}
      <footer
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.background})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80" />

        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16
               grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div>
            <h4 className="text-orange-500 font-semibold mb-4">
              About NLP-Studio
            </h4>
            <p className="text-gray-400 leading-relaxed">
              A modern AI-powered text platform built for students, developers,
              researchers, and content creators who value clarity and insight.
            </p>
          </div>

          <div className="md:text-right">
            <h4 className="text-orange-500 font-semibold mb-4">
              Connect
            </h4>
            <div className="flex flex-wrap md:justify-end gap-6">
              <a
                href="https://github.com/Abhinav-Marlingaplar"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={assets.githubIcon}
                  className="w-8 sm:w-9 opacity-70 hover:opacity-100 transition"
                />
              </a>

              <a
                href="https://www.linkedin.com/in/abhinav-marlingaplar1/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={assets.linkedinIcon}
                  className="w-8 sm:w-9 opacity-70 hover:opacity-100 transition"
                />
              </a>

              <a href="mailto:abhinav123@gmail.com">
                <img
                  src={assets.emailIcon}
                  className="w-8 sm:w-9 opacity-70 hover:opacity-100 transition"
                />
              </a>
            </div>
          </div>
        </div>

        <div
          className="relative z-10 border-t border-white/10
               text-center py-6 text-gray-500
               text-xs sm:text-sm px-4"
        >
          © {new Date().getFullYear()} NLP-Studio — Designed & Developed by Abhinav Marlingaplar
        </div>
      </footer>

    </div>
  );
};

export default Landing;
