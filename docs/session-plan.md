Plan de sesión — Estado actual del proyecto TenoMerca

Fecha de actualización: 2026-08-13T16:58:00-07:00

Regla operativa del proyecto:
- Todo cambio o implementación se hace directamente sobre main.
- No se crean ramas para tareas ni para cambios puntuales.
- Cada implementación o ajuste tiene su propio commit aislado y descriptivo.
- Este archivo es el punto de contexto para cualquier sesión nueva, incluso si se abre desde otra cuenta o desde otro entorno, sin necesidad de reconstruir el historial mental.

Contexto rápido:
- Objetivo principal: finalizar la versión funcional del marketplace TenoMerca, manteniendo frontend y backend alineados con el contrato API y con una estrategia de commits directa sobre main.
- Frontend: ya está desarrollado en modo mock con servicios preparados para API real.
- Backend: ya existe un skeleton Express funcional con endpoints mínimos y datos en memoria, y quedó commitado directamente en main.
- Requisito de trabajo: mantener cambios pequeños, revisables y commitados de forma individual.

Resumen de lo ya completado:
1. Frontend mock completo — Implementado
  - Home, catalogo, detalle de producto, carrito, checkout, login, register, dashboard de comprador, panel admin de productos, categorías, usuarios y pedidos.
  - Archivos principales: frontend/src/pages/* y frontend/src/services/*.
2. Servicios preparados para backend real — Implementado
  - productService, orderService, categoryService, userService, addressService.
  - Todos aceptan dos modos:
    1. Mock/local con localStorage cuando no hay VITE_API_URL.
    2. API real cuando VITE_API_URL está definido.
3. Contrato API documentado — Implementado
  - README actualizado con rutas mínimas del backend y estructura esperada.
4. Backend skeleton mínimo funcional — Implementado y commitado en main
  - Commit actual: 2bfb387 feat: add backend API skeleton
  - Endpoints incluidos: auth, products, categories, users, orders, addresses.
  - Datos semilla en memoria para pruebas locales.
5. Validación básica del backend — Implementado
  - Smoke tests con supertest para health, auth/login y listado de productos.

Estado actual del proyecto:
- Frontend mock listo para integración con backend.
- Backend skeleton listo y funcionando localmente en http://localhost:4000.
- Todo el trabajo se mantiene en main y cada incremento va en un commit separado.

Qué falta para cerrar la siguiente etapa:
1. Reforzar la autenticación por roles y middleware de acceso.
2. Conectar el frontend con el backend real mediante VITE_API_URL.
3. Validar CORS, errores 4xx/5xx, payloads y mensajes del API.
4. Mover la persistencia de memoria a PostgreSQL real.
5. Añadir protección de rutas admin y pruebas de integración si se requiere.

Plan de trabajo recomendado (por commits directos a main):
1. Commit backend skeleton (ya realizado): Express + endpoints base + seed data.
2. Commit siguiente: middlewares de autenticación y autorización por rol.
3. Commit siguiente: integración del frontend con VITE_API_URL y manejo inicial de errores en frontend.
4. Commit siguiente: migración de persistencia a PostgreSQL o DB real.
5. Commit siguiente: refinamiento de UX / validaciones / seguridad y soporte de entorno de producción.

Reglas de commits y ramas:
- Nunca crear ramas para tareas normales.
- Hacer commits directos sobre main.
- Cada cambio debe tener su propio commit, y cada commit debe responder a una pieza funcional claramente identificable.
- Si se realiza trabajo de investigación o corrección, también se commitea por bloque, no se acumula todo junto.

Contexto para otra sesión o otra cuenta:
- Si una sesión nueva se abre desde otra cuenta o desde otra máquina, este archivo debe leerse antes de seguir.
- La referencia de trabajo actual es: frontend mock completado + backend skeleton funcional + commits directos a main.
- La continuidad correcta es seguir con la autenticación por roles, luego frontend real con VITE_API_URL y luego persistencia real.

Archivos clave del proyecto:
- README.md
- design.md
- docs/copilot-prompt.md
- docs/session-plan.md
- frontend/src/pages/*
- frontend/src/services/*
- backend/src/app.js
- backend/src/server.js
- backend/src/data.js

Nota sobre el prompt de Copilot:
- El archivo docs/copilot-prompt.md es la referencia oficial para la sesión y define stack, reglas, arquitectura y estrategia de trabajo.
- Este session-plan.md sirve como resumen vivo del estado actual y de la secuencia de trabajo para continuar sin perder contexto.

---
Último estado registrado:
- Backend skeleton implementado y guardado en main.
- El siguiente bloque de trabajo está definido y listo para continuar sin ramas ni pérdida de contexto.
