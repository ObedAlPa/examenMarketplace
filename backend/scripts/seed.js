const path = require('path')
const { Client } = require('pg')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const DATABASE_URL = process.env.DATABASE_URL || process.env.PG_CONNECTION || 'postgres://localhost:5432/tenomerca_dev'

async function run() {
  const client = new Client({ connectionString: DATABASE_URL })

  try {
    await client.connect()
    console.log('Connected to', DATABASE_URL)

    const users = [
      { id: 'USR-1', nombre: 'Admin', email: 'admin@tenomerca.test', password: 'AdminPass123!', role: 'admin' },
      { id: 'USR-2', nombre: 'Comprador', email: 'buyer@tenomerca.test', password: 'BuyerPass123!', role: 'comprador' }
    ]

    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10)
      await client.query(
        `INSERT INTO users (id,nombre,email,password,role,created_at)
         VALUES ($1,$2,$3,$4,$5,now())
         ON CONFLICT (id) DO NOTHING`,
        [user.id, user.nombre, user.email, hashed, user.role]
      )
    }

    await client.query(
      `INSERT INTO categories (id,nombre,slug)
       VALUES ($1,$2,$3)
       ON CONFLICT (id) DO NOTHING`,
      ['CAT-1', 'General', 'general']
    )

    await client.query(
      `INSERT INTO products (id,titulo,descripcion,precio,stock,categoria_id,featured,archivo_url,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now())
       ON CONFLICT (id) DO NOTHING`,
      ['PRD-1', 'Producto Demo', 'Descripción de ejemplo', 199.9, 10, 'CAT-1', true, '/placeholder-product.jpg']
    )

    await client.query(
      `INSERT INTO orders (id,user_id,items,total,status,created_at)
       VALUES ($1,$2,$3,$4,$5,now())
       ON CONFLICT (id) DO NOTHING`,
      ['ORD-1', 'USR-2', '[]', 0, 'pending']
    )

    console.log('Seeds applied')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
