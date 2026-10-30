# Tasks: Limpieza de Datos Simulados y Responsividad Nativa Real

## 1. Purga de Datos Falsos y Sincronización con Supabase

- [x] 1.1 Limpiar `vvInitialAppData.ts` eliminando listas ficticias quemadas (`initialEvents`, `initialPhotos`, `initialBitacora`), dejando colecciones vacías por defecto y sincronización prioritaria desde Supabase.
- [x] 1.2 Actualizar `VvAppContext.tsx` para inicializar en vacío y cargar reactivamente eventos, fotos, categorías y configuración desde Supabase sin rellenar datos simulados en `localStorage`.

## 2. Eliminación de Marco Simulador y Responsividad Fluida

- [x] 2.1 Eliminar `deviceMode`, botones manuales de alternancia ("Ver en Móvil" / "Volver a Web") y la clase `.vv-phone-frame` en `PublicLayout.tsx`, `LandingPage.tsx` y `LoginPage.tsx`.
- [x] 2.2 Reestructurar `AdminLayout.tsx` para aplicar responsividad nativa pura: Sidebar fija y grillas en pantallas de escritorio (>768px), y barra inferior fija (`Bottom Navigation Bar`) al 100% del viewport en teléfonos (<=768px), sin marcos simulados en PC.
- [x] 2.3 Eliminar los estilos CSS del marco de teléfono (`.vv-phone-frame`) y asegurar que los modales se abran centrados y responsivos en cualquier resolución.

## 3. Estados Vacíos y Verificación

- [x] 3.1 Implementar estados vacíos elegantes y claros en `/landing`, `/catalogo`, `/admin/eventos`, `/admin/fotos` y `/admin/calendario` cuando la base de datos no contenga elementos.
- [x] 3.2 Actualizar las pruebas E2E de Playwright (`e2e/sistema-11-pantallas.spec.ts`) para validar escritorio y móvil nativo sin selectores de botones de emulación, y verificar que pasen al 100%.
