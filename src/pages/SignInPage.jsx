import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/auth";
import { Logo } from "../components/common/Logo";
import logo from "../assets/logo.jpeg";

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
];

const peopleImages = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&facepad=2",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&facepad=2",
];

export default function SignInPage() {
  const { signIn, user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Sign in the user using the backend authentication
      const userData = await signIn(formData.email, formData.password);
      
      // Redirect to the user's profile page after successful login
      if (userData && userData.id) {
        navigate(`/profile/${userData.id}`);
      } else {
        // Fallback to feed if user data is not available
        navigate("/feed");
      }
    } catch (err) {
      // Handle different types of errors with user-friendly messages
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.status === 400) {
          setError("Invalid request. Please check your input and try again.");
        } else if (err.response.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.response.data?.message || "An error occurred during sign in.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Unable to connect to the server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Top employer logos */}
      <div className="flex justify-center gap-6 py-6 md:py-10">
        {employerLogos.map((emp) => (
          <img
            key={emp.name}
            src={emp.url}
            alt={emp.name}
            className="h-8 md:h-10 grayscale hover:grayscale-0 transition-all duration-300"
          />
        ))}
      </div>
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-4 pb-8">
        {/* Left: Glassy Form */}
        <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/20">
          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className="h-20 w-20 rounded-2xl shadow-lg mb-2 object-cover"
            />
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
              Sign in to your account
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500"
            />
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        {/* Right: Photo grid/banner */}
        <div className="hidden md:grid grid-cols-2 gap-4 max-w-xs">
          {peopleImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="Young professional"
              className="rounded-2xl shadow-lg object-cover aspect-square w-full h-full border-4 border-white/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
