const db = require('./db/pgClient')

module.exports = {
  async getProducts() {
    const res = await db.query('SELECT * FROM products ORDER BY created_at DESC')
    return res.rows
  },
  async getProductById(id) {
    const res = await db.query('SELECT * FROM products WHERE id = $1', [id])
    return res.rows[0] || null
  },
  async createProduct(p) {
    const q = `INSERT INTO products (id, titulo, descripcion, precio, stock, categoria_id, featured, archivo_url, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now()) RETURNING *`;
    const vals = [p.id, p.titulo, p.descripcion || '', p.precio || 0, p.stock || 0, p.categoria_id || null, p.featured || false, p.archivo_url || '/placeholder-product.jpg']
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async updateProduct(id, patch) {
    const existing = await module.exports.getProductById(id)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    const q = `UPDATE products SET titulo=$1, descripcion=$2, precio=$3, stock=$4, categoria_id=$5, featured=$6, archivo_url=$7 WHERE id=$8 RETURNING *`;
    const vals = [updated.titulo, updated.descripcion || '', updated.precio || 0, updated.stock || 0, updated.categoria_id || null, updated.featured || false, updated.archivo_url || '/placeholder-product.jpg', id]
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async deleteProduct(id) {
    const res = await db.query('DELETE FROM products WHERE id = $1', [id])
    return res.rowCount > 0
  },

  // Categories
  async getCategories() {
    const res = await db.query('SELECT * FROM categories ORDER BY nombre')
    return res.rows
  },
  async createCategory(c) {
    const q = `INSERT INTO categories (id,nombre,slug) VALUES ($1,$2,$3) RETURNING *`;
    const vals = [c.id, c.nombre, c.slug || null]
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async updateCategory(id, patch) {
    const existing = (await module.exports.getCategories()).find(x=>x.id===id)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    const q = `UPDATE categories SET nombre=$1, slug=$2 WHERE id=$3 RETURNING *`;
    const vals = [updated.nombre, updated.slug || null, id]
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async deleteCategory(id) {
    const res = await db.query('DELETE FROM categories WHERE id=$1', [id])
    return res.rowCount > 0
  },

  // Users (sanitized)
  async getUsers() {
    const res = await db.query('SELECT id, nombre, email, role, created_at FROM users ORDER BY created_at DESC')
    return res.rows
  },
  async getUserById(id) {
    const res = await db.query('SELECT id, nombre, email, role, created_at FROM users WHERE id=$1', [id])
    return res.rows[0] || null
  },
  async getUserByEmail(email) {
    const res = await db.query('SELECT * FROM users WHERE email=$1', [email])
    return res.rows[0] || null
  },
  async createUser(u) {
    const q = `INSERT INTO users (id,nombre,email,password,role,created_at) VALUES ($1,$2,$3,$4,$5,now()) RETURNING id,nombre,email,role,created_at`;
    const vals = [u.id, u.nombre, u.email, u.password || '', u.role || 'comprador']
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async updateUser(id, patch) {
    const existing = await module.exports.getUserById(id)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    const q = `UPDATE users SET nombre=$1, email=$2, role=$3 WHERE id=$4 RETURNING id,nombre,email,role,created_at`;
    const vals = [updated.nombre, updated.email, updated.role || 'comprador', id]
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async deleteUser(id) {
    const res = await db.query('DELETE FROM users WHERE id=$1', [id])
    return res.rowCount > 0
  },

  // Orders
  async getOrders() {
    const res = await db.query('SELECT * FROM orders ORDER BY created_at DESC')
    return res.rows
  },
  async getOrderById(id) {
    const res = await db.query('SELECT * FROM orders WHERE id=$1', [id])
    return res.rows[0] || null
  },
  async createOrder(o) {
    const q = `INSERT INTO orders (id,user_id,items,total,status,created_at) VALUES ($1,$2,$3,$4,$5,now()) RETURNING *`;
    const vals = [o.id, o.userId, JSON.stringify(o.items||[]), o.total || 0, o.status || 'pending']
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async updateOrder(id, patch) {
    const existing = await module.exports.getOrderById(id)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    const q = `UPDATE orders SET items=$1, total=$2, status=$3 WHERE id=$4 RETURNING *`;
    const vals = [JSON.stringify(updated.items||[]), updated.total||0, updated.status||'pending', id]
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async deleteOrder(id) {
    const res = await db.query('DELETE FROM orders WHERE id=$1', [id])
    return res.rowCount > 0
  },

  // Addresses
  async getAddresses() {
    const res = await db.query('SELECT * FROM addresses')
    return res.rows
  },
  async createAddress(a) {
    const q = `INSERT INTO addresses (id,alias,nombre,calle,numero,colonia,municipio,estado,codigopostal,pais,telefono) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
    const vals = [a.id, a.alias || 'Dirección', a.nombre || '', a.calle || '', a.numero || '', a.colonia || '', a.municipio || '', a.estado || '', a.codigoPostal || '', a.pais || 'México', a.telefono || '']
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async updateAddress(id, patch) {
    const existing = (await module.exports.getAddresses()).find(x=>x.id===id)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    const q = `UPDATE addresses SET alias=$1,nombre=$2,calle=$3,numero=$4,colonia=$5,municipio=$6,estado=$7,codigopostal=$8,pais=$9,telefono=$10 WHERE id=$11 RETURNING *`;
    const vals = [updated.alias,updated.nombre,updated.calle,updated.numero,updated.colonia,updated.municipio,updated.estado,updated.codigopostal,updated.pais,updated.telefono,id]
    const res = await db.query(q, vals)
    return res.rows[0]
  },
  async deleteAddress(id) {
    const res = await db.query('DELETE FROM addresses WHERE id=$1', [id])
    return res.rowCount > 0
  }
}
