import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { signOut } from "firebase/auth"; // Import Firebase signOut function
import { auth } from "../../firebaseConfig"; // Import your Firebase auth instance
import { toast } from "react-toastify"; // Toastify for notifications
import "react-toastify/dist/ReactToastify.css";

const UserProfileMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      toast.success("Successfully signed out!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/signin"); // Redirect to the sign-in page
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
                to="/profile/:userId"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              >
                View Profile
              </Link>
            </li>
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
