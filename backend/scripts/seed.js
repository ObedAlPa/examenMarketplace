const path = require('path')
const { Client } = require('pg')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env'), quiet: true })

const DATABASE_URL = process.env.DATABASE_URL || process.env.PG_CONNECTION || 'postgresql://postgres:postgres@localhost:5432/marketplace_dev'

async function run() {
  const client = new Client({ connectionString: DATABASE_URL })

  try {
    await client.connect()
    console.log('Connected to database (seed)')

    // Insert categories
    const categories = [
      { id: 'cat-1', nombre: 'Llantas', slug: 'llantas' },
      { id: 'cat-2', nombre: 'Frenos', slug: 'frenos' },
      { id: 'cat-3', nombre: 'Motor', slug: 'motor' },
      { id: 'cat-4', nombre: 'Electrónica', slug: 'electronica' },
      { id: 'cat-5', nombre: 'Suspensión', slug: 'suspension' }
    ]

    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (id,nombre,slug) VALUES ($1,$2,$3) ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, slug = EXCLUDED.slug`,
        [cat.id, cat.nombre, cat.slug]
      )
    }
    console.log(`Inserted ${categories.length} categories`)

    // Insert products
    const products = [
      {
        id: 'p1',
        titulo: 'Llanta 18" Acero',
        descripcion: 'Llanta de acero resistente para uso urbano y rural.',
        precio: 1899,
        stock: 25,
        categoria_id: 'cat-1',
        featured: true,
        archivo_url: '/placeholder-product.jpg'
      },
      {
        id: 'p2',
        titulo: 'Pastillas de freno premium',
        descripcion: 'Pastillas de freno de alto rendimiento, vida útil extendida.',
        precio: 699,
        stock: 40,
        categoria_id: 'cat-2',
        featured: true,
        archivo_url: '/placeholder-product.jpg'
      },
      {
        id: 'p3',
        titulo: 'Filtro de aceite synthetic',
        descripcion: 'Filtro de aceite sintético para cambios cada 10,000 km.',
        precio: 89,
        stock: 120,
        categoria_id: 'cat-3',
        featured: false,
        archivo_url: '/placeholder-product.jpg'
      },
      {
        id: 'p4',
        titulo: 'Batería 12V 650 CCA',
        descripcion: 'Batería de alto rendimiento para clima frío y verano.',
        precio: 1299,
        stock: 30,
        categoria_id: 'cat-3',
        featured: false,
        archivo_url: '/placeholder-product.jpg'
      },
      {
        id: 'p5',
        titulo: 'Kit de suspensión deportiva',
        descripcion: 'Reduce la altura del vehículo y mejora estabilidad en curvas.',
        precio: 2899,
        stock: 15,
        categoria_id: 'cat-5',
        featured: true,
        archivo_url: '/placeholder-product.jpg'
      },
      {
        id: 'p6',
        titulo: 'Correa de distribución',
        descripcion: 'Kit completo de correa y tensores para mantenimiento preventivo.',
        precio: 459,
        stock: 80,
        categoria_id: 'cat-2',
        featured: false,
        archivo_url: '/placeholder-product.jpg'
      }
    ]

    for (const prod of products) {
      await client.query(
        `INSERT INTO products (id,titulo,descripcion,precio,stock,categoria_id,featured,archivo_url,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now()) ON CONFLICT (id) DO NOTHING`,
        [prod.id, prod.titulo, prod.descripcion, prod.precio, prod.stock, prod.categoria_id, prod.featured, prod.archivo_url]
      )
    }
    console.log(`Inserted ${products.length} products`)

    // Insert admin user
    const adminHashed = await bcrypt.hash('AdminPass123!', 10)
    await client.query(
      `INSERT INTO users (id,nombre,email,password,role,created_at) VALUES ($1,$2,$3,$4,$5,now()) ON CONFLICT (id) DO NOTHING`,
      ['USR-1', 'Administrador Auto', 'admin@auto.partes.test', adminHashed, 'admin']
    )
    console.log('Inserted admin user')

    // Insert buyer user
    const buyerHashed = await bcrypt.hash('BuyerPass123!', 10)
    await client.query(
      `INSERT INTO users (id,nombre,email,password,role,created_at) VALUES ($1,$2,$3,$4,$5,now()) ON CONFLICT (id) DO NOTHING`,
      ['USR-2', 'Comprador Prueba', 'buyer@auto.partes.test', buyerHashed, 'comprador']
    )
    console.log('Inserted buyer user')

    console.log('Seeds applied successfully')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()