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
6. Levantar frontend: npm run dev (documentado en frontend)


## Estado actual
- design.md creado y comiteado.
- .gitignore creado y comiteado.
- Estructura de carpetas inicial y placeholders para `frontend/`, `backend/`, `database/` creados.


## Qué sigue (plan inmediato)
1. Crear scripts SQL (`database/create_database.sql` y `database/data.sql`) y comitearlos.
2. Implementar backend: autenticación, modelos y endpoints.
3. Implementar integración Google Drive y API de códigos postales.
4. Implementar frontend siguiendo `design.md`.


---

(README inicial: se irá completando a medida que avance el proyecto. Mantener actualizado.)

> Generado y añadido al repo por: Copilot CLI runtime in VS Code (asistente AI). Soy un asistente AI usando Copilot CLI runtime en VS Code.
