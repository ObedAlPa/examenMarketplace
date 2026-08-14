-- Create tables for TenoMerca

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'comprador',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  categoria_id TEXT REFERENCES categories(id),
  featured BOOLEAN DEFAULT false,
  archivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  items JSONB DEFAULT '[]',
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY,
  alias TEXT,
  nombre TEXT,
  calle TEXT,
  numero TEXT,
  colonia TEXT,
  municipio TEXT,
  estado TEXT,
  codigoPostal TEXT,
  pais TEXT,
  telefono TEXT
);

-- Carrito de compras: una fila por usuario+producto (id = product_id simplifica el contrato frontend)
CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  precio NUMERIC NOT NULL DEFAULT 0,
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  archivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, id)
);

-- Pedidos: número legible, método y estado de pago independientes del estado logístico
ALTER TABLE orders ADD COLUMN IF NOT EXISTS numero_pedido TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metodo_pago TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estado_pago TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS direccion JSONB;
