const categories = [
  { id: 'cat-1', nombre: 'Llantas', slug: 'llantas' },
  { id: 'cat-2', nombre: 'Frenos', slug: 'frenos' },
  { id: 'cat-3', nombre: 'Motor', slug: 'motor' },
  { id: 'cat-4', nombre: 'Electrónica', slug: 'electronica' },
  { id: 'cat-5', nombre: 'Suspensión', slug: 'suspension' }
]

const products = [
  {
    id: 'p1',
    titulo: 'Llanta 18" Acero',
    descripcion: 'Llanta de acero resistente para uso urbano y rural.',
    precio: 1899,
    stock: 25,
    categoria_id: 'cat-1',
    featured: true,
    archivo_url: '/placeholder-product.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    titulo: 'Pastillas de freno premium',
    descripcion: 'Pastillas de freno de alto rendimiento, vida útil extendida.',
    precio: 699,
    stock: 40,
    categoria_id: 'cat-2',
    featured: true,
    archivo_url: '/placeholder-product.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    titulo: 'Filtro de aceite synthetic',
    descripcion: 'Filtro de aceite sintético para cambios cada 10,000 km.',
    precio: 89,
    stock: 120,
    categoria_id: 'cat-3',
    featured: false,
    archivo_url: '/placeholder-product.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    titulo: 'Batería 12V 650 CCA',
    descripcion: 'Batería de alto rendimiento para clima frío y verano.',
    precio: 1299,
    stock: 30,
    categoria_id: 'cat-3',
    featured: false,
    archivo_url: '/placeholder-product.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 'p5',
    titulo: 'Kit de suspensión deportiva',
    descripcion: 'Reduce la altura del vehículo y mejora estabilidad en curvas.',
    precio: 2899,
    stock: 15,
    categoria_id: 'cat-5',
    featured: true,
    archivo_url: '/placeholder-product.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 'p6',
    titulo: 'Correa de distribución',
    descripcion: 'Kit completo de correa y tensores para mantenimiento preventivo.',
    precio: 459,
    stock: 80,
    categoria_id: 'cat-2',
    featured: false,
    archivo_url: '/placeholder-product.jpg',
    created_at: new Date().toISOString()
  }
]

const users = [
  {
    id: 'USR-1',
    nombre: 'Administrador Auto',
    email: 'admin@auto.partes.test',
    password: 'AdminPass123!',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'USR-2',
    nombre: 'Comprador Prueba',
    email: 'buyer@auto.partes.test',
    password: 'BuyerPass123!',
    role: 'comprador',
    created_at: new Date().toISOString()
  }
]

const orders = []

const addresses = []

const cartItems = []

module.exports = {
  categories,
  products,
  users,
  orders,
  addresses,
  cartItems
}