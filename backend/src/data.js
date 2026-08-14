const categories = [
  { id: 'cat-1', nombre: 'Tecnología', slug: 'tecnologia' },
  { id: 'cat-2', nombre: 'Hogar', slug: 'hogar' },
  { id: 'cat-3', nombre: 'Ropa', slug: 'ropa' },
  { id: 'cat-4', nombre: 'Deportes', slug: 'deportes' },
  { id: 'cat-5', nombre: 'Libros', slug: 'libros' }
]

const products = [
  {
    id: 'p1',
    titulo: 'Audífonos inalámbricos X100',
    descripcion: 'Audífonos con cancelación de ruido y excelente batería.',
    precio: 1299,
    stock: 25,
    categoria_id: 'cat-1',
    featured: true,
    archivo_url: 'drive://1m6rI4d2d1QfQz5mhI5jCJjW2d7S9gKXq',
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    titulo: 'Teclado mecánico KMX',
    descripcion: 'Teclado gamer con switches suaves y RGB personalizable.',
    precio: 899,
    stock: 40,
    categoria_id: 'cat-1',
    featured: true,
    archivo_url: 'drive://1M3QqvT8SHhXl5b1Z0gF4mN4x6dU2dR4Y',
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    titulo: 'Sartén antiadherente 28cm',
    descripcion: 'Sartén ideal para cocina diaria con acabado resistente.',
    precio: 349,
    stock: 60,
    categoria_id: 'cat-2',
    featured: false,
    archivo_url: 'drive://1Yl4nGQxEMWI3fEW1nD9X9PKx9ZV9Y2kF',
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    titulo: 'Playera algodón orgánico',
    descripcion: 'Playera de algodón premium, cómoda y con corte moderno.',
    precio: 249,
    stock: 120,
    categoria_id: 'cat-3',
    featured: false,
    archivo_url: 'drive://1v9zNfQnI4Qz3J8C5s0cK7yM7Vv0xP3nW',
    created_at: new Date().toISOString()
  },
  {
    id: 'p5',
    titulo: 'Balón de fútbol oficial',
    descripcion: 'Balón oficial para entrenamientos y partidos.',
    precio: 599,
    stock: 30,
    categoria_id: 'cat-4',
    featured: true,
    archivo_url: 'drive://1WbH9a0qG2x0L4w8SE1QjF4wQ1nP7Xc9k',
    created_at: new Date().toISOString()
  },
  {
    id: 'p6',
    titulo: 'Introducción a JavaScript',
    descripcion: 'Libro guía para aprender JavaScript desde cero.',
    precio: 199,
    stock: 80,
    categoria_id: 'cat-5',
    featured: false,
    archivo_url: 'drive://1lD0uG1sJ8X2mQ4rC6vY0wK2hP7wV9nT1',
    created_at: new Date().toISOString()
  }
]

const users = [
  {
    id: 'USR-1',
    nombre: 'Administrador Teno',
    email: 'admin@tenomerca.test',
    password: 'AdminPass123!',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'USR-2',
    nombre: 'Comprador Prueba',
    email: 'buyer@tenomerca.test',
    password: 'BuyerPass123!',
    role: 'comprador',
    created_at: new Date().toISOString()
  }
]

const orders = [
  {
    id: 'ORD-1',
    userId: 'USR-2',
    items: [{ productId: 'p1', cantidad: 1, precio: 1299 }],
    total: 1299,
    status: 'pending',
    created_at: new Date().toISOString()
  }
]

const addresses = [
  {
    id: 'ADR-1',
    alias: 'Casa',
    nombre: 'Comprador Prueba',
    calle: 'Av. Revolución',
    numero: '123',
    colonia: 'Centro',
    municipio: 'Ciudad de México',
    estado: 'CDMX',
    codigoPostal: '06000',
    pais: 'México',
    telefono: '5512345678'
  }
]

const cartItems = []

module.exports = {
  categories,
  products,
  users,
  orders,
  addresses,
  cartItems
}
