Plan de sesión — Frontend preparado para Backend

Fecha: 2026-08-13T00:57:00-07:00

Contexto rápido:
- Objetivo: terminar el frontend del proyecto TenoMerca (React + Vite + Tailwind) usando datos mock y dejarlo preparado para integrar el backend luego.
- Requisitos del usuario: "solo lo mínimo que menciona el prompt"; frontend debe quedar preparado para que cuando exista backend todo funcione sin reescribir la UI.

Resumen de lo ya completado (por vista / commit por vista):
1. Home (mock) — Implementado
   - Página principal con destacados y navegación. Archivo: frontend/src/pages/Home.tsx
2. Catalog y ProductDetail (mock) — Implementado
   - Catalogo, ProductDetail con placeholders de imagen. Usa frontend/src/services/productService.ts
3. Cart y Checkout (mock) — Implementado
   - Carrito, Checkout con validaciones, CP lookup mock y creación de pedidos (orderService). Redirección a /orders/:id.
4. Login y Register (mock) — Implementado
   - Validaciones, accesibilidad básica. Archivos: frontend/src/pages/auth/Login.tsx, Register.tsx
5. Buyer dashboard — Implementado (mínimo)
   - Orders list y OrderDetail (recibo mínimo). Archivos: frontend/src/pages/Orders.tsx, OrderDetail.tsx
6. Admin — Product CRUD (mock) — Implementado
   - productService con create/update/delete (localStorage fallback). UI admin: frontend/src/pages/AdminProducts.tsx (create form, inline edit + modal, delete).
7. Admin — Category CRUD (mock) — Implementado
   - categoryService (localStorage fallback) y UI admin: frontend/src/pages/AdminCategories.tsx
8. Admin — Users & Orders (mock) — Implementado
   - userService (localStorage fallback) y UI admin: frontend/src/pages/AdminUsers.tsx
   - Admin orders UI: frontend/src/pages/AdminUsersOrders.tsx (status change, delete). orderService soporta update/delete.
9. README — Actualizada
   - Sección "Funcionalidades" añadida. Sección "API contract" añadida con rutas mínimas que el backend debe exponer. Archivo: README.md

Servicios y abstracciones:
- services/ (productService, orderService, categoryService, userService, addressService, form validators)
  - Todos los servicios soportan dos modos:
    1. Mock/local: si VITE_API_URL no está definida, usan localStorage (mismo comportamiento actual en dev)
    2. API: si VITE_API_URL está definida, hacen fetch a endpoints REST estándar (/api/...).
  - Esto permite que cuando el backend esté listo, solo sea necesario definir VITE_API_URL y el frontend usará el API sin cambios de UI.

Pruebas (tests):
- Vitest + jsdom (dev dependency instalado localmente).
- Tests implementados y pasando:
  - frontend/src/services/form.test.ts (validadores)
  - frontend/src/services/userService.test.ts
  - frontend/src/services/productService.test.ts
  - frontend/src/services/categoryService.test.ts
  - frontend/src/services/orderService.test.ts
- Resultado local: todos los tests pasan (20 tests en total al final).

Cambios adicionales de UX/Accesibilidad:
- Reemplacé prompts/alerts nativos por SimpleModal (frontend/src/components/ui/SimpleModal.tsx) y validaciones inline en admin views.
- Navbar ahora muestra submenu Admin cuando el user tiene role === 'admin'.

Estado actual: ¿Qué falta para "terminado" según el objetivo?
- Tareas obligatorias para considerar el frontend "listo para backend" (prioridad alta):
  1. Confirmar convención de autenticación (cookies httpOnly vs JWT). README sugiere ambas; definir una facilitará la integración del backend. (recomendado: cookies httpOnly en conjunto con CORS y SameSite/secure)
  2. Backend skeleton (endpoints) que cumpla el "API contract" del README. Endpoints mínimos:
     - Auth: POST /api/auth/login, POST /api/auth/register, GET /api/auth/me
     - Products: GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id
     - Categories: GET/POST/PUT/DELETE /api/categories
     - Users: GET/POST/PUT/DELETE /api/users (admin)
     - Orders: GET/POST/GET by id/PUT/DELETE /api/orders
     - Addresses: GET/POST/PUT/DELETE /api/addresses
  3. Asegurar que VITE_API_URL esté documentada y usada en deploys y .env (README ya lo menciona).

- Tareas recomendadas (no obligatorias, pero facilitan la integración):
  - Añadir apiClient central (fetch wrapper) con manejo de errors, inyección de token y uniformidad de headers.
  - Añadir tests para integración de services con mock server (supertest o msw) si se quiere cobertura más profunda.
  - Ajustes de UX: usar input type=number para precio, focus-trap y cerrar con ESC en SimpleModal.
  - Protección de rutas admin (client-side) para evitar que usuarios no-admin naveguen a /admin/* (ya hay checks en navbar, pero proteger rutas evita acceso directo por URL).

Plan recomendado para pasar al backend (pasos concretos)
1. (Opcional) Crear un pequeño "backend skeleton" en /backend que implemente los endpoints listados utilizando Express y una capa de persistencia mínima (Postgres o incluso in-memory/SQLite) para permitir pruebas locales.
2. Decidir y documentar el método de autenticación en el README (cookies httpOnly preferidas). Implementar endpoints de auth en backend skeleton.
3. Desplegar backend local y definir VITE_API_URL=http://localhost:4000 en frontend/.env.local. Verificar que las vistas consumen el API y que las funcionalidades mock pasan a ser reales.
4. Iterar sobre problemas: CORS, manejo de archivos (imágenes), formatos de fecha, errores 4xx/5xx y mensajes.

Archivos clave (referencia rápida)
- frontend/src/pages/* (Home, Catalog, ProductDetail, Cart, Checkout, Orders, OrderDetail, Admin*)
- frontend/src/services/* (productService, orderService, userService, categoryService, addressService, form.ts)
- frontend/src/components/ui/SimpleModal.tsx
- README.md (sección API contract actualizada)
- Tests: frontend/src/services/*.test.ts

Checkpoint / Entregables actuales
- Frontend completo (UI) en modo mock con servicios que soportan switch a backend definindo VITE_API_URL.
- Tests unitarios para services y validadores.
- Documentación del contrato API para que el backend implemente exactamente lo que el frontend espera.

Siguientes acciones que puedo ejecutar ahora (elige o confirmo la siguiente por defecto):
- Generar un backend skeleton Express con handlers mínimos que respeten el API contract (crea archivos en /backend). Tiempo estimado: 1–2 h para un skeleton básico.
- Implementar apiClient central en frontend para uniformizar llamadas y añadir manejo de tokens/errores. Tiempo estimado: 30–60 min.
- Proteger rutas admin en frontend (guard) y agregar tests de integración básicos. Tiempo estimado: 30–60 min.

---
Plan creado por: Copilot CLI runtime in VS Code (asistente AI)

Nota sobre el prompt de Copilot:

El "Prompt para GitHub Copilot (VS Code) — Marketplace México v2" se ha versionado y colocado como archivo en el repositorio para evitar duplicados temporales y para que sea fácil de mantener y revisar.

- Archivo con el prompt: [docs/copilot-prompt.md](C:/proyectos/examenMarketplace/examenMarketplace.worktrees/revision-sesion-plan-proyecto/docs/copilot-prompt.md)

Dónde y cómo usarlo:

- Pegar **todo** el contenido de `docs/copilot-prompt.md` directamente en el chat de GitHub Copilot dentro de VS Code cuando se inicie una sesión nueva destinada a desarrollar o continuar este proyecto.
- Ese prompt define el rol (desarrollador full-stack senior), el stack, las reglas de diseño (design.md), y la estrategia de commits; por tanto debe ser la "fuente de verdad" para que Copilot actúe coherentemente con las decisiones del proyecto.
- No mantener copias redundantes en la carpeta de session-state. La copia temporal que existía en session-state fue eliminada y ahora la versión controlada en `docs/copilot-prompt.md` es la referencia oficial.

Si necesita que el prompt se incluya en otro lugar (por ejemplo README o design.md) indique dónde y lo hago.
