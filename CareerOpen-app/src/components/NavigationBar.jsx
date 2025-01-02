import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaBell,
  FaBriefcase,
  FaEnvelope,
  FaUsers,
} from "react-icons/fa";
import UserProfileMenu from "./UserProfileMenu"; // Import the UserProfileMenu component
import logo from "../assets/logo.jpeg"; // Import logo
import { useUser } from "../context/UserContext"; // Import UserContext for user data

const NavigationBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser(); // Assuming UserContext provides user data

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center">
          <img src={logo} alt="CareerOpen Logo" className="h-8 w-8 mr-2" />
          <Link
            to="/"
            className="text-blue-600 font-bold text-xl hover:text-blue-700"
          >
            CareerOpen
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-2/5 sm:w-3/5 lg:w-1/3">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm pl-2 focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-6">
          {/* Home Link */}
          <Link
            to="/"
            className="text-gray-500 text-xl cursor-pointer hover:text-blue-600"
          >
            <FaHome />
          </Link>

          {/* Jobs Link */}
          <Link
            to="/job/:jobId"
            className="text-gray-500 text-xl cursor-pointer hover:text-blue-600"
          >
            <FaBriefcase />
          </Link>

          {/* Notifications Link */}
          <Link
            to="/notifications/:userId"
            className="text-gray-500 text-xl cursor-pointer hover:text-blue-600"
          >
            <FaBell />
          </Link>

          {/* My Network Link */}
          <Link
            to="/myNetwork/:userId"
            className="text-gray-500 text-xl cursor-pointer hover:text-blue-600"
          >
            <FaUsers />
          </Link>

          {/* Messages Link */}
          <Link
            to="/messages/:messageId"
            className="text-gray-500 text-xl cursor-pointer hover:text-blue-600"
          >
            <FaEnvelope />
          </Link>

          {/* User Profile Dropdown with Profile Picture */}
          <div className="relative">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="User Profile"
                className="h-8 w-8 rounded-full border border-gray-300 object-cover cursor-pointer"
                onClick={() => {
                  /* You can toggle the UserProfileMenu here if needed */
                }}
              />
            ) : (
              <UserProfileMenu />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
