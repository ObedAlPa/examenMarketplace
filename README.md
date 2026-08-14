# TenoMerca

Marketplace académico con frontend React + Vite, backend Express y persistencia PostgreSQL preparada.

## Instalación rápida

Desde la raíz del proyecto:

```bash
npm run setup
npm run dev
```

Eso deja el sistema listo para probarlo en local con:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

## Qué hace `npm run setup`

- instala dependencias del backend y frontend
- crea `.env` y `.env.local` si no existen
- intenta conectarse a PostgreSQL
- si la base está disponible, ejecuta migraciones y seeds

## Variables de entorno

Archivos de ejemplo:
- `backend/.env.example`
- `frontend/.env.example`

Backend:

```env
PORT=4000
JWT_SECRET=change-this-secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=postgres://postgres:postgres@localhost:5432/marketplace_dev
```

Frontend:

```env
VITE_API_URL=http://localhost:4000
```

## Si PostgreSQL todavía no está levantado

Puedes hacer esto manualmente:

```bash
npm run migrate
npm run seed
npm run dev
```

## Credenciales de prueba

- Admin:
  - email: `admin@tenomerca.test`
  - password: `AdminPass123!`
- Comprador:
  - email: `buyer@tenomerca.test`
  - password: `BuyerPass123!`

## Funcionalidades principales

- catálogo de productos
- carrito y checkout
- login y registro
- autenticación con JWT
- roles admin/comprador
- CRUD de productos, categorías y usuarios
- persistencia PostgreSQL preparada con fallback en memoria

## Validación rápida

1. Inicia el proyecto con:
   ```bash
   npm run dev
   ```
2. Abre el frontend en el navegador.
3. Inicia sesión con el administrador de prueba.
4. Prueba rutas del panel admin.
5. Verifica que el backend responda en:
   ```bash
   http://localhost:4000/api/health
   ```

## Notas importantes

- La contraseña de la base de datos se guarda hasheada con bcrypt.
- En producción usa un JWT_SECRET fuerte.
- El proyecto está preparado para correr sin Docker usando PostgreSQL local + pgAdmin o una instancia local funcional.
