# Tasks: Auditoría QA, Seguridad de Rutas, Integración Supabase y Ergonomía Móvil

## 1. Seguridad de Rutas y Route Guarding

- [x] 1.1 Implementar el Route Guard en [`App.tsx`](file:///D:/Eventos_Vero/Frontend/src/App.tsx) para interceptar cualquier ruta bajo `/admin/*` y redirigir inmediatamente a `/login` si el usuario no está autenticado.
- [x] 1.2 Configurar el estado de autenticación en [`VvAppContext.tsx`](file:///D:/Eventos_Vero/Frontend/src/context/VvAppContext.tsx) para inicializar en `false` por defecto y restaurar la sesión mediante `supabase.auth.getSession()`.

## 2. Autenticación Real con Supabase Auth

- [x] 2.1 Conectar `loginOwner` en [`VvAppContext.tsx`](file:///D:/Eventos_Vero/Frontend/src/context/VvAppContext.tsx) a `supabase.auth.signInWithPassword()` para autenticar formalmente al usuario administrador (`veronica@gmail.com` / `20042008`) y recibir el token JWT.
- [x] 2.2 Conectar `logoutOwner` a `supabase.auth.signOut()` para revocar la sesión activa en Supabase, limpiar el estado y redirigir a `/login`.
- [x] 2.3 Manejar respuestas de error estructuradas ante credenciales inválidas y registrar los intentos en la bitácora del sistema.

## 3. Integridad de Base de Datos y Categorías

- [x] 3.1 Sincronizar categorías en [`VvAppContext.tsx`](file:///D:/Eventos_Vero/Frontend/src/context/VvAppContext.tsx) exclusivamente desde la tabla `categorias` de Supabase, eliminando arrays quemados o fusiones redundantes en cliente.
- [x] 3.2 Eliminar los 6 registros semilla de categorías e implementar CRUD completo (crear, editar y eliminar categorías) sincronizado con Supabase y UI de administración.
- [x] 3.3 Verificar que las operaciones de inserción y consulta contra Supabase respeten las políticas RLS de `002_rls_policies.sql` sin violaciones ni excepciones de permisos.

## 4. Optimización de Experiencia Web Móvil

- [x] 4.1 Implementar botón flotante de WhatsApp (FAB) persistente en la vista pública móvil de [`PublicLayout.tsx`](file:///D:/Eventos_Vero/Frontend/src/components/layout/PublicLayout.tsx) para acceso inmediato a cotización en teléfonos.
- [x] 4.2 Ajustar la barra de navegación inferior móvil en [`AdminLayout.tsx`](file:///D:/Eventos_Vero/Frontend/src/components/layout/AdminLayout.tsx) garantizando dimensiones táctiles mínimas de 48x48px y espaciado de zona segura `env(safe-area-inset-bottom)`.

## 5. Verificación E2E y Validación de Calidad

- [x] 5.1 Actualizar las pruebas E2E en [`Frontend/e2e/sistema-11-pantallas.spec.ts`](file:///D:/Eventos_Vero/Frontend/e2e/sistema-11-pantallas.spec.ts) para validar el bloqueo de rutas `/admin/*` sin login y el flujo de autenticación real.
- [x] 5.2 Ejecutar `npm run build` y la suite de pruebas completa en Playwright (`npx playwright test`) verificando 100% de aserciones aprobadas.
