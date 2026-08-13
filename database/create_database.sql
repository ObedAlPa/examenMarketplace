-- create_database.sql
-- DDL para la base de datos del marketplace (PostgreSQL)
-- Incluye tablas: roles, usuarios, categorias, productos, imagenes, direcciones, carrito, detalle_carrito, pedidos, detalle_pedido

-- Requiere la extensión pgcrypto para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nombre TEXT,
    rol_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Productos
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    precio NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_titulo ON productos USING gin (to_tsvector('spanish', coalesce(titulo, '')));

-- Imágenes de productos (puede almacenar URL o referencia a GDrive)
CREATE TABLE IF NOT EXISTS imagenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    archivo_url TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_imagenes_producto ON imagenes(producto_id);

-- Direcciones de usuario
CREATE TABLE IF NOT EXISTS direcciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    calle TEXT,
    ciudad TEXT,
    estado TEXT,
    pais TEXT,
    codigo_postal TEXT,
    telefono TEXT,
    es_predeterminada BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_direcciones_usuario ON direcciones(usuario_id);

-- Carrito (uno por usuario)
CREATE TABLE IF NOT EXISTS carrito (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS detalle_carrito (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrito_id UUID NOT NULL REFERENCES carrito(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0)
);
CREATE INDEX IF NOT EXISTS idx_detalle_carrito_carrito ON detalle_carrito(carrito_id);

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    direccion_id UUID REFERENCES direcciones(id) ON DELETE SET NULL,
    total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
    estado TEXT NOT NULL DEFAULT 'pendiente',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0)
);
CREATE INDEX IF NOT EXISTS idx_detalle_pedido_pedido ON detalle_pedido(pedido_id);

-- Triggers / funciones auxiliares: actualizar timestamps
-- Función para tablas que usan 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para tablas que usan 'actualizado_en'
CREATE OR REPLACE FUNCTION trigger_set_timestamp_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Conectar trigger a tablas que tienen updated_at
DROP TRIGGER IF EXISTS usuarios_set_timestamp ON usuarios;
CREATE TRIGGER usuarios_set_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp_updated_at();

-- Conectar trigger a tablas que usan actualizado_en
DROP TRIGGER IF EXISTS productos_set_timestamp ON productos;
CREATE TRIGGER productos_set_timestamp
BEFORE UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp_actualizado_en();

COMMIT;

-- Fin del DDL inicial

