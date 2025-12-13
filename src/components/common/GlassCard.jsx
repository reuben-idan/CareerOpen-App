import React from "react";

const GlassCard = ({ children, className = "", padding = "p-6 md:p-8" }) => {
  return (
    <div
      className={`backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/20 ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
