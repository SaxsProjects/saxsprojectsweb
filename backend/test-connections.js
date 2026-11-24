/**
 * SaxsProjects — Full Connection & Integration Test Suite
 * Run: node test-connections.js
 *
 * Tests:
 *  1. Firebase Admin SDK init
 *  2. Firebase Auth  — list users (proves auth service is live)
 *  3. Firestore      — write / read / delete + seed demo chat message
 *  4. MongoDB Atlas  — connect, insert, query, delete
 *  5. Gemini API     — live chat completion
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { auth, db, saveChatMessage, firebaseAdminActive } from './firebase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FieldValue } from 'firebase-admin/firestore';

// ─── Helpers ───────────────────────────────────────────────────────────────

const pass  = (msg) => console.log(`  ✅  ${msg}`);
const fail  = (msg) => console.error(`  ❌  ${msg}`);
const info  = (msg) => console.log(`  ℹ️   ${msg}`);
const title = (n, msg) => console.log(`\n${'─'.repeat(56)}\n  ${n}. ${msg}\n${'─'.repeat(56)}`);

let totalPassed = 0;
let totalFailed = 0;

function ok(msg)  { pass(msg);  totalPassed++; }
function err(msg) { fail(msg);  totalFailed++; }

// ─── Main ──────────────────────────────────────────────────────────────────

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   SaxsProjects  —  Connection Test Suite             ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  // ══════════════════════════════════════════════════════════
  // TEST 1 — Firebase Admin SDK
  // ══════════════════════════════════════════════════════════
  title(1, 'Firebase Admin SDK Initialization');
  if (firebaseAdminActive) {
    ok('Firebase Admin SDK initialized successfully.');
  } else {
    err('Firebase Admin SDK NOT initialized — check firebase-admin-config.json.');
  }

  // ══════════════════════════════════════════════════════════
  // TEST 2 — Firebase Authentication
  // ══════════════════════════════════════════════════════════
  title(2, 'Firebase Authentication Service');
  if (!auth) {
    err('auth instance is null. Skipping auth tests.');
  } else {
    try {
      // List up to 3 users to prove Auth is reachable
      const listResult = await auth.listUsers(3);
      ok(`Auth service live. Found ${listResult.users.length} user(s) registered.`);
      listResult.users.forEach(u => info(`  → ${u.email || u.uid}`));
    } catch (e) {
      err(`Auth service error: ${e.message}`);
    }
  }

  // ══════════════════════════════════════════════════════════
  // TEST 3 — Firestore Database
  // ══════════════════════════════════════════════════════════
  title(3, 'Firestore Database');
  if (!db) {
    err('db instance is null. Skipping Firestore tests.');
  } else {
    // 3a — Write
    let testDocRef;
    try {
      testDocRef = db.collection('_connection_test').doc('ping');
      await testDocRef.set({
        status: 'ok',
        testedAt: FieldValue.serverTimestamp()
      });
      ok('Firestore WRITE successful (_connection_test/ping).');
    } catch (e) {
      err(`Firestore WRITE failed: ${e.message}`);
    }

    // 3b — Read
    if (testDocRef) {
      try {
        const snap = await testDocRef.get();
        if (snap.exists && snap.data().status === 'ok') {
          ok('Firestore READ successful — document verified.');
        } else {
          err('Firestore READ returned unexpected data.');
        }
      } catch (e) {
        err(`Firestore READ failed: ${e.message}`);
      }

      // 3c — Delete (cleanup)
      try {
        await testDocRef.delete();
        ok('Firestore CLEANUP — test document deleted.');
      } catch (e) {
        err(`Firestore DELETE failed: ${e.message}`);
      }
    }

    // 3d — saveChatMessage helper
    try {
      await saveChatMessage('test-client-id', 'Hello from connection test!');
      ok('saveChatMessage() helper executed without error.');
    } catch (e) {
      err(`saveChatMessage() failed: ${e.message}`);
    }

    // 3e — Seed demo Firestore chat message for demo@example.com
    try {
      const demoEmail   = 'demo@example.com';
      const messagesRef = db.collection('chats').doc(demoEmail).collection('messages');

      // Only seed if no messages exist yet
      const existing = await messagesRef.limit(1).get();
      if (existing.empty) {
        await messagesRef.add({
          sender: 'dev',
          text:   "Hey there! I've set up your private workspace portal. We can use this channel to discuss layout directions and features. Feel free to reply!",
          time:   '10:14 AM',
          timestamp: FieldValue.serverTimestamp(),
          isProcessed: true
        });
        ok(`Firestore chat seeded for ${demoEmail}.`);
      } else {
        info(`Firestore chat for ${demoEmail} already has messages — skipping seed.`);
      }
    } catch (e) {
      err(`Firestore chat seed failed: ${e.message}`);
    }
  }

  // ══════════════════════════════════════════════════════════
  // TEST 4 — MongoDB Atlas
  // ══════════════════════════════════════════════════════════
  title(4, 'MongoDB Atlas Connection');
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    err('MONGODB_URI is not defined in .env.');
  } else {
    try {
      await mongoose.connect(mongoUri);
      ok(`MongoDB connected — host: ${mongoose.connection.host}`);

      // Write a temp document
      const TestModel = mongoose.model(
        '_ConnectionTest',
        new mongoose.Schema({ ping: String, at: Date })
      );
      const doc = await TestModel.create({ ping: 'ok', at: new Date() });
      ok(`MongoDB WRITE successful (id: ${doc._id}).`);

      // Read it back
      const found = await TestModel.findById(doc._id);
      if (found && found.ping === 'ok') {
        ok('MongoDB READ successful — document verified.');
      } else {
        err('MongoDB READ returned unexpected data.');
      }

      // Delete it
      await TestModel.deleteOne({ _id: doc._id });
      ok('MongoDB CLEANUP — test document deleted.');

      await mongoose.disconnect();
      ok('MongoDB connection closed cleanly.');
    } catch (e) {
      err(`MongoDB error: ${e.message}`);
      try { await mongoose.disconnect(); } catch { /* already disconnected */ }
    }
  }

  // ══════════════════════════════════════════════════════════
  // TEST 5 — Google Gemini API
  // ══════════════════════════════════════════════════════════
  title(5, 'Google Gemini API Key');
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    err('GEMINI_API_KEY is not defined in .env.');
  } else {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const result = await model.generateContent('Reply with exactly: CONNECTION_OK');
      const reply = result.response.text().trim();
      ok(`Gemini API live. Response: "${reply}"`);
    } catch (e) {
      err(`Gemini API error: ${e.message}`);
    }
  }

  // ══════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log(`║  RESULTS: ${totalPassed} passed  |  ${totalFailed} failed${' '.repeat(33 - String(totalPassed).length - String(totalFailed).length)}║`);
  console.log('╚══════════════════════════════════════════════════════╝\n');

  process.exit(totalFailed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('\n❌ Unhandled test runner error:', err);
  process.exit(1);
});
