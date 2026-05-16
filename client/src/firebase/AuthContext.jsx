import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider, firebaseConfig } from './config';

// Determine if we should use mock authentication
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || 
                     !firebaseConfig.apiKey || 
                     firebaseConfig.apiKey === 'your_api_key';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    if (USE_MOCK_AUTH) {
      console.log('Mock Signup:', email);
      const mockUser = { email, uid: 'mock-uid-' + Date.now() };
      setCurrentUser(mockUser);
      return Promise.resolve({ user: mockUser });
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    if (USE_MOCK_AUTH) {
      console.log('Mock Login:', email);
      const mockUser = { email, uid: 'mock-uid-' + Date.now() };
      setCurrentUser(mockUser);
      return Promise.resolve({ user: mockUser });
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (USE_MOCK_AUTH) {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  }

  function loginWithGoogle() {
    if (USE_MOCK_AUTH) {
      console.log('Mock Google Login');
      const mockUser = { 
        email: 'demo@example.com', 
        displayName: 'Demo User',
        uid: 'mock-google-uid-' + Date.now() 
      };
      setCurrentUser(mockUser);
      return Promise.resolve({ user: mockUser });
    }
    return signInWithPopup(auth, googleProvider);
  }

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      console.warn('Using Mock Authentication mode. Firebase is bypassed.');
      setLoading(false);
      return;
    }

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
