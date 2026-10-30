# Propuesta: Remediación de Problemas Bloqueantes P0 (Responsive y Modales)

## 1. Contexto y Justificación
Durante la auditoría técnica y crítica de diseño Impeccable (evaluación dual A/B), se detectaron tres problemas bloqueantes de severidad P0 que impiden el uso fluido en dispositivos móviles y vulneran criterios fundamentales de accesibilidad web (WCAG 2.1 AA):
1. **Navegación pública ausente en móviles**: `PublicNavbar` oculta todos los enlaces bajo 768px (`hidden md:flex`) sin menú hamburguesa ni drawer alternativo.
2. **Barra lateral fija en el panel administrativo**: `AdminLayout` impone un ancho fijo de 256px (`w-64`) sin colapso responsivo, quebrando la interfaz del dueño en teléfonos móviles.
3. **Modales inaccesibles**: `WhatsAppQuoteModal` y `EventDetailModal` carecen de semántica de diálogo (`role="dialog"`), trampa de foco (`focus-trap`), escucha de tecla `Escape` y áreas táctiles de cierre ergonómicas (>=44x44px).

## 2. Alcance
- Implementar menú móvil accesible con drawer animado en `PublicNavbar.tsx`.
- Implementar layout adaptativo con drawer lateral desplegable en `AdminLayout.tsx` para `<768px`.
- Crear el componente primitivo reutilizable `VvModal.tsx` en el UI Kit con control de teclado (`Escape`), trampa de foco, cierre por clic en backdrop y semántica ARIA.
- Refactorizar `WhatsAppQuoteModal.tsx` y `EventDetailModal.tsx` para basarse en `VvModal.tsx`.
- Añadir pruebas E2E en Playwright para validar la navegación móvil y el comportamiento de los modales.

## 3. Fuera de Alcance
- Rediseño integral del Hero (propuesto para fase P1).
- Modificaciones a tablas o endpoints de Supabase.
