require('dotenv').config();
const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

console.log("Testing with User:", GMAIL_USER);

if (!GMAIL_USER || !GMAIL_PASS) {
  console.error("Missing GMAIL_USER or GMAIL_PASS in .env");
  process.exit(1);
}

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

mailer.sendMail({
  from: `"${process.env.EMAIL_FROM_NAME}" <${GMAIL_USER}>`,
  to: process.env.AUTHORITY_EMAILS || GMAIL_USER,
  subject: "Test Email from SafeLink",
  text: "If you receive this, the email configuration is working perfectly!",
}).then(info => {
  console.log("✅ Success! Email sent:", info.messageId);
}).catch(err => {
  console.error("❌ Failed to send email:", err);
});
