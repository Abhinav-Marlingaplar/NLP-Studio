import React from "react";
import ReactMarkdown from "react-markdown";

const OutputBox = ({ messages = [] }) => {
  return (
    <div className="space-y-4 max-w-full overflow-x-hidden">
      {messages.length === 0 && (
        <p className="py-6 text-gray-400 text-sm">
          No messages yet.
        </p>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`
            p-4 rounded-xl whitespace-pre-wrap
            shadow-sm
            ${
              msg.sender === "user"
                ? "ml-auto max-w-[70%] bg-orange-500/20 text-white border border-orange-500/30"
                : ""
            }
            ${
              msg.sender === "ai"
                ? "max-w-[70%] bg-white/10 text-gray-200 border border-white/20"
                : ""
            }
            ${
              msg.sender === "system"
                ? "max-w-full bg-white/5 text-gray-300 border border-white/20"
                : ""
            }
          `}
        >
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default OutputBox;
