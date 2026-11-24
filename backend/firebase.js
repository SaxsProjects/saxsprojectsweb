import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultServiceAccountPath = path.join(__dirname, 'firebase-admin-config.json');

// Firebase service-account credentials, from (in order):
//   FIREBASE_SERVICE_ACCOUNT       the JSON itself (or base64 of it) in an env var
//   FIREBASE_SERVICE_ACCOUNT_PATH  a path, e.g. /etc/secrets/firebase-admin-config.json (Render secret file)
//   backend/firebase-admin-config.json
export function loadServiceAccount() {
  const inline = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
  if (inline) {
    const json = inline.startsWith('{') ? inline : Buffer.from(inline, 'base64').toString('utf8');
    return JSON.parse(json);
  }
  const file = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || defaultServiceAccountPath;
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return null;
}

let firebaseAdminActive = false;

if (getApps().length === 0) {
  try {
    const serviceAccount = loadServiceAccount();
    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
        databaseURL: "https://saxsprojects-6a7eb.firebaseio.com"
      });
      firebaseAdminActive = true;
      console.log('Firebase Admin SDK initialized.');
    } else {
      console.log('⚠️ Firebase service account not found (set FIREBASE_SERVICE_ACCOUNT or add firebase-admin-config.json). Authenticated routes will be refused in production.');
    }
  } catch (error) {
    console.error('Error loading Firebase service account:', error.message);
  }
} else {
  firebaseAdminActive = true;
}

// Auth and Firestore are only available when a service account is configured.
export const auth = firebaseAdminActive ? getAuth(getApp()) : null;
export const db = firebaseAdminActive ? getFirestore(getApp(), 'saxsprojects') : null;
export { FieldValue, firebaseAdminActive };

/**
 * Saves a chat message to Firestore
 * @param {string} clientId
 * @param {any} message
 */
export async function saveChatMessage(clientId, message) {
  if (!db) {
    console.log(`[Mock Firestore] Saved chat message for ${clientId}:`, message);
    return;
  }
  await db.collection('chats').add({
    clientId,
    message,
    timestamp: new Date()
  });
}
