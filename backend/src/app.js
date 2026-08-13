const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { categories, products, users, orders, addresses } = require('./data')

const app = express()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true
  })
)
app.use(express.json())

const withId = (prefix) => `${prefix}-${crypto.randomUUID()}`

const sanitizeUser = (user) => {
  if (!user) return null
  const { password, ...safeUser } = user
  return safeUser
}

const findUserByEmail = (email) => {
  const normalized = String(email || '').trim().toLowerCase()
  return users.find((user) => user.email.toLowerCase() === normalized) || null
}

const buildToken = (user) => jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' })

const getUserFromRequest = (req) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '').trim() : ''

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return users.find((user) => user.id === decoded.sub) || null
  } catch (error) {
    return null
  }
}

const sendNotFound = (res, resourceName = 'Registro') => res.status(404).json({ message: `${resourceName} no encontrado` })

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'tenomerca-api', timestamp: new Date().toISOString() })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const user = findUserByEmail(email)

  if (!user || user.password !== String(password || '')) {
    return res.status(401).json({ message: 'Credenciales inválidas' })
  }

  return res.json({
    token: buildToken(user),
    user: sanitizeUser(user)
  })
})

app.post('/api/auth/register', (req, res) => {
  const { nombre, email, password, role = 'comprador' } = req.body || {}

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'nombre, email y password son requeridos' })
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: 'El correo ya existe' })
  }

  const resolvedRole = role === 'admin' || role === 'comprador' || role === 'buyer' ? (role === 'admin' ? 'admin' : 'comprador') : 'comprador'

  const user = {
    id: withId('USR'),
    nombre: String(nombre),
    email: String(email).toLowerCase(),
    password: String(password),
    role: resolvedRole,
    created_at: new Date().toISOString()
  }

  users.push(user)

  return res.status(201).json({
    token: buildToken(user),
    user: sanitizeUser(user)
  })
})

app.get('/api/auth/me', (req, res) => {
  const user = getUserFromRequest(req)

  if (!user) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  return res.json({ user: sanitizeUser(user) })
})

app.get('/api/products', (req, res) => {
  const { featured, q } = req.query

  let list = [...products]

  if (featured === 'true') {
    list = list.filter((product) => product.featured)
  }

  if (q) {
    const query = String(q).toLowerCase()
    list = list.filter((product) => product.titulo.toLowerCase().includes(query) || (product.descripcion || '').toLowerCase().includes(query))
  }

  return res.json(list)
})

app.get('/api/products/search', (req, res) => {
  const query = String(req.query.q || '').trim().toLowerCase()
  if (!query) return res.json([])

  const filtered = products.filter((product) => product.titulo.toLowerCase().includes(query) || (product.descripcion || '').toLowerCase().includes(query))
  return res.json(filtered)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id)
  if (!product) return sendNotFound(res, 'Producto')
  return res.json(product)
})

app.post('/api/products', (req, res) => {
  const payload = req.body || {}
  const product = {
    id: payload.id || withId('p'),
    titulo: payload.titulo || 'Nuevo producto',
    descripcion: payload.descripcion || '',
    precio: Number(payload.precio || 0),
    stock: Number(payload.stock || 0),
    categoria_id: payload.categoria_id || categories[0]?.id || null,
    featured: Boolean(payload.featured),
    archivo_url: payload.archivo_url || '/placeholder-product.jpg',
    created_at: new Date().toISOString()
  }

  products.unshift(product)
  return res.status(201).json(product)
})

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Producto')

  products[index] = { ...products[index], ...req.body }
  return res.json(products[index])
})

app.delete('/api/products/:id', (req, res) => {
  const initialLength = products.length
  const remaining = products.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Producto')

  products.splice(0, products.length, ...remaining)
  return res.status(204).send()
})

app.get('/api/categories', (req, res) => res.json(categories))

app.post('/api/categories', (req, res) => {
  const { nombre, slug } = req.body || {}
  if (!nombre) return res.status(400).json({ message: 'nombre es requerido' })

  const category = {
    id: withId('cat'),
    nombre: String(nombre),
    slug: slug || String(nombre).toLowerCase().replace(/\s+/g, '-')
  }

  categories.push(category)
  return res.status(201).json(category)
})

app.put('/api/categories/:id', (req, res) => {
  const index = categories.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Categoría')

  categories[index] = { ...categories[index], ...req.body }
  return res.json(categories[index])
})

app.delete('/api/categories/:id', (req, res) => {
  const initialLength = categories.length
  const remaining = categories.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Categoría')

  categories.splice(0, categories.length, ...remaining)
  return res.status(204).send()
})

app.get('/api/users', (req, res) => res.json(users.map((user) => sanitizeUser(user))))

app.get('/api/users/:id', (req, res) => {
  const user = users.find((item) => item.id === req.params.id)
  if (!user) return sendNotFound(res, 'Usuario')
  return res.json(sanitizeUser(user))
})

app.post('/api/users', (req, res) => {
  const { nombre, email, password, role = 'comprador' } = req.body || {}
  if (!nombre || !email || !password) return res.status(400).json({ message: 'nombre, email y password son requeridos' })

  const resolvedRole = role === 'admin' || role === 'comprador' || role === 'buyer' ? (role === 'admin' ? 'admin' : 'comprador') : 'comprador'

  const newUser = {
    id: withId('USR'),
    nombre: String(nombre),
    email: String(email).toLowerCase(),
    password: String(password),
    role: resolvedRole,
    created_at: new Date().toISOString()
  }

  users.push(newUser)
  return res.status(201).json(sanitizeUser(newUser))
})

app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Usuario')

  users[index] = { ...users[index], ...req.body }
  return res.json(sanitizeUser(users[index]))
})

app.delete('/api/users/:id', (req, res) => {
  const initialLength = users.length
  const remaining = users.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Usuario')

  users.splice(0, users.length, ...remaining)
  return res.status(204).send()
})

app.get('/api/orders', (req, res) => res.json(orders))

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((item) => item.id === req.params.id)
  if (!order) return sendNotFound(res, 'Pedido')
  return res.json(order)
})

app.post('/api/orders', (req, res) => {
  const payload = req.body || {}
  const order = {
    id: payload.id || withId('ORD'),
    userId: payload.userId || payload.user_id || 'USR-2',
    items: Array.isArray(payload.items) ? payload.items : [],
    total: Number(payload.total || 0),
    status: payload.status || 'pending',
    created_at: new Date().toISOString()
  }

  orders.push(order)
  return res.status(201).json(order)
})

app.put('/api/orders/:id', (req, res) => {
  const index = orders.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Pedido')

  orders[index] = { ...orders[index], ...req.body }
  return res.json(orders[index])
})

app.delete('/api/orders/:id', (req, res) => {
  const initialLength = orders.length
  const remaining = orders.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Pedido')

  orders.splice(0, orders.length, ...remaining)
  return res.status(204).send()
})

app.get('/api/addresses', (req, res) => res.json(addresses))

app.post('/api/addresses', (req, res) => {
  const payload = req.body || {}
  const address = {
    id: payload.id || withId('ADR'),
    alias: payload.alias || 'Dirección',
    nombre: payload.nombre || '',
    calle: payload.calle || '',
    numero: payload.numero || '',
    colonia: payload.colonia || '',
    municipio: payload.municipio || '',
    estado: payload.estado || '',
    codigoPostal: payload.codigoPostal || '',
    pais: payload.pais || 'México',
    telefono: payload.telefono || ''
  }

  addresses.push(address)
  return res.status(201).json(address)
})

app.put('/api/addresses/:id', (req, res) => {
  const index = addresses.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Dirección')

  addresses[index] = { ...addresses[index], ...req.body }
  return res.json(addresses[index])
})

app.delete('/api/addresses/:id', (req, res) => {
  const initialLength = addresses.length
  const remaining = addresses.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Dirección')

  addresses.splice(0, addresses.length, ...remaining)
  return res.status(204).send()
})

app.use((err, req, res, next) => {
  console.error(err)
  return res.status(500).json({ message: 'Error interno del servidor' })
})

module.exports = app
