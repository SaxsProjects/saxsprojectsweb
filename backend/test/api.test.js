import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import request from 'supertest';
import { futureWeekday, futureWeekend, setupApp } from './helpers.js';

let ctx;
let Inquiry;
let Booking;
let Project;

before(async () => {
  ctx = await setupApp();
  ({ default: Inquiry } = await import('../models/Inquiry.js'));
  ({ default: Booking } = await import('../models/Booking.js'));
  ({ default: Project } = await import('../models/Project.js'));
});

after(async () => {
  await ctx.teardown();
});

const admin = { Authorization: 'Bearer admin@example.com' };
const clientA = { Authorization: 'Bearer a@example.com' };

describe('health and errors', () => {
  it('reports health without exposing data', async () => {
    const res = await request(ctx.app).get('/api/health').expect(200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.database, true);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
  });

  it('returns JSON 404 for unknown API routes and 400 for bad JSON', async () => {
    await request(ctx.app).get('/api/nope').expect(404, { error: 'Not found.' });
    await request(ctx.app).post('/api/inquiries').set('Content-Type', 'application/json').send('{bad').expect(400);
  });

  it('only allows the website origin through CORS', async () => {
    const ok = await request(ctx.app).get('/api/health').set('Origin', 'https://www.saxsprojects.co.za');
    assert.equal(ok.headers['access-control-allow-origin'], 'https://www.saxsprojects.co.za');
    const evil = await request(ctx.app).get('/api/health').set('Origin', 'https://evil.example');
    assert.equal(evil.headers['access-control-allow-origin'], undefined);
  });
});

describe('enquiries', () => {
  const valid = { name: 'Thandi Test', email: 'Thandi@Example.com', details: 'Booking app for my salon', phone: '0712345678', service: 'Web application', consent: true };

  it('validates required fields', async () => {
    await request(ctx.app).post('/api/inquiries').send({ ...valid, email: 'nope' }).expect(400);
    await request(ctx.app).post('/api/inquiries').send({ ...valid, name: '' }).expect(400);
    await request(ctx.app).post('/api/inquiries').send({ ...valid, details: ' ' }).expect(400);
    await request(ctx.app).post('/api/inquiries').send({ ...valid, details: 'x'.repeat(5001) }).expect(400);
  });

  it('silently drops bot submissions (honeypot)', async () => {
    const before = await Inquiry.countDocuments();
    await request(ctx.app).post('/api/inquiries').send({ ...valid, website: 'spam' }).expect(200);
    assert.equal(await Inquiry.countDocuments(), before);
  });

  it('keeps every enquiry, including repeat ones', async () => {
    const first = await request(ctx.app).post('/api/inquiries').send(valid).expect(200);
    await request(ctx.app).post('/api/inquiries').send({ ...valid, details: 'Also need a logo' }).expect(200);
    const saved = await Inquiry.find({ email: 'thandi@example.com' }).sort({ createdAt: 1 });
    assert.equal(saved.length, 2);
    assert.equal(saved[0].id, first.body.inquiryId);
    assert.equal(saved[0].phone, '0712345678');
    assert.ok(saved[0].consentAt);
    assert.equal(saved[1].details, 'Also need a logo');
    assert.ok(saved.every((i) => i.emailDelivered));
  });

  it('lets only the admin list and update enquiries', async () => {
    await request(ctx.app).get('/api/admin/inquiries').expect(401);
    await request(ctx.app).get('/api/admin/inquiries').set(clientA).expect(403);
    const list = await request(ctx.app).get('/api/admin/inquiries').set(admin).expect(200);
    assert.ok(list.body.length >= 2);
    const id = list.body[0]._id;
    await request(ctx.app).patch(`/api/admin/inquiries/${id}`).set(admin).send({ status: 'bogus' }).expect(400);
    const upd = await request(ctx.app).patch(`/api/admin/inquiries/${id}`).set(admin).send({ status: 'contacted' }).expect(200);
    assert.equal(upd.body.status, 'contacted');
    await request(ctx.app).patch('/api/admin/inquiries/not-an-id').set(admin).send({ status: 'won' }).expect(404);
  });
});

describe('consultation bookings', () => {
  const day = futureWeekday(3);
  const booking = (time, extra = {}) => ({
    name: 'Sipho Dube', email: 'sipho@example.com', phone: '0821234567',
    dateTimeString: `${day}T${time}:00+02:00`, ...extra,
  });

  it('books a free slot and saves it', async () => {
    const res = await request(ctx.app).post('/api/schedule').send(booking('10:30')).expect(201);
    assert.equal(res.body.date, day);
    assert.equal(res.body.time, '10:30');
    const saved = await Booking.findById(res.body.bookingId);
    assert.equal(saved.status, 'confirmed');
    assert.equal(saved.endsAt - saved.startsAt, 15 * 60 * 1000);
  });

  it('never double-books a slot', async () => {
    const res = await request(ctx.app).post('/api/schedule').send(booking('10:30', { email: 'other@example.com' })).expect(409);
    assert.match(res.body.error, /just been booked/);
    assert.equal(await Booking.countDocuments({ date: day, time: '10:30', status: 'confirmed' }), 1);
  });

  it('reports booked times so the website can grey them out', async () => {
    const res = await request(ctx.app).get(`/api/schedule/booked-slots?date=${day}`).expect(200);
    assert.deepEqual(res.body.bookedSlots, ['10:30']);
    assert.ok(!res.body.availableSlots.includes('10:30'));
    await request(ctx.app).get('/api/schedule/booked-slots?date=tomorrow').expect(400);
  });

  it('frees a slot when the admin cancels the booking', async () => {
    const [b] = await Booking.find({ date: day, time: '10:30' });
    await request(ctx.app).patch(`/api/admin/bookings/${b.id}`).set(admin).send({ status: 'cancelled' }).expect(200);
    await request(ctx.app).post('/api/schedule').send(booking('10:30', { email: 'new@example.com' })).expect(201);
    const upcoming = await request(ctx.app).get('/api/admin/bookings?upcoming=true&status=confirmed').set(admin).expect(200);
    assert.deepEqual(upcoming.body.map((x) => x.email), ['new@example.com']);
  });

  it('rejects weekends, past times, odd times and missing details', async () => {
    const weekend = futureWeekend();
    await request(ctx.app).post('/api/schedule').send({ ...booking('10:30'), dateTimeString: `${weekend}T10:30:00+02:00` }).expect(400);
    await request(ctx.app).post('/api/schedule').send({ ...booking('10:30'), dateTimeString: '2020-01-06T10:30:00+02:00' }).expect(400);
    await request(ctx.app).post('/api/schedule').send(booking('10:00')).expect(400);
    await request(ctx.app).post('/api/schedule').send({ ...booking('11:30'), email: 'bad' }).expect(400);
    await request(ctx.app).post('/api/schedule').send({ ...booking('11:30'), name: '' }).expect(400);
    await request(ctx.app).post('/api/schedule').send({ ...booking('11:30'), dateTimeString: 'next tuesday' }).expect(400);
  });
});

describe('client portal access', () => {
  before(async () => {
    await Project.create({ clientEmail: 'b@example.com', title: 'B secret project', tier: 'Website' });
  });

  it('requires sign-in', async () => {
    await request(ctx.app).get('/api/projects/my-project').expect(401);
  });

  it('never shows one client another client’s project', async () => {
    const res = await request(ctx.app).get('/api/projects/my-project').set(clientA).set('X-Target-Client', 'b@example.com').expect(200);
    assert.equal(res.body.clientEmail, 'a@example.com');
    assert.notEqual(res.body.title, 'B secret project');
    assert.equal(res.body.cost, 'To be quoted');
  });

  it('lets the admin view a chosen client', async () => {
    const res = await request(ctx.app).get('/api/projects/my-project').set(admin).set('X-Target-Client', 'b@example.com').expect(200);
    assert.equal(res.body.title, 'B secret project');
  });

  it('keeps admin-only routes admin-only', async () => {
    await request(ctx.app).get('/api/projects').set(clientA).expect(403);
    await request(ctx.app).post('/api/clients').set(clientA).send({}).expect(403);
    await request(ctx.app).get('/api/test/database').set(clientA).expect(403);
  });
});
