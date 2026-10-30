# Tasks

## 1. Estructura y Scaffolding del Workspace

- [x] 1.1 Crear las carpetas raiz del proyecto `/Frontend`, `/Movil`, `/Backend`, `/Doc` y `/Shared` y verificar su presencia con `Get-ChildItem`.
- [x] 1.2 Configurar el paquete `/Shared` con contratos TypeScript y tokens CSS de "Gala Nocturna" y verificar la exportacion correcta de tipos.
- [x] 1.3 Inicializar la carpeta `/Doc` con la guia de arquitectura, manual de tokens y directrices de despliegue, verificando la generacion de los archivos markdown.

## 2. Fase 1: Backend Supabase y Modelado Relacional

- [x] 2.1 Escribir el script DDL de migraciones SQL para las tablas `categorias`, `eventos`, `fotos_evento`, `bitacora` y `cotizaciones` en `/Backend/migrations/001_initial_schema.sql` y verificar consistencia de claves foraneas.
- [x] 2.2 Configurar politicas de seguridad RLS en `/Backend/migrations/002_rls_policies.sql` para permitir lectura publica del catalogo y restringir escritura al rol de dueno autenticado, verificando la sintaxis SQL.
- [x] 2.3 Definir la configuracion de Supabase Storage para el bucket `eventos-fotos` con politicas de acceso publico de lectura y verificar el script de inicializacion.
- [x] 2.4 Generar tipos TypeScript de base de datos en `/Shared/types/supabase.ts` y validar ausencia de errores de tipado con `tsc --noEmit`.

## 3. Fase 2: Frontend Web Publico (Landing, Catalogo y Cotizacion)

- [x] 3.1 Inicializar el proyecto `/Frontend` con Vite + React 19 + TypeScript + Tailwind CSS y verificar que compile con `npm run build`.
- [x] 3.2 Migrar e integrar los tokens visuales de Gala Nocturna y fuentes tipograficas desde la demo en `/Frontend/src/index.css` y verificar contraste y estilos base.
- [x] 3.3 Implementar el catalogo publico interactivo con filtros por categoria conectado al cliente Supabase y verificar el filtrado de eventos en el navegador.
- [x] 3.4 Implementar el modal de detalle de evento y carrusel fotografico con optimizacion de carga y verificar visualizacion correcta.
- [x] 3.5 Construir el modal de cotizacion interactiva y generador de enlace dinamico a WhatsApp, verificando la composicion del mensaje preformateado.

## 4. Fase 3: Panel de Administracion Web (Dueno)

- [x] 4.1 Configurar el flujo de autenticacion con Supabase Auth en `/Frontend/src/pages/admin/LoginPage.tsx` y verificar proteccion de rutas privadas.
- [x] 4.2 Construir el panel de gestion de eventos (crear, editar, cambiar estados) y verificar la persistencia de cambios en la base de datos.
- [x] 4.3 Implementar el modulo de carga y curaduria de fotos conectando el componente Dropzone con Supabase Storage y verificar la actualizacion de la galeria.
- [x] 4.4 Integrar el calendario operativo de montajes y agenda diaria, verificando la correcta distribucion por fechas de evento.
- [x] 4.5 Desarrollar la bitacora de auditoria para registrar cambios de estado y notas operativas del dueno, verificando inserciones y consultas.

## 5. Fase 4: Aplicacion Movil (Dueno en Campo)

- [x] 5.1 Inicializar el proyecto `/Movil` con React Native (Expo SDK 52) y TypeScript y verificar su arranque con `npx expo start --dry-run`.
- [x] 5.2 Implementar la navegacion inferior (Bottom Tab Bar) con las secciones Agenda, Fotos, Eventos y Bitacora, verificando transiciones fluidas.
- [x] 5.3 Integrar el modulo de camara nativa (`expo-camera` / `expo-image-picker`) con compresion y subida directa a Supabase Storage, verificando carga de fotos en campo.
- [x] 5.4 Implementar la vista rapida de bitacora y agenda del dia para uso en ruta, verificando persistencia con el backend de Supabase.

## 6. Verificacion y Pruebas E2E

- [x] 6.1 Crear suite de pruebas E2E con Playwright en `/Frontend` apuntando al canal de Chrome local para validar flujo de catalogo y modal de cotizacion.
- [x] 6.2 Crear pruebas E2E para el inicio de sesion y creacion de eventos en el panel de administracion y verificar ejecucion exitosa con `npx playwright test --channel=chrome`.
