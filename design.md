# Diseño e identidad marca — AutoPartes v2

Este documento define la identidad visual, paleta de colores, tipografía y reglas de uso que regirán TODO el frontend del proyecto AutoPartes. Todos los componentes deberán atenerse estrictamente a lo aquí definido. Si se requiere un nuevo color o componente, primero actualizar este archivo y luego implementarlo.

---

## 1. Nombre y slogan

Opciones propuestas:

1. AutoPartes — "Tu auto, tus piezas"
2. CarParts MX — "Piezas para tu vehículo"
3. AutoHub — "El mercado de autopartes"

Elección: AutoPartes

Slogan: "Tu auto, tus piezas"

Breve justificación: "AutoPartes" es directo y describe el rubro sin ambigüedades. Evita la confusión con mercados generales y posiciona el producto inmediatamente. "MX" sugiere enfoque México sin ser tan específico como TenoMerca.

---

## 2. Logotipo / identidad visual

Concepto: logotipo tipográfico con un símbolo simple inspirado en un aro de rueda estilizado o un fragmento de pieza mecánica que sugiere precisión y variedad de productos. El símbolo es geométrico y sencillo para funcionar bien en SVG y como favicon. Estilo: moderno, técnico y confiable.

SVG del logotipo (versión horizontal: símbolo + nombre):

```svg
<!-- Logo AutoPartes - horizontal -->
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="60" viewBox="0 0 360 60" role="img" aria-label="AutoPartes">
  <title>AutoPartes</title>
  <!-- símbolo: aro de rueda estilizado -->
  <g transform="translate(10,6)">
    <path d="M12 0 C18 6 24 18 24 24 C24 30 18 42 12 48 C6 54 6 6 12 6 Z" fill="#2B3A58" />
    <path d="M24 0 C30 6 36 18 36 24 C36 30 30 42 24 48 C18 54 12 6 24 6 Z" fill="#2B3A58" opacity="0.18" />
  </g>
  <!-- logotype text -->
  <text x="80" y="36" font-family="Poppins, Inter, sans-serif" font-weight="600" font-size="28" fill="#222222">AutoPartes</text>
  <text x="80" y="50" font-family="Merriweather, serif" font-weight="400" font-size="10" fill="#6B6B6B">Tu auto, tus piezas</text>
</svg>
```

Notas de uso del logo:
- Usar la versión en color sobre fondos claros. Para fondo oscuro usar versión invertida (símbolo blanco y texto blanco/ácido según contraste).
- Espacio mínimo alrededor del logo: 16px.
- No distorsionar, rotar ni alterar proporciones.

---

## 3. Paleta de colores (acorde al rubro automotriz)

- Primario: Azul acero — HEX: #2B3A58 (uso: botones primarios, enlaces destacados, íconos activos)
- Secundario: Naranja advertencia — HEX: #E67E22 (uso: acentos, badges secundarios, highlights, precios en oferta)
- Fondo principal: Gris muy claro — HEX: #F7F7F8 (uso: fondo general de páginas)
- Superficie (cards, paneles): Blanco puro — HEX: #FFFFFF
- Texto principal (dark): Carbón — HEX: #222222
- Texto secundario: Gris oscuro — HEX: #4B4B4B
- Bordes / divider: Gris suave — HEX: #E6E6E9
- Éxito: Verde oscuro — HEX: #1E8449
- Error: Rojo oscuro — HEX: #C0392B
- Advertencia: Naranja — HEX: #E67E22 (mismo que secundario, usado para precaución)
- Enlace / accent alternative: Azul más claro — HEX: #2C3E50

Uso recomendado:
- Botón primario: fondo primario (#2B3A58) con texto blanco.
- Botón secundario/outline: fondo blanco, borde #2B3A58, texto #2B3A5C.
- Estado success/error/alert: usar los colores dedicados para mensajes y badges.

Contraste: diseñar siempre con contraste AA/AAA mínimo para texto según WCAG. Evitar usar tonos muy claros para texto sobre fondos claros.

---

## 4. Tipografía

Fuentes (Google Fonts):
- Principal (UI): Poppins (weights: 400, 600, 700)
- Secundaria (display / lectura larga): Merriweather (weights: 300, 400, 700)

Stack CSS: font-family: "Poppins", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

Escala tipográfica recomendada:
- h1: 32px / 40px line-height / weight 700
- h2: 24px / 32px / weight 600
- h3: 20px / 28px / weight 600
- h4: 16px / 24px / weight 600
- h5: 14px / 20px / weight 600
- p / body: 14px / 20px / weight 400
- botones (texto): 14px / 18px / weight 600

Nota: Usar Poppins para todos los elementos de UI (nav, botones, labels). Merriweather solo para textos largos o títulos especiales si se necesita un contraste tipográfico.

---

## 5. Sistema de espaciado y breakpoints

Espaciado base (modular):
- 4px = xxs
- 8px = xs
- 12px = sm
- 16px = md (base)
- 24px = lg
- 32px = xl
- 48px = xxl

Grid y breakpoints (mobile-first):
- Mobile: 0 - 639px (1 columna principal)
- Tablet: 640px - 1023px (2 columnas / responsive grid)
- Desktop: 1024px - 1439px (3 columnas en catálogo)
- Wide: 1440px+ (4 columnas en catálogo)

Sistema de contenedor:
- Max-width content: 1200px (centro) con padding horizontal 16px en móviles, 24px en tablet, 32px en desktop.

---

## 6. Estilos de componentes base

Regla: usar clases utilitarias de Tailwind con tokens que mapearán a los colores/espaciados de este archivo.

Botones (primary / secondary / ghost):

Primary:
- Background: #2B3A58
- Text: #FFFFFF
- Border-radius: 8px
- Padding: 10px 16px
- Hover: darken 8% (aprox #22324D)
- Active: translateY(1px) + shadow inset
- Disabled: bg #E6E6E9, text #A0A0A0, cursor not-allowed

Secondary (outline):
- Background: #FFFFFF
- Border: 1px solid #2B3A58
- Text: #2B3A58
- Hover: background #F0F2F5

Ghost (text only):
- Background: transparent
- Text: #E67E22

Inputs / Selects / Textarea:
- Background: #FFFFFF
- Border: 1px solid #E6E6E9
- Border-radius: 8px
- Padding: 10x
- Placeholder: #BDBDBD
- Focus: outline none; box-shadow: 0 0 0 3px rgba(43,58,88,0.12) (usar color secundario con baja opacidad)
- Error state: border-color #C0392B; box-shadow rgba(192,57,43,0.12)

Cards de producto:
- Background: #FFFFFF
- Border-radius: 12px
- Border: 1px solid #E6E6E9
- Padding interno: 16px
- Imagen: ratio 4:3 (object-fit: cover), border-radius: 8px
- Shadow ligero: 0 4px 10px rgba(16,16,16,0.04)
- Nombre: h4 (16px, 600)
- Precio: 16px, 700, color #E67E22
- Badge de stock: si stock > 0 badge verde (#1E8449) con texto blanco; si stock == 0 badge gris/rojo según status

Badges de estado de orden:
- Pendiente: background #E67E22, text #222
- Confirmado: background #2B3A58, text #fff
- Preparando: background #1E8449, text #fff
- Enviado: background #1E8449, text #fff
- Entregado: background #1E8449, text #fff
- Cancelado: background #C0392B, text #fff

Navbar:
- Height: 64px
- Background: #FFFFFF
- Border-bottom: 1px solid #E6E6E9
- Logo a la izquierda, buscador centra/expandible, accesos (login/registro, carrito) a la derecha

Footer:
- Background: #222222
- Text: #FFFFFF (uso limitado de color secundario en enlaces)
- Padding: 32px

---

## 7. Reglas de uso — Qué SÍ y Qué NO

Qué SÍ:
- Usar únicamente la paleta aquí definida para elementos de UI.
- Mantener Poppins como fuente principal en header, botones, labels y UI general.
- Respetar el sistema de espaciado modular.
- Usar las variantes de botones y estados definidos.
- Usar el SVG del logo suministrado o versiones derivadas respetando proporciones.

Qué NO:
- No usar amarillo brillante ni azul corporativo similar a Mercado Libre.
- No mezclar tipografías fuera de las definidas (solo Poppins y Merriweather como secundarias).
- No crear componentes con bordes/curvas radicalmente distintos (mantener border-radius 8-12px).
- No usar sombras fuertes ni gradientes exagerados.

---

## 8. Tokens y mapping a Tailwind (sugerencia de configuración)

En el proyecto frontend, mapear estos tokens en tailwind.config.js:

- colors.primary: '#2B3A58'
- colors.secondary: '#E67E22'
- colors.bg: '#F7F7F8'
- colors.surface: '#FFFFFF'
- colors.text: '#222222'
- colors.muted: '#4B4B4B'
- colors.border: '#E6E6E9'
- colors.success: '#1E8449'
- colors.error: '#C0392B'
- colors.warning: '#E67E22'
- spacing.1 = '4px', spacing.2 = '8px', spacing.3 = '12px', spacing.4 = '16px', spacing.6 = '24px', spacing.8 = '32px'

Ejemplo de clase utilizable: .btn-primary { @apply bg-primary text-white px-4 py-2 rounded-lg font-semibold }

---

## 9. Ejemplos de componentes (código conceptual)

Botón primario (Tailwind):
- className: "bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#22324D] disabled:bg-[#E6E6E9]"

Card de producto (estructura):
- <div className="bg-surface border border-border rounded-xl p-4 shadow-sm"> <img ... /> <h4 className="text-base font-semibold text-text">Nombre</h4> <p className="text-sm text-muted">Categoría</p> <div className="mt-2"><span className="text-lg font-bold text-primary">$1,299.00</span></div></div>

---

## 10. Notas finales

- Este documento es la única fuente de verdad para estilos. Cualquier cambio debe registrarse aquí.
- El diseño prioriza accesibilidad, contraste legible y usabilidad en dispositivos móviles.
- Para tests visuales y revisión del profesor, conservar ejemplos de pantallas en /docs/capturas/ cuando estén disponibles.

---

> Archivo generado por: asistente SDD — conversión de identidad de marca de marketplace a tienda de autopartes.