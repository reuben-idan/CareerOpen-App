import React from "react";

const peopleImages = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=400&h=400&facepad=2",
];

const PeopleGrid = ({
  className = "",
  maxImages = 4,
  showOnMobile = false,
}) => {
  const displayImages = peopleImages.slice(0, maxImages);

  return (
    <div
      className={`${
        showOnMobile ? "grid" : "hidden md:grid"
      } grid-cols-2 gap-3 md:gap-4 max-w-xs ${className}`}
    >
      {displayImages.map((img, i) => (
        <div key={i} className="relative group">
          <img
            src={img}
            alt="Young professional"
            className="rounded-2xl shadow-lg object-cover aspect-square w-full h-full border-4 border-white/40 group-hover:border-blue-300 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default PeopleGrid;
