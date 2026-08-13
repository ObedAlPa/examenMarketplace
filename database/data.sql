-- data.sql
-- Seeds de ejemplo para TenoMerca (Marketplace México)
-- Contiene: roles, usuarios (con password bcrypt), categorías, productos e imágenes (referencias placeholder)
-- NOTA: El script asume que create_database.sql ya creó la extensión pgcrypto y las tablas.

BEGIN;

-- Roles
INSERT INTO roles (id, name) VALUES
  (gen_random_uuid(), 'admin'),
  (gen_random_uuid(), 'comprador');

-- Usuarios de prueba
-- Credenciales (plaintext) incluidas en README.md para uso de evaluación:
-- Admin: admin@tenomerca.test / AdminPass123!
-- Comprador: buyer@tenomerca.test / BuyerPass123!

INSERT INTO usuarios (id, email, password_hash, nombre, rol_id) VALUES
  (gen_random_uuid(), 'admin@tenomerca.test', '$2a$10$mYE7t40yHXNQUGBuBwKHN.T4hsdKqZjcO1iP4nGsA1iRnsg.MhtFS', 'Administrador Teno', (SELECT id FROM roles WHERE name = 'admin')),
  (gen_random_uuid(), 'buyer@tenomerca.test', '$2a$10$ly6la6raXS9Qaj653GOcYuFY2eKz3p6OkKA0.iJia8m3BQu/NOBrW', 'Comprador Prueba', (SELECT id FROM roles WHERE name = 'comprador'));

-- Categorías de ejemplo
INSERT INTO categorias (id, nombre, descripcion) VALUES
  (gen_random_uuid(), 'Electrónica', 'Dispositivos y gadgets'),
  (gen_random_uuid(), 'Computación', 'Laptops, accesorios y componentes'),
  (gen_random_uuid(), 'Hogar', 'Artículos para el hogar y decoración'),
  (gen_random_uuid(), 'Ropa', 'Moda y accesorios'),
  (gen_random_uuid(), 'Deportes', 'Equipo deportivo'),
  (gen_random_uuid(), 'Libros', 'Libros y material de lectura');

-- Productos de ejemplo (nota: archivo_url usa placeholder; reemplazar con referencias Drive más adelante)
INSERT INTO productos (id, categoria_id, titulo, descripcion, precio, stock, disponible) VALUES
  (gen_random_uuid(), (SELECT id FROM categorias WHERE nombre='Electrónica' LIMIT 1), 'Audífonos inalámbricos X100', 'Audífonos Bluetooth con cancelación de ruido', 1299.00, 25, TRUE),
  (gen_random_uuid(), (SELECT id FROM categorias WHERE nombre='Computación' LIMIT 1), 'Teclado mecánico KMX', 'Teclado mecánico retroiluminado, switch azul', 899.00, 40, TRUE),
  (gen_random_uuid(), (SELECT id FROM categorias WHERE nombre='Hogar' LIMIT 1), 'Sartén antiadherente 28cm', 'Sartén de aluminio con recubrimiento cerámico', 349.00, 60, TRUE),
  (gen_random_uuid(), (SELECT id FROM categorias WHERE nombre='Ropa' LIMIT 1), 'Playera algodón orgánico', 'Playera unisex de algodón orgánico 100%', 249.00, 120, TRUE),
  (gen_random_uuid(), (SELECT id FROM categorias WHERE nombre='Deportes' LIMIT 1), 'Balón de fútbol oficial', 'Balón profesional cosido a mano', 599.00, 30, TRUE),
  (gen_random_uuid(), (SELECT id FROM categorias WHERE nombre='Libros' LIMIT 1), 'Introducción a JavaScript', 'Guía práctica para aprender JavaScript moderno', 199.00, 80, TRUE);

-- Imágenes placeholder (archivo_url: reemplazar por referencia Drive file ID o URL cuando se integre Google Drive)
INSERT INTO imagenes (id, producto_id, archivo_url, orden) VALUES
  (gen_random_uuid(), (SELECT id FROM productos WHERE titulo LIKE 'Audífonos inalámbricos X100' LIMIT 1), 'DRIVE_PLACEHOLDER:electronica/auriculares-x100.jpg', 0),
  (gen_random_uuid(), (SELECT id FROM productos WHERE titulo LIKE 'Teclado mecánico KMX' LIMIT 1), 'DRIVE_PLACEHOLDER:computacion/teclado-kmx.jpg', 0),
  (gen_random_uuid(), (SELECT id FROM productos WHERE titulo LIKE 'Sartén antiadherente 28cm' LIMIT 1), 'DRIVE_PLACEHOLDER:hogar/sarten-28.jpg', 0),
  (gen_random_uuid(), (SELECT id FROM productos WHERE titulo LIKE 'Playera algodón orgánico' LIMIT 1), 'DRIVE_PLACEHOLDER:ropa/playera-organica.jpg', 0),
  (gen_random_uuid(), (SELECT id FROM productos WHERE titulo LIKE 'Balón de fútbol oficial' LIMIT 1), 'DRIVE_PLACEHOLDER:deportes/balon-futbol.jpg', 0),
  (gen_random_uuid(), (SELECT id FROM productos WHERE titulo LIKE 'Introducción a JavaScript' LIMIT 1), 'DRIVE_PLACEHOLDER:libros/intro-js.jpg', 0);

COMMIT;

-- Fin seeds

