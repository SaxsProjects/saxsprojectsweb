// Runs in its own process with NODE_ENV=production: the development mock auth
// must be impossible to use, even if ALLOW_MOCK_AUTH is set by mistake.
import assert from 'node:assert/strict';
import { after, before, it } from 'node:test';
import request from 'supertest';
import { setupApp } from './helpers.js';

let ctx;

before(async () => {
  ctx = await setupApp({ NODE_ENV: 'production', ALLOW_MOCK_AUTH: 'true' });
});

after(async () => {
  await ctx.teardown();
});

it('refuses a forged admin token in production', async () => {
  const res = await request(ctx.app).get('/api/projects').set('Authorization', 'Bearer admin@example.com');
  assert.equal(res.status, 503);
});

it('refuses an unsigned JWT in production', async () => {
  const fake = `${Buffer.from('{"alg":"none"}').toString('base64url')}.${Buffer.from('{"email":"admin@example.com","sub":"x"}').toString('base64url')}.`;
  const res = await request(ctx.app).get('/api/admin/inquiries').set('Authorization', `Bearer ${fake}x`);
  assert.equal(res.status, 503);
});

it('sends HSTS in production', async () => {
  const res = await request(ctx.app).get('/api/health');
  assert.match(res.headers['strict-transport-security'], /max-age=/);
});

it('does not pretend an enquiry was emailed when SMTP is missing', async () => {
  const res = await request(ctx.app).post('/api/inquiries').send({ name: 'A', email: 'a@example.com', details: 'Hi' });
  assert.equal(res.status, 502);
  assert.ok(res.body.inquiryId, 'the enquiry is still saved for the admin');
});

it('releases the slot and reports failure when the booking email cannot be sent', async () => {
  const { futureWeekday } = await import('./helpers.js');
  const { default: Booking } = await import('../models/Booking.js');
  const day = futureWeekday(4);
  const res = await request(ctx.app).post('/api/schedule').send({
    name: 'Sipho', email: 's@example.com', dateTimeString: `${day}T09:30:00+02:00`,
  });
  assert.equal(res.status, 502);
  assert.equal(await Booking.countDocuments({ date: day }), 0);
});
