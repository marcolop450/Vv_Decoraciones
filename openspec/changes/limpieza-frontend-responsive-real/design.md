# Design: Limpieza de Datos Simulados y Responsividad Nativa Real

## Context
La versión anterior incluía un simulador visual con marco de teléfono (`.vv-phone-frame`) y botones manuales de toggle ("Ver en Móvil" / "Volver a Web") visibles en pantallas de escritorio, además de colecciones iniciales de datos quemados ficticios (clientes, eventos y fotografías falsas en `vvInitialAppData.ts`). Esto generaba ruido visual y sobrecontexto no deseado en producción.

## Goals / Non-Goals

**Goals:**
- Eliminar completamente el emulador de teléfono (`vv-phone-frame`) y los botones de toggle manual de dispositivo en pantallas de escritorio.
- Implementar responsividad fluida nativa: en PC (>768px) se muestra el layout completo de escritorio; en teléfonos (<=768px) se muestra el layout móvil adaptado al 100% del viewport real.
- Limpiar el estado inicial ficticio (`initialEvents`, `initialPhotos`, `initialBitacora`) y conectar directamente con las tablas de Supabase.
- Diseñar estados vacíos (empty states) atractivos cuando no haya eventos o fotos en la base de datos.
- Cumplir estrictamente la regla de cero sobrecontexto y concisión técnica.

**Non-Goals:**
- No alterar la arquitectura modular de 11 rutas de `VvRouterSwitch`.
- No alterar las credenciales de autenticación ni los esquemas de base de datos en Supabase.

## Decisions

### 1. Detección Responsiva Nativa en vez de `deviceMode` Forzado
- **Decisión:** Reemplazar el estado forzado `deviceMode: 'desktop' | 'mobile'` en `VvAppContext` por un hook reactivo de ancho de pantalla (`isMobile: window.innerWidth < 768`).
- **Razón:** El dispositivo real del usuario define la visualización automáticamente. Quien navega en PC ve la versión Web de escritorio completa, y quien navega en un teléfono ve la interfaz móvil optimizada sin bordes de teléfono falsos.
- **Alternativa descartada:** Mantener botones de alternancia en la barra de navegación; rechazada porque añade sobrecontexto y confunde al usuario final.

### 2. Purgado de Datos Quemados y Carga Reactiva desde Supabase
- **Decisión:** El estado inicial en `createInitialVvState()` inicializa con listas vacías `events: []`, `photos: []`, `bitacora: []`. `VvAppContext` consulta de inmediato las tablas `eventos`, `fotos_evento`, `categorias` y `configuracion_negocio` en Supabase.
- **Razón:** Permite que la aplicación sea 100% de producción y refleje únicamente los datos reales registrados por el dueño.
- **Alternativa descartada:** Dejar datos ficticios como fallback visual; rechazada por el requerimiento explícito del usuario de limpiar datos falsos y simulados.

### 3. Estados Vacíos (Empty States) Guiados
- **Decisión:** Cada pantalla (`/landing`, `/catalogo`, `/admin/eventos`, `/admin/fotos`) incluye un mensaje limpio y elegante con botón de acción (ej. "+ Registrar Primer Evento", "+ Subir Primera Foto") si la base de datos no tiene registros.
- **Razón:** Evita pantallas en blanco y ofrece una excelente experiencia de onboarding para el dueño.

## Risks / Trade-offs

- **[Base de datos vacía en primera carga]** → Se muestran empty states elegantes con instrucciones directas para que el usuario o el dueño comiencen a registrar información real de inmediato.
- **[Pruebas E2E en Playwright]** → Las pruebas ya no deben buscar botones de alternancia manual; deben utilizar viewports reales (`viewport: { width: 1280, height: 720 }` para desktop y `viewport: { width: 375, height: 667 }` para móvil).
