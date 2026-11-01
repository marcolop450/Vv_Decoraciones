# Proposal: Auditoría Integral QA, Seguridad de Rutas, Base de Datos y Optimización Móvil

## Why

Una auditoría técnica de QA y ciberseguridad sobre la plataforma reveló vulnerabilidades críticas de control de acceso: las rutas privadas `/admin/*` son accesibles directamente sin autenticación debido a la ausencia de un Route Guard y a que el estado de autenticación iniciaba en `true` por defecto. Asimismo, la autenticación actual operaba mediante una validación local en memoria en lugar de integrarse con el servicio de autenticación y tokens JWT de Supabase Auth (donde el usuario `veronica@gmail.com` ya existe registrado).

Esta propuesta subsana dichas brechas de seguridad, garantiza la integridad referencial y de RLS en la base de datos de Supabase, valida que las categorías provengan exclusivamente de la tabla `categorias` sin duplicados ficticios, y optimiza la ergonomía en dispositivos móviles tanto para el visitante (botón flotante táctil de cotización) como para la dueña (zona táctil segura de 48px en navegación inferior).

## What Changes

- **Control Estricto de Rutas (Route Guard)**: Redirección inmediata a `/login` si un usuario no autenticado intenta acceder por URL o navegación a cualquier ruta bajo `/admin/*` (`/admin/inicio`, `/admin/fotos`, `/admin/eventos`, etc.).
- **Autenticación Real con Supabase Auth**: Reemplazo de la validación simulada en cliente por llamadas seguras a `supabase.auth.signInWithPassword()` y `supabase.auth.signOut()`, gestionando sesiones persistentes y tokens JWT para el usuario administrador `veronica@gmail.com`.
- **Integridad y Sincronización Estricta de Base de Datos**:
  - Asegurar que las 6 categorías provengan exclusivamente de la tabla `categorias` de Supabase, eliminando cualquier inyección o duplicado en memoria.
  - Verificar que las políticas de RLS en Supabase no generen excepciones y que las operaciones de eventos y fotografías se sincronicen de manera fidedigna.
- **Optimización de Experiencia Web Móvil para Clientes**: Botón flotante accesible de WhatsApp persistente con llamada directa a la acción y carrusel deslizable horizontal de chips de categorías sin barras de desplazamiento invasivas.
- **Optimización Móvil para la Dueña**:
  - Ajuste de altura táctil mínima (48x48px) y espaciado de seguridad inferior (`env(safe-area-inset-bottom)`) en la barra de navegación móvil (`Bottom Navigation Bar`).
  - Adaptación de formularios y modales en pantallas compactas para prevenir desbordamientos o solapamientos de botones en cabecera.

## Capabilities

### New Capabilities
- `identity-access`: Gestión de autenticación, verificación de sesiones activas, tokens JWT y control de acceso por roles para administradores mediante Supabase Auth.

### Modified Capabilities
- `platform-navigation`: Incorpora protección estricta de rutas privadas administrativas (`Route Guard`) y optimizaciones ergonómicas para dispositivos móviles (visitante y dueño).

## Impact

- **Seguridad**: Bloqueo absoluto de acceso no autorizado al panel administrativo y datos de clientes.
- **Frontend**: Modificación en [`App.tsx`](file:///D:/Eventos_Vero/Frontend/src/App.tsx), [`VvAppContext.tsx`](file:///D:/Eventos_Vero/Frontend/src/context/VvAppContext.tsx), [`AdminLayout.tsx`](file:///D:/Eventos_Vero/Frontend/src/components/layout/AdminLayout.tsx), y componentes móviles.
- **Backend / Supabase**: Validación de compatibilidad con políticas RLS de `002_rls_policies.sql` para el usuario autenticado.
- **Testing**: Pruebas E2E en Playwright para verificar denegación de acceso no autenticado a `/admin/*`, login exitoso con Supabase y navegación táctil móvil.
