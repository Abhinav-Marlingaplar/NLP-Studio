import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: "⬡" },
  { to: "/app/chatbot",   label: "AI Chatbot",  icon: "◈" },
  { to: "/app/paraphraser", label: "Paraphraser", icon: "◇" },
  { to: "/app/analytics", label: "Text Analytics", icon: "◉" },
];

const Layout = () => {
  return (
    <div className="flex min-h-screen text-white" style={{ fontFamily: "'DM Sans', sans-serif", background: '#080808' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap');

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
          text-decoration: none;
          position: relative;
        }
        .sidebar-link:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }
        .sidebar-link.active {
          color: #F5C842;
          background: rgba(245,200,66,0.08);
          border: 1px solid rgba(245,200,66,0.18);
        }
        .sidebar-link .icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.05);
          transition: all 0.2s ease;
        }
        .sidebar-link.active .icon {
          background: rgba(245,200,66,0.15);
          color: #F5C842;
        }
        .sidebar-link:hover .icon {
          background: rgba(255,255,255,0.08);
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col py-8 px-4"
             style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>

        <Link to="/app/dashboard" className="flex justify-center mb-10 px-2">
          <img src={assets.nlpstudio} alt="logo" className="w-28 opacity-80 hover:opacity-100 transition-opacity" />
        </Link>

        {/* Nav label */}
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase px-3 mb-3"
           style={{ color: 'rgba(255,255,255,0.25)' }}>
          Navigation
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
                     className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom decorative line */}
        <div className="mt-auto pt-8">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
          <p className="text-[10px] text-center mt-4 font-light" style={{ color: 'rgba(255,255,255,0.2)' }}>
            NLP-Studio v1.0
          </p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex flex-col flex-1 relative overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
             style={{ backgroundImage: `url(${assets.background})` }} />
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.97) 100%)' }} />

        {/* PAGE CONTENT */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>

        {/* FOOTER */}
        <footer className="relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3"
               style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
            <p>
              © {new Date().getFullYear()}{" "}
              <span style={{ color: '#E8A020' }}>NLP Studio</span>
              {" "}— Built by Abhinav Marlingaplar
            </p>
            <div className="flex gap-6">
              {[
                { href: "https://github.com/Abhinav-Marlingaplar", label: "GitHub" },
                { href: "https://www.linkedin.com/in/abhinav-marlingaplar1/", label: "LinkedIn" },
                { href: "mailto:abhinav123@gmail.com", label: "Mail" },
              ].map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                   className="hover:text-amber-400 transition-colors duration-200">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
