-- Seed data for TenoMerca (development only)

INSERT INTO users (id, nombre, email, password, role, created_at) VALUES
('USR-1', 'Admin', 'admin@tenomerca.test', 'AdminPass123!', 'admin', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, nombre, email, password, role, created_at) VALUES
('USR-2', 'Comprador', 'buyer@tenomerca.test', 'BuyerPass123!', 'comprador', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, nombre, slug) VALUES
('CAT-1','General','general') ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, titulo, descripcion, precio, stock, categoria_id, featured, archivo_url, created_at) VALUES
('PRD-1','Producto Demo','Descripción de ejemplo', 199.9, 10, 'CAT-1', true, '/placeholder-product.jpg', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, user_id, items, total, status, created_at) VALUES
('ORD-1','USR-2', '[]', 0, 'pending', now())
ON CONFLICT (id) DO NOTHING;
