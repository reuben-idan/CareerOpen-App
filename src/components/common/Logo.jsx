import React from "react";
import logo from "../../assets/logo.jpeg";

const Logo = ({ subtitle, className = "" }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <img
      src={logo}
      alt="CareerOpen Logo"
      className="h-16 w-16 rounded-xl shadow-lg mb-1 object-cover"
    />
    <span className="text-xl font-bold text-primary-700 dark:text-primary-200 tracking-tight">
      CareerOpen
    </span>
    {subtitle && (
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </span>
    )}
  </div>
);

export { Logo };
