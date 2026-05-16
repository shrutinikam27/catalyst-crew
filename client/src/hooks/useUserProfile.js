/**
 * useUserProfile — Syncs the authenticated user with their Firestore profile.
 * Loads role, name, preferences, and keeps them in sync in real-time.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { syncUserProfile, subscribeToUserProfile } from '../services/firestoreService';

export const useUserProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Sync user to Firestore on login
    const initProfile = async () => {
      try {
        await syncUserProfile(currentUser.uid, {
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
          photoURL: currentUser.photoURL || '',
          phone: currentUser.phoneNumber || ''
        });
      } catch (error) {
        console.warn('Profile sync error (may be offline or mock):', error);
      }
    };

    initProfile();

    // Subscribe to real-time profile changes
    const unsubscribe = subscribeToUserProfile(currentUser.uid, (profileData) => {
      setProfile(profileData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  return { profile, loading, isAdmin: profile?.role === 'admin' };
};
