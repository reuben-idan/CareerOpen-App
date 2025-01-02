// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi0c1ocBTOl3U11bfO2uCVavvcug5bgAI",
  authDomain: "careeropen-6f059.firebaseapp.com",
  projectId: "careeropen-6f059",
  storageBucket: "careeropen-6f059.firebasestorage.app",
  messagingSenderId: "1062433243943",
  appId: "1:1062433243943:web:ff6ceaf8a9f21e68465f02"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
