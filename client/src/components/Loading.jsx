import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center gap-3 py-4 px-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .dot-pulse {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .dot-pulse span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F5C842, #E8A020);
          animation: dotBounce 1.2s ease-in-out infinite;
          display: inline-block;
        }
        .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
        .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="dot-pulse">
        <span /><span /><span />
      </div>

      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 400, letterSpacing: '0.04em' }}>
        Processing…
      </p>
    </div>
  );
};

export default Loading;
