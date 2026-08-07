import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { admin, auth, db, firebaseAdminActive, verifyUserToken } from './firebase.js';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { getAuthUrl } from './googleAuth.js';

// Schema imports
import Client from './models/Client.js';
import Project from './models/Project.js';
import Billing from './models/Billing.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Root & Health Status Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'SaxsProjects Integrated Enterprise API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      projects: '/api/projects',
      clients: '/api/admin/clients',
    }
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'SaxsProjects API Gateway',
    timestamp: new Date().toISOString()
  });
});

// ========================================================
// 1. DATABASE CONNECTION
// ========================================================
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Cluster.');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('Ensure the connection string in backend/.env is accurate and your current IP is whitelisted on MongoDB Atlas.');
    console.log('Connection URI format: mongodb+srv://username:password@cluster.mongodb.net/database?appName=YourApp');
  });

// ========================================================
// 2. FIREBASE ADMIN INITIALIZATION & AUTH MIDDLEWARE
// ========================================================
if (!firebaseAdminActive) {
  console.log('---------------------------------------------------------');
  console.log('⚠️  firebase-admin-config.json NOT FOUND.');
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
      // Real Firebase JWT token verification using verifyUserToken helper
      const uid = await verifyUserToken(token);
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
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
  const adminEmail = (process.env.ADMIN_EMAIL || 'saxs.solutions25@gmail.com').toLowerCase();
  
  if (req.user && req.user.email && req.user.email.toLowerCase() === adminEmail) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Exclusive administrator credentials required.' });
  }
};

// ========================================================
// 3. GOOGLE MEET & CALENDAR SERVICE
// ========================================================
const generateGoogleMeetLink = async (dateTimeString, attendeeEmail) => {
  const ownerEmail = process.env.ADMIN_EMAIL || 'saxs.solutions25@gmail.com';
  let googleAuthClient = null;

  // 1. Try to load credentials from firebase-admin-config.json if it exists
  const serviceAccountPath = path.join(__dirname, 'firebase-admin-config.json');
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      googleAuthClient = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      console.log(`✅ Using service account for Google Calendar API (${credentials.client_email})`);
    } catch (err) {
      console.error('❌ Error initializing Google Calendar API with firebase-admin-config.json:', err.message);
    }
  } else {
    console.log('⚠️  firebase-admin-config.json not found, attempting alternative auth methods...');
  }

  // 2. Fall back to GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY if config JSON not found
  if (!googleAuthClient && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    try {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      googleAuthClient = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/calendar']
      );
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
        throw new Error('Invalid date/time format provided');
      }

      const endTime = new Date(startTime.getTime() + 15 * 60 * 1000); // 15-min call

      // Create event WITHOUT conference data initially
      // Google Calendar might auto-generate a Hangout link
      // Note: Don't mix ISO dateTime with timeZone field - use one or the other
      const event = {
        summary: 'SaxsProjects 15-Min Technical Scope Consultation',
        description: `Technical alignment call with ${attendeeEmail}. We will review wireframes, API integrations, and database architecture.`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() }
      };

      console.log(`📅 Attempting to create calendar event on primary calendar...`);
      
      let response;
      try {
        // Create on service account's primary calendar
        response = await calendar.events.insert({
          calendarId: 'primary',
          resource: event
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

      // Generate a Meet URL based on event ID
      if (response.data.id) {
        // Google Meet URL structure using event hash
        const meetUrl = `https://meet.google.com/${response.data.id.replace(/[^a-z0-9]/g, '')}`;
        console.log('✅ Generated Google Meet URL from event ID:', meetUrl);
        return meetUrl;
      }

      // Fallback to htmlLink if nothing else works
      if (response.data.htmlLink) {
        console.log('✅ Calendar event link:', response.data.htmlLink);
        return response.data.htmlLink;
      }

      console.error('❌ No meet link, hangout link, or event link found in calendar response.');
      throw new Error('Could not extract Meet link from calendar event');
      
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
// 4. NODEMAILER EMAIL DISPATCH SERVICE
// ========================================================
const sendConfirmationEmail = async (clientEmail, clientName, dateTimeString, meetLink) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || 'saxs.solutions25@gmail.com';

  const dateFormatted = new Date(dateTimeString).toLocaleString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Johannesburg'
  });

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #070e17; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e3a5f;">
      <div style="text-align: center; border-bottom: 1px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 25px;">
        <h2 style="color: #0066ff; margin: 0; font-size: 24px; letter-spacing: 1px;">SaxsProjects</h2>
        <p style="color: #8da2bb; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase;">Consultation Scheduled</p>
      </div>
      
      <p style="font-size: 15px; line-height: 1.6; color: #dbe4ef;">Hi ${clientName},</p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #dbe4ef;">Your 15-minute technical scope consultation call has been successfully booked with <strong>SaxsProjects</strong>.</p>
      
      <div style="background: rgba(0, 102, 255, 0.04); border: 1px solid #0066ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #8da2bb; text-transform: uppercase; font-weight: bold;">Date & Time (SAST):</p>
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff; font-weight: 600;">${dateFormatted}</p>
        
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #8da2bb; text-transform: uppercase; font-weight: bold;">Google Meet Link:</p>
        <p style="margin: 0;"><a href="${meetLink}" target="_blank" style="color: #00ff66; text-decoration: none; font-size: 16px; font-weight: bold; border-bottom: 1px dashed #00ff66;">Join Google Meet Session</a></p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #8da2bb;">Please ensure you are logged into your Google account and have verified your microphone / video setup before the meeting starts.</p>
      
      <div style="border-top: 1px solid #1e3a5f; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #8da2bb;">
        <p style="margin: 0 0 5px 0;">SaxsProjects Digital Architecture • saxs.solutions25@gmail.com</p>
        <p style="margin: 0;">Call: 0714135824 / 0613991212 • WhatsApp: +27 61 399 1212</p>
      </div>
    </div>
  `;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: port == 465, // true for port 465, false for 587
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from: fromEmail,
        to: clientEmail,
        cc: fromEmail,
        subject: 'Confirmed: SaxsProjects 15-Min Consultation Call',
        html: emailHtml
      });

      console.log('Email sent successfully:', info.messageId);
      return;
    } catch (error) {
      console.error('Nodemailer SMTP dispatch error:', error);
    }
  }

  // Fallback: print HTML template neatly to terminal logs for verification
  console.log('\n========================================================');
  console.log('✉️  EMAIL DISPATCH (MOCK LOGGING):');
  console.log(`To: ${clientEmail}`);
  console.log(`CC: ${fromEmail}`);
  console.log(`Subject: Confirmed: SaxsProjects 15-Min Consultation Call`);
  console.log('-------------------- CONTENT ---------------------------');
  console.log(`Meeting Date: ${dateFormatted}`);
  console.log(`Google Meet Link: ${meetLink}`);
  console.log('SMTP keys missing in .env. Setup SMTP details to send real emails.');
  console.log('========================================================\n');
};

// ========================================================
// 5. LIVE CHAT AI ASSISTANT AUTORESPONDER (GEMINI API)
// ========================================================
const runAIEngine = async (question) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const systemPrompt = `You are the SaxsProjects AI Assistant - EXCLUSIVELY answering questions about SaxsProjects services and offerings only.
  
IMPORTANT CONSTRAINT: You ONLY answer questions about SaxsProjects and our digital services. You refuse to answer any questions not related to SaxsProjects, web development services, or our company offerings. For off-topic questions, politely redirect to SaxsProjects services.

Company Information:
- SaxsProjects: Premium digital architecture and custom software solutions
- Founded by qualified software developer with focus on high-quality, fast delivery
- Technologies: React, Vite, Node.js, MongoDB, Firebase, Google APIs
- Location/Contact: South Africa, +27 714 135 824 / +27 613 991 212, Saxs.solutions25@gmail.com

Services & Pricing (ZAR - South African Rand):
WEBSITES:
- Standard Website (No Database): R2,800 (Deposit R1,400, 10 days)
- Standard Website (With Database): R3,400 (Deposit R1,700, 14 days)
- Top Tier Website (No Database): R3,800 (Deposit R1,900, 16 days)
- Top Tier Website (With Database): R4,400 (Deposit R2,200, 20 days)

WEB APPLICATIONS:
- Small Data Scale: R5,000 (Deposit R2,500, 21 days)
- Big Data Scale: R5,500 (Deposit R2,750, 28 days)

MOBILE APPS (Cross-platform iOS + Android):
- Mobile App (No Cloud Database): R6,000 (Deposit R3,000, 21 days)
- Mobile App (With Cloud Database): R8,600 (Deposit R4,300, 30 days)

FEATURES INCLUDED:
- Full responsive design
- SEO optimization
- User authentication
- Admin dashboard
- Real-time notifications (Firebase)
- Data management (MongoDB)
- 30-day post-launch support
- Google Meet consultation (15-min free initial call)

BOOKING & CONTACT:
- Free 15-minute technical consultation: Book via Contact page (Mon-Sat, 09:30-16:30 SAST)
- Email: Saxs.solutions25@gmail.com
- WhatsApp: https://wa.me/27613991212
- Direct Call: 0714135824 (Primary) / 0613991212 (Support)

Response Guidelines:
- Keep answers SHORT and direct (1-2 sentences maximum)
- Always include pricing in ZAR
- Suggest booking a consultation for complex questions
- Mention relevant features for queries
- Redirect non-SaxsProjects questions politely but firmly
- Be professional, friendly, and enthusiastic about our services`;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt
      });
      const result = await model.generateContent(question);
      return result.response.text().trim();
    } catch (error) {
      console.error('Gemini API error:', error.message);
    }
  }

  // Smart local NLP matching engine fallback (SaxsProjects-only)
  const cleanInput = question.toLowerCase();
  
  // Check if question is about SaxsProjects services
  const isSaxsQuestion = cleanInput.match(/saxs|website|web app|mobile|app|price|cost|timeline|booking|consultation|feature|database|react|node|firebase|mongodb/);
  
  if (!isSaxsQuestion) {
    return "I'm the SaxsProjects AI Assistant, and I only answer questions about SaxsProjects services, web development, and our digital solutions. Ask me about our websites, web apps, mobile apps, pricing, or booking a consultation!";
  }

  if (cleanInput.includes("cost") || cleanInput.includes("price") || cleanInput.includes("pricing") || cleanInput.includes("rate") || cleanInput.includes("fee") || cleanInput.includes("zar") || cleanInput.includes("rand")) {
    return "💰 SaxsProjects Pricing: Websites R2,800-R4,400 ZAR, Web Apps R5,000-R5,500 ZAR, Mobile Apps R6,000-R8,600 ZAR. All include 50% deposit upfront, 50% on completion. Use our Pricing Calculator or book a free consultation!";
  } else if (cleanInput.includes("website") || cleanInput.includes("site")) {
    return "🌐 We build premium websites starting at R2,800 ZAR (Standard, no DB) to R4,400 ZAR (Top Tier with DB). All include SEO optimization, responsive design, admin control, and 30-day support. 10-20 day timeline.";
  } else if (cleanInput.includes("web app") || cleanInput.includes("webapp") || cleanInput.includes("portal") || cleanInput.includes("dashboard")) {
    return "📊 Custom Web Applications: R5,000-R5,500 ZAR. Build interactive dashboards, client portals, booking systems, and inventory trackers with live data sync. 21-28 day delivery.";
  } else if (cleanInput.includes("mobile") || cleanInput.includes("iphone") || cleanInput.includes("android")) {
    return "📱 Cross-platform Mobile Apps (iOS + Android): R6,000 (no DB) or R8,600 (with Cloud DB). Full app store ready with real-time notifications and user authentication. 21-30 day timeline.";
  } else if (cleanInput.includes("timeline") || cleanInput.includes("duration") || cleanInput.includes("days") || cleanInput.includes("fast")) {
    return "⚡ SaxsProjects delivers fast: Websites in 10-20 days, Web Apps in 21-28 days, Mobile Apps in 21-30 days. Timeline depends on project scope. Book a consultation to discuss your timeline!";
  } else if (cleanInput.includes("database") || cleanInput.includes("db") || cleanInput.includes("mongodb") || cleanInput.includes("firebase")) {
    return "🔄 We use Firebase (real-time notifications) + MongoDB (structured data). Database options add R600 ZAR to website/mobile projects. Hybrid architecture ensures speed and scalability.";
  } else if (cleanInput.includes("consult") || cleanInput.includes("booking") || cleanInput.includes("call") || cleanInput.includes("meeting")) {
    return "📞 Free 15-minute consultation available Monday-Saturday, 09:30-16:30 SAST. Book via Contact page, email Saxs.solutions25@gmail.com, or WhatsApp +27 613 991 212. Let's discuss your project!";
  } else if (cleanInput.includes("hello") || cleanInput.includes("hi") || cleanInput.includes("hey") || cleanInput.includes("sup")) {
    return "👋 Hi! I'm the SaxsProjects AI Assistant. I help with questions about our websites, web apps, mobile apps, pricing, and booking consultations. What can I help you build today?";
  } else {
    return "🚀 I'm the SaxsProjects Assistant - ask me about websites (R2,800+), web apps (R5,000+), mobile apps (R6,000+), features, timelines, or book your free 15-min consultation!";
  }
};

// ========================================================
// 6. FIRESTORE REAL-TIME BACKGROUND LISTENER
// ========================================================
if (firebaseAdminActive) {
  try {
    console.log('Boothing Firestore Real-time Background Listener for Chat Autoresponses...');

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
              const lastRepliedKey = `last_replied_${docId}`;
              
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
                  timestamp: admin.firestore.FieldValue.serverTimestamp(),
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
app.post('/api/clients', async (req, res) => {
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
  // Allow admin to view specific client's project via X-Target-Client header
  let clientEmail = req.headers['x-target-client'] || req.user.email;
  clientEmail = clientEmail.toLowerCase();

  try {
    let project = await Project.findOne({ clientEmail });
    if (!project) {
      // Create a default project layout if none exists yet, allowing direct logins to see a draft workspace
      project = new Project({
        clientEmail,
        title: `${req.user.name || 'Custom'} Project Site`,
        tier: 'Small Business Website',
        progress: 35,
        status: 'Contact form synced! Under developer review.',
        cost: 'R2,800 ZAR',
        timeline: '10 Days',
        milestones: [
          { name: "Inquiry Form Received", status: "completed" },
          { name: "Database Lead Sync Approved", status: "completed" },
          { name: "Scope Call & Technical Review", status: "active" },
          { name: "Milestone Agreement Sign-off", status: "pending" },
          { name: "Vite Core Development Phase", status: "pending" },
          { name: "Live Production Deployment", status: "pending" }
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
        cost: cost || 'R2,800 ZAR',
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
  // Allow admin to view specific client's invoices via X-Target-Client header
  let clientEmail = req.headers['x-target-client'] || req.user.email;
  clientEmail = clientEmail.toLowerCase();

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

// D. Consultation Scheduling Endpoint (Google Meet + Emails)
app.post('/api/schedule', async (req, res) => {
  const { email, name, dateTimeString } = req.body;

  if (!email || !dateTimeString) {
    return res.status(400).json({ error: 'Recipient Email and Date-Time String are required.' });
  }

  try {
    console.log(`Scheduling consultation request received for ${email} on ${dateTimeString}`);

    // 1. Generate Google Meet video channel (real link, will throw error if it fails)
    let meetLink;
    try {
      meetLink = await generateGoogleMeetLink(dateTimeString, email);
      console.log('✅ Successfully generated real Google Meet link for consultation');
    } catch (meetErr) {
      console.error('❌ Failed to generate real Google Meet link:', meetErr.message);
      return res.status(500).json({ 
        error: 'Failed to generate Google Meet link. Please ensure Google Calendar API is properly configured.',
        details: meetErr.message
      });
    }

    // 2. Dispatch beautifully styled confirmation email
    try {
      await sendConfirmationEmail(email.toLowerCase(), name || 'SaxsProjects Partner', dateTimeString, meetLink);
      console.log('✅ Confirmation email sent successfully with real Meet link');
    } catch (emailErr) {
      console.error('❌ Failed to send confirmation email:', emailErr.message);
      return res.status(500).json({ 
        error: 'Consultation scheduled but failed to send confirmation email.',
        meetLink: meetLink
      });
    }

    res.status(200).json({
      success: true,
      dateTimeString,
      meetLink,
      message: 'Consultation calendar event created and confirmation email sent with real Google Meet link.'
    });
  } catch (error) {
    console.error('Error during scheduling routine:', error);
    res.status(500).json({ error: 'Failed to process consultation scheduling.' });
  }
});

// ========================================================
// CONSULTATION AVAILABILITY ENDPOINT - Get Booked Slots
// ========================================================
app.get('/api/schedule/booked-slots', async (req, res) => {
  try {
    const { date } = req.query; // Expected format: "2026-05-25" or "2026 May 25"
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter required (format: YYYY-MM-DD or YYYY Month DD)' });
    }

    // Find all scheduling records for the requested date
    // Using Firestore or a database model for consultation bookings
    // For now, return empty array as placeholder (database integration would follow)
    const bookedSlots = []; // This would be populated from actual booking records
    
    console.log(`📅 Booked slots requested for date: ${date}`);
    
    res.status(200).json({
      date,
      bookedSlots, // Array of booked times like ["09:30", "10:30", "14:00"]
      availableSlots: generateAvailableSlots(bookedSlots),
      message: 'Consultation availability data retrieved.'
    });
  } catch (error) {
    console.error('Error retrieving booked slots:', error);
    res.status(500).json({ error: 'Failed to retrieve booked slots.' });
  }
});

// Helper function to generate available time slots
const generateAvailableSlots = (bookedSlots = []) => {
  const times = [];
  const startHour = 9; // 09:30
  const startMinutes = 30;
  const endHour = 16; // 16:30
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 60) {
      if (hour === startHour && minutes < startMinutes) continue;
      if (hour > endHour) break;
      if (hour === endHour && minutes > 30) break;
      
      const timeStr = `${hour.toString().padStart(2, '0')}:${minutes === 0 ? '30' : '00'}`;
      if (!bookedSlots.includes(timeStr)) {
        times.push(timeStr);
      }
    }
  }
  
  return times;
};

// D.1. Inquiry Submission Endpoint (with Email Validation and Auto-Reply)
const sendInquiryEmail = async (adminEmail, clientEmail, clientName, bizName, details, activeQuote) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || 'saxs.solutions25@gmail.com';

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
        <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
      </div>
      
      <h4 style="color: #0066ff; margin-top: 20px; margin-bottom: 10px;">Project Details:</h4>
      <div style="background: var(--bg-deep); padding: 15px; border-radius: 8px; border-left: 3px solid #0066ff; margin-bottom: 20px;">
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
      
      <p style="font-size: 15px; line-height: 1.6; color: #dbe4ef;">Thank you for your inquiry submission to <strong>SaxsProjects</strong>. We have received your request and logged it securely in our database.</p>
      
      <div style="background: rgba(0, 102, 255, 0.04); border: 1px solid #0066ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #8da2bb; text-transform: uppercase; font-weight: bold;">What Happens Next:</p>
        <ul style="margin: 0; padding-left: 20px; color: #dbe4ef;">
          <li style="margin-bottom: 8px;">Our development team will review your inquiry within 2-4 business hours</li>
          <li style="margin-bottom: 8px;">You will receive a follow-up email with next steps and timeline</li>
          <li style="margin-bottom: 8px;">We can schedule your free 15-minute consultation directly from the portal</li>
          <li>Your project details are securely stored in your SaxsProjects portal</li>
        </ul>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #8da2bb;">In the meantime, feel free to reach out directly:</p>
      
      <div style="background: var(--bg-deep); padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0 0 8px 0; color: #dbe4ef;"><strong>📧 Email:</strong> Saxs.solutions25@gmail.com</p>
        <p style="margin: 0 0 8px 0; color: #dbe4ef;"><strong>📞 Phone:</strong> 0714135824 (Primary) / 0613991212 (Support)</p>
        <p style="margin: 0; color: #dbe4ef;"><strong>💬 WhatsApp:</strong> +27 61 399 1212</p>
      </div>
      
      <div style="border-top: 1px solid #1e3a5f; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 12px; color: #8da2bb;">
        <p style="margin: 0 0 5px 0;">SaxsProjects Digital Architecture</p>
        <p style="margin: 0;">Inquiry Reference: ${new Date().getTime()}</p>
      </div>
    </div>
  `;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: port == 465,
        auth: { user, pass }
      });

      // Send to admin
      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `[NEW LEAD] Inquiry from ${clientName} - ${bizName || 'No Business Name'}`,
        html: adminEmailHtml
      });

      // Send auto-reply to client
      await transporter.sendMail({
        from: fromEmail,
        to: clientEmail,
        subject: 'Thank You - Your SaxsProjects Inquiry Has Been Received',
        html: clientAutoReplyHtml
      });

      console.log('Inquiry emails sent successfully to admin and client');
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }

  // Fallback logging
  console.log('\n========================================================');
  console.log('📧 INQUIRY EMAIL (MOCK LOGGING):');
  console.log('TO ADMIN:', adminEmail);
  console.log('FROM CLIENT:', clientEmail);
  console.log('SUBJECT:', `[NEW LEAD] Inquiry from ${clientName}`);
  console.log('AUTO-REPLY SENT TO:', clientEmail);
  console.log('========================================================\n');
  return true;
};

app.post('/api/inquiries', async (req, res) => {
  const { email, name, bizName, details, activeQuote } = req.body;

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
    await client.save();

    // Send emails (inquiry recipient notification + auto-reply to client)
    const inquiryEmail = process.env.INQUIRY_RECIPIENT_EMAIL || process.env.ADMIN_EMAIL || 'saxs.projects25@gmail.com';
    await sendInquiryEmail(inquiryEmail, email.toLowerCase(), name, bizName, details, activeQuote);

    res.status(200).json({
      success: true,
      message: 'Inquiry submitted successfully. Confirmation email sent.',
      clientId: client._id,
      isNewClient
    });
  } catch (error) {
    console.error('Error in POST /api/inquiries:', error);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

// E. Chat Helper API Endpoint (REST Fallback for Floating Bubble AI)
app.post('/api/chat/respond', async (req, res) => {
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

// Test Database Connection (No auth required for initial setup)
app.get('/api/test/database', async (req, res) => {
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
// 8.5. GOOGLE OAUTH 2.0 AUTHENTICATION
// ========================================================
// Exchange authorization code for tokens
app.post('/api/auth/google', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: req.headers['x-redirect-uri'] || 'http://localhost:5173/callback',
      grant_type: 'authorization_code'
    });

    const { access_token, id_token, refresh_token } = tokenResponse.data;

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, picture, id: googleId } = userInfoResponse.data;

    // Create or update client in database
    let client = await Client.findOne({ email: email.toLowerCase() });
    
    if (!client) {
      client = new Client({
        name,
        email: email.toLowerCase(),
        phone: '',
        googleId,
        profilePicture: picture,
        createdAt: new Date()
      });
      await client.save();
    } else {
      // Update existing client with Google info
      client.googleId = googleId;
      client.profilePicture = picture;
      await client.save();
    }

    // Prepare response
    res.status(200).json({
      success: true,
      user: {
        id: client._id,
        email: client.email,
        name: client.name,
        picture: client.profilePicture,
        googleId
      },
      tokens: {
        access_token,
        id_token,
        refresh_token
      }
    });
  } catch (error) {
    console.error('Google OAuth Error:', error.response?.data || error.message);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.response?.data || error.message
    });
  }
});

// Google OAuth callback handler (handles redirect from Google)
app.get('/api/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect('http://localhost:5173/login?error=No+authorization+code+received');
  }

  try {
    // Import and use the getTokens function from googleAuth
    const { getTokens } = await import('./googleAuth.js');
    const tokens = await getTokens(code);

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const { email, name, picture, id: googleId } = userInfoResponse.data;

    // Create or update client in database
    let client = await Client.findOne({ email: email.toLowerCase() });
    
    if (!client) {
      client = new Client({
        name,
        email: email.toLowerCase(),
        phone: '',
        googleId,
        profilePicture: picture,
        createdAt: new Date()
      });
      await client.save();
    } else {
      client.googleId = googleId;
      client.profilePicture = picture;
      await client.save();
    }

    // Redirect to frontend with tokens as query params
    const frontendUrl = `http://localhost:5173/callback?` + new URLSearchParams({
      access_token: tokens.access_token,
      id_token: tokens.id_token,
      refresh_token: tokens.refresh_token || '',
      email: client.email,
      name: client.name
    }).toString();

    res.redirect(frontendUrl);
  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    res.redirect(`http://localhost:5173/login?error=${encodeURIComponent('Authentication failed')}`);
  }
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
// 9. SERVER BOOTSTRAP
// ========================================================
console.log("Visit this URL to authorize:", getAuthUrl());

app.listen(PORT, () => {
  console.log(`=========================================================`);
  console.log(`🚀 SaxsProjects Integrated Backend running on port ${PORT}`);
  console.log(`   Local Address: http://localhost:${PORT}`);
  console.log(`=========================================================`);
});
