/**
 * useFirestore — React hook for real-time Firestore subscriptions.
 * Handles automatic subscribe/unsubscribe on component mount/unmount.
 */

import { useState, useEffect } from 'react';
import { subscribeToCollection, subscribeToDocument } from '../services/firestoreService';

/**
 * Subscribe to a Firestore collection with real-time updates
 * @param {string} collectionName
 * @param {Array} filters - Array of { field, operator, value }
 * @param {string} sortField
 * @param {string} sortDirection
 * @param {number} limitCount
 */
export const useFirestoreCollection = (collectionName, filters = [], sortField = 'createdAt', sortDirection = 'desc', limitCount = 50) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToCollection(
        collectionName,
        (docs) => {
          setData(docs);
          setLoading(false);
        },
        filters,
        sortField,
        sortDirection,
        limitCount
      );
      return () => unsubscribe();
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(filters), sortField, sortDirection, limitCount]);

  return { data, loading, error };
};

/**
 * Subscribe to a single Firestore document with real-time updates
 * @param {string} collectionName
 * @param {string} docId
 */
export const useFirestoreDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const unsubscribe = subscribeToDocument(
        collectionName,
        docId,
        (doc) => {
          setData(doc);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [collectionName, docId]);

  return { data, loading, error };
};
