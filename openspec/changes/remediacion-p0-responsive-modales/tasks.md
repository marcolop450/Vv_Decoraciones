# Tareas de Implementación: Remediación P0

- [x] 1. Crear componente primitivo `VvModal.tsx` en `Frontend/src/components/ui/VvModal.tsx` con semántica accesible, soporte para `Escape`, cierre en backdrop y touch target >=44x44px. <!-- id: 1 -->
- [x] 2. Refactorizar `WhatsAppQuoteModal.tsx` para consumir `VvModal.tsx` asegurando scrolling interno y touch targets ergonómicos. <!-- id: 2 -->
- [x] 3. Refactorizar `EventDetailModal.tsx` para consumir `VvModal.tsx` garantizando adaptación en viewports móviles reducidos. <!-- id: 3 -->
- [x] 4. Actualizar `PublicNavbar.tsx` con botón hamburguesa accesible (`aria-expanded`) y drawer de navegación móvil. <!-- id: 4 -->
- [x] 5. Actualizar `AdminLayout.tsx` con soporte responsivo: sidebar ocultable en `<768px` y drawer deslizable para administración en campo. <!-- id: 5 -->
- [x] 6. Escribir y ejecutar prueba E2E en Playwright (`responsive-navigation.spec.ts`) validando la navegación móvil y el funcionamiento accesible de modales. <!-- id: 6 -->
