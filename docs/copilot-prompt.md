# Prompt para GitHub Copilot (VS Code) — Marketplace México v2

> Copia y pega todo el bloque de abajo (desde "Actúa como..." hasta el final) directamente en el chat de Copilot en VS Code.

---

Actúa como un desarrollador full-stack senior. Vamos a construir, dentro de este mismo repositorio/carpeta de trabajo, una plataforma web tipo marketplace enfocada exclusivamente en operaciones dentro de México (similar en concepto a Mercado Libre, pero con identidad visual, nombre y experiencia totalmente propios — ver sección de identidad de marca más abajo, es un requisito estricto que NO se parezca a Mercado Libre).

## Stack a utilizar (definido para este proyecto)

- **Frontend:** React (con Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL (obligatorio)
- **Almacenamiento de imágenes:** Google Drive (cuenta institucional, ver detalles abajo)
- **Control de versiones:** Git/GitHub (commits incrementales durante el desarrollo)
- **Despliegue:** local

**Por qué este stack:** todo el flujo queda en JavaScript/TypeScript de punta a punta (frontend y backend), lo que agiliza el desarrollo asistido por IA y reduce fricción de contexto entre capas. React+Vite da un entorno de desarrollo rápido y un ecosistema de componentes maduro; Tailwind permite implementar de forma disciplinada un sistema de diseño consistente (ver `design.md`) sin pelear con CSS suelto. Express es minimalista y directo para construir la API REST y el CRUD. La librería oficial `googleapis` de Node tiene soporte de primera clase para Google Drive API, y la conexión a PostgreSQL vía `pg` o un ORM como Prisma es igualmente sencilla en este stack. En conjunto son tecnologías con enorme cantidad de documentación, ideales para que puedas explicar cada decisión técnica con soltura.

---

## 0. Identidad de marca — requisito estricto de diferenciación

Antes de escribir cualquier código de interfaz, debes **crear una identidad visual 100% original**, claramente distinta a Mercado Libre (evita su paleta amarillo/azul, evita su tipo de isotipo de "manita", evita layouts calcados de su home).

Debes definir y documentar:

1. **Nombre de la plataforma** (original, relacionado con México pero no genérico tipo "MexiMarket"; propone 2-3 opciones y elige una).
2. **Logotipo / identidad visual**: describe el concepto del logo (forma, símbolo, estilo — puede ser tipográfico o con ícono simple en SVG) y genera un logo simple en SVG/texto para usar en el proyecto (no hace falta arte complejo, pero debe ser coherente con el nombre y la paleta).
3. **Colorimetría propia**: define una paleta completa (color primario, secundario, acento, fondos, texto, estados de éxito/error/advertencia) con sus códigos HEX, claramente diferente al amarillo/azul de Mercado Libre.
4. **Tipografía**: fuente principal y secundaria (usa fuentes de Google Fonts disponibles).
5. **Tono visual general**: moderno, minimalista, cálido, etc. — decide un estilo y mantente consistente.

### Archivo obligatorio: `design.md`

Genera, como primer entregable del proyecto (antes de construir componentes de UI), un archivo `design.md` en la raíz del proyecto que documente formalmente:

- Nombre y slogan de la plataforma.
- Logotipo (descripción + código SVG o referencia al archivo del logo).
- Paleta de colores completa con HEX y su uso (primario, secundario, acento, fondo, texto, bordes, estados).
- Tipografía (familias, pesos, tamaños base para h1-h6, párrafo, botones).
- Espaciados y sistema de grid/breakpoints que se usarán.
- Estilo de componentes base: botones (estados hover/active/disabled), inputs, cards de producto, badges de estado de pedido, navbar, footer.
- Reglas de uso: qué SÍ y qué NO hacer para mantener consistencia.

**Regla obligatoria de todo el proyecto:** a partir de este punto, **todo componente de frontend que generes debe basarse únicamente en lo definido en `design.md`** (mismos colores, tipografía, espaciados y estilos de componente). No introduzcas colores, fuentes o estilos nuevos que no estén documentados ahí. Si en algún momento necesitas un nuevo color o componente que no está en `design.md`, primero actualiza `design.md` y luego impleméntalo, para que el archivo siga siendo la fuente única de verdad del diseño y el proyecto se mantenga visualmente coherente de principio a fin (home, catálogo, detalle de producto, carrito, checkout, panel de administrador, login/registro, etc.).

---

## Contexto de negocio

Plataforma para que vendedores publiquen productos y compradores consulten el catálogo, busquen, filtren, vean el detalle, agreguen al carrito y generen una solicitud de compra/pedido. El pago es simulado, no se requiere pasarela real. Todo enfocado a México: moneda MXN, direcciones mexicanas, estados de la República, código postal mexicano.

---

## 1. Página principal (mínimo obligatorio)

- Nombre de la plataforma y logotipo (definidos en `design.md`).
- Menú de navegación.
- Buscador de productos.
- Listado/menú de categorías.
- Sección de productos destacados.
- Información general de la plataforma (footer o sección "quiénes somos").
- Accesos de login/registro.

## 2. Módulo de usuarios

### Comprador

- Registro e inicio de sesión.
- Consultar, buscar y filtrar productos.
- Consultar detalle de producto.
- Agregar productos al carrito, modificar cantidades, eliminar productos del carrito.
- Generar una solicitud de compra/pedido (checkout simulado).
- Consultar el historial/estado de sus pedidos.

### Administrador

- Inicio de sesión con rol de administrador.
- CRUD completo de productos (crear, modificar, eliminar/desactivar).
- Administración de categorías (CRUD).
- Consultar usuarios registrados.
- Consultar pedidos y cambiar su estado (Pendiente, Confirmado, Preparando, Enviado, Entregado, Cancelado).

Implementa control de acceso por rol (comprador vs administrador) protegiendo tanto las rutas del frontend como los endpoints del backend.

## 3. Módulo de productos

Cada producto debe tener como mínimo: identificador, nombre, descripción, precio (MXN), categoría, existencia/stock, imagen (referencia a Google Drive), estado (activo/inactivo) y fecha de registro.

Operaciones requeridas: crear, consultar, modificar, desactivar/eliminar (soft delete recomendado usando el campo estado).

## 4. Categorías

Catálogo de categorías (ej. Electrónica, Computación, Telefonía, Hogar, Ropa, Deportes, Videojuegos, Automóviles, Libros, Otros), administrable por el administrador. Puedes ajustar o ampliar esta lista.

## 5. Búsqueda y filtrado

- Campo de búsqueda por nombre/texto libre.
- Filtros combinables por: categoría, precio mínimo, precio máximo, disponibilidad.

## 6. Detalle del producto

Debe mostrar: imagen, nombre, descripción, precio, existencia, categoría, información básica del vendedor, y botón para agregar al carrito.

## 7. Carrito de compras

Agregar productos, modificar cantidades, eliminar productos, calcular subtotal por producto, calcular total general, y confirmar el pedido.

## 8. Pedidos y pago simulado

Al confirmar el carrito se debe generar un pedido con como mínimo: número de pedido, usuario, fecha, productos, cantidades, total y estado. Estados sugeridos: Pendiente, Confirmado, Preparando, Enviado, Entregado, Cancelado.

**El pago es representativo/simulado, no hay pasarela ni procesamiento real de dinero.** Aun así, el flujo de checkout debe simular de forma creíble que el pago se realizó: al confirmar el pedido, deja que el usuario "seleccione" un método de pago simbólico (ej. Tarjeta simulada, Transferencia simulada, Efectivo/OXXO simulado) y muestra un estado de pago (Pendiente/Pagado simulado) independiente del estado logístico del pedido. No implementes ni solicites datos reales de tarjeta, CVV o información bancaria bajo ninguna circunstancia — todo el paso de "pago" es una simulación visual y de flujo, no una transacción real.

## 9. Direcciones (México)

Capturar direcciones con al menos: nombre del destinatario, calle, número, colonia, código postal, municipio, estado, país (fijo "México").

### ⚠️ Requisito específico — Código Postal con API automática

El campo de **código postal** debe estar conectado a una API pública de códigos postales de México (investiga y elige la más estable/gratuita disponible actualmente, tipo SEPOMEX o equivalente). Al capturar el código postal, el sistema debe:

1. Consultar la API automáticamente (con debounce).
2. Autocompletar estado, municipio/delegación y colonia(s) disponibles (select si hay varias colonias).
3. Dejar que el usuario solo escriba manualmente calle, número y nombre.
4. Manejar errores si el CP no existe o la API no responde.
5. Documentar en comentarios qué API se usa y cómo se maneja el API key (variables de entorno, nunca hardcodeada).

## 10. Seguridad mínima

- Contraseñas con hash (bcrypt), nunca en texto plano.
- Validación de datos en frontend Y backend.
- Control de acceso según tipo de usuario.
- Protección de operaciones administrativas.
- Consultas parametrizadas/preparadas (prevención de SQL Injection).

## 11. Integración con Google Drive — cuenta ya establecida

La cuenta institucional que se usará para todo el almacenamiento de imágenes de productos es:

```
al05-050-0322@utdelacosta.edu.mx
```

Configura el proyecto para que esta cuenta quede establecida desde el inicio:

- Crea en el backend un módulo de integración con Google Drive API (usa la librería oficial `googleapis` de Node.js).
- Usa el flujo de **cuenta de servicio (Service Account)** o **OAuth2** (elige el que mejor se adapte, documenta la decisión) autorizado sobre esta cuenta institucional para subir/leer archivos.
- Todas las credenciales (client_id, client_secret, refresh_token o archivo de credenciales de la cuenta de servicio) deben ir en variables de entorno (`.env`), nunca hardcodeadas ni subidas al repositorio. Agrega `.env` y cualquier archivo de credenciales al `.gitignore`.
- Deja documentado en el `README.md` el proceso paso a paso para vincular la cuenta `al05-050-0322@utdelacosta.edu.mx` (habilitar Google Drive API en Google Cloud Console, generar credenciales, compartir la carpeta raíz del proyecto con esa cuenta, etc.).
- Estructura de carpetas dentro de esa cuenta de Drive:

```
Google Drive (al05-050-0322@utdelacosta.edu.mx)└── Marketplace-Mexico    ├── electronica/    ├── hogar/    └── ropa/
```
- En PostgreSQL solo se guarda la referencia necesaria para localizar la imagen (ID de archivo de Drive o URL embebible), nunca el binario de la imagen.
- Al mostrar el producto, la aplicación debe reconstruir/renderizar la imagen a partir de esa referencia guardada.

## 12. Base de datos PostgreSQL — IMPORTANTE

Analiza TODO lo que este sistema necesita (usuarios, roles, categorías, productos, imágenes/referencias, carrito, detalle de carrito, pedidos, detalle de pedido, direcciones, y cualquier otra entidad que consideres necesaria para que el sistema funcione correctamente de forma robusta). 

Como referencia orientativa (no obligatoria ni definitiva): `usuarios, roles, categorias, productos, imagenes, carrito, detalle_carrito, pedidos, detalle_pedido, direcciones`.

**No te limites a copiar esa lista.** Analiza el sistema completo descrito en este prompt y:

- Agrega las tablas, columnas o catálogos adicionales que consideres necesarios.
- Elimina o fusiona cualquier tabla de la lista de referencia que consideres redundante o innecesaria para este alcance.
- Justifica brevemente en comentarios SQL las decisiones de diseño relevantes.

Requisitos mínimos de diseño de la base de datos:

- Relaciones correctamente definidas entre tablas.
- Claves primarias y claves foráneas.
- Restricciones (NOT NULL, UNIQUE, CHECK donde aplique).
- Tipos de datos adecuados (usa NUMERIC para precios, no FLOAT).
- Integridad referencial (ON DELETE/ON UPDATE apropiados).
- Valores predeterminados donde sea necesario.
- Índices donde estén justificados.

Entrega dos archivos SQL:

1. `database/create_database.sql` — estructura completa (DDL).
2. `database/data.sql` — datos de prueba (usuarios de ejemplo con contraseñas ya hasheadas, categorías, algunos productos, etc.).

## 13. Estructura de proyecto sugerida

```
marketplace-mexico/
├── design.md
├── frontend/
├── backend/
├── database/
│   ├── create_database.sql
│   └── data.sql
├── docs/
├── README.md
├── .gitignore
```

## 14. README.md — obligatorio y debe permitir ejecutar el proyecto sin ayuda externa

Genera un `README.md` completo y claro, pensado para que tanto yo como mi profesor podamos clonar el repositorio y levantar el sistema completo sin depender de explicaciones externas. Debe incluir, al inicio, una breve ficha de identificación académica:

- Alumno: Obed Alcantar Pacheco.
- Profesor: MIA. César Geovanni Machuca Pereida.
- Materia: Desarrollo web integral.
- Unidad temática: Unidad 3 — Integración de componentes de software para aplicaciones Web.

Y después, el contenido exigido por el documento del examen, como mínimo:

- Nombre del proyecto y descripción breve (tomados de `design.md`).
- Objetivo del proyecto.
- Tecnologías utilizadas (versión de Node, React, PostgreSQL, etc.).
- Requisitos previos (software que debe estar instalado, versiones mínimas).
- Instrucciones de instalación paso a paso (clonar, instalar dependencias de frontend y backend por separado).
- Configuración de variables de entorno: lista exacta de todas las variables que debe contener el `.env` de frontend y backend (con nombre de la variable y una descripción de qué va ahí, sin exponer valores reales/secretos).
- Configuración de PostgreSQL: cómo crear la base de datos y ejecutar `create_database.sql` y `data.sql`.
- Configuración de Google Drive: pasos para vincular la cuenta `al05-050-0322@utdelacosta.edu.mx` (habilitar la API en Google Cloud Console, generar credenciales, compartir la carpeta `Marketplace-Mexico`, dónde colocar el archivo de credenciales o las variables correspondientes).
- Cómo levantar el backend y el frontend en local (comandos exactos, puertos por defecto).
- Usuarios de prueba (correo/usuario y contraseña de un comprador y un administrador ya cargados en `data.sql`).
- Resumen de funcionalidades implementadas.
- Espacio reservado para capturas de pantalla (con indicación de dónde se colocarán, aunque las agregues tú después).
- URL de implementación local (ej. `http://localhost:xxxx`).

El README debe mantenerse actualizado a medida que el proyecto avanza, no solo generarse una vez al final (ver los commits específicos de actualización del README en la sección 16). Al terminar el proyecto, el README debe quedar como un documento único, completo y probado, con exactamente todo lo necesario (requisitos, instalación, variables de entorno, configuración de PostgreSQL, configuración de Google Drive, comandos de arranque) para que cualquier persona pueda ejecutar el sistema completo desde cero sin depender de esta conversación ni de explicaciones adicionales.

## 15. .gitignore — obligatorio y completo desde el primer commit

Desde el primer commit del proyecto, genera un `.gitignore` en la raíz que excluya explícitamente todo lo que nunca debe subirse al repositorio ni incluirse en un Pull Request, incluyendo (pero sin limitarse a) lo siguiente según el stack definido:

- Variables de entorno: `.env`, `.env.local`, `.env.*.local`, y cualquier variante por ambiente.
- Credenciales y llaves: archivos de credenciales de Google (ej. `*.json` de service account, `credentials.json`, `token.json`), llaves privadas, certificados.
- Dependencias instalables: `node_modules/` (frontend y backend).
- Builds y artefactos generados: `dist/`, `build/`, `.vite/`, `.cache/`.
- Logs: `*.log`, `npm-debug.log*`, `logs/`.
- Archivos de sistema operativo/editor: `.DS_Store`, `Thumbs.db`, `.vscode/` (excepto configuraciones que sí quieras compartir, evalúalo), `.idea/`.
- Archivos temporales de pruebas o cobertura: `coverage/`, `*.tmp`.
- Cualquier volcado o backup de base de datos que no sea el `data.sql`/`create_database.sql` oficiales (ej. `*.dump`, `*.bak`).

Verifica antes de cada commit importante que ningún archivo con credenciales reales, `.env` con valores reales, o `node_modules` haya quedado rastreado por Git accidentalmente.

## 16. Estrategia de commits — obligatorio un commit por apartado, NUNCA todo en uno solo

El profesor revisará el historial de Git como evidencia del proceso de desarrollo, por lo que **no se aceptará un repositorio con un solo commit o con todo el proyecto subido de una sola vez**. Debes trabajar y confirmar (`git commit`) cada apartado del sistema de forma separada, en el momento en que ese apartado quede terminado, siguiendo aproximadamente esta secuencia (ajústala si el orden real de desarrollo cambia, pero mantén la separación por apartado):

1. `Initial project setup` — estructura de carpetas, configuración inicial, `.gitignore`, `README.md` base (secciones vacías o con placeholders de lo que irá llenándose después).
2. `Add design.md with brand identity` — identidad de marca, colorimetría, tipografía.
3. `Create database structure` — `create_database.sql`.
4. `Add database seed data` — `data.sql`.

**Frontend (con datos mock, un commit por vista):**

1. `Build frontend home page` (mock).
2. `Build product catalog and detail pages` (mock, imágenes placeholder).
3. `Build cart and checkout UI` (mock).
4. `Build login and registration UI` (mock).
5. `Build buyer dashboard UI` (mock) — historial y estado de pedidos del comprador.
6. `Build admin dashboard - product CRUD UI` (mock).
7. `Build admin dashboard - category CRUD UI` (mock).
8. `Build admin dashboard - users and orders UI` (mock).
9. `Update README with frontend functionalities` — actualiza en el README las secciones de "Funcionalidades" y "Capturas de pantalla" con lo ya construido en el frontend hasta este punto.

**Backend (en el mismo orden que las vistas del frontend, un commit por endpoint/módulo correspondiente a cada una):**

1. `Create home endpoints` — endpoints públicos para productos destacados y listado de categorías (corresponde a la vista del commit 5).
2. `Create product catalog endpoints` — listado, búsqueda, filtros combinables y detalle de producto (corresponde a la vista del commit 6).
3. `Create cart and checkout endpoints` — agregar/modificar/eliminar del carrito, cálculo de totales y creación de pedido con pago simulado (corresponde a la vista del commit 7).
4. `Create authentication endpoints` — registro, login, hash de contraseñas, JWT/sesiones (corresponde a la vista del commit 8).
5. `Create user roles and access control middleware` — protección de rutas por rol comprador/administrador, necesario antes de exponer los endpoints protegidos que siguen.
6. `Create buyer order history endpoints` — historial y consulta de estado de pedidos del comprador (corresponde a la vista del commit 9).
7. `Create admin product CRUD endpoints` (corresponde a la vista del commit 10).
8. `Create admin category CRUD endpoints` (corresponde a la vista del commit 11).
9. `Create admin users and orders management endpoints` — listado de usuarios, consulta y cambio de estado de pedidos (corresponde a la vista del commit 12).
10. `Integrate postal code API for addresses` — usado por el formulario de dirección dentro del checkout.
11. `Update README with backend setup and environment variables` — actualiza en el README las secciones de requisitos, instalación, configuración y variables de entorno con lo ya construido en el backend hasta este punto.

**Integración final y cierre:**

1. `Connect frontend to backend` — reemplazo de datos mock por llamadas reales a la API en todas las pantallas.
2. `Integrate Google Drive for product images` — subida real de imágenes, almacenamiento de la referencia en PostgreSQL y reemplazo de los placeholders por las imágenes reales en el frontend.
3. `Add frontend and backend validations`.
4. `Security improvements` (parametrización de consultas, protección de rutas, revisión de hashing).
5. `Update README with PostgreSQL and Google Drive setup steps` — completa en el README los pasos de configuración de PostgreSQL y de vinculación de la cuenta de Google Drive.
6. `Final README review and local deployment test` — revisa y corrige el README de principio a fin, y realiza una prueba real siguiéndolo paso a paso desde cero (clonar en una carpeta limpia y levantar el sistema únicamente con las instrucciones del README) para confirmar que cualquier persona (yo o el profesor) pueda ejecutar el sistema completo sin errores ni pasos faltantes.

Reglas para cada commit:

- Cada commit debe corresponder a un avance real y funcional de un apartado específico (no mezclar, por ejemplo, backend de productos con frontend de carrito en el mismo commit).
- El mensaje de commit debe ser claro y describir exactamente qué se implementó en ese apartado.
- Si mientras desarrollas un apartado necesitas volver a tocar código de un commit anterior (ej. un fix), haz un commit adicional específico para ese ajuste (ej. `Fix product validation bug`), no lo mezcles con el commit del apartado nuevo.
- Ve avisándome en el chat cuándo un apartado está listo para hacer commit, y sugiéreme el mensaje exacto a usar, para que yo mismo ejecute `git add` y `git commit` en cada punto (o hazlo tú si tienes acceso a terminal integrada, pero siempre respetando esta separación).

---

## Cómo quiero que trabajes

1. Primero, crea `design.md` con toda la identidad de marca (nombre, logo, colorimetría, tipografía, componentes base). Muéstramelo antes de seguir.
2. Después, dame un resumen breve de la arquitectura: tablas finales de la BD con su justificación, endpoints principales del backend, y estructura de carpetas del frontend.
3. Luego, genera el proyecto por partes respetando este orden macro: **primero toda la base de datos, despues todo el frontend, despues todo el backend (endpoint por endpoint, en el mismo orden en que se construyeron las vistas del frontend que los consumen), y al final la integración de imágenes con Google Drive.** Específicamente: (1) base de datos completa (estructura + seeds), (2) frontend completo siguiendo estrictamente `design.md` — construido inicialmente con datos simulados/mock mientras no exista backend, ya que aún no habrá API real que consumir —, (3) backend completo (autenticación, CRUDs, endpoints, integración de la API de código postal), (4) conexión real del frontend con el backend ya terminado (reemplazando los datos simulados por las llamadas reales a la API, usando imágenes de marcador/placeholder mientras tanto), (5) carrito y pedidos con pago simulado ya conectados de extremo a extremo, (6) integración final de Google Drive con la cuenta `al05-050-0322@utdelacosta.edu.mx` (subida, almacenamiento de referencia y visualización real de imágenes, reemplazando los placeholders), (7) ajustes de seguridad y validaciones finales.

**Importante sobre el frontend (paso 2):** "frontend completo" NO significa generarlo de una sola vez. Cada vista, pantalla, CRUD o dashboard del frontend debe desarrollarse y confirmarse como una unidad separada, con su propio commit (ej. home, catálogo de productos, detalle de producto, carrito, checkout, login, registro, dashboard/panel de comprador con su historial de pedidos, dashboard/panel de administrador con sus propios CRUDs de productos/categorías/usuarios/pedidos). No avances a la siguient... (truncated for brevity)

---

*Nota: el bloque original del prompt es muy extenso — este archivo contiene la versión completa del "Prompt para GitHub Copilot (VS Code) — Marketplace México v2". Pegar aquí permite que el prompt sea versionado y referenciado desde el repo.*
