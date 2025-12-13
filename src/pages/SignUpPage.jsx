import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/auth";
// Firebase import removed - using backend auth
import { Logo } from "../components/common/Logo";
import ImageUpload from "../components/common/ImageUpload";
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

export default function SignUpPage() {
  const { signUp, user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    userType: "jobseeker",
    headline: "Professional",
    location: "",
    about:
      "Welcome to my profile! I'm excited to connect and share my professional journey.",
    skills: ["Communication", "Teamwork", "Problem Solving"],
    photoURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    
    // Client-side validation
    const errors = {};
    
    if (!formData.first_name?.trim()) {
      errors.first_name = ["First name is required"];
    }
    
    if (!formData.last_name?.trim()) {
      errors.last_name = ["Last name is required"];
    }
    
    if (!formData.email?.trim()) {
      errors.email = ["Email is required"];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ["Please enter a valid email address"];
    }
    
    if (!formData.password) {
      errors.password = ["Password is required"];
    } else if (formData.password.length < 8) {
      errors.password = ["Password must be at least 8 characters long"];
    }
    
    if (!formData.password2) {
      errors.password2 = ["Please confirm your password"];
    } else if (formData.password !== formData.password2) {
      errors.password2 = ["Passwords do not match"];
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Register the user with the backend - only include fields expected by the backend
      const userData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password2: formData.password2,
        is_employer: formData.userType === 'employer'  // Map userType to is_employer
      };
      
      // Note: Additional profile fields (headline, location, about, skills)
      // should be updated in a separate API call after successful registration

      // Sign up the user
      const newUser = await signUp(userData);
      
      // Prepare profile update data
      const profileData = {
        headline: formData.headline,
        location: formData.location,
        about: formData.about,
        skills: formData.skills
      };
      
      // Update the user's profile with additional data
      try {
        await authService.updateProfile(newUser.id, profileData);
      } catch (profileError) {
        console.error("Error updating profile:", profileError);
        // Continue with signup even if profile update fails
      }
      
      // Handle profile image upload if provided
      if (profileImage) {
        try {
          // The profile context will handle the upload after the profile is created
          // No need to do anything here as the profile context will handle it
        } catch (uploadError) {
          console.error("Error uploading profile image:", uploadError);
          // Continue with signup even if image upload fails
        }
      }

      // Show success message and redirect to profile
      setSuccess("Registration successful! Redirecting to your profile...");
      // The signUp function already handles the login and user data
      // We can get the user data from the auth context
      const user = await signIn(userData.email, userData.password);
      if (user && user.id) {
        navigate(`/profile/${user.id}`);
      } else {
        // Fallback to feed if user data is not available
        navigate("/feed");
      }
    } catch (err) {
      setLoading(false);
      
      // Handle different types of errors
      if (err.response?.data) {
        const { data } = err.response;
        
        // Handle field validation errors
        if (typeof data === 'object' && data !== null) {
          // Handle non-field specific errors
          if (data.detail) {
            setError(data.detail);
          } 
          // Handle field-specific errors
          else {
            const formattedErrors = {};
            Object.entries(data).forEach(([field, messages]) => {
              // Convert array of errors to a single string if needed
              formattedErrors[field] = Array.isArray(messages) ? messages.join(' ') : messages;
            });
            setFieldErrors(formattedErrors);
            
            // Set a general error message if no field errors were set
            if (Object.keys(formattedErrors).length === 0) {
              setError("Please check your input and try again.");
            } else {
              setError("Please fix the errors below.");
            }
          }
        }
      }
      
      // Set a generic error message if no specific error was caught above
      if (!error && err.message) {
        setError(err.message);
      } else if (!error) {
        setError('An unexpected error occurred. Please try again.');
      }
      
      // Scroll to the top to show the error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
              Sign Up
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
              Create your account
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className={`w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border ${
                    fieldErrors.first_name ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-600/50'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {fieldErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {fieldErrors.first_name[0]}
                  </p>
                )}
              </div>
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className={`w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border ${
                    fieldErrors.last_name ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-600/50'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {fieldErrors.last_name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {fieldErrors.last_name[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-600/50'
                } focus:ring-2 focus:ring-blue-500`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Professional Headline"
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-600/50 focus:ring-2 focus:ring-blue-500"
            />
            <div className="mb-1">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-600/50'
                } focus:ring-2 focus:ring-blue-500`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>
            <div className="mb-1">
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border ${
                  fieldErrors.password2 ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-600/50'
                } focus:ring-2 focus:ring-blue-500`}
              />
              {fieldErrors.password2 && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.password2[0]}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, userType: "jobseeker" }))
                }
                className={`flex-1 py-2 rounded-xl font-medium transition-all duration-200 ${
                  formData.userType === "jobseeker"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white/40 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, userType: "employer" }))
                }
                className={`flex-1 py-2 rounded-xl font-medium transition-all duration-200 ${
                  formData.userType === "employer"
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-white/40 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300"
                }`}
              >
                Employer
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <ImageUpload
                onImageSelect={setProfileImage}
                currentImage={formData.photoURL}
                className="w-full"
              />
            </div>
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-center border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-center border border-green-200 dark:border-green-800">
                {success}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
              >
                Sign in
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
