// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = (config) => {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missingFields = requiredFields.filter((field) => !config[field]);

  if (missingFields.length > 0) {
    console.error("Missing Firebase configuration:", missingFields);
    throw new Error(
      `Missing required Firebase configuration: ${missingFields.join(", ")}`
    );
  }
};

// Initialize Firebase
let app;
let auth;
let googleProvider;
let facebookProvider;
let db;

try {
  validateFirebaseConfig(firebaseConfig);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export {
  app,
  db,
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
};
