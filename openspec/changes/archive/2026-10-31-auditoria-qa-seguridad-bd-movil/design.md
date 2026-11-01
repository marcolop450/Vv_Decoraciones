# Design: Auditoría QA, Seguridad de Rutas, Integración Supabase y Ergonomía Móvil

## Context

Para la motivación y contexto general del cambio, referirse a [`proposal.md`](proposal.md).
El frontend opera una Single Page Application (SPA) basada en React con enrutador discreto (`HTML5 History API`). Actualmente, el enrutador conmuta páginas sin validar si la ruta actual pertenece al segmento privado `/admin/*`, y el estado `isAuthenticated` arrancaba predeterminado en `true`. Además, la autenticación era una comparación local de cadenas de texto sin validar contra Supabase Auth, lo que impedía que Supabase identificara al usuario como `authenticated` bajo sus políticas de seguridad de nivel de fila (RLS).

## Goals / Non-Goals

**Goals:**
- Implementar un `ProtectedRoute` (Guard de Navegación) centralizado en [`App.tsx`](file:///D:/Eventos_Vero/Frontend/src/App.tsx) que impida el acceso y renderizado de módulos administrativos a usuarios no autenticados, redirigiéndolos de inmediato a `/login`.
- Integrar la autenticación real con `supabase.auth.signInWithPassword()` y `supabase.auth.signOut()` para el administrador registrado (`veronica@gmail.com`), gestionando la sesión activa mediante `supabase.auth.getSession()`.
- Validar la integridad de la base de datos de Supabase asegurando cero violaciones de restricciones, que las 6 categorías provengan exclusivamente de la tabla `categorias` sin duplicados ficticios, y que las operaciones operativas se sincronicen directamente.
- Implementar un botón flotante táctil de WhatsApp (FAB) en la vista pública móvil para elevar la conversión y agilidad de cotización de los clientes.
- Optimizar la ergonomía de la barra de navegación móvil del dueño (`AdminLayout`) con objetivos táctiles mínimos de 48x48px y espaciado de seguridad inferior (`env(safe-area-inset-bottom)`).

**Non-Goals:**
- Modificar el sistema de diseño visual "Gala Nocturna" (se preservan estrictamente los colores `#050505`, `#D4AF37`, `#F9F6F0`).
- Introducir un servidor intermediario Node.js/Express (la arquitectura frontend interactúa directamente con Supabase mediante el cliente tipado `@supabase/supabase-js`).

## Decisions

### 1. Route Guard Centralizado en el Enrutador
- **Decisión**: En [`App.tsx`](file:///D:/Eventos_Vero/Frontend/src/App.tsx), envolver las rutas administrativas `/admin/*` en una verificación estricta: si `!isAuthenticated`, el enrutador guarda la ruta solicitada y renderiza directamente [`LoginPage.tsx`](file:///D:/Eventos_Vero/Frontend/src/pages/LoginPage.tsx) actualizando la URL a `/login`.
- **Alternativas consideradas**:
  - *Comprobación individual dentro de cada página administrativa*: Rechazado por redundancia de código y por provocar parpadeos visuales ("flash of unauthenticated content") antes de la redirección.

### 2. Autenticación Delegada en Supabase Auth
- **Decisión**: `loginOwner(email, password)` invoca `supabase.auth.signInWithPassword({ email, password })`. Si la respuesta es exitosa, se establece la sesión en Supabase y el estado reactivo `isAuthenticated` pasa a `true`. Al recargar el navegador, `useEffect` consulta `supabase.auth.getSession()` para restaurar la sesión automáticamente.
- **Alternativas consideradas**:
  - *Autenticación personalizada mediante contraseña hasheada en tabla propia*: Rechazado porque las políticas RLS de Supabase dependen intrínsecamente del rol `authenticated` emitido por Supabase Auth en los tokens JWT.

### 3. Sincronización Estricta de Categorías sin Ficticios
- **Decisión**: Limpiar cualquier array duplicado o hardcodeado en cliente y vincular el selector de categorías directamente a la tabla `categorias` de Supabase. La creación de nuevas categorías mediante "+ Nueva Categoría" persiste en la tabla con su respectivo `slug` generado.
- **Alternativas consideradas**:
  - *Mantener categorías estáticas en memoria*: Rechazado para cumplir con la regla de negocio de cero hardcoding y permitir al dueño gestionar sus líneas de evento.

### 4. Botón Flotante Persistente de Cotización WhatsApp en Móvil
- **Decisión**: Incorporar un botón flotante circular (`fixed bottom-5 right-5 z-40`) con el icono de WhatsApp y halo dorado sutil, visible exclusivamente en pantallas móviles (`md:hidden`) en las vistas públicas `/landing` y `/catalogo`.
- **Alternativas consideradas**:
  - *Barra fija inferior completa en la web pública*: Rechazado porque satura la pantalla del visitante y resta protagonismo a las fotografías de gala.

### 5. Ergonomía Táctil y Safe Areas en Barra Móvil del Dueño
- **Decisión**: Aplicar `min-h-[48px]`, `min-w-[48px]` a cada botón de la barra inferior de navegación móvil (`AdminLayout.tsx`) y añadir `pb-[calc(0.5rem+env(safe-area-inset-bottom))]`.
- **Alternativas consideradas**:
  - *Uso de padding fijo de 10px*: Provoca que en dispositivos modernos con barra de navegación por gestos (iPhone / Android) los botones queden tapados o sean difíciles de presionar.

## Risks / Trade-offs

- **[Riesgo]**: Pruebas automáticas E2E de Playwright podrían fallar si intentan acceder a `/admin/*` sin autenticarse previamente.
  - **→ Mitigación**: Las pruebas E2E en [`e2e/sistema-11-pantallas.spec.ts`](file:///D:/Eventos_Vero/Frontend/e2e/sistema-11-pantallas.spec.ts) inician sesión a través de `/login` con las credenciales registradas (`veronica@gmail.com` / `20042008`) antes de ejecutar las aserciones administrativas, validando a su vez el bloqueo de accesos no autorizados.
- **[Riesgo]**: Dispositivos móviles sin conexión temporal podrían demorar la validación de `getSession()`.
  - **→ Mitigación**: Implementar un indicador sutil de verificación de sesión y persistir el estado de autenticación en `localStorage` sincronizado con la sesión de Supabase.
