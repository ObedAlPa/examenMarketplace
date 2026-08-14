# TenoMerca

## Ficha académica

- Alumno: Obed Alcantar Pacheco
- Profesor: MIA. César Geovanni Machuca Pereida
- Materia: Desarrollo web integral
- Unidad temática: Unidad 3 — Integración de componentes de software para aplicaciones Web

Marketplace académico con frontend React + Vite, backend Express y persistencia PostgreSQL preparada.

## Instalación rápida

Desde la raíz del proyecto:

```bash
npm run setup
npm run dev
```

Al iniciar el sistema, la primera pantalla es el login. Si 5173 ya está en uso, Vite puede abrir en 5174 automáticamente. La aplicación queda disponible en:
- Frontend: http://localhost:5173  (o http://localhost:5174 si 5173 está ocupado)
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

## Credenciales de prueba

- Admin:
  - email: `admin@tenomerca.test`
  - password: `AdminPass123!`
- Comprador:
  - email: `buyer@tenomerca.test`
  - password: `BuyerPass123!`

La primera vista del sistema es el login. Si aún no tienes cuenta, usa la opción de registro desde la pantalla de acceso.

## Imágenes en Google Drive

Las imágenes de productos se guardan como referencia, no como blob en la base de datos. En `archivo_url` puedes guardar cualquiera de estas opciones:

```text
drive://<FILE_ID>
https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
https://drive.google.com/uc?export=view&id=<FILE_ID>
```

El sistema normaliza esas referencias para mostrarlas en el frontend sin guardar archivos dentro de PostgreSQL.

## Configuración de Google Drive

Las imágenes de productos se suben a la cuenta institucional `al05-050-0322@utdelacosta.edu.mx` mediante OAuth2 con refresh token. Pasos resumidos:

1. Entra a Google Cloud Console y crea un proyecto.
2. Habilita la API de Google Drive.
3. Crea un OAuth Client ID de tipo "Desktop app" y anota el Client ID y el Client Secret.
4. Autoriza una vez con la cuenta institucional para obtener el refresh token (flujo OAuth2).
5. Define las 4 variables de Drive en `backend/.env`.
6. En Drive, crea la estructura de carpetas `Marketplace-Mexico/{electronica, hogar, ropa}`.
7. `GOOGLE_DRIVE_FOLDER_ID` es el ID de la carpeta `Marketplace-Mexico`.
8. Las imágenes se suben con permiso "cualquier persona con el enlace".

Nota: si Drive no está configurado, el sistema sigue funcionando. La subida responde 503 con un mensaje claro y los productos usan una imagen placeholder.

## Búsqueda de código postal

El checkout consulta la API pública Postali (basada en SEPOMEX, sin API key) para autocompletar estado, municipio y colonias con debounce al escribir el código postal. La URL es configurable vía `CP_API_URL` en `backend/.env` por si cambias de proveedor.

## Qué hace `npm run setup`

- instala dependencias del backend y frontend
- crea `.env` y `.env.local` si no existen
- intenta conectarse a PostgreSQL
- si la base está disponible, verifica si la base de datos existe y la crea si hace falta
- luego ejecuta migraciones y seeds

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
# URL de la API pública Postali (SEPOMEX), sin API key. Configurable por si cambias de proveedor.
CP_API_URL=https://postali.app/api/v1/mx/cp/
# Google Drive (OAuth2 con refresh token). Ver sección "Configuración de Google Drive".
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REFRESH_TOKEN=tu-refresh-token
GOOGLE_DRIVE_FOLDER_ID=id-de-la-carpeta-marketplace-mexico
```

Frontend:

```env
VITE_API_URL=http://localhost:4000
```

## Si PostgreSQL todavía no está levantado

El proyecto puede seguir funcionando en modo memoria mientras no haya una base de datos disponible. Si quieres activar PostgreSQL, actualiza `backend/.env` con tu `DATABASE_URL` real y luego ejecuta:

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
- carrito con backend y checkout
- pedidos con número de pedido y pago simulado (método y estado)
- búsqueda de código postal real (Postali/SEPOMEX)
- subida de imágenes de productos a Google Drive
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
