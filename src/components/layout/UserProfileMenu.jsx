import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "../../context/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfileMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center text-gray-500 text-xl hover:text-blue-600 focus:outline-none"
        aria-label="User Profile Menu"
      >
        <FaUserAlt />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-2">
            {/* Profile Link */}
            <li>
              <Link
                to={`/profile/${user?.uid}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              >
                View Profile
              </Link>
            </li>
            {/* Subscription Payment Link */}
            <li>
              <Link
                to="/subscription"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
              >
                Payment on Subscription
              </Link>
            </li>
            {/* Sign Out Button */}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
