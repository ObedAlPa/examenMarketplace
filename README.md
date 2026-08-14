# AutoPartes

## Ficha académica

- Alumno: Obed Alcantar Pacheco
- Profesor: MIA. César Geovanni Machuca Pereida
- Materia: Desarrollo web integral
- Unidad temática: Unidad 3 — Integración de componentes de software para aplicaciones Web

Tienda en línea de venta de partes y accesorios para automóviles. Aplicación full-stack con API REST, autenticación JWT, carrito con checkout, búsqueda de código postal y subida de imágenes a Google Drive.

## Instalación rápida

Desde la raíz del proyecto (PowerShell en Windows):

```bash
npm run setup
npm start
```

- `npm run setup`: verifica requisitos (Node, npm, PostgreSQL), crea los `.env` si faltan, instala dependencias con npm workspaces y ejecuta migraciones y seed.
- `npm start`: libera los puertos 4000 y 5173 e inicia backend y frontend en ventanas separadas de PowerShell.
- Alternativa multiplataforma (WSL/Linux/macOS): `npm run dev`, que levanta ambos con `concurrently`.

Al iniciar el sistema, la primera pantalla es el login (ver sección de credenciales abajo). La aplicación queda disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

## Credenciales de prueba

- Admin:
  - email: `admin@auto.partes.test`
  - password: `AdminPass123!`
- Comprador:
  - email: `buyer@auto.partes.test`
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

## Configuración de Google Drive (opcional — cada usuario su propia cuenta)

> **IMPORTANTE:** Este proyecto NO incluye credenciales de Google Drive en el repositorio por seguridad. **Cada persona que clone el proyecto debe configurar SU PROPIA cuenta de Google Drive** (personal o institucional) siguiendo los pasos de abajo. No uses las credenciales de otra persona.

Las imágenes de productos se suben a Google Drive mediante OAuth2 con refresh token. El backend expone `POST /api/upload` (solo admin) que devuelve una referencia `drive://<fileId>`, y el frontend la convierte en URL pública visible sin login.

### Pasos para configurar TU Google Drive (5-10 min)

1. **Google Cloud Console** → [console.cloud.google.com](https://console.cloud.google.com)
   - Crea un proyecto nuevo (o usa uno existente)
   - Nombre sugerido: `AutoPartes-Drive-Upload`

2. **Habilita la API de Google Drive**
   - APIs y servicios → Biblioteca → Busca "Google Drive API" → Habilitar

3. **Crea credenciales OAuth 2.0**
   - APIs y servicios → Credenciales → Crear credenciales → ID de cliente OAuth
   - Tipo de aplicación: **Aplicación de escritorio** (Desktop app)
   - Nombre: `AutoPartes Local Dev`
   - Copia el **Client ID** y **Client Secret**

4. **Obtén el Refresh Token (una sola vez)**
   - Opción A (rápida): Usa [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
     - Gear (⚙️) → Marca "Use your own OAuth credentials" → Pega tu Client ID y Client Secret
     - Paso 1: Selecciona `https://www.googleapis.com/auth/drive.file` → Authorize APIs
     - Inicia sesión con **TU cuenta de Google** (la que quieras usar para subir imágenes)
     - Paso 2: Exchange authorization code for tokens → Copia el **Refresh token**
   - Opción B (script local): Ejecuta `node scripts/get-refresh-token.js` (ver abajo)

5. **Crea la carpeta raíz en TU Drive**
   - Entra a [drive.google.com](https://drive.google.com) con TU cuenta
   - Crea una carpeta llamada `AutoPartes`
   - Dentro crea subcarpetas: `llantas`, `frenos`, `motor`, `electrónica`, `suspensión`, `accesorios` (el backend las crea automáticamente si no existen, pero la raíz sí debe existir)
   - Copia el **ID de la carpeta `AutoPartes`** (es lo que hay en la URL: `https://drive.google.com/drive/folders/<ESTE_ES_EL_ID>`)

6. **Configura `backend/.env` con TUS valores**
   ```env
   GOOGLE_CLIENT_ID=tu-client-id-aquí
   GOOGLE_CLIENT_SECRET=tu-client-secret-aquí
   GOOGLE_REFRESH_TOKEN=tu-refresh-token-aquí
   GOOGLE_DRIVE_FOLDER_ID=id-de-tu-carpeta-auto-partes
   ```

### Script auxiliar para obtener el refresh token (opcional)

```bash
# En backend/
node scripts/get-refresh-token.js
# Te pedirá Client ID y Client Secret, abre el navegador, autorizas, y te imprime el refresh token
```

> Si no tienes `scripts/get-refresh-token.js`, usa el OAuth Playground (opción A arriba).

### Qué pasa si NO configuras Drive

- El proyecto **funciona completo** sin Drive
- Al intentar subir imagen (admin) → respuesta `503` con mensaje claro
- Los productos del seed usan placeholders (`/placeholder-product.jpg`)
- No hay errores ni crashes, solo feature degradada elegantemente

### Seguridad: por qué NO hay credenciales en el repo

- Un **refresh token no expira** y da acceso completo al Drive de esa cuenta
- Subirlo a Git público = cualquiera podría borrar/subir/leer archivos de ese Drive
- Cada desarrollador/usuario usa SU cuenta → aislamiento total, sin riesgos

## Búsqueda de código postal

El checkout consulta la API pública Postali (basada en SEPOMEX, sin API key) para autocompletar estado, municipio y colonias con debounce al escribir el código postal. La URL es configurable vía `CP_API_URL` en `backend/.env` por si cambias de proveedor.

## Qué hace `npm run setup`

Ejecuta `scripts/setup.ps1` (PowerShell):

- verifica que Node.js, npm y PostgreSQL estén disponibles
- crea `backend/.env` y `frontend/.env.local` a partir de los ejemplos si no existen
- prueba la conexión a PostgreSQL usando `DATABASE_URL`
- crea la base de datos si no existe
- instala dependencias con npm workspaces
- ejecuta migraciones y seeds

## Qué hace `npm start`

Ejecuta `scripts/start.ps1` (PowerShell):

- verifica Node.js y `node_modules`
- libera los puertos 4000 (backend) y 5173 (frontend) de procesos huérfanos
- inicia el backend y el frontend en ventanas separadas de PowerShell

Detén cada servicio presionando `Ctrl+C` en su ventana.

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
GOOGLE_DRIVE_FOLDER_ID=id-de-la-carpeta-auto-partes
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
npm start
```

## Funcionalidades principales

- catálogo de partes para automóvil
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
   npm start
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