import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'firebase-admin-config.json');

let firebaseAdminActive = false;

if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://saxsprojects-6a7eb.firebaseio.com"
      });
      firebaseAdminActive = true;
      console.log('Firebase Admin SDK initialized successfully in firebase.js');
    } catch (error) {
      console.error('Error loading firebase-admin-config.json in firebase.js:', error);
    }
  } else {
    console.log('⚠️ firebase-admin-config.json NOT FOUND in firebase.js. Running in Mock Auth & Local Sync Mode.');
  }
} else {
  firebaseAdminActive = true;
}

// Export the auth and firestore service instances and admin references
export const auth = firebaseAdminActive ? admin.auth() : null;
export const db = firebaseAdminActive ? getFirestore(admin.app(), 'saxsprojects') : null;
export { admin, firebaseAdminActive };

/**
 * Verifies the Firebase ID token and returns the UID
 * @param {string} token - The Firebase ID token from the client
 * @returns {Promise<string>} - The decoded user's UID
 */
export async function verifyUserToken(token) {
  if (!firebaseAdminActive || !auth) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        const uid = payload.user_id || payload.sub;
        if (!uid) throw new Error('No UID in payload');
        return uid;
      } else if (token.includes('@')) {
        return token;
      } else {
        throw new Error('Invalid token');
      }
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid; // This UID links to the client
  } catch (error) {
    throw new Error('Invalid token');
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
