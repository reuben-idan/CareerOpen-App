import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.jpeg";
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

const SignUpPage = () => {
  const { signUp } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [slide1, slide2, ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      signUp({
        email: user.email,
        uid: user.uid,
        role: formData.role,
      });
      toast.success("Sign-up successful! Redirecting to your dashboard.");
      navigate(`/feed/${user.uid}`);
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      signUp({
        email: user.email,
        uid: user.uid,
        role: formData.role,
      });
      toast.success("Sign-up successful! Redirecting to your dashboard.");
      navigate(`/feed/${user.uid}`);
    } catch (err) {
      toast.error(`Sign-up failed: ${err.message}`);
    }
  };

  const handleGoogleSignUp = () => handleSocialSignUp(new GoogleAuthProvider());
  const handleFacebookSignUp = () =>
    handleSocialSignUp(new FacebookAuthProvider());

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <img src={logo} alt="CareerOpen Logo" className="w-32 mx-auto" />
          <h2 className="text-2xl font-semibold mt-4">Sign Up</h2>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Role</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>
        <div className="flex flex-col space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-2 px-4 flex justify-center items-center border border-gray-300 rounded-md shadow-sm bg-white text-gray-600 hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2 text-red-500" />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={handleFacebookSignUp}
            className="w-full py-2 px-4 flex justify-center items-center border border-gray-300 rounded-md shadow-sm bg-white text-gray-600 hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faFacebook} className="mr-2 text-blue-500" />
            Continue with Facebook
          </button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Already on CareerOpen?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 h-full">
        <div className="h-full w-full relative">
          <img
            src={slides[currentSlide]}
            alt="Slide"
            className="h-full w-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
