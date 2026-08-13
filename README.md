# TenoMerca — Marketplace México

Alumno: Obed Alcantar Pacheco
Profesor: MIA. César Geovanni Machuca Pereida
Materia: Desarrollo web integral
Unidad temática: Unidad 3 — Integración de componentes de software para aplicaciones Web


## Descripción breve
TenoMerca — "Compras con alma mexicana" — es una plataforma marketplace enfocada en operaciones dentro de México: vendedores pueden publicar productos y compradores consultarlos, agregarlos al carrito y generar pedidos. El proyecto usa React + Vite en el frontend, Node.js + Express en el backend y PostgreSQL para persistencia. Las imágenes se almacenan en Google Drive.

> Nota: La identidad visual y las reglas de diseño están en `design.md` (archivo fuente de verdad para estilos, colores y tipografía).

## Objetivo
Construir una aplicación web tipo marketplace para prácticas académicas, integrando autenticación, CRUD de productos y categorías, carrito y flujo de pedidos simulado, con almacenamiento de imágenes en Google Drive y validación de códigos postales mexicanos mediante una API pública.

## Tecnologías (principales)
- Node.js (>= 18)
- npm o yarn / pnpm
- React + Vite
- Tailwind CSS
- Express
- PostgreSQL (>= 13)
- googleapis (Google Drive integration)
- bcrypt, jsonwebtoken


## Estructura inicial del repositorio
- design.md — identidad visual, paleta y reglas de UI (fuente de la verdad)
- frontend/ — código del cliente (React + Vite)
- backend/ — API (Node.js + Express)
- database/
  - create_database.sql (DDL) — por crear
  - data.sql (seed data) — por crear
- docs/ — documentación y capturas


## Requisitos previos
- Node.js y npm (o yarn/pnpm)
- PostgreSQL instalado y usuario con permisos para crear bases de datos
- Cuenta Google Cloud para configurar Google Drive API (ver sección Configuración de Google Drive en README extendido)


## Variables de entorno (placeholder)

Las siguientes variables se usarán en el backend (archivo `.env` en `backend/` o en la raíz dependiendo de la configuración final):

- DATABASE_URL — URL de conexión Postgres (ej. postgres://user:pass@host:5432/dbname) OR separate vars:
  - PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
- JWT_SECRET — secreto para firmar tokens JWT
- PORT — puerto donde corre el backend (ej. 4000)
- GOOGLE_SERVICE_ACCOUNT_JSON — ruta al archivo JSON de cuenta de servicio (opcional)
- GOOGLE_DRIVE_FOLDER_ID — ID de la carpeta raíz en Drive (Marketplace-Mexico)
- POSTAL_API_KEY — (si la API de códigos postales requiere clave). Si no, dejar vacío.

Variables de entorno del frontend (archivo `.env` para Vite, p.e. `.env.local`):
- VITE_API_URL — URL del backend (ej. http://localhost:4000)


## Primeros pasos (rápido)
1. Clonar el repositorio
   git clone https://github.com/ObedAlPa/examenMarketplace.git
2. Instalar dependencias en backend y frontend (aún no creados en esta etapa):
   - cd backend && npm install
   - cd frontend && npm install
3. Configurar PostgreSQL y crear la base de datos (ver `database/create_database.sql` cuando esté listo).
4. Crear archivo `.env` en `backend/` con las variables necesarias.
5. Levantar backend: npm run dev (o comando que se documentará en la carpeta backend)

Frontend — uso rápido

6. Levantar frontend (pasos detallados):

   1) Entrar a la carpeta del frontend:

      cd frontend

   2) Instalar dependencias (si no están instaladas):

      npm install

   3) Levantar el servidor de desarrollo (Vite):

      npm run dev

      Abrir en el navegador la URL que muestre Vite (normalmente http://localhost:5173).

   4) Ejecutar tests unitarios (validadores):

      npm run test

   5) Build de producción (si se requiere):

      npm run build

   Nota: El frontend contiene validaciones de formulario, persistencia de carrito/pedidos en localStorage y tests unitarios para las funciones de validación (usar `npm run test`).


## Ejecutar la base de datos PostgreSQL y seeds desde la terminal de VS Code
A continuación se muestran comandos y pasos para crear la base de datos y ejecutar los scripts SQL (Windows / PowerShell). Desde VS Code: Abrir Terminal -> New Terminal (PowerShell) y ejecutar los siguientes pasos.

1) (Opcional) Usando una instalación local de PostgreSQL (psql debe estar en PATH)

- Crear la base de datos (reemplazar <PGUSER> y <PGPASSWORD> si aplica):
  psql -h localhost -p 5432 -U <PGUSER> -c "CREATE DATABASE marketplace_dev;"

- Ejecutar el script DDL (create_database.sql):
  psql -h localhost -p 5432 -U <PGUSER> -d marketplace_dev -f database/create_database.sql

- Ejecutar el script de seeds (data.sql):
  psql -h localhost -p 5432 -U <PGUSER> -d marketplace_dev -f database/data.sql

Notas:
- Si psql solicita contraseña, introdúcela cuando se pida (o exporta PGPASSWORD en la sesión: $env:PGPASSWORD='tu_contraseña').
- El script create_database.sql intenta crear la extensión pgcrypto (gen_random_uuid()). Crear extensiones requiere permisos de superusuario. Si no tienes permisos de superuser, ejecuta los pasos con un rol que sí los tenga o modifica el DDL para generar UUIDs desde la aplicación.

2) (Alternativa) Usando Docker (recomendado si no quieres instalar PostgreSQL localmente)

- Levantar un contenedor PostgreSQL (ejemplo):
  docker run --name examen-pg -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=marketplace_dev -p 5432:5432 -d postgres:14

- Esperar a que el contenedor arranque y luego ejecutar los scripts desde la máquina host (si psql está instalado) o ejecutar psql dentro del contenedor:
  docker exec -it examen-pg bash
  psql -U postgres -d marketplace_dev -f /workspace/database/create_database.sql    # si montaste /workspace

- Si prefieres copiar los archivos al contenedor temporalmente:
  docker cp database/create_database.sql examen-pg:/tmp/create_database.sql
  docker cp database/data.sql examen-pg:/tmp/data.sql
  docker exec -it examen-pg psql -U postgres -d marketplace_dev -f /tmp/create_database.sql
  docker exec -it examen-pg psql -U postgres -d marketplace_dev -f /tmp/data.sql

3) Validaciones rápidas (después de ejecutar los scripts)
- Listar tablas: psql -U <PGUSER> -d marketplace_dev -c "\dt"
- Ver roles: psql -U <PGUSER> -d marketplace_dev -c "SELECT id, name FROM roles;"
- Ver usuarios: psql -U <PGUSER> -d marketplace_dev -c "SELECT email, nombre, created_at FROM usuarios;"

4) Problemas comunes
- Error al crear extensión pgcrypto -> necesitas permisos de superusuario. Si usas Docker con la imagen oficial, el usuario 'postgres' crea extensiones sin problema.
- psql no está en PATH -> instalar cliente PostgreSQL o usar Docker + psql dentro del contenedor.

Si quieres, puedo añadir comandos concretos para PowerShell que exporten temporalmente PGPASSWORD o scripts .ps1 para automatizar estos pasos.





## Usuarios de prueba
Los siguientes usuarios de prueba se crean en `database/data.sql`. Contraseñas plaintext para evaluación y pruebas locales (usar solo en entorno de desarrollo):

- Admin
  - Email: admin@tenomerca.test
  - Contraseña: AdminPass123!

- Comprador
  - Email: buyer@tenomerca.test
  - Contraseña: BuyerPass123!

## Estado actual
- design.md creado y comiteado.
- .gitignore creado y comiteado.
- Estructura de carpetas inicial y placeholders para `frontend/`, `backend/`, `database/` creados.


## Funcionalidades del frontend (estado)
A continuación se lista el estado actual por vista/funcionalidad (mock/local, preparado para backend):

1. Build frontend home page (mock) — Implementado ✅
   - Home con listados de destacados y navegación.
2. Build product catalog and detail pages (mock, imágenes placeholder) — Implementado ✅
   - Catalog, ProductDetail; imágenes placeholder y productService como abstracción.
3. Build cart and checkout UI (mock) — Implementado ✅
   - Carrito (Cart), Checkout con validaciones y persistencia mock en localStorage vía services.
4. Build login and registration UI (mock) — Implementado ✅
   - Login y Register con validaciones y accesibilidad ARIA.
5. Build buyer dashboard UI (mock) — Implementado (mínimo) ✅
   - Orders (lista) y OrderDetail (recibo mínimo) disponibles; UX básico para historial y estados.
6. Build admin dashboard - product CRUD UI (mock) — Parcial/Mock ⏳
   - Interfaz mock añadida (lista + botones). CRUD todavía como mock; pendiente integrar productService o API para persistencia real.
7. Build admin dashboard - category CRUD UI (mock) — Parcial/Mock ⏳
   - Interfaz mock añadida (lista estático + botones). Persistencia pendiente.
8. Build admin dashboard - users and orders UI (mock) — Parcial/Mock ⏳
   - Vista de pedidos (admin) añadida y muestra pedidos mock. Gestión de usuarios no persistente en este momento.
9. Update README with frontend functionalities — Actualizado ✅
   - Esta sección (Funcionalidades) se ha añadido para reflejar el estado real. Se pueden añadir capturas de pantalla abajo.


## Capturas de pantalla (placeholders)
Se pueden añadir capturas en `docs/screenshots/` y referenciarlas aquí. De momento se listan placeholders que puedes reemplazar por imágenes reales:

- Home — docs/screenshots/home.png (placeholder)
- Catalog — docs/screenshots/catalog.png (placeholder)
- ProductDetail — docs/screenshots/product-detail.png (placeholder)
- Cart / Checkout — docs/screenshots/checkout.png (placeholder)
- Orders / OrderDetail — docs/screenshots/order-detail.png (placeholder)
- Admin — docs/screenshots/admin-products.png (placeholder)

Para añadir imágenes reales:
1. Crear la carpeta `docs/screenshots/` y guardar las capturas con los nombres indicados.
2. Reemplazar los placeholders por enlaces relativos en este README: `![Home](docs/screenshots/home.png)`.


## Qué sigue (plan inmediato)
1. Crear scripts SQL (`database/create_database.sql` y `database/data.sql`) y comitearlos.
2. Implementar backend: autenticación, modelos y endpoints.
3. Implementar integración Google Drive y API de códigos postales.
4. Implementar frontend siguiendo `design.md`.


---

(README inicial: se irá completando a medida que avance el proyecto. Mantener actualizado.)

> Generado y añadido al repo por: Copilot CLI runtime in VS Code (asistente AI). Soy un asistente AI usando Copilot CLI runtime en VS Code.
