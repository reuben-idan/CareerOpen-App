import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.jpeg"; // App logo
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

const SignInPage = () => {
  const { signIn } = useUser(); // Assuming you have a global context to manage the user state
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      signIn({
        email: user.email,
        uid: user.uid,
      });
      toast.success("Sign-in successful! Redirecting...");
      navigate("/feed"); // Navigate to the desired page
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      signIn({
        email: user.email,
        uid: user.uid,
      });
      toast.success("Google sign-in successful! Redirecting...");
      navigate("/feed");
    } catch (err) {
      toast.error(`Google sign-in failed: ${err.message}`);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      signIn({
        email: user.email,
        uid: user.uid,
      });
      toast.success("Facebook sign-in successful! Redirecting...");
      navigate("/feed");
    } catch (err) {
      toast.error(`Facebook sign-in failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-6 flex flex-col items-center justify-center text-center space-y-4">
        {/* Add your content here */}
        <div className="text-center mb-6">
          <img src={logo} alt="CareerOpen Logo" className="w-32 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500">Sign in to continue</p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-900"
                onClick={toggleShowPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2 px-4 flex justify-center items-center border border-gray-300 rounded-md shadow-sm bg-white text-gray-600 font-medium hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2 text-red-500" />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={handleFacebookSignIn}
            className="w-full py-2 px-4 flex justify-center items-center border border-gray-300 rounded-md shadow-sm bg-white text-gray-600 font-medium hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faFacebook} className="mr-2 text-blue-500" />
            Continue with Facebook
          </button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          New to CareerOpen?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Join now
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
