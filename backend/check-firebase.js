/**
 * Firebase Quick Check — Auth + Firestore
 * Run: node check-firebase.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { auth, db, firebaseAdminActive } from './firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const pass = (msg) => console.log(`  ✅  ${msg}`);
const fail = (msg) => console.error(`  ❌  ${msg}`);

async function run() {
  console.log('\n══════════════════════════════════════');
  console.log('  Firebase Quick Check');
  console.log('══════════════════════════════════════\n');

  // ── 1. Admin SDK ───────────────────────────────
  console.log('1. Firebase Admin SDK');
  if (firebaseAdminActive) {
    pass('Admin SDK initialized successfully.');
  } else {
    fail('Admin SDK NOT active — check firebase-admin-config.json.');
  }

  // ── 2. Authentication ──────────────────────────
  console.log('\n2. Firebase Authentication');
  try {
    const result = await auth.listUsers(5);
    pass(`Auth service live. Registered users: ${result.users.length}`);
    result.users.forEach(u => console.log(`     → ${u.email || u.uid}`));
  } catch (e) {
    fail(`Auth error: ${e.message}`);
  }

  // ── 3. Firestore ───────────────────────────────
  console.log('\n3. Firestore Database');
  try {
    const ref = db.collection('_ping').doc('test');
    await ref.set({ ok: true, at: FieldValue.serverTimestamp() });
    const snap = await ref.get();
    await ref.delete();
    pass(`Firestore write/read/delete all succeeded (ok=${snap.data().ok}).`);
  } catch (e) {
    fail(`Firestore error [${e.code}]: ${e.message}`);
    if (e.code === 5) {
      console.log('     → The Firestore database has not been created yet.');
      console.log('     → Go to: https://console.firebase.google.com');
      console.log('     → Open your project → Build → Firestore Database → Create database');
    }
  }

  console.log('\n══════════════════════════════════════\n');
  setTimeout(() => process.exit(0), 500);
}

run().catch(e => {
  console.error('Unhandled error:', e);
  process.exit(1);
});
