/**
 * Client-side Notification helper
 * Calls the server /api/notify/complaint endpoint.
 * Silently swallows errors so app never breaks if notification fails.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Send Email/Push confirmation when citizen files a complaint.
 * @param {object} params
 * @param {string} params.email       - Citizen's email
 * @param {string} params.fcmToken    - Citizen's FCM token (optional)
 * @param {string} params.userName    - Citizen's display name
 * @param {string} params.complaintId - Firestore document ID
 * @param {string} params.category    - Complaint category
 */
export const sendComplaintFiledNotify = async ({ email, fcmToken, userName, complaintId, category }) => {
  if (!email && !fcmToken) return;
  try {
    await fetch(`${API_BASE}/api/notify/complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'filed', email, fcmToken, userName, complaintId, category }),
    });
  } catch (err) {
    console.warn('Notify (filed) skipped:', err.message);
  }
};

/**
 * Send Email/Push when complaint status changes (dispatched / investigating / resolved).
 * @param {object} params
 * @param {string} params.email       - Citizen's email
 * @param {string} params.fcmToken    - Citizen's FCM token
 * @param {string} params.userName    - Citizen's display name
 * @param {string} params.complaintId - Firestore document ID
 * @param {string} params.status      - New status string
 */
export const sendComplaintStatusNotify = async ({ email, fcmToken, userName, complaintId, status }) => {
  if (!email && !fcmToken) return;
  try {
    await fetch(`${API_BASE}/api/notify/complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'status', email, fcmToken, userName, complaintId, status }),
    });
  } catch (err) {
    console.warn('Notify (status) skipped:', err.message);
  }
};
