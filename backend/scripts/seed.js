const { Client } = require('pg')
const bcrypt = require('bcrypt')

const DATABASE_URL = process.env.DATABASE_URL || process.env.PG_CONNECTION || 'postgres://localhost:5432/tenomerca_dev'

async function run() {
  const client = new Client({ connectionString: DATABASE_URL })
  try {
    await client.connect()
    console.log('Connected to', DATABASE_URL)

    // Seed users with hashed passwords
    const users = [
      { id: 'USR-1', nombre: 'Admin', email: 'admin@tenomerca.test', password: 'AdminPass123!', role: 'admin' },
      { id: 'USR-2', nombre: 'Comprador', email: 'buyer@tenomerca.test', password: 'BuyerPass123!', role: 'comprador' }
    ]

    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10)
      await client.query(
        `INSERT INTO users (id,nombre,email,password,role,created_at) VALUES ($1,$2,$3,$4,$5,now()) ON CONFLICT (id) DO NOTHING`,
        [u.id, u.nombre, u.email, hashed, u.role]
      )
    }

    // Categories
    await client.query(`INSERT INTO categories (id,nombre,slug) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING`, ['CAT-1', 'General', 'general'])

    // Products
    await client.query(`INSERT INTO products (id,titulo,descripcion,precio,stock,categoria_id,featured,archivo_url,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now()) ON CONFLICT (id) DO NOTHING`, ['PRD-1','Producto Demo','Descripción de ejemplo',199.9,10,'CAT-1',true,'/placeholder-product.jpg'])

    // Orders
    await client.query(`INSERT INTO orders (id,user_id,items,total,status,created_at) VALUES ($1,$2,$3,$4,$5,now()) ON CONFLICT (id) DO NOTHING`, ['ORD-1','USR-2', '[]', 0, 'pending'])

    console.log('Seeds applied')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
const path = require('path')
const { Client } = require('pg')

const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'data.sql'), 'utf8')
const DATABASE_URL = process.env.DATABASE_URL || process.env.PG_CONNECTION || 'postgresql://postgres:postgres@localhost:5432/tenomerca_dev'

async function run() {
  const client = new Client({ connectionString: DATABASE_URL })
  try {
    await client.connect()
    console.log('Connected to', DATABASE_URL)
    await client.query(sql)
    console.log('Seeds applied')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
