import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full py-6 animate-fadeIn">
      <div
        className="
          w-10 h-10 rounded-full
          border-4 border-white/20
          border-t-orange-500
          animate-spin
        "
      />
      <p className="ml-4 text-orange-500 font-semibold">
        Processing…
      </p>
    </div>
  );
};

export default Loading;
