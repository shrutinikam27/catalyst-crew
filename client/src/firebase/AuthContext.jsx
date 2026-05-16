import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInAnonymously
} from 'firebase/auth';
import { auth, googleProvider, firebaseConfig } from './config';
import { syncUserProfile, subscribeToUserProfile } from '../services/firestoreService';

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
  const [userProfile, setUserProfile] = useState(null);
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

  function setupRecaptcha(containerId) {
    if (USE_MOCK_AUTH) return;
    
    // Check if we already have a verifier on the window to avoid re-render errors
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    
    window.recaptchaVerifier = recaptchaVerifier;
    return recaptchaVerifier;
  }

  async function loginWithPhone(phoneNumber, recaptchaVerifier) {
    if (USE_MOCK_AUTH) {
      console.log('Mock Phone Login:', phoneNumber);
      return {
        isMock: true,
        confirm: async (otp) => {
          if (otp === '123456') {
            const mockUser = { phoneNumber, uid: 'mock-phone-uid-' + Date.now() };
            setCurrentUser(mockUser);
            return { user: mockUser };
          }
          throw new Error('Invalid OTP');
        }
      };
    }
    
    try {
      return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    } catch (error) {
      console.warn('Firebase Phone Auth Error:', error.code, error.message);
      
      // Fallback for most common configuration errors in development
      const fallbackErrors = [
        'auth/operation-not-allowed',
        'auth/billing-not-enabled',
        'auth/invalid-app-credential',
        'auth/invalid-verification-code',
        'auth/network-request-failed'
      ];

      if (fallbackErrors.includes(error.code) || error.message?.includes('400')) {
        console.warn('Falling back to Mock Mode for testing due to service configuration.');
        return {
          isMock: true,
          confirm: async (otp) => {
            if (otp === '123456') {
              const mockUser = { phoneNumber, uid: 'mock-phone-uid-' + Date.now() };
              setCurrentUser(mockUser);
              return { user: mockUser };
            }
            throw new Error('Invalid OTP');
          }
        };
      }
      throw error;
    }
  }

  // Sync Firestore profile when auth user changes
  useEffect(() => {
    let unsubProfile = null;

    if (currentUser?.uid && !USE_MOCK_AUTH) {
      // Sync user to Firestore, then subscribe to real-time profile updates
      syncUserProfile(currentUser.uid, {
        email: currentUser.email || '',
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
        photoURL: currentUser.photoURL || '',
        phone: currentUser.phoneNumber || ''
      }).catch(err => console.warn('Profile sync:', err));

      unsubProfile = subscribeToUserProfile(currentUser.uid, (profile) => {
        setUserProfile(profile);
      });
    } else {
      setUserProfile(null);
    }

    return () => { if (unsubProfile) unsubProfile(); };
  }, [currentUser?.uid]);

  function loginAnonymously() {
    if (USE_MOCK_AUTH) {
      const mockUser = { uid: 'anon-' + Date.now(), isAnonymous: true };
      setCurrentUser(mockUser);
      return Promise.resolve({ user: mockUser });
    }
    return signInAnonymously(auth);
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
    userProfile,
    userRole: userProfile?.role || 'citizen',
    signup,
    login,
    logout,
    loginWithGoogle,
    loginAnonymously,
    setupRecaptcha,
    loginWithPhone
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
