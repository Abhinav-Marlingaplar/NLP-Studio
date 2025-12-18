import React from "react";

const InputBox = ({
  label = "Enter text",
  value,
  onChange,
  rows = 4,
  placeholder = "Type here...",
}) => {
  return (
    <div className="w-full animate-fadeIn">
      <label className="text-gray-300 text-sm mb-1 block">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full p-4 rounded-xl
          bg-white/5 backdrop-blur
          text-white placeholder-gray-400
          border border-white/20
          focus:border-orange-500/60
          focus:ring-1 focus:ring-orange-500/40
          outline-none resize-none
          transition-all duration-300
        "
      />
    </div>
  );
};

export default InputBox;
