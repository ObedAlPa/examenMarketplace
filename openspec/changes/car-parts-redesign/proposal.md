# Proposal: car-parts-redesign

## Intent

Redisear completamente la aplicación TenoMerca (marketplace genérico mexicano) para convertirla en una aplicación de venta de partes y accesorios para automóviles ("AutoPartes"). La aplicación actual no tiene un tema definido consistente, por lo que este cambio permite establecer una identidad de marca coherente enfocada en el mercado de autopuestos.

El cambio afecta:
- Identidad visual y branding (nombre, colores, tipografía)
- Categorías y productos (de electrónica/hogar/ropa a autopartes)
- Texto y copy en todo el frontend
- Documentación y README
- Datos seed y migraciones de base de datos

## Scope

### In Scope
- Renombrar la marca de "TenoMerca" a "AutoPartes" (o nombre definido)
- Nueva paleta de colores acorde al rubro automotriz (evitar amarillo/blue de Mercado Libre)
- Rediseñar categorías: Llantas, Frenos, Motor, Electrónica, Suspensión, Accesorios, Mantenimiento
- Reemplazar productos seed: de 6 productos diversos a 6+ productos de autopartes
- Actualizar copy en todas las páginas frontend (Home, Catálogo, Producto, Carrito, Checkout, Admin)
- Actualizar README, design.md y scripts de setup/seed
- Mantener funcionalidades existentes: auth JWT, carrito, pedidos, CP búsqueda, Drive upload (fallback)

### Out of Scope
- Cambiar la arquitectura completa (API REST, Express + Vite, persistencia PostgreSQL)
- Migrar a otro framework o lenguaje
- Quitar features existentes (solo renombrar/reequipar)
- Cambiar la lógica de negocio de pedidos o checkout

## Capabilities

### New Capabilities
- `product-catalog-car-parts`: Catálogo de productos con categorías automotrices, filtros por categoría y búsqueda de título/descripción
- `admin-car-parts-CRUD`: Panel admin con CRUD completo de categorías, productos, usuarios y órdenes
- `postal-code-lookup`: Mantener búsqueda de código postal vía Postali/SEPOMEX (sin cambios)
- `google-drive-upload`: Mantener subida a Google Drive con fallback placeholder (sin cambios)

### Modified Capabilities
- `branding-and-identity`: Cambio completo de nombre, slogan, paleta de colores y tipografía
- `product-data-seed`: Reemplazo total de categories y products en seed data
- `frontend-copy`: Actualización de todos los strings/texto en páginas y componentes

## Approach

1. **Branding**: Definir nuevo nombre (ej. "AutoPartes"), slogan, paleta de colores (tonos grises, azules automotrices, rojo para errores/alerts), tipografía mantener Poppins/Merriweather
2. **Diseño (design.md)**: Nueva paleta — primario azul marino/acero, secundario naranja/ámbar para acentos, fondos grises claros, contraste WCAG AA/AAA
3. **Categorías**: Mapear categorías automotrices al sistema de 5-6 categorías principales con subcategorías
4. **Productos seed**: Reemplazar los 6 productos actuales por 6 productos de autopartes con datos realistas
5. **Frontend**: Actualizar copy en todas las páginas; los componentes UI pueden reutilizarse con nuevas props/clases
6. **Backend**: Solo cambiar data.js (categories/products); API routes idénticas
7. **Documentation**: Actualizar README con nuevo nombre y features

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `design.md` | Complete redesign | Nueva paleta de colores, tipografía, reglas de componentes |
| `backend/src/data.js` | Modified | Reemplazar categories y products seed con datos de autopartes |
| `backend/.env.example` | Minor | Actualizar descripciones si es necesario |
| `frontend/src/pages/` | Modified | Actualizar texto/headlines en: Home, Catalog, ProductDetail, Cart, Checkout, OrderDetail, Admin pages |
| `frontend/src/components/` | Minor | Verificar clases Tailwind coinciden con nueva paleta |
| `README.md` | Modified | Actualizar descripción, credenciales, features |
| `scripts/seed.js` | Modified | Reemplazar datos de seed |
| `scripts/migrate.js` | None | Sin cambios (estructura DB igual) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breakage en páginas por cambios de clase Tailwind | Medium | Probar cada página después de cambios de diseño; mantener compatencia hacia atrás en clases críticas |
| Pérdida de datos seed existentes | Low | Hacer backup del seed actual antes de reemplazar; el nuevo seed tiene formato idéntico |
| Conflicto con colores originales del proyecto académico | Medium | Definir nueva paleta que aún respete los tokens de Tailwind y WCAG; el profesor puede aprobar o sugerir ajustes |
| Copy restante en español con referencias a "mercado" | Alto | Revisar exhaustivamente todas las páginas/frontend; crear script de búsqueda "TenoMerca|marketplace|catálogo" |

## Rollback Plan

1. `git reset --hard HEAD~1` para deshacer el último commit
2. O restaurar `design.md`, `data.js`, `README.md` desde git
3. Re-ejecutar `npm run seed` si la base de datos se corrompe
4. El repo mantiene el historial, así que cualquier archivo se puede revertir

## Success Criteria

- [ ] `design.md` tiene nueva paleta de 7+ colores y reglas de componentes actualizadas
- [ ] `backend/src/data.js` tiene 5-6 categorías automotrices y 6+ productos de autopartes
- [ ] Todas las páginas frontend tienen copy en español coherente con "venta de partes para carro"
- [ ] `npm run setup` y `npm run seed` completan sin errores
- [ ] Los 3 tests básicos (`npm test` en backend) siguen pasando
- [ ] El health check `/api/health` responde correctamente
- [ ] El login/admin funcional mantiene credenciales `admin@tenomerca.test` / `AdminPass123!`

## Dependencies

- Ninguna externa. Cambio interno al proyecto.
- Requiere revisión del diseño en `design.md` y actualización de datos en `data.js`.

## Proposal question round

1. ¿Qué nombre propone para la nueva marca? "AutoPartes" es sugerente, pero el usuario puede tener otro preferente.
2. ¿Qué paleta de colores principales desea para rubro automotriz? (sugerencia: azules/navegados, grises, rojo alerta)
3. ¿Cuántas categorías principales de autopartes quiere? (sugerencia: 6: Llantas, Frenos, Motor, Electrónica, Suspensión, Mantenimiento)
4. ¿Los productos seed deben ser específicos de marcas/modelos o genéricos (frenos, baterías, llantas)?
5. ¿Se mantiene el mismo sistema de roles admin/comprador o hay cambios?

*Estas preguntas están abiertas para que el usuario las responda antes de pasar a la fase de specs/diseño.*