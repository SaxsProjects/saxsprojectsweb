// Shared setup: a real MongoDB (in memory) and the Express app, with no SMTP
// configured (emails are logged, not sent) and development-only mock auth, so
// "Bearer <email>" signs in as that email.
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export async function setupApp(env = {}) {
  Object.assign(process.env, {
    NODE_ENV: 'test',
    ALLOW_MOCK_AUTH: 'true',
    ADMIN_EMAIL: 'admin@example.com',
    SMTP_HOST: '',
    SMTP_USER: '',
    SMTP_PASS: '',
    ...env,
  });
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const { app } = await import('../server.js');
  const { default: Booking } = await import('../models/Booking.js');
  await Booking.syncIndexes();
  return {
    app,
    async teardown() {
      await mongoose.disconnect();
      await mongo.stop();
    },
  };
}

// The next Monday–Friday at least `daysAhead` days away, as YYYY-MM-DD (SAST).
export function futureWeekday(daysAhead = 3) {
  const d = new Date(Date.now() + 2 * 3600 * 1000 + daysAhead * 86400000);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function futureWeekend() {
  const d = new Date(Date.now() + 2 * 3600 * 1000 + 3 * 86400000);
  while (d.getUTCDay() !== 6) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
