import React from "react";

const employerLogos = [
  {
    name: "Google",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Microsoft",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    name: "Meta",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Logo.svg",
  },
  {
    name: "Amazon",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Netflix",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
  {
    name: "Apple",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Tesla",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
  },
  {
    name: "Adobe",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
  },
];

const EmployerLogos = ({ className = "" }) => {
  return (
    <div
      className={`flex justify-center gap-4 md:gap-6 py-4 md:py-6 ${className}`}
    >
      {employerLogos.map((emp) => (
        <img
          key={emp.name}
          src={emp.url}
          alt={emp.name}
          className="h-6 md:h-8 lg:h-10 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
        />
      ))}
    </div>
  );
};

export default EmployerLogos;
