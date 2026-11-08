import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { seedDatabase } from '../src/seeds/seedData.js';

let server;
let baseUrl;
let authToken = '';
let testUserId = '';
let sampleContentId = '';

test.before(async () => {
  await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthylife');
  await seedDatabase();

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
});

test('1. GET /api/health should return healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.status, 'healthy');
});

test('2. GET /api/content should return seeded articles and videos', async () => {
  const res = await fetch(`${baseUrl}/api/content`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.length >= 6);

  // Store first item ID for subsequent detail and favorite tests
  sampleContentId = data.data[0]._id;
  assert.ok(sampleContentId);
});

test('3. GET /api/content/:id should return single content details', async () => {
  const res = await fetch(`${baseUrl}/api/content/${sampleContentId}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data._id, sampleContentId);
  assert.ok(data.data.title);
});

test('4. POST /api/auth/register should register new user', async () => {
  const testEmail = `tester_${Date.now()}@example.com`;
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'User Tester',
      email: testEmail,
      password: 'password123',
    }),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.token);
  assert.ok(data.data.user.id);
  authToken = data.data.token;
  testUserId = data.data.user.id;
});

test('5. POST /api/auth/login should authenticate user', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'budi@healthylife.com',
      password: 'password123',
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.user.email, 'budi@healthylife.com');
  assert.ok(data.data.token);
});

test('6. GET /api/auth/me should return authenticated profile', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.user.id, testUserId);
});

test('7. GET /api/activities/summary should return today metrics and week strip', async () => {
  const res = await fetch(`${baseUrl}/api/activities/summary`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.today);
  assert.equal(data.data.weekStrip.length, 7);
});

test('8. POST /api/activities should log new activity and update metrics', async () => {
  const res = await fetch(`${baseUrl}/api/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      title: 'Jogging Pagi',
      category: 'Olahraga',
      durationMinutes: 25,
      calories: 180,
      notes: 'Jogging santai keliling lapangan',
    }),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.activity.title, 'Jogging Pagi');
  assert.equal(data.data.activity.calories, 180);
});

test('9. PATCH /api/activities/metrics/water should increment water intake', async () => {
  const res = await fetch(`${baseUrl}/api/activities/metrics/water`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ amount: 250 }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.waterMl, 250);
});

test('10. POST /api/favorites/:id should toggle bookmark', async () => {
  // Add favorite
  const res1 = await fetch(`${baseUrl}/api/favorites/${sampleContentId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
  });

  assert.equal(res1.status, 201);
  const data1 = await res1.json();
  assert.equal(data1.success, true);
  assert.equal(data1.isFavorited, true);

  // Check list
  const resList = await fetch(`${baseUrl}/api/favorites`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  assert.equal(resList.status, 200);
  const listData = await resList.json();
  assert.equal(listData.success, true);
  assert.equal(listData.count, 1);
  assert.equal(listData.data[0]._id, sampleContentId);

  // Remove favorite
  const res2 = await fetch(`${baseUrl}/api/favorites/${sampleContentId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
  });
  assert.equal(res2.status, 200);
  const data2 = await res2.json();
  assert.equal(data2.isFavorited, false);
});

const authed = (method, path, body) =>
  fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => ({ status: r.status, body: await r.json() }));

test('11. Meals and water logs must not count as burned calories or active minutes', async () => {
  const before = (await authed('GET', '/api/activities/summary')).body.data.today;

  const meal = await authed('POST', '/api/activities', { title: 'Makan Siang', category: 'Nutrisi', calories: 480 });
  assert.equal(meal.status, 201);
  const water = await authed('POST', '/api/activities', { title: 'Minum', category: 'Hidrasi', amountMl: 300 });
  assert.equal(water.status, 201);

  const after = (await authed('GET', '/api/activities/summary')).body.data.today;
  assert.equal(after.caloriesBurned, before.caloriesBurned);
  assert.equal(after.activeMinutes, before.activeMinutes);
  assert.equal(after.waterMl, before.waterMl + 300);

  // Deleting reverses exactly the contribution that was added.
  await authed('DELETE', `/api/activities/${water.body.data.activity._id}`);
  const reverted = (await authed('GET', '/api/activities/summary')).body.data.today;
  assert.equal(reverted.waterMl, before.waterMl);
  await authed('DELETE', `/api/activities/${meal.body.data.activity._id}`);
});

test('12. Invalid activity and metric input is rejected', async () => {
  const negative = await authed('POST', '/api/activities', { title: 'x', calories: -50 });
  assert.equal(negative.status, 400);
  const badCategory = await authed('POST', '/api/activities', { title: 'x', category: 'Tidur' });
  assert.equal(badCategory.status, 400);
  const badWater = await authed('PATCH', '/api/activities/metrics/water', { amount: -250 });
  assert.equal(badWater.status, 400);
  const badSteps = await authed('PATCH', '/api/activities/metrics/steps', { steps: -1 });
  assert.equal(badSteps.status, 400);
});

test('13. Re-seeding keeps content ids stable and preserves user favorites', async () => {
  const idsBefore = (await (await fetch(`${baseUrl}/api/content`)).json()).data.map((c) => c._id).sort();
  await seedDatabase();
  const idsAfter = (await (await fetch(`${baseUrl}/api/content`)).json()).data.map((c) => c._id).sort();
  assert.deepEqual(idsAfter, idsBefore);
});

test('14. Activities can be filtered to a single day and summary exposes a Monday-first week', async () => {
  const today = (await authed('GET', '/api/activities/summary')).body.data;
  assert.equal(today.weekStrip[0].dayName, 'Senin');
  assert.equal(today.weekStrip[6].dayName, 'Minggu');
  assert.equal(today.weekStrip.filter((d) => d.isToday).length, 1);

  const day = today.weekStrip.find((d) => d.isToday).date;
  const list = await authed('GET', `/api/activities?date=${day}`);
  assert.equal(list.status, 200);
  assert.ok(list.body.data.every((a) => a.date));
  const bad = await authed('GET', '/api/activities?date=7-11-2026');
  assert.equal(bad.status, 400);
});
