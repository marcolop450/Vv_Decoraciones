# Reglas del Workspace - Eventos Vero

## 1. Comunicacion y Formato
- Cero emojis unicode en respuestas, commits y codigo. Usar exclusivamente emoticones tradicionales de texto si se requiere expresion :) ;-) :D -_-
- Sin relleno ("AI Slop"): ir directo al grano tecnico sin introducciones protocolares, disculpas innecesarias ni conclusiones obvias.
- Sin sobrecontexto: entregar respuestas concisas, accionables y precisas. Evitar volcar explicaciones largas no solicitadas.

## 2. Codigo Limpio, Modularidad y Componentes Reutilizables
- Codigo autoexplicativo: nombres claros en variables, funciones y componentes.
- Minimo de comentarios: prohibido comentar lo evidente o sintaxis basica. Solo justificar logica de negocio no trivial.
- Componentes pequenos y reutilizables: limite maximo de ~250 lineas por archivo. Prohibido duplicar componentes o maquetar desde cero elementos que ya existan en el UI Kit (`VvButton`, `VvCard`, `VvBadge`, `VvInput`, `VvModal`).
- Paginas desacopladas y separadas: rutas publicas (`/pages/public/`) y privadas (`/pages/admin/`) en directorios independientes.
- Separacion estricta de logica y presentacion: llamadas de red, estado y transformaciones de datos encapsuladas en custom hooks (`useEventos`, `useConfiguracion`, etc.).
- TypeScript riguroso: evitar `any`, tipar contratos de API, schemas y modelos.

## 3. Parametrizacion y Variables de Negocio (Cero Hardcoding)
- Prohibido quemar (hardcodear) en el codigo numeros telefonicos, enlaces a WhatsApp, correos, nombres de dueno o redes sociales.
- Toda variable comercial debe persistir en la tabla de configuracion de Supabase (`configuracion_negocio`) con fallback en variables de entorno `.env` (`VITE_CONTACT_PHONE`, etc.).
- El dueno debe tener la capacidad de cambiar su numero de WhatsApp, telefono y datos de contacto directamente desde su perfil de administracion sin alterar codigo ni requerir redespliegues.

## 4. Desarrollo Guiado por Especificaciones (OpenSpec / SDD)
- Toda modificacion estructural o feature relevante debe rastrearse en `openspec/`.
- Usar el ciclo OpenSpec: `openspec new change <nombre>`, documentar spec y tareas, y sincronizar al completar con `openspec sync`.
- No alterar arquitectura sin actualizar la especificacion correspondiente en `openspec/specs/`.

## 5. Testing End-to-End (Playwright)
- Ejecutar contra el Google Chrome local usando `{ channel: 'chrome' }` o `--channel=chrome` para no forzar descargas redundantes.
- En pruebas E2E, usar locators semanticos orientados al usuario (`getByRole`, `getByLabel`, `getByText`). Prohibido usar selectores XPath fragiles o clases CSS dinamicas.
- Prohibido el uso de `page.waitForTimeout()` arbitrario; usar esperas basadas en assertions web-first (`expect(locator).toBeVisible()`).

## 6. UI y Sistema de Diseno (Impeccable)
- Mantener consistencia visual con "Gala Nocturna" (fondo `#050505`, acentos dorados `#D4AF37`, textos legibles marfil `#F9F6F0`).
- Respetar contraste WCAG AA en pantallas de campo y aplicar carga diferida (`loading="lazy"`) con compresion WebP en todas las fotografias.

## 7. Seguridad y Backend (Supabase)
- Validacion estricta en la entrada de datos con Zod schemas en frontend y constraints/RLS en Supabase.
- Sanitizacion y escape para prevenir XSS.
- Manejo centralizado y estructurado de errores en APIs.
