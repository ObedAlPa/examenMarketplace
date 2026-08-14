-- Seed data for TenoMerca (development only)
-- Passwords are bcrypt hashes (never plaintext). Plain values used for evaluation:
-- Admin: admin@tenomerca.test / AdminPass123!
-- Comprador: buyer@tenomerca.test / BuyerPass123!

INSERT INTO users (id, nombre, email, password, role, created_at) VALUES
('USR-1', 'Admin', 'admin@tenomerca.test', '$2a$10$mYE7t40yHXNQUGBuBwKHN.T4hsdKqZjcO1iP4nGsA1iRnsg.MhtFS', 'admin', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, nombre, email, password, role, created_at) VALUES
('USR-2', 'Comprador', 'buyer@tenomerca.test', '$2a$10$ly6la6raXS9Qaj653GOcYuFY2eKz3p6OkKA0.iJia8m3BQu/NOBrW', 'comprador', now())
ON CONFLICT (id) DO NOTHING;

-- Categorías base
INSERT INTO categories (id, nombre, slug) VALUES
('CAT-1', 'Electrónica', 'electronica'),
('CAT-2', 'Computación', 'computacion'),
('CAT-3', 'Hogar', 'hogar'),
('CAT-4', 'Ropa', 'ropa'),
('CAT-5', 'Deportes', 'deportes'),
('CAT-6', 'Libros', 'libros'),
('CAT-7', 'General', 'general')
ON CONFLICT (id) DO NOTHING;

-- Productos demo con activo=true y placeholders SVG
INSERT INTO products (id, titulo, descripcion, precio, stock, categoria_id, featured, archivo_url, activo, created_at) VALUES
('PRD-1', 'Audífonos inalámbricos X100', 'Audífonos Bluetooth 5.0 con cancelación de ruido activa, 30h de batería', 1299.00, 25, 'CAT-1', true, '/placeholder-audio.svg', true, now()),
('PRD-2', 'Teclado mecánico KMX', 'Teclado mecánico RGB switches azules, layout ANSI, aluminio', 899.00, 40, 'CAT-2', true, '/placeholder-teclado.svg', true, now()),
('PRD-3', 'Sartén antiadherente 28cm', 'Sartén de aluminio forjado, libre de PFOA, apta inducción', 349.00, 60, 'CAT-3', true, '/placeholder-sarten.svg', true, now()),
('PRD-4', 'Playera algodón orgánico', 'Playera 100% algodón orgánico certificado GOTS, corte clásico', 249.00, 120, 'CAT-4', true, '/placeholder-playera.svg', true, now()),
('PRD-5', 'Balón de fútbol oficial', 'Balón tamaño 5, FIFA Quality Pro, cuero sintético texturizado', 599.00, 30, 'CAT-5', true, '/placeholder-balon.svg', true, now()),
('PRD-6', 'Introducción a JavaScript', 'Guía práctica ES6+ con ejercicios, 350 páginas, tapa blanda', 199.00, 80, 'CAT-6', true, '/placeholder-libro.svg', true, now()),
('PRD-7', 'Producto Demo', 'Descripción de ejemplo para pruebas', 199.9, 10, 'CAT-7', false, '/placeholder-product.svg', true, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, user_id, items, total, status, created_at) VALUES
('ORD-1', 'USR-2', '[]', 0, 'Pendiente', now())
ON CONFLICT (id) DO NOTHING;