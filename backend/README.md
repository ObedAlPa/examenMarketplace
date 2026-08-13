# Backend (Node.js + Express)

Backend inicial del proyecto TenoMerca con API REST mínima y datos en memoria para poder conectar el frontend sin reescribir la UI.

Stack actual:
- Node.js + Express
- CORS + dotenv + JWT
- Datos de ejemplo en memoria (skeleton para conectar PostgreSQL después)

## Instalación

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
PORT=4000
JWT_SECRET=change-this-secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Endpoints disponibles

- GET /api/health
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me
- GET /api/products
- GET /api/products/:id
- GET /api/products/search?q=
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders
- PUT /api/orders/:id
- DELETE /api/orders/:id
- GET /api/addresses
- POST /api/addresses
- PUT /api/addresses/:id
- DELETE /api/addresses/:id

## Cuentas de prueba

- Admin: admin@tenomerca.test / AdminPass123!
- Buyer: buyer@tenomerca.test / BuyerPass123!

## Verificación rápida

```bash
npm test
```

## Puerto

Por defecto la API corre en `http://localhost:4000`.
