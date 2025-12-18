import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-white">

      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 shrink-0
                 bg-black/60 backdrop-blur-xl
                 border-r border-white/10 flex-col p-6">
        <Link
          to="/app/dashboard"
          className="mb-10 flex justify-center transition-transform hover:scale-105"
        >
          <img src={assets.nlpstudio} alt="logo" className="w-36" />
        </Link>

        <nav className="flex flex-col space-y-2">
          {[
            { to: "/app/dashboard", label: "Dashboard" },
            { to: "/app/chatbot", label: "AI Chatbot" },
            { to: "/app/paraphraser", label: "Paraphraser" },
            { to: "/app/analytics", label: "Text Analytics" },
          ].map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all
                 ${
                   isActive
                     ? "bg-orange-600 shadow-lg shadow-orange-600/20"
                     : "hover:bg-white/10"
                 }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex flex-col flex-1 relative overflow-hidden">

        {/* BACKGROUND */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${assets.background})` }}
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* PAGE CONTENT */}
        <div className="relative z-10 flex-1 overflow-y-auto
                p-4 sm:p-6 md:p-10">
          <Outlet />
        </div>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4
                flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="text-orange-500 font-semibold">NLP Studio</span>{" "}
              — Built by Abhinav Marlingaplar
            </p>

            <div className="flex gap-6">
              <a
                href="https://github.com/Abhinav-Marlingaplar"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/abhinav-marlingaplar1/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition"
              >
                LinkedIn
              </a>
              <a
                href="mailto:abhinav123@gmail.com"
                className="hover:text-orange-400 transition"
              >
                Mail
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
