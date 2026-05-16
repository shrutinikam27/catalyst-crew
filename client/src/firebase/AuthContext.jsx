import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from './config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDemo = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';

  function signup(email, password) {
    if (isDemo) return Promise.resolve({ user: { email } });
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    if (isDemo) {
      setCurrentUser({ email });
      return Promise.resolve({ user: { email } });
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (isDemo) {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  }

  function loginWithGoogle() {
    if (isDemo) {
      setCurrentUser({ email: 'demo@safelink.com' });
      return Promise.resolve({ user: { email: 'demo@safelink.com' } });
    }
    return signInWithPopup(auth, googleProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
