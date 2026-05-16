import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Check if Firebase keys are present
const hasFirebaseKeys = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'your_api_key_here';

let app;
let auth;
let googleProvider;

if (hasFirebaseKeys) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  console.warn("Firebase API key is missing. App is running in DEMO MODE.");
  // Provide mock objects to prevent crashes
  app = {};
  auth = {
    onAuthStateChanged: (cb) => {
      // Simulate no user logged in initially
      setTimeout(() => cb(null), 500);
      return () => {};
    }
  };
  googleProvider = {};
}

export { auth, googleProvider };
export default app;
