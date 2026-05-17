/**
 * SMS Service — Twilio integration for CatalystCrew / SafeLink
 * Sends SMS alerts for:
 *   1. SOS alert sent (to volunteers & authorities)
 *   2. Complaint filed confirmation (to citizen)
 *   3. Complaint status update / resolved (to citizen)
 *
 * Gracefully skips SMS if TWILIO_* env vars are not set (dev mode).
 */

const twilio = require('twilio');

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN  = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER; // e.g. +12345678901

// Authority / emergency contact numbers (comma-separated in env, or hardcoded fallbacks)
const AUTHORITY_NUMBERS = process.env.AUTHORITY_NUMBERS
  ? process.env.AUTHORITY_NUMBERS.split(',').map(n => n.trim())
  : [];

// Volunteer role → phone numbers map (comma-separated per role in env)
const VOLUNTEER_NUMBERS = {
  medical:     (process.env.VOLUNTEER_MEDICAL_NUMBERS   || '').split(',').filter(Boolean).map(n => n.trim()),
  crime:       (process.env.VOLUNTEER_CRIME_NUMBERS     || '').split(',').filter(Boolean).map(n => n.trim()),
  firebrigade: (process.env.VOLUNTEER_FIRE_NUMBERS      || '').split(',').filter(Boolean).map(n => n.trim()),
};

let client = null;
let smsEnabled = false;

if (ACCOUNT_SID && AUTH_TOKEN && FROM_NUMBER) {
  try {
    client = twilio(ACCOUNT_SID, AUTH_TOKEN);
    smsEnabled = true;
    console.log('✅ Twilio SMS service initialized'.green);
  } catch (e) {
    console.warn('⚠️  Twilio init failed — SMS disabled:', e.message);
  }
} else {
  console.warn('⚠️  Twilio env vars not set — SMS notifications disabled (set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)'.yellow);
}

/**
 * Core send helper — swallows errors so one failed SMS never crashes the server.
 */
const send = async (to, body) => {
  if (!smsEnabled || !to) return;
  // Ensure number starts with +
  const number = to.startsWith('+') ? to : `+${to}`;
  try {
    const msg = await client.messages.create({ from: FROM_NUMBER, to: number, body });
    console.log(`📱 SMS sent to ${number} [SID: ${msg.sid}]`.cyan);
  } catch (err) {
    console.error(`❌ SMS failed to ${number}:`, err.message);
  }
};

/**
 * Send to multiple numbers in parallel.
 */
const sendBulk = (numbers, body) => {
  if (!numbers || numbers.length === 0) return Promise.resolve();
  return Promise.all(numbers.map(n => send(n, body)));
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Called when a citizen fires an SOS.
 * Notifies relevant volunteers + all authorities.
 */
const notifySOS = async ({ emergencyType, location, userName, notifyVolunteers = [] }) => {
  const locStr = location
    ? `Lat: ${location.latitude?.toFixed(4)}, Lng: ${location.longitude?.toFixed(4)}`
    : 'Location unknown';

  const msg =
    `🆘 SOS ALERT — SafeLink CatalystCrew\n` +
    `Type: ${emergencyType}\n` +
    `From: ${userName || 'Anonymous Citizen'}\n` +
    `Location: ${locStr}\n` +
    `Open the SafeLink app to respond.`;

  // Collect volunteer numbers based on roles needed
  const volunteerNums = [...new Set(
    notifyVolunteers.flatMap(role => VOLUNTEER_NUMBERS[role] || [])
  )];

  await Promise.all([
    sendBulk(volunteerNums, msg),
    sendBulk(AUTHORITY_NUMBERS, msg),
  ]);
};

/**
 * Called when a complaint is successfully filed.
 * Sends confirmation SMS to the citizen.
 */
const notifyComplaintFiled = async ({ phone, userName, complaintId, category }) => {
  if (!phone) return;
  const msg =
    `✅ Complaint Registered — SafeLink\n` +
    `Hi ${userName || 'Citizen'}, your complaint has been filed.\n` +
    `Case ID: #${complaintId?.slice(0, 8).toUpperCase()}\n` +
    `Category: ${category || 'General'}\n` +
    `Track status anytime on the SafeLink app.`;
  await send(phone, msg);
};

/**
 * Called when police/admin updates complaint status.
 * Sends status update SMS to the citizen.
 */
const notifyComplaintUpdate = async ({ phone, userName, complaintId, status }) => {
  if (!phone) return;

  const statusMessages = {
    dispatched:    'A unit has been dispatched to your location.',
    investigating: 'An investigator has been assigned to your case.',
    resolved:      'Your complaint has been resolved. Thank you for reporting.',
    assigned:      'Your complaint has been assigned to a department.',
  };

  const detail = statusMessages[status] || `Status updated to: ${status}`;

  const msg =
    `📋 Case Update — SafeLink\n` +
    `Hi ${userName || 'Citizen'}, Case #${complaintId?.slice(0, 8).toUpperCase()}\n` +
    `${detail}\n` +
    `Open the SafeLink app to view details.`;

  await send(phone, msg);
};

module.exports = {
  notifySOS,
  notifyComplaintFiled,
  notifyComplaintUpdate,
  smsEnabled,
};
