import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets.js";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap');
        
        .font-display { font-family: 'Playfair Display', serif; }
        
        .gold-text {
          background: linear-gradient(135deg, #F5C842 0%, #E8A020 50%, #C97B10 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-glow {
          position: relative;
        }
        .card-glow::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(245,200,66,0.25) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .card-glow:hover::before { opacity: 1; }
        
        .noise-bg::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .nav-link {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, #F5C842, #E8A020);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .step-number {
          background: linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.05));
          border: 1px solid rgba(245,200,66,0.3);
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06]"
           style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(24px)' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <img src={assets.nlpstudio} alt="NLP Studio" className="w-32 sm:w-36" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                      className="flex items-center gap-6 sm:gap-8">
            <Link to="/login" className="nav-link text-sm text-gray-400 hover:text-white transition-colors duration-300 font-medium tracking-wide">
              Sign In
            </Link>
            <Link to="/register"
              className="px-5 py-2.5 text-sm font-semibold rounded-lg text-[#080808] tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #F5C842 0%, #E8A020 100%)' }}>
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-6">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${assets.background})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.9) 100%)' }} />

        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,200,66,0.06) 0%, transparent 70%)' }} />
        </div>

        <motion.div initial="hidden" animate="visible" variants={stagger}
                    className="relative z-10 max-w-5xl text-center">

          <motion.div variants={fadeUp} transition={{ duration: 0.7 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium tracking-widest uppercase"
                      style={{ background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.25)', color: '#F5C842' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5C842', display: 'inline-block' }} />
            AI-Powered Text Intelligence
          </motion.div>

          <motion.h1 variants={fadeUp} transition={{ duration: 0.7 }}
                     className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
            Build. Analyze.
            <span className="block gold-text">Understand Text.</span>
          </motion.h1>

          <motion.p variants={fadeUp} transition={{ duration: 0.7 }}
                    className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            NLP-Studio is a professional AI workspace for chatting with knowledge bases,
            rewriting content, and extracting deep insights — all in one refined dashboard.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register"
              className="px-8 py-3.5 text-sm font-semibold rounded-lg text-[#080808] tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #F5C842 0%, #E8A020 100%)' }}>
              Start for Free →
            </Link>
            <Link to="/login"
              className="px-8 py-3.5 text-sm font-medium rounded-lg text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                      className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                      style={{ color: '#F5C842' }}>
              Core Tools
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-bold mb-5">
              What NLP-Studio Offers
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed font-light">
              A carefully crafted suite of AI-powered tools designed to help you write better,
              understand text deeply, and interact with information intelligently.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "AI Chatbot",
                icon: "◈",
                desc: "Chat intelligently with documents and knowledge bases using context-aware AI responses powered by RAG.",
              },
              {
                title: "Paraphraser",
                icon: "◇",
                desc: "Rewrite and refine text professionally while preserving intent, improving clarity and adapting tone.",
              },
              {
                title: "Text Analytics",
                icon: "◉",
                desc: "Extract sentiment, keywords, readability scores, and actionable insights for data-driven decisions.",
              },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                          transition={{ delay: i * 0.12 }} whileHover={{ y: -6 }}
                          className="card-glow group rounded-2xl p-8 cursor-default"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-xl font-bold"
                     style={{ background: 'rgba(245,200,66,0.1)', color: '#F5C842', border: '1px solid rgba(245,200,66,0.2)' }}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-amber-300 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${assets.background})` }} />
        <div className="absolute inset-0" style={{ background: 'rgba(8,8,8,0.88)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                      className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                      style={{ color: '#F5C842' }}>
              Workflow
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-bold">
              How It Works
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Content", desc: "Upload documents or paste text you want to work with — PDFs, articles, or raw input." },
              { step: "02", title: "Ask or Analyze", desc: "Chat, paraphrase, or deep-analyze content in real time with precision AI tools." },
              { step: "03", title: "Get Insights", desc: "Receive accurate answers, polished rewrites, and actionable insights instantly." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                          transition={{ delay: i * 0.12 }} whileHover={{ y: -6 }}
                          className="card-glow group rounded-2xl p-8 cursor-default"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                <div className="step-number w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <span className="font-display text-2xl font-bold gold-text">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                      className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                      style={{ color: '#F5C842' }}>
              Audience
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-bold mb-5">
              Who Is NLP-Studio For?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed font-light">
              Built as a learning-first, practice-oriented AI platform for those who value clarity and deep insight.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Students",
                tag: "Learning",
                text: "Explore modern NLP systems through hands-on interaction using chat, paraphrasing, and analytics tools.",
              },
              {
                title: "Developers",
                tag: "Building",
                text: "Understand how AI-powered text tools fit into real full-stack applications with clean, well-structured UI.",
              },
              {
                title: "Content Creators",
                tag: "Creating",
                text: "Practice rewriting and analyzing content while learning how NLP assists real-world writing workflows.",
              },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                          transition={{ delay: i * 0.12 }} whileHover={{ y: -6 }}
                          className="card-glow group rounded-2xl p-8"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5 inline-block"
                      style={{ background: 'rgba(245,200,66,0.08)', color: '#E8A020', border: '1px solid rgba(245,200,66,0.2)' }}>
                  {item.tag}
                </span>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-300 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6"
               style={{ background: 'linear-gradient(135deg, rgba(245,200,66,0.08) 0%, rgba(8,8,8,0) 60%)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="max-w-3xl mx-auto text-center"
                    style={{ border: '1px solid rgba(245,200,66,0.15)', borderRadius: '24px', padding: '64px 48px', background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#F5C842' }}>Ready to begin?</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5">Start using NLP-Studio today</h2>
          <p className="text-gray-500 mb-10 font-light">Free to use. No credit card required.</p>
          <Link to="/register"
            className="inline-block px-10 py-4 text-sm font-semibold rounded-lg text-[#080808] tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #F5C842 0%, #E8A020 100%)' }}>
            Create Your Free Account →
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${assets.background})` }} />
        <div className="absolute inset-0" style={{ background: 'rgba(8,8,8,0.92)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img src={assets.nlpstudio} alt="NLP Studio" className="w-28 mb-5 opacity-80" />
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm font-light">
              A modern AI-powered text platform built for students, developers,
              researchers, and content creators who value clarity and insight.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#F5C842' }}>Connect</p>
            <div className="flex flex-wrap md:justify-end gap-5">
              {[
                { href: "https://github.com/Abhinav-Marlingaplar", src: assets.githubIcon, label: "GitHub" },
                { href: "https://www.linkedin.com/in/abhinav-marlingaplar1/", src: assets.linkedinIcon, label: "LinkedIn" },
                { href: "mailto:abhinav123@gmail.com", src: assets.emailIcon, label: "Email" },
              ].map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                   className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                   style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={link.src} className="w-5 opacity-70 hover:opacity-100 transition-opacity" alt={link.label} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t text-center py-6 text-xs text-gray-700 font-light tracking-wide"
             style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          © {new Date().getFullYear()} NLP-Studio — Designed & Developed by Abhinav Marlingaplar
        </div>
      </footer>
    </div>
  );
};

export default Landing;
