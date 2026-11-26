import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
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

if (!getApps().length) {
  try {
    const serviceAccount = loadServiceAccount();
    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
        databaseURL: "https://saxsprojects-6a7eb.firebaseio.com"
      });
      firebaseAdminActive = true;
      console.log('Firebase Admin SDK initialized successfully in firebase.js');
    } else {
      console.log('⚠️ Firebase service account not found (set FIREBASE_SERVICE_ACCOUNT or add firebase-admin-config.json). Authenticated routes will be refused in production.');
    }
  } catch (error) {
    console.error('Error loading Firebase service account in firebase.js:', error.message);
  }
} else {
  firebaseAdminActive = true;
}

// Export the auth and firestore service instances and admin references
export const auth = firebaseAdminActive ? getAuth() : null;
export const db = firebaseAdminActive ? getFirestore(getApp(), 'saxsprojects') : null;
export { firebaseAdminActive };

/**
 * Verifies the Firebase ID token and returns the UID
 * @param {string} token - The Firebase ID token from the client
 * @returns {Promise<string>} - The decoded user's UID
 */
export async function verifyUserToken(token) {
  if (!firebaseAdminActive || !auth) {
    // Never trust an unverified token: without the Admin SDK there is no way to check a signature.
    throw new Error('Authentication is not configured on this server');
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid; // This UID links to the client
  } catch (error) {
    throw new Error('Invalid token', { cause: error });
  }
}

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
