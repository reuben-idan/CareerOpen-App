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
import { config, validateConfig } from "./src/config/env.js";

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

  const missingFields = requiredFields.filter((field) => 
    !config[field] || config[field].startsWith("placeholder")
  );

  if (missingFields.length > 0) {
    console.error("Missing Firebase configuration:", missingFields);
    if (import.meta.env.PROD) {
      throw new Error(
        `Missing required Firebase configuration: ${missingFields.join(", ")}`
      );
    } else {
      console.warn("Firebase configuration incomplete. Some features may not work.");
    }
  }
};

// Initialize Firebase
let app;
let auth;
let googleProvider;
let facebookProvider;
let db;

try {
  validateFirebaseConfig(config.firebase);
  app = initializeApp(config.firebase);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  if (import.meta.env.PROD) {
    throw error;
  } else {
    console.warn("Firebase initialization failed. Running in development mode without Firebase.");
  }
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
