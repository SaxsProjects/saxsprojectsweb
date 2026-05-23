import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from './models/Client.js';
import Project from './models/Project.js';
import Billing from './models/Billing.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas for seeding...');

  // ── Clear old demo data ──────────────────────────────────────────────────
  await Client.deleteOne({ email: 'demo@example.com' });
  await Project.deleteOne({ clientEmail: 'demo@example.com' });
  await Billing.deleteMany({ clientEmail: 'demo@example.com' });
  console.log('🗑️  Old demo records cleared.');

  // ── Seed Client ──────────────────────────────────────────────────────────
  await new Client({
    email: 'demo@example.com',
    name: 'Demo Client',
    businessName: 'BrewLocal Coffee & Loyalty',
    contactInfo: 'Coffee shop loyalty app with POS and Stripe integrations'
  }).save();
  console.log('✅ clients: demo@example.com seeded.');

  // ── Seed Project ─────────────────────────────────────────────────────────
  await new Project({
    clientEmail: 'demo@example.com',
    title: 'BrewLocal Coffee & Loyalty Portal',
    tier: 'Web Application (Big Data) - 5 Pages (Features: Stripe, WhatsApp API)',
    progress: 75,
    status: 'Figma layouts approved. React + Supabase frontend scaffolding actively in development.',
    cost: 'R5,000 ZAR',
    timeline: '21 Days',
    milestones: [
      { name: 'Discovery Consultation Call',           status: 'completed' },
      { name: 'Milestone Agreement & Initial Deposit', status: 'completed' },
      { name: 'High-Fi Layout Mockups Approved',       status: 'completed' },
      { name: 'Vite + React Coding Phase',             status: 'active'    },
      { name: 'Stripe & WhatsApp API Hooks',           status: 'pending'   },
      { name: 'Production Launch & Domain Mapping',    status: 'pending'   }
    ]
  }).save();
  console.log('✅ projects: demo@example.com seeded.');

  // ── Seed Billing (50/50 split) ───────────────────────────────────────────
  await new Billing({
    clientEmail: 'demo@example.com',
    invoiceId: 'INV-2026-D042',
    title: 'Initial 50% Deposit',
    desc: 'Scope sign-off & project initiation fee',
    amount: 'R2,500 ZAR',
    status: 'PAID'
  }).save();

  await new Billing({
    clientEmail: 'demo@example.com',
    invoiceId: 'INV-2026-B043',
    title: 'Final 50% Balance',
    desc: 'Production delivery & launch fee',
    amount: 'R2,500 ZAR',
    status: 'PENDING RELEASE'
  }).save();
  console.log('✅ billings: 2 invoices seeded for demo@example.com.');

  console.log('\n🚀 MongoDB seed complete! All demo records are ready.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed script error:', err);
  process.exit(1);
});
