/**
 * bad-app.js — Fixture with deliberate compliance violations for testing detectors.
 * NEVER deploy this code. These are intentional test violations.
 */

// OBL-SEC-04: Hardcoded credentials
const DB_PASSWORD = "super_secret_password_123";
const JWT_SECRET = "myjwtsecretkey";
const RAZORPAY_KEY_SECRET = "rzp_live_abc123xyz";

// OBL-SEC-03: Weak password hashing (MD5 applied to password)
const crypto = require('crypto');
function hashUserPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// OBL-RBI-01 / OBL-DPDP-08 / OBL-CERT-03: Non-India cloud region
const AWS_REGION = "us-east-1";
const S3_BUCKET_REGION = "eu-west-1";

// OBL-SEC-05: SQL built by string concatenation
const mysql = require('mysql');
function getUser(username) {
  const query = "SELECT * FROM users WHERE username = '" + username + "'";
  return db.query(query);
}

// OBL-AADH-02: Aadhaar number hardcoded (test: 234123412346 — valid Verhoeff checksum)
// The number below is a known test Aadhaar used in UIDAI sandbox documentation.
const TEST_AADHAAR = "2341 2341 2346";

// OBL-SEC-02: Plain HTTP API endpoint
const PAYMENT_API_URL = "http://api.payments.example.com/v1/charge";

// OBL-DPDP-01: No consent mechanism — just collecting data directly
function signupUser(req, res) {
  const { name, email, phone, dob } = req.body;
  // No consent check, no age verification, no purpose notice
  db.users.create({ name, email, phone, dob });
  res.json({ success: true });
}

// OBL-CHILD-03: Analytics fired without minor check
const analytics = require('mixpanel');
function trackPageView(userId, page) {
  // No isMinor check before tracking
  analytics.track('page_view', { userId, page });
}
