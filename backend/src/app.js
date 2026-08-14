const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const multer = require('multer')
const drive = require('./drive')
const { normalizeDriveImageUrl } = require('./imageUrl')
const { categories, products, users, orders, addresses, cartItems } = require('./data')
// Ensure in-memory seed users have hashed passwords for local dev/tests
for (let u of users) {
  if (u && u.password && !String(u.password).startsWith('$2')) {
    // hash synchronously at startup for simplicity
    u.password = bcrypt.hashSync(String(u.password), 10)
  }
}

// Optional Postgres-backed store (used when DATABASE_URL is configured)
let store = null
try {
  if (process.env.DATABASE_URL) store = require('./pgStore')
} catch (e) {
  console.warn('pgStore not available:', e && e.message)
}

const app = express()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// Subida de imágenes en memoria (máx 5MB). El archivo NO se guarda en disco.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

// Estados y métodos válidos para pedidos (whitelist: nada fuera de aquí entra)
const ORDER_STATUSES = ['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'Entregado', 'Cancelado']
const PAYMENT_METHODS = ['Tarjeta simulada', 'Transferencia simulada', 'Efectivo/OXXO simulada']
const PAYMENT_STATUSES = ['Pendiente', 'Pagado']

// En desarrollo cualquier origen localhost/127.0.0.1/192.168.* se acepta
// automáticamente (isLocalDevOrigin). CORS_ORIGINS solo hace falta si algún
// día despliegas con dominios propios; el default es el puerto dev estándar.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const isLocalDevOrigin = (origin) => {
  if (!origin) return true

  try {
    const url = new URL(origin)
    const hostname = url.hostname.toLowerCase()
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname.startsWith('192.168.')
    return isLocalHost && ['http:', 'https:'].includes(url.protocol)
  } catch (error) {
    return false
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
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

const normalizeProduct = (product) => {
  if (!product) return null
  return { ...product, archivo_url: normalizeDriveImageUrl(product.archivo_url) }
}

const buildToken = (user) => jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' })

// Async helper to find user by email (DB-aware)
const findUserByEmail = async (email) => {
  const normalized = String(email || '').trim().toLowerCase()
  if (store) {
    const user = await store.getUserByEmail(normalized)
    return user || null
  }
  return users.find((user) => user.email.toLowerCase() === normalized) || null
}

const getUserFromRequest = async (req) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '').trim() : ''

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (store) {
      return await store.getUserById(decoded.sub)
    }
    return users.find((user) => user.id === decoded.sub) || null
  } catch (error) {
    return null
  }
}

// Middleware: require that a valid JWT is provided
const requireAuth = async (req, res, next) => {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'No autorizado' })
  req.user = user
  next()
}

// Middleware factory: require a specific role (e.g., 'admin')
const requireRole = (role) => async (req, res, next) => {
  const user = req.user || await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'No autorizado' })
  if (role === 'admin') {
    if (user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' })
  } else {
    if (user.role !== role) return res.status(403).json({ message: 'Acceso denegado' })
  }
  req.user = user
  next()
}

const sendNotFound = (res, resourceName = 'Registro') => res.status(404).json({ message: `${resourceName} no encontrado` })

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'tenomerca-api', timestamp: new Date().toISOString() })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  const user = await findUserByEmail(email)

  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })

  const match = await bcrypt.compare(String(password || ''), String(user.password || ''))
  if (!match) return res.status(401).json({ message: 'Credenciales inválidas' })

  return res.json({
    token: buildToken(user),
    user: sanitizeUser(user)
  })
})

app.post('/api/auth/register', async (req, res) => {
  const { nombre, email, password } = req.body || {}

  // Seguridad: el rol SIEMPRE queda 'comprador'. El campo `role` del body se
  // IGNORA para bloquear la escalada de privilegios (hoy aceptaba role:'admin').
  // Los admins se crean vía seed o vía PUT /api/users/:id.
  const role = 'comprador'

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'nombre, email y password son requeridos' })
  }

  if (await findUserByEmail(email)) {
    return res.status(409).json({ message: 'El correo ya existe' })
  }

  const hashed = await bcrypt.hash(String(password), 10)

  const user = {
    id: withId('USR'),
    nombre: String(nombre),
    email: String(email).toLowerCase(),
    password: hashed,
    role: role,
    created_at: new Date().toISOString()
  }

  if (store) {
    const created = await store.createUser(user)
    return res.status(201).json({ token: buildToken(created), user: sanitizeUser(created) })
  }

  users.push(user)

  return res.status(201).json({
    token: buildToken(user),
    user: sanitizeUser(user)
  })
})

app.get('/api/auth/me', async (req, res) => {
  const user = await getUserFromRequest(req)

  if (!user) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  return res.json({ user: sanitizeUser(user) })
})

app.get('/api/products', async (req, res) => {
  const { featured, q } = req.query

  if (store) {
    let list = (await store.getProducts()).map(normalizeProduct)
    if (featured === 'true') list = list.filter(p => p.featured)
    if (q) {
      const query = String(q).toLowerCase()
      list = list.filter((product) => String(product.titulo || '').toLowerCase().includes(query) || String(product.descripcion || '').toLowerCase().includes(query))
    }
    return res.json(list)
  }

  let list = [...products].map(normalizeProduct)
  if (featured === 'true') list = list.filter((product) => product.featured)
  if (q) {
    const query = String(q).toLowerCase()
    list = list.filter((product) => product.titulo.toLowerCase().includes(query) || (product.descripcion || '').toLowerCase().includes(query))
  }
  return res.json(list)
})

app.get('/api/products/search', async (req, res) => {
  const query = String(req.query.q || '').trim().toLowerCase()
  if (!query) return res.json([])
  if (store) {
    const all = (await store.getProducts()).map(normalizeProduct)
    const filtered = all.filter((product) => String(product.titulo || '').toLowerCase().includes(query) || String(product.descripcion || '').toLowerCase().includes(query))
    return res.json(filtered)
  }
  const filtered = products.map(normalizeProduct).filter((product) => product.titulo.toLowerCase().includes(query) || (product.descripcion || '').toLowerCase().includes(query))
  return res.json(filtered)
})

app.get('/api/products/:id', async (req, res) => {
  if (store) {
    const product = normalizeProduct(await store.getProductById(req.params.id))
    if (!product) return sendNotFound(res, 'Producto')
    return res.json(product)
  }
  const product = normalizeProduct(products.find((item) => item.id === req.params.id))
  if (!product) return sendNotFound(res, 'Producto')
  return res.json(product)
})

app.post('/api/products', requireAuth, requireRole('admin'), async (req, res) => {
  const payload = req.body || {}
  const product = {
    id: payload.id || withId('p'),
    titulo: payload.titulo || 'Nuevo producto',
    descripcion: payload.descripcion || '',
    precio: Number(payload.precio || 0),
    stock: Number(payload.stock || 0),
    categoria_id: payload.categoria_id || categories[0]?.id || null,
    featured: Boolean(payload.featured),
    archivo_url: payload.archivo_url || '/placeholder-product.jpg'
  }

  if (store) {
    const created = await store.createProduct(product)
    return res.status(201).json(created)
  }

  products.unshift(product)
  return res.status(201).json(product)
})

app.put('/api/products/:id', requireAuth, requireRole('admin'), async (req, res) => {
  if (store) {
    const updated = await store.updateProduct(req.params.id, req.body)
    if (!updated) return sendNotFound(res, 'Producto')
    return res.json(updated)
  }

  const index = products.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Producto')

  products[index] = { ...products[index], ...req.body }
  return res.json(products[index])
})

app.delete('/api/products/:id', requireAuth, requireRole('admin'), async (req, res) => {
  if (store) {
    const ok = await store.deleteProduct(req.params.id)
    if (!ok) return sendNotFound(res, 'Producto')
    return res.status(204).send()
  }

  const initialLength = products.length
  const remaining = products.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Producto')

  products.splice(0, products.length, ...remaining)
  return res.status(204).send()
})

app.get('/api/categories', async (req, res) => {
  if (store) return res.json(await store.getCategories())
  return res.json(categories)
})

app.post('/api/categories', requireAuth, requireRole('admin'), async (req, res) => {
  const { nombre, slug } = req.body || {}
  if (!nombre) return res.status(400).json({ message: 'nombre es requerido' })

  const category = {
    id: withId('cat'),
    nombre: String(nombre),
    slug: slug || String(nombre).toLowerCase().replace(/\s+/g, '-')
  }

  if (store) {
    const created = await store.createCategory(category)
    return res.status(201).json(created)
  }

  categories.push(category)
  return res.status(201).json(category)
})

app.put('/api/categories/:id', requireAuth, requireRole('admin'), async (req, res) => {
  if (store) {
    const updated = await store.updateCategory(req.params.id, req.body)
    if (!updated) return sendNotFound(res, 'Categoría')
    return res.json(updated)
  }

  const index = categories.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Categoría')

  categories[index] = { ...categories[index], ...req.body }
  return res.json(categories[index])
})

app.delete('/api/categories/:id', requireAuth, requireRole('admin'), async (req, res) => {
  if (store) {
    const ok = await store.deleteCategory(req.params.id)
    if (!ok) return sendNotFound(res, 'Categoría')
    return res.status(204).send()
  }

  const initialLength = categories.length
  const remaining = categories.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Categoría')

  categories.splice(0, categories.length, ...remaining)
  return res.status(204).send()
})

// Solo admin puede listar todos los usuarios
app.get('/api/users', requireRole('admin'), async (req, res) => {
  if (store) return res.json(await store.getUsers())
  return res.json(users.map((user) => sanitizeUser(user)))
})

// Solo admin o el propio usuario puede consultar un perfil
app.get('/api/users/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Acceso denegado' })
  }

  if (store) {
    const u = await store.getUserById(req.params.id)
    if (!u) return sendNotFound(res, 'Usuario')
    return res.json(u)
  }
  const user = users.find((item) => item.id === req.params.id)
  if (!user) return sendNotFound(res, 'Usuario')
  return res.json(sanitizeUser(user))
})

app.post('/api/users', requireAuth, requireRole('admin'), async (req, res) => {
  const { nombre, email, password, role = 'comprador' } = req.body || {}
  if (!nombre || !email || !password) return res.status(400).json({ message: 'nombre, email y password son requeridos' })

  const resolvedRole = role === 'admin' || role === 'comprador' || role === 'buyer' ? (role === 'admin' ? 'admin' : 'comprador') : 'comprador'

  const hashed = await bcrypt.hash(String(password), 10)

  const newUser = {
    id: withId('USR'),
    nombre: String(nombre),
    email: String(email).toLowerCase(),
    password: hashed,
    role: resolvedRole,
    created_at: new Date().toISOString()
  }

  if (store) {
    const created = await store.createUser(newUser)
    return res.status(201).json(created)
  }

  users.push(newUser)
  return res.status(201).json(sanitizeUser(newUser))
})

app.put('/api/users/:id', requireAuth, requireRole('admin'), (req, res) => {
  const index = users.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Usuario')

  users[index] = { ...users[index], ...req.body }
  return res.json(sanitizeUser(users[index]))
})

app.delete('/api/users/:id', requireAuth, requireRole('admin'), (req, res) => {
  const initialLength = users.length
  const remaining = users.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Usuario')

  users.splice(0, users.length, ...remaining)
  return res.status(204).send()
})

// ============================================================
// Carrito de compras: una fila por usuario+producto. El userId SIEMPRE
// sale del token (req.user.id), nunca del payload del cliente.
// ============================================================
app.get('/api/cart', requireAuth, async (req, res) => {
  if (store) return res.json(await store.getCartByUserId(req.user.id))
  return res.json(cartItems.filter((item) => item.userId === req.user.id))
})

app.post('/api/cart/items', requireAuth, async (req, res) => {
  const { productId, cantidad } = req.body || {}
  if (!productId) return res.status(400).json({ message: 'productId es requerido' })
  const qty = Number(cantidad)
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ message: 'cantidad debe ser un entero mayor o igual a 1' })
  }

  // Seguridad: titulo, precio y archivo_url SIEMPRE se toman del catálogo,
  // nunca de lo que envía el cliente.
  const product = store
    ? normalizeProduct(await store.getProductById(productId))
    : normalizeProduct(products.find((p) => p.id === productId))
  if (!product) return sendNotFound(res, 'Producto')

  if (store) {
    const cart = await store.getCartByUserId(req.user.id)
    const exists = cart.some((i) => i.id === product.id)
    const created = await store.upsertCartItem({
      id: product.id,
      userId: req.user.id,
      titulo: product.titulo,
      precio: product.precio,
      cantidad: qty,
      archivo_url: product.archivo_url
    })
    return res.status(exists ? 200 : 201).json(created)
  }

  const existing = cartItems.find((i) => i.userId === req.user.id && i.id === product.id)
  if (existing) {
    existing.cantidad += qty
    return res.json(existing)
  }

  const item = {
    id: product.id,
    userId: req.user.id,
    titulo: product.titulo,
    precio: product.precio,
    cantidad: qty,
    archivo_url: product.archivo_url
  }
  cartItems.push(item)
  return res.status(201).json(item)
})

app.put('/api/cart/items/:id', requireAuth, async (req, res) => {
  const qty = Number((req.body || {}).cantidad)
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ message: 'cantidad debe ser un entero mayor o igual a 1' })
  }

  if (store) {
    const updated = await store.updateCartItem(req.params.id, req.user.id, qty)
    if (!updated) return sendNotFound(res, 'Item del carrito')
    return res.json(updated)
  }

  const item = cartItems.find((i) => i.userId === req.user.id && i.id === req.params.id)
  if (!item) return sendNotFound(res, 'Item del carrito')
  item.cantidad = qty
  return res.json(item)
})

app.delete('/api/cart/items/:id', requireAuth, async (req, res) => {
  if (store) {
    const ok = await store.deleteCartItem(req.params.id, req.user.id)
    if (!ok) return sendNotFound(res, 'Item del carrito')
    return res.status(204).send()
  }

  const index = cartItems.findIndex((i) => i.userId === req.user.id && i.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Item del carrito')
  cartItems.splice(index, 1)
  return res.status(204).send()
})

app.delete('/api/cart', requireAuth, async (req, res) => {
  if (store) {
    await store.clearCart(req.user.id)
    return res.status(204).send()
  }

  const remaining = cartItems.filter((i) => i.userId !== req.user.id)
  cartItems.splice(0, cartItems.length, ...remaining)
  return res.status(204).send()
})

// Solo admin puede listar TODOS los pedidos
app.get('/api/orders', requireRole('admin'), async (req, res) => {
  if (store) return res.json(await store.getOrders())
  return res.json(orders)
})

// Pedidos del usuario autenticado: un comprador solo ve LOS SUYOS
// (se registra ANTES de GET /api/orders/:id para que ':id' no capture "mine")
app.get('/api/orders/mine', requireAuth, async (req, res) => {
  if (store) {
    const all = await store.getOrders()
    return res.json(all.filter((order) => order.user_id === req.user.id))
  }
  return res.json(orders.filter((order) => order.userId === req.user.id))
})

// Solo admin o el dueño del pedido puede verlo
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  if (store) {
    const order = await store.getOrderById(req.params.id)
    if (!order) return sendNotFound(res, 'Pedido')
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' })
    }
    return res.json(order)
  }
  const order = orders.find((item) => item.id === req.params.id)
  if (!order) return sendNotFound(res, 'Pedido')
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ message: 'Acceso denegado' })
  }
  return res.json(order)
})

app.post('/api/orders', requireAuth, async (req, res) => {
  const payload = req.body || {}

  const requestedItems = Array.isArray(payload.items) ? payload.items : []
  if (requestedItems.length === 0) {
    return res.status(400).json({ message: 'El pedido debe incluir al menos un item' })
  }

  // Dirección mínima exigida al cliente (el resto de campos es opcional)
  let direccion = payload.direccion || {}
  if (typeof direccion === 'string') {
    try { direccion = JSON.parse(direccion) } catch (e) { direccion = {} }
  }
  if (!direccion.nombre || !direccion.calle || !direccion.numero || !direccion.colonia) {
    return res.status(400).json({ message: 'La dirección requiere nombre, calle, numero y colonia' })
  }

  const metodo_pago = payload.metodo_pago
  if (!PAYMENT_METHODS.includes(metodo_pago)) {
    return res.status(400).json({ message: `metodo_pago inválido. Usa uno de: ${PAYMENT_METHODS.join(', ')}` })
  }

  const estado_pago = payload.estado_pago || 'Pendiente'
  if (!PAYMENT_STATUSES.includes(estado_pago)) {
    return res.status(400).json({ message: `estado_pago inválido. Usa uno de: ${PAYMENT_STATUSES.join(', ')}` })
  }

  // Seguridad: el total se recalcula SIEMPRE server-side con el precio del
  // catálogo. Cualquier precio enviado por el cliente se IGNORA.
  const items = []
  let total = 0
  for (const requested of requestedItems) {
    const product = store
      ? await store.getProductById(requested.id)
      : products.find((p) => p.id === requested.id)
    if (!product) {
      return res.status(400).json({ message: `El producto ${requested.id} no existe` })
    }
    const cantidad = Number(requested.cantidad)
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return res.status(400).json({ message: `cantidad del producto ${requested.id} debe ser un entero mayor o igual a 1` })
    }
    // Validar stock disponible y producto activo
    if (product.activo === false) {
      return res.status(400).json({ message: `El producto ${product.titulo} no está disponible` })
    }
    if (Number(product.stock || 0) < cantidad) {
      return res.status(400).json({ message: `Stock insuficiente para ${product.titulo}. Disponible: ${product.stock}` })
    }
    const precio = Number(product.precio) || 0
    items.push({
      id: product.id,
      titulo: product.titulo,
      precio,
      cantidad,
      archivo_url: normalizeDriveImageUrl(product.archivo_url)
    })
    total += precio * cantidad
  }

  // Número de pedido legible y secuencial
  const count = store ? await store.countOrders() : orders.length
  const numero_pedido = 'TM-' + String(1000 + count)

  const order = {
    id: withId('ORD'),
    userId: req.user.id,
    items,
    total,
    status: 'Pendiente',
    numero_pedido,
    metodo_pago,
    estado_pago,
    direccion
  }

  if (store) {
    const created = await store.createOrder(order)
    await store.clearCart(req.user.id)
    return res.status(201).json(created)
  }

  order.created_at = new Date().toISOString()
  orders.push(order)
  // Al crear el pedido se vacía el carrito del usuario
  const remainingCart = cartItems.filter((i) => i.userId !== req.user.id)
  cartItems.splice(0, cartItems.length, ...remainingCart)
  return res.status(201).json(order)
})

// Solo admin puede actualizar o eliminar pedidos
app.put('/api/orders/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { status } = req.body || {}
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: `status inválido. Usa uno de: ${ORDER_STATUSES.join(', ')}` })
  }

  if (store) {
    const updated = await store.updateOrder(req.params.id, { status })
    if (!updated) return sendNotFound(res, 'Pedido')
    return res.json(updated)
  }

  const order = orders.find((item) => item.id === req.params.id)
  if (!order) return sendNotFound(res, 'Pedido')
  order.status = status
  return res.json(order)
})

app.delete('/api/orders/:id', requireAuth, requireRole('admin'), async (req, res) => {
  if (store) {
    const ok = await store.deleteOrder(req.params.id)
    if (!ok) return sendNotFound(res, 'Pedido')
    return res.status(204).send()
  }

  const initialLength = orders.length
  const remaining = orders.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Pedido')

  orders.splice(0, orders.length, ...remaining)
  return res.status(204).send()
})

// Rutas de direcciones requieren sesión autenticada
app.get('/api/addresses', requireAuth, async (req, res) => {
  if (store) return res.json(await store.getAddresses())
  return res.json(addresses)
})

app.post('/api/addresses', requireAuth, async (req, res) => {
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

  if (store) {
    const created = await store.createAddress(address)
    return res.status(201).json(created)
  }

  addresses.push(address)
  return res.status(201).json(address)
})

app.put('/api/addresses/:id', requireAuth, async (req, res) => {
  if (store) {
    const updated = await store.updateAddress(req.params.id, req.body)
    if (!updated) return sendNotFound(res, 'Dirección')
    return res.json(updated)
  }

  const index = addresses.findIndex((item) => item.id === req.params.id)
  if (index === -1) return sendNotFound(res, 'Dirección')

  addresses[index] = { ...addresses[index], ...req.body }
  return res.json(addresses[index])
})

app.delete('/api/addresses/:id', requireAuth, async (req, res) => {
  if (store) {
    const ok = await store.deleteAddress(req.params.id)
    if (!ok) return sendNotFound(res, 'Dirección')
    return res.status(204).send()
  }

  const initialLength = addresses.length
  const remaining = addresses.filter((item) => item.id !== req.params.id)
  if (remaining.length === initialLength) return sendNotFound(res, 'Dirección')

  addresses.splice(0, addresses.length, ...remaining)
  return res.status(204).send()
})

// ============================================================
// GET /api/codigo-postal/:cp — Consulta pública de código postal.
// Usa la API de Postali (https://postali.app), basada en los datos
// oficiales de SEPOMEX. Es gratuita y NO requiere API key.
// La URL es configurable vía CP_API_URL (ver .env.example) por si
// cambias de proveedor; si alguno llegara a pedir key, va en .env —
// nunca hardcodeada en el código.
// ============================================================
app.get('/api/codigo-postal/:cp', async (req, res) => {
  const cp = String(req.params.cp || '')

  // Validación estricta: un CP mexicano son exactamente 5 dígitos
  if (!/^\d{5}$/.test(cp)) {
    return res.status(400).json({ message: 'Código postal inválido' })
  }

  const baseUrl = process.env.CP_API_URL || 'https://postali.app/api/v1/mx/cp/'

  // Timeout de ~5s: si el proveedor externo no responde, abortamos la petición
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  let response
  try {
    response = await fetch(`${baseUrl}${cp}`, { signal: controller.signal })
  } catch (error) {
    // Error de red o timeout: el fallo es del proveedor externo, no del alumno
    clearTimeout(timeout)
    console.error(`Error consultando CP ${cp}:`, error && error.message)
    return res.status(502).json({ message: 'No se pudo consultar el servicio de códigos postales' })
  }
  clearTimeout(timeout)

  // El proveedor devuelve 404 cuando el CP no existe en SEPOMEX
  if (!response.ok) {
    return res.status(404).json({ message: 'Código postal no encontrado' })
  }

  const data = await response.json()
  const colonias = Array.isArray(data.asentamientos)
    ? data.asentamientos.map((item) => item && item.nombre).filter(Boolean)
    : []

  // Respuesta SIEMPRE con la misma forma que espera el Checkout del frontend
  return res.json({
    cp: data.cp || cp,
    estado: data.estado || '',
    municipio: data.municipio || '',
    colonias
  })
})

// ============================================================
// POST /api/upload — Sube una imagen de producto a Google Drive.
// Solo admin. Devuelve drive://<fileId>, que el frontend normaliza
// a una URL pública de Drive (ver backend/src/imageUrl.js).
// Sin credenciales de Drive el endpoint responde 503 (degradado
// elegante, nunca un 500 crasheado).
// ============================================================
app.post('/api/upload', requireAuth, requireRole('admin'), upload.single('image'), async (req, res) => {
  if (!drive.isConfigured) {
    return res.status(503).json({
      message: 'Google Drive no configurado. Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y GOOGLE_DRIVE_FOLDER_ID en el .env (ver README).'
    })
  }

  // Multer rechaza con 413 los archivos mayores a 5MB; aquí validamos el resto
  const file = req.file
  if (!file || !String(file.mimetype || '').startsWith('image/')) {
    return res.status(400).json({ message: 'Se requiere un archivo de imagen' })
  }

  const categorySlug = req.body.categorySlug || 'general'

  try {
    const { fileId } = await drive.uploadImage({
      buffer: file.buffer,
      mimeType: file.mimetype,
      filename: Date.now() + '-' + file.originalname,
      categorySlug
    })
    return res.json({ archivo_url: 'drive://' + fileId })
  } catch (error) {
    const msg = String((error && error.message) || '').toLowerCase()
    // OAuth2 failures (credenciales vencidas/revocadas/inválidas) → degradar
    // graceful a 503 en lugar de 500, para que el producto se guarde igual.
    const isAuthError =
      msg.includes('unauthorized_client') ||
      msg.includes('invalid_grant') ||
      msg.includes('invalid_client') ||
      msg.includes('invalid_token') ||
      msg.includes('unauthorized')
    console.error('Error subiendo imagen a Google Drive:', error && error.message)
    if (isAuthError) {
      return res.status(503).json({
        message: 'Google Drive no configurado o credenciales inválidas. Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y GOOGLE_DRIVE_FOLDER_ID en el .env (ver README).'
      })
    }
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

app.use((err, req, res, next) => {
  // El límite de tamaño de multer (5MB) se traduce a 413, no a 500
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'El archivo supera el tamaño máximo de 5MB' })
  }
  console.error(err)
  return res.status(500).json({ message: 'Error interno del servidor' })
})

module.exports = app
