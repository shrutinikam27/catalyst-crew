import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBTOlvKtKLEZNd4Cc1eMirDdkD9Kbqbzsc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hackonate.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hackonate",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hackonate.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "928323326414",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:928323326414:web:cb4bed679b637df3d9db9f"
};

// Simple check to see if we are using placeholder values
if (firebaseConfig.apiKey === 'your_api_key' || !firebaseConfig.apiKey) {
  console.error('Firebase Error: API Key is missing or invalid. Please update your .env.local file with your Firebase project credentials.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

console.log("Firebase initialized for project:", firebaseConfig.projectId);

export { auth, db, storage, googleProvider, firebaseConfig };
export default app;
