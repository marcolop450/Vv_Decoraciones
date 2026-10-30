# Diseño Técnico: Remediación P0 Responsive y Modales Accesibles

## 1. Arquitectura de Componentes

### 1.1 `VvModal.tsx` (`Frontend/src/components/ui/VvModal.tsx`)
Componente modal unificado del UI Kit para erradicar la duplicación de código (Regla #2 del Workspace):
- **Propiedades**:
  * `isOpen: boolean`
  * `onClose: () => void`
  * `title?: string`
  * `size?: 'sm' | 'md' | 'lg' | 'xl'`
  * `children: React.ReactNode`
- **Accesibilidad y UX**:
  * `role="dialog"` y `aria-modal="true"`.
  * Escucha global de evento `keydown` para tecla `Escape`.
  * Detección de clics en backdrop con cierre seguro.
  * Botón de cierre '✕' con área táctil mínima de 44x44px (`aria-label="Cerrar modal"`).
  * Estructura flexible con `max-h-[90dvh] overflow-y-auto` para evitar desbordes en móviles.

### 1.2 `PublicNavbar.tsx` Adaptativo
- Añadir botón hamburguesa visible solo en móviles (`md:hidden`) con `aria-label="Abrir menú de navegación"` y estado `aria-expanded`.
- Panel desplegable / drawer móvil con enlaces a "Inicio", "Catálogo de Galas" y "Acceso Dueño", además del botón de WhatsApp y "Cotizar Evento".
- Cierre automático del menú al hacer clic en un enlace de navegación.

### 1.3 `AdminLayout.tsx` Adaptativo
- En móviles (`<768px`), el sidebar fijo `w-64` se oculta (`hidden md:flex`).
- En el header superior administrativo se agrega un botón de menú (`md:hidden`) para desplegar el drawer de navegación del dueño.
- El drawer móvil incluye backdrop oscuro y enlaces a todas las secciones administrativas (`Panel`, `Eventos`, `Fotos`, `Perfil`).

## 2. Compatibilidad y Pruebas
- Validación con Playwright E2E emulando viewports móviles (Pixel 5 / iPhone 12 / 375x667).
