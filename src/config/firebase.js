import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Hardcoded Firebase configuration (from user)
const firebaseConfig = {
  apiKey: "AIzaSyDJn-cqrCpMXvLOKOivRh4L-wvR1EPNSaw",
  authDomain: "careeropen-6f059.firebaseapp.com",
  projectId: "careeropen-6f059",
  storageBucket: "careeropen-6f059.appspot.com",
  messagingSenderId: "1062433243943",
  appId: "1:1062433243943:web:ff6ceaf8a9f21e68465f02",
};

// Initialize Firebase
export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Configure Facebook Auth Provider
facebookProvider.setCustomParameters({
  display: "popup",
});

// Auth helper functions
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result;
  } catch (error) {
    console.error("Facebook sign-in error:", error);
    throw error;
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

// Remove duplicate named exports below, as they are already exported above
// export {
//   app,
//   auth,
//   storage,
//   googleProvider,
//   facebookProvider,
//   signInWithGoogle,
//   signInWithFacebook,
//   signOutUser,
// };
