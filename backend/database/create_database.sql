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
