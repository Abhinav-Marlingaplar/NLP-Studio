import React from "react";
import ReactMarkdown from "react-markdown";

const OutputBox = ({ messages = [], icon = "◈" }) => {
  return (
    <div className="space-y-3 max-w-full overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .msg-user {
          margin-left: auto;
          max-width: 72%;
          padding: 12px 16px;
          border-radius: 16px 16px 4px 16px;
          background: rgba(245,200,66,0.1);
          border: 1px solid rgba(245,200,66,0.22);
          color: rgba(255,255,255,0.9);
          font-size: 13.5px;
          line-height: 1.65;
        }
        .msg-ai {
          max-width: 72%;
          padding: 12px 16px;
          border-radius: 16px 16px 16px 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.8);
          font-size: 13.5px;
          line-height: 1.65;
        }
        .msg-system {
          max-width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.35);
          font-size: 12px;
          text-align: center;
          letter-spacing: 0.01em;
        }
        .msg-ai p, .msg-user p { margin: 0 0 6px 0; }
        .msg-ai p:last-child, .msg-user p:last-child { margin: 0; }
        .msg-ai strong, .msg-user strong { color: #F5C842; font-weight: 600; }
        .msg-ai ul, .msg-ai ol { padding-left: 18px; margin: 6px 0; }
        .msg-ai li { margin: 3px 0; }
        .msg-ai code {
          background: rgba(255,255,255,0.07);
          padding: 1px 6px;
          border-radius: 5px;
          font-size: 12px;
          color: #F5C842;
        }
        .sender-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          gap: 10px;
        }
        .empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(245,200,66,0.07);
          border: 1px solid rgba(245,200,66,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 4px;
        }
      `}</style>

      {messages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">{icon}</div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>
            No messages yet
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', fontWeight: 300 }}>
            Output will appear here
          </p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={index}>
          {msg.sender === "user" && (
            <div>
              <p className="sender-label" style={{ textAlign: 'right', color: 'rgba(245,200,66,0.5)', paddingRight: '4px' }}>You</p>
              <div className="msg-user">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          )}
          {msg.sender === "ai" && (
            <div>
              <p className="sender-label" style={{ color: 'rgba(255,255,255,0.25)', paddingLeft: '4px' }}>NLP Studio</p>
              <div className="msg-ai">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          )}
          {msg.sender === "system" && (
            <div className="msg-system">{msg.text}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OutputBox;
