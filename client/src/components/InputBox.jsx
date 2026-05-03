import React from "react";

const InputBox = ({
  label,
  value,
  onChange,
  rows = 4,
  placeholder = "Type here...",
  disabled = false,
  onSubmit,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full mt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .premium-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.85);
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          line-height: 1.65;
          outline: none;
          resize: none;
          transition: all 0.25s ease;
        }
        .premium-textarea::placeholder {
          color: rgba(255,255,255,0.2);
          font-weight: 300;
        }
        .premium-textarea:focus {
          border-color: rgba(245,200,66,0.4);
          background: rgba(245,200,66,0.03);
          box-shadow: 0 0 0 3px rgba(245,200,66,0.07);
        }
        .premium-textarea:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      {label && (
        <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase mb-2"
               style={{ color: 'rgba(255,255,255,0.3)' }}>
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="premium-textarea"
        />

        {onSubmit && (
          <p className="absolute bottom-3 right-3 text-[10px] pointer-events-none"
             style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 400 }}>
            ⌘↵ to send
          </p>
        )}
      </div>
    </div>
  );
};

export default InputBox;
