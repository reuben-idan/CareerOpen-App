// src/components/Sidebar.js

import  "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-gray-100 p-4 w-1/4 h-screen">
      <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-2">
        <li>
          <Link to="/profile" className="text-blue-600 hover:underline">
            Profile
          </Link>
        </li>
        <li>
          <Link to="/myNetwork" className="text-blue-600 hover:underline">
            My Network
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="text-blue-600 hover:underline">
            Jobs
          </Link>
        </li>
        <li>
          <Link to="/messages" className="text-blue-600 hover:underline">
            Messages
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
