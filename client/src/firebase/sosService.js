import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, firebaseConfig } from './config';

// Detect mock mode (same logic as AuthContext)
const USE_MOCK_AUTH =
  import.meta.env.VITE_USE_MOCK_AUTH === 'true' ||
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey === 'your_api_key';

/**
 * Maps emergency type → which volunteer expertise categories should be notified.
 * Volunteer expertise tags from volunteerRequests: 'firebrigade' | 'medical' | 'crime'
 */
export const EMERGENCY_VOLUNTEER_MAP = {
  Fire: ['firebrigade', 'medical'],
  Crime: ['crime'],
  Medical: ['medical', 'crime'],
  Accident: ['firebrigade', 'medical', 'crime'],
};

/**
 * Creates a new SOS alert in Firestore.
 * @param {object} params
 * @param {string} params.emergencyType  - 'Fire' | 'Crime' | 'Medical' | 'Accident'
 * @param {{ latitude: number, longitude: number }} params.location - user's live coords
 * @param {string|null} params.userId    - UID if logged in, null if anonymous
 * @param {string|null} params.userName  - display name or null
 * @returns {Promise<string>} - the newly created document ID
 */
export async function createSosAlert({ emergencyType, location, userId = null, userName = null }) {
  const notifyVolunteers = EMERGENCY_VOLUNTEER_MAP[emergencyType] ?? [];

  // In mock / offline mode there is no real auth token, so skip the Firestore
  // write and return a fake alert ID so the UI can still show success.
  if (USE_MOCK_AUTH) {
    console.info('[SOS Mock] Alert created (mock mode):', { emergencyType, location, userId, userName });
    return 'mock-alert-' + Date.now();
  }

  // 1. Immediately call Node.js backend to dispatch emails to authorities & volunteers
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  fetch(`${API_BASE}/api/sos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emergencyType,
      location: { latitude: location.latitude, longitude: location.longitude },
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous'
    })
  }).then(res => res.json())
    .then(data => console.log('✅ Backend SOS email trigger success:', data))
    .catch(err => console.error('❌ Backend SOS email trigger failed:', err));

  // 2. Add to Firestore
  const docRef = await addDoc(collection(db, 'sosAlerts'), {
    emergencyType,
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    userId,
    userName: userName || 'Anonymous',
    status: 'pending',           // pending | accepted | resolved
    notifyVolunteers,            // array of expertise tags to filter volunteers
    acceptedBy: null,
    acceptedAt: null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Subscribe to SOS alerts that a given volunteer (by expertise) should see.
 * Filters: status = 'pending' AND notifyVolunteers array-contains the volunteer's expertise
 *
 * @param {string} expertise - 'firebrigade' | 'medical' | 'crime'
 * @param {function} callback - called with array of alert objects whenever data changes
 * @returns {function} unsubscribe
 */
export function subscribeToSosAlertsForVolunteer(expertise, callback) {
  // NOTE: We do NOT use orderBy here to avoid requiring a composite Firestore index.
  // Sorting is done client-side in the callback.
  const q = query(
    collection(db, 'sosAlerts'),
    where('status', '==', 'pending'),
    where('notifyVolunteers', 'array-contains', expertise)
  );
  return onSnapshot(
    q,
    (snap) => {
      const alerts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(alerts);
    },
    (err) => {
      console.error('[SOS] Firestore subscription error:', err.message);
      // If Firestore gives an index-required error, the link to create it will be in the message.
    }
  );
}

/**
 * Mark an SOS alert as accepted by a volunteer.
 * @param {string} alertId
 * @param {string} volunteerId
 * @param {string} volunteerName
 */
export async function acceptSosAlert(alertId, volunteerId, volunteerName) {
  const ref = doc(db, 'sosAlerts', alertId);
  await updateDoc(ref, {
    status: 'accepted',
    acceptedBy: volunteerId,
    acceptedByName: volunteerName,
    acceptedAt: serverTimestamp(),
  });
}

/**
 * Mark an SOS alert as resolved.
 */
export async function resolveSosAlert(alertId) {
  const ref = doc(db, 'sosAlerts', alertId);
  await updateDoc(ref, { status: 'resolved', resolvedAt: serverTimestamp() });
}

/**
 * Build a Google Maps directions URL from volunteer location to incident location.
 * @param {{ latitude: number, longitude: number }} from - volunteer's coords
 * @param {{ latitude: number, longitude: number }} to   - incident coords
 */
export function buildGoogleMapsUrl(from, to) {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&travelmode=driving`;
}
