import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth, db, FieldValue, firebaseAdminActive, loadServiceAccount } from './firebase.js';
import { sendMail, smtpConfigured } from './mailer.js';
import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Schema imports
import Client from './models/Client.js';
import Project from './models/Project.js';
import Billing from './models/Billing.js';
import Inquiry from './models/Inquiry.js';
import Booking from './models/Booking.js';
import { CONSULT_SLOTS, isIsoDate, parseSlot } from './lib/slots.js';
import { buildIcs } from './lib/ics.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'saxs.solutions25@gmail.com').toLowerCase();
// Customer-facing address (email footers, reply-to, where new leads go by default).
const BUSINESS_EMAIL = (process.env.BUSINESS_EMAIL || 'info@saxsprojects.co.za').toLowerCase();
// Mock auth (unsigned tokens / raw emails) is ONLY for local development and
// must be switched on explicitly. It is always off in production.
const ALLOW_MOCK_AUTH = !IS_PRODUCTION && process.env.ALLOW_MOCK_AUTH === 'true';

// Only the website itself may call this API from a browser.
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://www.saxsprojects.co.za,https://saxsprojects.co.za,http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || ALLOWED_ORIGINS.includes(origin)),
}));
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  if (IS_PRODUCTION) res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  next();
});

// Escape user-supplied text before putting it in an HTML email.
const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const isAdminUser = (user) => Boolean(user && user.email && user.email.toLowerCase() === ADMIN_EMAIL);

// Clients only ever see their own records; the admin may view any client via X-Target-Client.
const targetClientEmail = (req) => {
  const requested = req.headers['x-target-client'];
  return String(requested && isAdminUser(req.user) ? requested : req.user.email).toLowerCase();
};

// Tiny in-memory rate limiter for public form endpoints (per IP).
const rateLimit = ({ windowMs, max }) => {
  const hits = new Map();
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test') return next();
    const now = Date.now();
    const key = req.ip;
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      return res.status(429).json({ error: 'Too many requests. Please try again later or contact us on WhatsApp.' });
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    next();
  };
};
const publicFormLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 8 });


// ========================================================
// 1. DATABASE CONNECTION
// ========================================================
// Connection happens in start() at the bottom of this file, so tests can import the app.

// ========================================================
// 2. FIREBASE ADMIN INITIALIZATION & AUTH MIDDLEWARE
// ========================================================
if (!firebaseAdminActive) {
  console.log('---------------------------------------------------------');
  console.log('⚠️  Firebase service account NOT FOUND (FIREBASE_SERVICE_ACCOUNT / firebase-admin-config.json).');
  console.log('The backend is running in Mock Auth & Local Sync Mode.');
  console.log('For production verification, place your Firebase Private Key JSON at:');
  console.log(path.join(__dirname, 'firebase-admin-config.json'));
  console.log('---------------------------------------------------------');
}

// ========================================================
// ENV VALIDATION
// ========================================================
const validateEnvironment = () => {
  const requiredEnvs = ['MONGODB_URI', 'ADMIN_EMAIL'];
  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  
  if (missingEnvs.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingEnvs.join(', ')}`);
  }

  console.log('\n✅ Backend Configuration Status:');
  console.log(`   - MongoDB: ${process.env.MONGODB_URI ? '✓ Connected' : '✗ Missing'}`);
  console.log(`   - Admin Email: ${process.env.ADMIN_EMAIL ? '✓ ' + process.env.ADMIN_EMAIL : '✗ Missing'}`);
  console.log(`   - Gemini API: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Using local NLP'}`);
  console.log(`   - Google Calendar: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ Configured' : '✗ Using fallback'}`);
  console.log(`   - SMTP: ${process.env.SMTP_HOST ? '✓ Configured' : '✗ Using console logging'}`);
  console.log(`   - Firebase Admin: ${firebaseAdminActive ? '✓ Configured' : '✗ Mock mode'}\n`);
};

validateEnvironment();

// Token Authorization Middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (firebaseAdminActive) {
      // Real Firebase ID token verification
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } else if (!ALLOW_MOCK_AUTH) {
      console.error('Rejected request: Firebase Admin is not configured and mock auth is disabled.');
      return res.status(503).json({ error: 'Authentication is not configured on this server.' });
    } else {
      // Mock JWT decoder for testing
      const parts = token.split('.');
      if (parts.length === 3) {
        // Standard JWT payload is base64url encoded at index 1
        const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        
        req.user = {
          uid: payload.user_id || payload.sub,
          email: payload.email,
          name: payload.name || payload.email.split('@')[0]
        };
        next();
      } else if (token.includes('@')) {
        // Quick bypass using raw email for developer convenience
        req.user = {
          uid: token,
          email: token,
          name: token.split('@')[0]
        };
        next();
      } else {
        return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
      }
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
};

// Check if current user is admin
const adminOnly = (req, res, next) => {
  if (isAdminUser(req.user)) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Exclusive administrator credentials required.' });
  }
};

// ========================================================
// 3. GOOGLE MEET & CALENDAR SERVICE
// ========================================================
const generateGoogleMeetLink = async (dateTimeString, attendeeEmail) => {
  let googleAuthClient = null;

  // 1. Use the Firebase service account (it is also a Google service account)
  try {
    const credentials = loadServiceAccount();
    if (credentials) {
      googleAuthClient = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      console.log(`✅ Using service account for Google Calendar API (${credentials.client_email})`);
    }
  } catch (err) {
    console.error('❌ Error initializing Google Calendar API with the service account:', err.message);
  }

  // 2. Fall back to GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY if config JSON not found
  if (!googleAuthClient && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    try {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      googleAuthClient = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      console.log(`✅ Using service account JWT from environment variables (${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL})`);
    } catch (err) {
      console.error('❌ Error initializing Google Calendar API JWT from environment variables:', err.message);
    }
  }

  if (googleAuthClient) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: googleAuthClient });
      
      // Parse the dateTimeString properly
      let startTime;
      try {
        // Handle format like "2026 May 25 09:30 AM"
        startTime = new Date(dateTimeString);
        if (isNaN(startTime.getTime())) {
          throw new Error('Invalid date format');
        }
      } catch (dateErr) {
        console.error('❌ Date parsing error:', dateErr.message);
        throw new Error('Invalid date/time format provided', { cause: dateErr });
      }

      const endTime = new Date(startTime.getTime() + 15 * 60 * 1000); // 15-min call

      // Create event WITHOUT conference data initially
      // Google Calendar might auto-generate a Hangout link
      // Note: Don't mix ISO dateTime with timeZone field - use one or the other
      const event = {
        summary: 'SaxsProjects 15-Min Technical Scope Consultation',
        description: `Free 15-minute consultation with ${attendeeEmail}.`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() }
      };

      console.log(`📅 Attempting to create calendar event on primary calendar...`);
      
      let response;
      try {
        // Create on service account's primary calendar
        response = await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
          conferenceDataVersion: 1,
          resource: {
            ...event,
            conferenceData: {
              createRequest: {
                requestId: `saxs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' }
              }
            }
          }
        });
        console.log('✅ Calendar event created successfully on primary calendar.');
      } catch (insertErr) {
        console.error(`❌ Failed to create calendar event. Error: ${insertErr.message}`);
        if (insertErr.errors) {
          console.error('Detailed error:', insertErr.errors);
        }
        throw insertErr;
      }

      // Try to extract any Meet link from the response
      if (response.data.hangoutLink) {
        console.log('✅ Google Hangout link from event:', response.data.hangoutLink);
        return response.data.hangoutLink;
      }

      // Try conferenceData if it was auto-created
      if (response.data.conferenceData && response.data.conferenceData.entryPoints) {
        const meetEntryPoint = response.data.conferenceData.entryPoints.find(ep => ep.entryPointType === 'video');
        if (meetEntryPoint && meetEntryPoint.uri) {
          console.log('✅ Real Google Meet link from calendar event:', meetEntryPoint.uri);
          return meetEntryPoint.uri;
        }
      }

      // Never invent a meeting URL: a made-up meet.google.com link sends the
      // client to a meeting that doesn't exist.
      console.error('❌ Calendar event created but Google returned no Meet link.');
      throw new Error('Google Calendar did not return a Meet link');
      
    } catch (error) {
      console.error('❌ Google Calendar API error:', error.message);
      throw error;
    }
  } else {
    console.log('❌ No Google authentication client available. Cannot create real Google Meet link.');
    throw new Error('Google Calendar authentication not configured');
  }
};

// ========================================================
// 4. CONSULTATION CONFIRMATION EMAIL
// ========================================================
const sendBookingEmail = async (booking) => {
  const ownerEmail = process.env.INQUIRY_RECIPIENT_EMAIL || BUSINESS_EMAIL;
  const name = escapeHtml(booking.name);
  const when = booking.startsAt.toLocaleString('en-ZA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Johannesburg',
  });
  const how = booking.meetLink
    ? `<p style="margin:0;">Join on Google Meet: <a href="${escapeHtml(booking.meetLink)}">${escapeHtml(booking.meetLink)}</a></p>`
    : `<p style="margin:0;">We'll ${booking.phone ? `phone you on ${escapeHtml(booking.phone)}` : 'email you a video-call link'} at this time.</p>`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #15233F;">
      <h2 style="color: #0066FF; margin-bottom: 4px;">SaxsProjects</h2>
      <p style="color:#555; margin-top:0;">Free 15-minute consultation</p>
      <p>Hi ${name},</p>
      <p>Your consultation is booked for <strong>${escapeHtml(when)} (SAST)</strong>.</p>
      ${how}
      <p>The calendar invite is attached. Need to change the time? Just reply to this email or WhatsApp us on +27 61 399 1212.</p>
      <p style="color:#888; font-size:12px; margin-top:24px;">SaxsProjects · ${escapeHtml(BUSINESS_EMAIL)} · 071 413 5824 / 061 399 1212</p>
    </div>`;
  const ics = buildIcs({
    uid: `booking-${booking._id}@saxsprojects.co.za`,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    summary: 'SaxsProjects free 15-minute consultation',
    description: `Consultation with ${booking.name}.${booking.meetLink ? ` Google Meet: ${booking.meetLink}` : ''}${booking.phone ? ` Phone: ${booking.phone}` : ''}`,
    location: booking.meetLink || (booking.phone ? `Phone: ${booking.phone}` : 'Online'),
    organizerEmail: process.env.SMTP_FROM || process.env.SMTP_USER || BUSINESS_EMAIL,
    organizerName: 'SaxsProjects',
    attendeeEmail: booking.email,
  });

  if (smtpConfigured()) {
    await sendMail({
      to: booking.email,
      bcc: ownerEmail, // so the booking also lands in your inbox
      replyTo: ownerEmail,
      subject: `Booked: SaxsProjects consultation on ${booking.date} at ${booking.time} (SAST)`,
      html,
      icalEvent: { method: 'REQUEST', filename: 'consultation.ics', content: ics },
    });
    return;
  }

  if (IS_PRODUCTION) {
    throw new Error('SMTP is not configured; cannot send booking confirmation');
  }
  console.log(`✉️  [dev] Booking confirmation for ${booking.email} on ${booking.date} ${booking.time} (SMTP not configured; not sent)`);
};

// ========================================================
// 5. LIVE CHAT AI ASSISTANT AUTORESPONDER (GEMINI API)
// ========================================================
const runAIEngine = async (question) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const systemPrompt = `You are the SaxsProjects assistant. Only answer questions about SaxsProjects and its services; politely redirect anything else.

Facts (do not invent anything beyond these):
- SaxsProjects is a South African software studio in Thohoyandou, Limpopo, serving clients across South Africa remotely.
- Services: business websites, custom web applications, Android/iOS apps, database design, computer and laptop repairs and software updates, and learning support (tutoring and coding mentorship) for students.
- Pricing: we don't publish prices. Every client gets a free, fixed written quotation after a short chat about what they need. Payment is a 50% deposit to start and 50% before launch.
- Free 15-minute consultation: book on the website's Contact page, Monday to Friday, 09:30-16:30 SAST.
- Contact: ${BUSINESS_EMAIL}, phone 071 413 5824, WhatsApp +27 61 399 1212.
- We reply within one business day.
Never quote a price, promise a deadline, or agree to terms; say the written quotation will confirm those.`;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        systemInstruction: systemPrompt
      });
      const result = await model.generateContent(question);
      return result.response.text().trim();
    } catch (error) {
      console.error('Gemini API error:', error.message);
    }
  }

  // Simple keyword fallback (no AI key configured, or the AI call failed)
  const q = String(question || '').toLowerCase();
  if (/(cost|price|pricing|rate|fee|zar|rand|how much|quote)/.test(q)) {
    return `Every project is different, so we give each client a free, fixed written quotation. Tell us what you need on the Contact page, by WhatsApp (+27 61 399 1212) or at ${BUSINESS_EMAIL}, and we'll reply within one business day.`;
  }
  if (/(consult|book|call|meeting|appointment)/.test(q)) {
    return 'You can book a free 15-minute consultation on our Contact page, Monday to Friday, 09:30-16:30 (SAST). You will get a calendar invite by email.';
  }
  if (/(website|web app|mobile|app|database|repair|laptop|tutor|mentor|learning)/.test(q)) {
    return 'We build business websites, web apps and mobile apps, design databases, repair and update computers, and offer tutoring and coding mentorship. Tell us a little about what you need and we will send you a written quotation.';
  }
  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(q)) {
    return 'Hi! Thanks for getting in touch with SaxsProjects. How can we help you today?';
  }
  return `Thanks for your message. A member of the SaxsProjects team will reply within one business day. For anything urgent, WhatsApp us on +27 61 399 1212.`;
};

// ========================================================
// 6. FIRESTORE REAL-TIME BACKGROUND LISTENER
// ========================================================
// Off by default: automatic replies to clients must be switched on deliberately
// (CHAT_AUTOREPLY_ENABLED=true) and their wording checked first.
if (firebaseAdminActive && process.env.CHAT_AUTOREPLY_ENABLED === 'true' && process.env.NODE_ENV !== 'test') {
  try {
    console.log('Starting Firestore chat auto-reply listener...');

    db.collection('chats').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        // Look at subcollection messages
        if (change.type === 'added' || change.type === 'modified') {
          const docId = change.doc.id; // Usually the email of the client or the public chat id
          
          // Fetch the message array or subcollection
          const messagesRef = db.collection('chats').doc(docId).collection('messages');
          const messagesSnap = await messagesRef.orderBy('timestamp', 'desc').limit(1).get();
          
          if (!messagesSnap.empty) {
            const latestMsg = messagesSnap.docs[0].data();
            
            // Auto-respond ONLY if message is from 'client' or 'user', and was sent recently
            // and we haven't already replied to this message ID
            if ((latestMsg.sender === 'client' || latestMsg.sender === 'user') && latestMsg.text) {
              
              // Simple check to avoid circular loop
              if (latestMsg.isProcessed) return;

              console.log(`Live Firestore Chat Activity detected from: ${docId}. Content: "${latestMsg.text}"`);
              
              // Flag as processed immediately
              await messagesRef.doc(messagesSnap.docs[0].id).update({ isProcessed: true });

              // Run NLP Autoresponse
              const replyText = await runAIEngine(latestMsg.text);

              // Wait 1 second to simulate natural typing speed
              setTimeout(async () => {
                await messagesRef.add({
                  sender: docId.startsWith('public_') ? 'support' : 'dev',
                  text: replyText,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  timestamp: FieldValue.serverTimestamp(),
                  isProcessed: true
                });
                console.log(`Dispatched AI autoresponse to ${docId} successfully.`);
              }, 1000);
            }
          }
        }
      });
    });
  } catch (error) {
    console.error('Failed to bind real-time Firestore listener:', error);
  }
}

// ========================================================
// 7. EXPRESS API ENDPOINTS
// ========================================================

// A. Clients Management
app.post('/api/clients', authMiddleware, adminOnly, async (req, res) => {
  const { email, name, businessName, contactInfo, activeQuote } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Name are required.' });
  }

  try {
    let client = await Client.findOne({ email: email.toLowerCase() });
    if (client) {
      client.name = name;
      client.businessName = businessName || client.businessName;
      client.contactInfo = contactInfo || client.contactInfo;
      await client.save();
    } else {
      client = new Client({
        email: email.toLowerCase(),
        name,
        businessName,
        contactInfo
      });
      await client.save();
    }

    // Auto-create a Project matching their activeQuote configuration if one is passed
    if (activeQuote) {
      let project = await Project.findOne({ clientEmail: email.toLowerCase() });
      if (!project) {
        const featureStr = activeQuote.featureList && activeQuote.featureList.length > 0
          ? ` (Features: ${activeQuote.featureList.join(', ')})`
          : '';
        
        project = new Project({
          clientEmail: email.toLowerCase(),
          title: `${businessName || name}'s System Portal`,
          tier: `${activeQuote.type} - ${activeQuote.pages}${featureStr}`,
          progress: 10,
          status: 'Lead synced from Quote. Scope review scheduled.',
          cost: activeQuote.price,
          timeline: activeQuote.timeline,
          milestones: [
            { name: "Inquiry & Quote Synced", status: "completed" },
            { name: "Consultation Call Scheduled", status: "active" },
            { name: "Milestone Agreement & Deposit", status: "pending" },
            { name: "Scaffolding Development", status: "pending" },
            { name: "Review & Custom Adjustments", status: "pending" },
            { name: "Production Launch", status: "pending" }
          ]
        });
        await project.save();

        // Also seed default billing records matching the 50/50 ZAR split!
        const depositAmount = `R${activeQuote.deposit.toLocaleString()} ZAR`;
        const balanceAmount = `R${activeQuote.balance.toLocaleString()} ZAR`;
        
        const depositInvoice = new Billing({
          clientEmail: email.toLowerCase(),
          invoiceId: `INV-2026-D${Math.floor(100 + Math.random() * 900)}`,
          title: "Initial 50% Deposit",
          desc: `Upfront scope sign-off fee for ${activeQuote.type}`,
          amount: depositAmount,
          status: "PENDING"
        });
        await depositInvoice.save();

        const balanceInvoice = new Billing({
          clientEmail: email.toLowerCase(),
          invoiceId: `INV-2026-B${Math.floor(100 + Math.random() * 900)}`,
          title: "Final 50% Balance",
          desc: "Production delivery & launch fee",
          amount: balanceAmount,
          status: "PENDING RELEASE"
        });
        await balanceInvoice.save();
      }
    }

    res.status(200).json(client);
  } catch (error) {
    console.error('Error in POST /api/clients:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// B. Projects Management (Authenticated Client & Developer Routes)
app.get('/api/projects/my-project', authMiddleware, async (req, res) => {
  const clientEmail = targetClientEmail(req);

  try {
    let project = await Project.findOne({ clientEmail });
    if (!project) {
      // Create a default project layout if none exists yet, allowing direct logins to see a draft workspace
      project = new Project({
        clientEmail,
        title: `${req.user.name || 'Your'} Project`,
        tier: 'To be confirmed',
        progress: 0,
        status: 'Enquiry received. We will confirm your scope and quote.',
        cost: 'To be quoted',
        timeline: 'To be confirmed',
        milestones: [
          { name: "Enquiry Received", status: "completed" },
          { name: "Scope Call & Written Quote", status: "active" },
          { name: "Agreement & Deposit", status: "pending" },
          { name: "Design & Development", status: "pending" },
          { name: "Review & Launch", status: "pending" },
          { name: "30-Day Support", status: "pending" }
        ]
      });
      await project.save();
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Developer Fetch All Client Projects
app.get('/api/projects', authMiddleware, adminOnly, async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Developer Create or Update Project Details
app.post('/api/projects', authMiddleware, adminOnly, async (req, res) => {
  const { clientEmail, title, tier, progress, status, cost, timeline, milestones } = req.body;
  if (!clientEmail) {
    return res.status(400).json({ error: 'Client Email is required.' });
  }

  try {
    let project = await Project.findOne({ clientEmail: clientEmail.toLowerCase() });
    if (project) {
      project.title = title || project.title;
      project.tier = tier || project.tier;
      project.progress = progress !== undefined ? progress : project.progress;
      project.status = status || project.status;
      project.cost = cost || project.cost;
      project.timeline = timeline || project.timeline;
      if (milestones) {
        project.milestones = milestones;
      }
      await project.save();
    } else {
      project = new Project({
        clientEmail: clientEmail.toLowerCase(),
        title: title || 'Custom Project',
        tier: tier || 'Standard Tier',
        progress: progress || 0,
        status: status || 'Initiated',
        cost: cost || 'To be quoted',
        timeline: timeline || '10 Days',
        milestones: milestones || []
      });
      await project.save();
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// C. Billing & Invoicing API
app.get('/api/billing/my-invoices', authMiddleware, async (req, res) => {
  const clientEmail = targetClientEmail(req);

  try {
    const invoices = await Billing.find({ clientEmail });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching billing invoices:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Route to Get Invoices for specific client
app.get('/api/billing/client/:email', authMiddleware, adminOnly, async (req, res) => {
  try {
    const invoices = await Billing.find({ clientEmail: req.params.email.toLowerCase() });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Add Invoice
app.post('/api/billing', authMiddleware, adminOnly, async (req, res) => {
  const { clientEmail, invoiceId, title, desc, amount, status } = req.body;
  if (!clientEmail || !invoiceId || !title || !amount) {
    return res.status(400).json({ error: 'Client Email, Invoice ID, Title, and Amount are required.' });
  }

  try {
    const invoice = new Billing({
      clientEmail: clientEmail.toLowerCase(),
      invoiceId,
      title,
      desc,
      amount,
      status: status || 'PENDING'
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Toggle Invoice Status (PENDING vs PAID)
app.put('/api/billing/:id/status', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    const invoice = await Billing.findOne({ invoiceId: req.params.id });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    invoice.status = status;
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Delete Invoice
app.delete('/api/billing/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await Billing.deleteOne({ invoiceId: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.status(200).json({ success: true, message: 'Invoice removed successfully.' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// D. Consultation booking
// Books a free 15-minute call: validates the slot, saves it (a database index
// prevents double-booking), adds a Google Meet link when Google Calendar is
// configured, and emails a confirmation with a calendar invite.
const googleCalendarConfigured = () =>
  Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)) &&
  process.env.GOOGLE_MEET_ENABLED === 'true';

app.post('/api/schedule', publicFormLimiter, async (req, res) => {
  const { email, name, phone, dateTimeString, website } = req.body || {};
  if (website) return res.status(200).json({ success: true });

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ error: 'A valid email address is required for the calendar invite.' });
  }
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Your name is required.' });
  }
  const slot = parseSlot(dateTimeString);
  if (slot.error) return res.status(400).json({ error: slot.error });

  let booking;
  try {
    booking = await Booking.create({
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
      date: slot.date,
      time: slot.time,
      email: String(email).toLowerCase(),
      name: String(name).trim().slice(0, 200),
      phone: phone ? String(phone).trim().slice(0, 40) : undefined,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ error: 'Sorry, that time has just been booked. Please choose another slot.' });
    }
    console.error('Error saving booking:', error);
    return res.status(500).json({ error: 'Could not save the booking.' });
  }

  if (googleCalendarConfigured()) {
    try {
      const link = await generateGoogleMeetLink(slot.startsAt.toISOString(), booking.email);
      if (typeof link === 'string' && link.startsWith('https://meet.google.com/')) {
        booking.meetLink = link;
        await booking.save();
      }
    } catch (meetErr) {
      console.error('Google Meet link not created (continuing without it):', meetErr.message);
    }
  }

  try {
    await sendBookingEmail(booking);
  } catch (emailErr) {
    // Don't hold a slot the client was never told about: release it and let the
    // website fall back to a WhatsApp/email request.
    console.error('Booking confirmation email failed:', emailErr.message);
    await Booking.deleteOne({ _id: booking._id });
    return res.status(502).json({ error: 'We could not send your confirmation email. Please request the call by WhatsApp or email.' });
  }

  res.status(201).json({
    success: true,
    bookingId: booking._id,
    date: booking.date,
    time: booking.time,
    meetLink: booking.meetLink || null,
    message: 'Consultation booked. A confirmation with a calendar invite has been emailed.',
  });
});

// Times already taken on a day (YYYY-MM-DD), so the website can grey them out.
app.get('/api/schedule/booked-slots', async (req, res) => {
  const { date } = req.query;
  if (!isIsoDate(date)) {
    return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
  }
  try {
    const bookings = await Booking.find({ date, status: 'confirmed' }, { time: 1, _id: 0 }).lean();
    const bookedSlots = bookings.map((b) => b.time).sort();
    res.status(200).json({ date, bookedSlots, availableSlots: CONSULT_SLOTS.filter((t) => !bookedSlots.includes(t)) });
  } catch (error) {
    console.error('Error retrieving booked slots:', error);
    res.status(500).json({ error: 'Failed to retrieve booked slots.' });
  }
});

// ========================================================
// D.1. Inquiry Submission Endpoint (with Email Validation and Auto-Reply)
const sendInquiryEmail = async (adminEmail, rawClientEmail, rawClientName, rawBizName, rawDetails, rawQuote, extras = {}) => {
  const clientEmail = escapeHtml(rawClientEmail);
  const clientName = escapeHtml(rawClientName);
  const bizName = escapeHtml(rawBizName);
  const details = escapeHtml(rawDetails).replace(/\n/g, '<br>');
  const phone = escapeHtml(extras.phone);
  const service = escapeHtml(extras.service);
  const activeQuote = rawQuote ? {
    type: escapeHtml(rawQuote.type),
    pages: escapeHtml(rawQuote.pages),
    featureList: Array.isArray(rawQuote.featureList) ? rawQuote.featureList.map(escapeHtml) : [],
    price: escapeHtml(rawQuote.price),
    deposit: Number(rawQuote.deposit) || 0,
    balance: Number(rawQuote.balance) || 0,
    timeline: escapeHtml(rawQuote.timeline),
  } : null;

  // Email to admin
  const adminEmailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #070e17; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 700px; margin: 0 auto; border: 1px solid #1e3a5f;">
      <div style="text-align: center; border-bottom: 1px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 25px;">
        <h2 style="color: #0066ff; margin: 0; font-size: 24px; letter-spacing: 1px;">SaxsProjects</h2>
        <p style="color: #8da2bb; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase;">NEW PROJECT LEAD</p>
      </div>
      
      <h3 style="color: #0066ff; margin-bottom: 1rem;">New Inquiry from ${clientName}</h3>
      
      <div style="background: rgba(0, 102, 255, 0.04); border: 1px solid #0066ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Client Name:</strong> ${clientName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Business Name:</strong> ${bizName || 'Not provided'}</p>
        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${clientEmail}" style="color: #0066ff;">${clientEmail}</a></p>
        ${phone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
        ${service ? `<p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${service}</p>` : ''}
        <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
      </div>
      
      <h4 style="color: #0066ff; margin-top: 20px; margin-bottom: 10px;">Project Details:</h4>
      <div style="background: #0b1626; padding: 15px; border-radius: 8px; border-left: 3px solid #0066ff; margin-bottom: 20px;">
        <p style="margin: 0; line-height: 1.6; color: #dbe4ef;">${details || 'No details provided.'}</p>
      </div>
      
      ${activeQuote ? `
        <h4 style="color: #0066ff; margin-top: 20px; margin-bottom: 10px;">Associated Quote:</h4>
        <div style="background: rgba(0, 102, 255, 0.04); border: 1px solid #0066ff; padding: 15px; border-radius: 8px;">
          <p style="margin: 0 0 8px 0;"><strong>Package:</strong> ${activeQuote.type} (${activeQuote.pages})</p>
          <p style="margin: 0 0 8px 0;"><strong>Features:</strong> ${activeQuote.featureList.join(', ') || 'None'}</p>
          <p style="margin: 0 0 8px 0;"><strong>Total Cost:</strong> ${activeQuote.price}</p>
          <p style="margin: 0 0 8px 0;"><strong>Deposit Required:</strong> R${activeQuote.deposit.toLocaleString()} ZAR</p>
          <p style="margin: 0 0 8px 0;"><strong>Balance Due:</strong> R${activeQuote.balance.toLocaleString()} ZAR</p>
          <p style="margin: 0;"><strong>Timeline:</strong> ${activeQuote.timeline}</p>
        </div>
      ` : ''}
      
      <div style="border-top: 1px solid #1e3a5f; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #8da2bb;">
        <p style="margin: 0;">Inquiry received via SaxsProjects Lead System</p>
        <p style="margin: 5px 0 0 0;">Database stored and auto-reply sent to client.</p>
      </div>
    </div>
  `;

  // Auto-reply email to client
  const clientAutoReplyHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #070e17; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e3a5f;">
      <div style="text-align: center; border-bottom: 1px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 25px;">
        <h2 style="color: #0066ff; margin: 0; font-size: 24px; letter-spacing: 1px;">SaxsProjects</h2>
        <p style="color: #8da2bb; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase;">Inquiry Received ✓</p>
      </div>
      
      <p style="font-size: 15px; line-height: 1.6; color: #dbe4ef;">Hi ${clientName},</p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #dbe4ef;">Thank you for contacting <strong>SaxsProjects</strong>. We have received your enquiry.</p>
      
      <div style="background: rgba(0, 102, 255, 0.04); border: 1px solid #0066ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #8da2bb; text-transform: uppercase; font-weight: bold;">What Happens Next:</p>
        <ul style="margin: 0; padding-left: 20px; color: #dbe4ef;">
          <li style="margin-bottom: 8px;">We review your enquiry and reply within one business day</li>
          <li style="margin-bottom: 8px;">If needed, we set up a free 15-minute call to confirm the details</li>
          <li>You receive a fixed written quote with the scope, price and timeline</li>
        </ul>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #8da2bb;">In the meantime, feel free to reach out directly:</p>
      
      <div style="background: #0b1626; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0 0 8px 0; color: #dbe4ef;"><strong>📧 Email:</strong> ${escapeHtml(BUSINESS_EMAIL)}</p>
        <p style="margin: 0 0 8px 0; color: #dbe4ef;"><strong>📞 Phone:</strong> 071 413 5824 (Primary) / 061 399 1212 (Support)</p>
        <p style="margin: 0; color: #dbe4ef;"><strong>💬 WhatsApp:</strong> +27 61 399 1212</p>
      </div>
      
      <div style="border-top: 1px solid #1e3a5f; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #8da2bb;">
        <p style="margin: 0 0 5px 0;">SaxsProjects Digital Architecture</p>
        <p style="margin: 0;">Inquiry Reference: ${new Date().getTime()}</p>
      </div>
    </div>
  `;

  if (smtpConfigured()) {
    try {
      // Send to admin
      await sendMail({
        to: adminEmail,
        replyTo: rawClientEmail,
        subject: `[NEW LEAD] Inquiry from ${rawClientName} - ${rawBizName || 'No Business Name'}`.replace(/[\r\n]+/g, ' '),
        html: adminEmailHtml
      });

      // Send auto-reply to client
      await sendMail({
        to: rawClientEmail,
        subject: 'Thank you - your SaxsProjects enquiry has been received',
        html: clientAutoReplyHtml
      });

      console.log('Inquiry emails sent successfully to admin and client');
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send inquiry email', { cause: error });
    }
  }

  // In production a lead that only reaches the console is a lost lead.
  if (IS_PRODUCTION) {
    throw new Error('SMTP is not configured; cannot deliver inquiry email');
  }

  // Development fallback logging
  console.log('\n========================================================');
  console.log('📧 INQUIRY EMAIL (MOCK LOGGING):');
  console.log('TO ADMIN:', adminEmail);
  console.log('FROM CLIENT:', clientEmail);
  console.log('SUBJECT:', `[NEW LEAD] Inquiry from ${clientName}`);
  console.log('AUTO-REPLY SENT TO:', clientEmail);
  console.log('========================================================\n');
  return true;
};

app.post('/api/inquiries', publicFormLimiter, async (req, res) => {
  const { email, name, bizName, details, activeQuote, phone, service, consent, website } = req.body;

  // Honeypot: bots fill the hidden "website" field. Pretend success, do nothing.
  if (website) {
    return res.status(200).json({ success: true });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  if (!details || details.trim().length === 0) {
    return res.status(400).json({ error: 'Project details are required.' });
  }

  if (String(details).length > 5000 || String(name).length > 200) {
    return res.status(400).json({ error: 'Please keep your name under 200 and details under 5000 characters.' });
  }

  try {
    // Save inquiry to database
    let client = await Client.findOne({ email: email.toLowerCase() });
    const isNewClient = !client;

    if (!client) {
      client = new Client({
        email: email.toLowerCase(),
        name,
        businessName: bizName || 'Not specified',
        contactInfo: details
      });
    } else {
      client.name = name;
      client.businessName = bizName || client.businessName;
      client.contactInfo = details;
    }
    if (phone) client.phone = String(phone).slice(0, 40);
    if (service) client.service = String(service).slice(0, 120);
    if (consent) client.consentAt = new Date();
    await client.save();

    // Keep every enquiry, even from returning clients.
    const inquiry = await Inquiry.create({
      email: email.toLowerCase(),
      name: String(name).trim().slice(0, 200),
      phone: phone ? String(phone).slice(0, 40) : undefined,
      businessName: bizName ? String(bizName).slice(0, 200) : undefined,
      service: service ? String(service).slice(0, 120) : undefined,
      details: String(details).slice(0, 5000),
      quote: activeQuote || undefined,
      consentAt: consent ? new Date() : undefined,
    });

    // Send emails (inquiry recipient notification + auto-reply to client)
    const inquiryEmail = process.env.INQUIRY_RECIPIENT_EMAIL || BUSINESS_EMAIL;
    try {
      await sendInquiryEmail(inquiryEmail, email.toLowerCase(), name, bizName, details, activeQuote, { phone, service });
    } catch (emailErr) {
      // The enquiry is saved (visible in /api/admin/inquiries), but tell the visitor to use
      // another channel rather than wait for a reply that may not come.
      console.error('Inquiry email failed (inquiry saved):', emailErr.message);
      return res.status(502).json({ error: 'Your enquiry was saved but our email system is down. Please also WhatsApp or email us.', inquiryId: inquiry._id });
    }
    inquiry.emailDelivered = true;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry submitted successfully. Confirmation email sent.',
      inquiryId: inquiry._id,
      clientId: client._id,
      isNewClient
    });
  } catch (error) {
    console.error('Error in POST /api/inquiries:', error);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

// E. Chat Helper API Endpoint (REST Fallback for Floating Bubble AI)
app.post('/api/chat/respond', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  try {
    const responseText = await runAIEngine(text);
    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error('Error in chat API responder:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ========================================================
// 8. ADMIN ANALYTICS & MANAGEMENT ENDPOINTS
// ========================================================

// Public liveness probe for hosting/uptime monitors (exposes no data)
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, database: mongoose.connection.readyState === 1, email: smtpConfigured() });
});

// Admin Health Check Endpoint
app.get('/api/health/check', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Test MongoDB connection
    const mongoTest = await Client.countDocuments();
    const projectTest = await Project.countDocuments();
    const billingTest = await Billing.countDocuments();
    
    res.status(200).json({
      status: 'healthy',
      mongodb: true,
      timestamp: new Date(),
      collections: {
        clients: mongoTest,
        projects: projectTest,
        invoices: billingTest
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      mongodb: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Test Database Connection (admin only)
app.get('/api/test/database', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Test MongoDB connection
    await mongoose.connection.db.admin().ping();
    
    const clientCount = await Client.countDocuments();
    const projectCount = await Project.countDocuments();
    const invoiceCount = await Billing.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      database: {
        status: 'connected',
        timestamp: new Date(),
        collections: {
          clients: clientCount,
          projects: projectCount,
          invoices: invoiceCount
        }
      },
      mongodb: {
        version: mongoose.version,
        connection: 'active'
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Admin Get Statistics
app.get('/api/admin/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const totalProjects = await Project.countDocuments();
    const allInvoices = await Billing.find({});
    
    let totalRevenue = 0;
    let pendingInvoices = 0;
    
    allInvoices.forEach(inv => {
      if (inv.status === 'PAID') {
        const amount = parseInt(inv.amount.replace(/[^0-9]/g, ''));
        if (!isNaN(amount)) totalRevenue += amount;
      } else if (inv.status === 'PENDING') {
        pendingInvoices++;
      }
    });

    res.status(200).json({
      totalClients,
      totalProjects,
      totalRevenue: `R${totalRevenue.toLocaleString()} ZAR`,
      pendingInvoices,
      dbStatus: 'connected',
      apiStatus: 'connected'
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});

// Admin Get All Invoices
app.get('/api/admin/invoices', authMiddleware, adminOnly, async (req, res) => {
  try {
    const invoices = await Billing.find({}).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching all invoices:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Delete Project
app.delete('/api/admin/projects/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await Project.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Get All Clients
app.get('/api/admin/clients', authMiddleware, adminOnly, async (req, res) => {
  try {
    const clients = await Client.find({}).sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Delete Client
app.delete('/api/admin/clients/:email', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await Client.deleteOne({ email: req.params.email.toLowerCase() });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Client not found.' });
    }
    res.status(200).json({ success: true, message: 'Client deleted successfully.' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ========================================================
// 8.5. ADMIN: ENQUIRIES AND BOOKINGS
// ========================================================
const INQUIRY_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost', 'spam'];
const BOOKING_STATUSES = ['confirmed', 'cancelled', 'completed', 'no_show'];

app.get('/api/admin/inquiries', authMiddleware, adminOnly, async (req, res) => {
  const filter = INQUIRY_STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
  try {
    res.status(200).json(await Inquiry.find(filter).sort({ createdAt: -1 }).limit(limit).lean());
  } catch (error) {
    console.error('Error listing inquiries:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.patch('/api/admin/inquiries/:id', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body || {};
  if (!INQUIRY_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${INQUIRY_STATUSES.join(', ')}` });
  }
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Inquiry not found.' });
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found.' });
  res.status(200).json(inquiry);
});

app.get('/api/admin/bookings', authMiddleware, adminOnly, async (req, res) => {
  const filter = {};
  if (BOOKING_STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (req.query.upcoming === 'true') filter.startsAt = { $gte: new Date() };
  try {
    res.status(200).json(await Booking.find(filter).sort({ startsAt: 1 }).limit(500).lean());
  } catch (error) {
    console.error('Error listing bookings:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.patch('/api/admin/bookings/:id', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body || {};
  if (!BOOKING_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${BOOKING_STATUSES.join(', ')}` });
  }
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Booking not found.' });
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  res.status(200).json(booking);
});

// ========================================================
// 8.6. BLOG MANAGEMENT ENDPOINTS
// ========================================================
import Blog from './models/Blog.js';

// Get all published blog posts (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const posts = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .lean();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get single blog post by slug
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true }).lean();
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }
    // Increment view count
    await Blog.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin: Create new blog post
app.post('/api/admin/blogs', authMiddleware, adminOnly, async (req, res) => {
  const { title, category, content, excerpt, tags, featured } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  try {
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const post = new Blog({
      title,
      slug,
      category: category || 'General',
      content,
      excerpt: excerpt || content.substring(0, 150),
      tags: tags || [],
      published: true,
      featured: featured || false,
      publishedAt: new Date()
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A blog post with this slug already exists.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin: Update blog post
app.put('/api/admin/blogs/:id', authMiddleware, adminOnly, async (req, res) => {
  const { title, category, content, excerpt, tags, published, featured } = req.body;

  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    if (title) {
      post.title = title;
      // Regenerate slug only if title changed
      post.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    if (category) post.category = category;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;
    if (featured !== undefined) post.featured = featured;
    post.updatedAt = new Date();

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin: Delete blog post
app.delete('/api/admin/blogs/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }
    res.status(200).json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin: Get all blog posts (including unpublished)
app.get('/api/admin/blogs', authMiddleware, adminOnly, async (req, res) => {
  try {
    const posts = await Blog.find({}).sort({ publishedAt: -1 }).lean();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ========================================================
// 9. ERRORS, BOOTSTRAP AND SHUTDOWN
// ========================================================
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request is too large.' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

export { app };

export async function start() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. The API cannot store enquiries or bookings.');
    if (IS_PRODUCTION) process.exit(1);
  } else {
    try {
      await mongoose.connect(MONGODB_URI);
      await Promise.all([Booking.syncIndexes(), Inquiry.syncIndexes()]);
      console.log('✅ Connected to MongoDB.');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      if (IS_PRODUCTION) process.exit(1);
    }
  }
  const server = app.listen(PORT, () => {
    console.log(`🚀 SaxsProjects backend listening on port ${PORT}`);
  });
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await mongoose.disconnect().catch(() => {});
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  start();
}
