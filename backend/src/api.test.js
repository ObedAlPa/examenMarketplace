const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const app = require('./app')

test('GET /api/health returns ok', async () => {
  const response = await request(app).get('/api/health')

  assert.equal(response.status, 200)
  assert.equal(response.body.status, 'ok')
})

test('POST /api/auth/login returns JWT and user for admin account', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@auto.partes.test', password: 'AdminPass123!' })

  assert.equal(response.status, 200)
  assert.equal(response.body.user.role, 'admin')
  assert.ok(response.body.token)
})

test('GET /api/products returns seeded products', async () => {
  const response = await request(app).get('/api/products')

  assert.equal(response.status, 200)
  assert.ok(Array.isArray(response.body))
  assert.ok(response.body.length > 0)
})
