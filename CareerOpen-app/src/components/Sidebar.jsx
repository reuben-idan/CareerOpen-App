import "react";

const Sidebar = () => {
  const recommendations = [
    { name: "AmaliTech", link: "#" },
    { name: "KNUST E-Learning Centre", link: "#" },
    { name: "GCB Bank PLC", link: "#" },
  ];

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add to your feed</h3>
      <ul className="space-y-3">
        {recommendations.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <a href={item.link} className="text-blue-600 font-medium">
              {item.name}
            </a>
            <button className="bg-blue-600 text-white px-3 py-1 rounded">
              Follow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
