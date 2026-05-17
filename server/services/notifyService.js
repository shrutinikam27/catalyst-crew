/**
 * NotifyService — 100% Free Notifications for CatalystCrew / SafeLink
 *
 * Two channels:
 *   1. EMAIL  — Nodemailer + Gmail App Password (free, ~500/day)
 *   2. PUSH   — Firebase Cloud Messaging via firebase-admin (free, unlimited)
 *
 * Gracefully skips if env vars are missing (dev mode safe).
 */

const nodemailer = require('nodemailer');
const admin      = require('firebase-admin');
require('colors');

// ─── Email Setup ──────────────────────────────────────────────────────────────
let mailer = null;
let emailEnabled = false;

const GMAIL_USER = process.env.GMAIL_USER;   // e.g. yourapp@gmail.com
const GMAIL_PASS = process.env.GMAIL_PASS;   // Gmail App Password (16 chars, no spaces)
const FROM_NAME  = process.env.EMAIL_FROM_NAME || 'SafeLink CatalystCrew';

if (GMAIL_USER && GMAIL_PASS) {
  mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
  emailEnabled = true;
  console.log('✅ Email (Gmail) notification service initialized'.green);
} else {
  console.warn('⚠️  GMAIL_USER / GMAIL_PASS not set — email notifications disabled'.yellow);
}

// ─── FCM Push Setup ───────────────────────────────────────────────────────────
let fcmEnabled = false;

// Only init firebase-admin once (avoid re-init on hot-reload)
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
      fcmEnabled = true;
      console.log('✅ FCM Push notification service initialized'.green);
    } catch (e) {
      console.warn('⚠️  FCM init failed:', e.message);
    }
  } else {
    console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_JSON not set — FCM push disabled'.yellow);
  }
} else {
  fcmEnabled = true; // Already initialized
}

// ─── Authority & Volunteer Contacts ──────────────────────────────────────────
// Comma-separated emails
const AUTHORITY_EMAILS = (process.env.AUTHORITY_EMAILS || '').split(',').filter(Boolean).map(e => e.trim());

const VOLUNTEER_EMAILS = {
  medical:     (process.env.VOLUNTEER_MEDICAL_EMAILS   || '').split(',').filter(Boolean).map(e => e.trim()),
  crime:       (process.env.VOLUNTEER_CRIME_EMAILS     || '').split(',').filter(Boolean).map(e => e.trim()),
  firebrigade: (process.env.VOLUNTEER_FIRE_EMAILS      || '').split(',').filter(Boolean).map(e => e.trim()),
};

// ─── Core Helpers ─────────────────────────────────────────────────────────────

const sendEmail = async (to, subject, html) => {
  if (!emailEnabled || !to) return;
  try {
    await mailer.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`.cyan);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
  }
};

const sendEmailBulk = (addresses, subject, html) => {
  if (!addresses || addresses.length === 0) return Promise.resolve();
  return Promise.all(addresses.map(addr => sendEmail(addr, subject, html)));
};

/**
 * Send FCM push notification to a specific device token.
 * Citizens get a token stored when they enable notifications in-browser.
 */
const sendPush = async (fcmToken, title, body, data = {}) => {
  if (!fcmEnabled || !fcmToken) return;
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: { ...data },
      webpush: {
        notification: { icon: '/logo.png', badge: '/badge.png', vibrate: [200, 100, 200] },
        fcmOptions: { link: '/' },
      },
    });
    console.log(`🔔 Push sent to token ${fcmToken.slice(0, 10)}...`.cyan);
  } catch (err) {
    console.error('❌ FCM push failed:', err.message);
  }
};

// ─── HTML Email Templates ─────────────────────────────────────────────────────

const sosEmailHtml = ({ emergencyType, userName, location }) => `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#f8fafc;border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#dc2626,#7f1d1d);padding:32px;text-align:center">
    <div style="font-size:48px">🆘</div>
    <h1 style="margin:12px 0 4px;font-size:24px;font-weight:900;letter-spacing:2px">SOS ALERT</h1>
    <p style="margin:0;opacity:.8;font-size:13px;text-transform:uppercase;letter-spacing:1px">SafeLink CatalystCrew</p>
  </div>
  <div style="padding:32px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:10px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px">Emergency Type</td><td style="padding:10px 0;font-weight:700;color:#f87171">${emergencyType}</td></tr>
      <tr><td style="padding:10px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px">Reported By</td><td style="padding:10px 0;font-weight:700">${userName || 'Anonymous Citizen'}</td></tr>
      <tr><td style="padding:10px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px">Latitude</td><td style="padding:10px 0;font-weight:700">${location?.latitude?.toFixed(5) || 'N/A'}</td></tr>
      <tr><td style="padding:10px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px">Longitude</td><td style="padding:10px 0;font-weight:700">${location?.longitude?.toFixed(5) || 'N/A'}</td></tr>
      <tr><td style="padding:10px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px">Time</td><td style="padding:10px 0;font-weight:700">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
    </table>
    ${location?.latitude ? `<a href="https://maps.google.com/?q=${location.latitude},${location.longitude}" style="display:block;margin-top:24px;padding:14px;background:#6366f1;color:#fff;text-align:center;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:1px">📍 VIEW ON GOOGLE MAPS</a>` : ''}
    <p style="margin-top:24px;padding:16px;background:#1e293b;border-radius:10px;font-size:13px;color:#94a3b8;border-left:3px solid #dc2626">Open the SafeLink dashboard immediately to respond to this emergency.</p>
  </div>
</div>`;

const complaintFiledHtml = ({ userName, complaintId, category }) => `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#f8fafc;border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center">
    <div style="font-size:48px">✅</div>
    <h1 style="margin:12px 0 4px;font-size:22px;font-weight:900">Complaint Registered</h1>
    <p style="margin:0;opacity:.8;font-size:13px">SafeLink CatalystCrew</p>
  </div>
  <div style="padding:32px">
    <p style="font-size:15px;line-height:1.6">Hi <strong>${userName || 'Citizen'}</strong>,</p>
    <p style="font-size:14px;color:#94a3b8;line-height:1.6">Your complaint has been successfully filed and assigned to the appropriate department.</p>
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin:20px 0">
      <p style="margin:0 0 8px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px">Case Reference</p>
      <p style="margin:0;font-size:22px;font-weight:900;color:#818cf8;letter-spacing:2px">#${complaintId?.slice(0, 8).toUpperCase()}</p>
    </div>
    <p style="font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Category: <strong style="color:#f8fafc">${category || 'General'}</strong></p>
    <p style="margin-top:24px;padding:16px;background:#1e293b;border-radius:10px;font-size:13px;color:#94a3b8;border-left:3px solid #4f46e5">You can track the status of your complaint in real-time on the SafeLink app under <strong style="color:#818cf8">Track Complaints</strong>.</p>
  </div>
</div>`;

const statusUpdateHtml = ({ userName, complaintId, status }) => {
  const statusConfig = {
    dispatched:    { icon: '🚓', color: '#6366f1', label: 'Unit Dispatched',    msg: 'A police unit has been dispatched to your reported location and is en route.' },
    investigating: { icon: '🔍', color: '#f59e0b', label: 'Under Investigation', msg: 'An investigator has been assigned to your case and has begun the investigation.' },
    resolved:      { icon: '✅', color: '#10b981', label: 'Case Resolved',       msg: 'Your complaint has been resolved by the authorities. Thank you for keeping the city safe.' },
    assigned:      { icon: '📋', color: '#3b82f6', label: 'Case Assigned',       msg: 'Your complaint has been assigned to a department for review.' },
  };
  const cfg = statusConfig[status] || { icon: '📋', color: '#6366f1', label: status, msg: `Your complaint status has been updated to: ${status}.` };
  return `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#f8fafc;border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(135deg,${cfg.color},${cfg.color}aa);padding:32px;text-align:center">
    <div style="font-size:48px">${cfg.icon}</div>
    <h1 style="margin:12px 0 4px;font-size:22px;font-weight:900">${cfg.label}</h1>
    <p style="margin:0;opacity:.8;font-size:13px">Case #${complaintId?.slice(0, 8).toUpperCase()}</p>
  </div>
  <div style="padding:32px">
    <p style="font-size:15px">Hi <strong>${userName || 'Citizen'}</strong>,</p>
    <p style="font-size:14px;color:#94a3b8;line-height:1.7">${cfg.msg}</p>
    <p style="margin-top:24px;padding:16px;background:#1e293b;border-radius:10px;font-size:13px;color:#94a3b8;border-left:3px solid ${cfg.color}">Track your case in real-time on the SafeLink app → <strong style="color:#818cf8">Track Complaints</strong></p>
  </div>
</div>`;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Notify on SOS: emails volunteers + authorities, FCM push to their tokens.
 */
const notifySOS = async ({ emergencyType, location, userName, notifyVolunteers = [], fcmTokens = [] }) => {
  const subject = `🆘 SOS ALERT — ${emergencyType} — SafeLink`;
  const html = sosEmailHtml({ emergencyType, location, userName });

  const volunteerEmails = [...new Set(
    (notifyVolunteers || []).flatMap(role => VOLUNTEER_EMAILS[role] || [])
  )];

  const allEmails = [...new Set([...volunteerEmails, ...AUTHORITY_EMAILS])];

  await Promise.all([
    sendEmailBulk(allEmails, subject, html),
    ...fcmTokens.map(token => sendPush(token, `🆘 SOS: ${emergencyType}`, `${userName || 'Someone'} needs help nearby!`, { type: 'sos', emergencyType })),
  ]);
};

/**
 * Notify citizen when their complaint is filed.
 */
const notifyComplaintFiled = async ({ email, fcmToken, userName, complaintId, category }) => {
  await Promise.all([
    email ? sendEmail(email, `✅ Complaint Registered — #${complaintId?.slice(0,8).toUpperCase()}`, complaintFiledHtml({ userName, complaintId, category })) : null,
    fcmToken ? sendPush(fcmToken, '✅ Complaint Registered!', `Case #${complaintId?.slice(0,8).toUpperCase()} has been filed.`, { type: 'complaint_filed', complaintId }) : null,
  ]);
};

/**
 * Notify citizen on complaint status change.
 */
const notifyComplaintUpdate = async ({ email, fcmToken, userName, complaintId, status }) => {
  const subjects = {
    dispatched:    `🚓 Unit Dispatched — Case #${complaintId?.slice(0,8).toUpperCase()}`,
    investigating: `🔍 Investigation Started — Case #${complaintId?.slice(0,8).toUpperCase()}`,
    resolved:      `✅ Case Resolved — Case #${complaintId?.slice(0,8).toUpperCase()}`,
    assigned:      `📋 Case Assigned — Case #${complaintId?.slice(0,8).toUpperCase()}`,
  };
  const subject = subjects[status] || `📋 Case Update — #${complaintId?.slice(0,8).toUpperCase()}`;
  const html = statusUpdateHtml({ userName, complaintId, status });

  await Promise.all([
    email    ? sendEmail(email, subject, html) : null,
    fcmToken ? sendPush(fcmToken, subject.replace(/[✅🚓🔍📋]/g, '').trim(), `Your case status: ${status}`, { type: 'complaint_update', complaintId, status }) : null,
  ]);
};

module.exports = {
  notifySOS,
  notifyComplaintFiled,
  notifyComplaintUpdate,
  emailEnabled,
  fcmEnabled,
};
