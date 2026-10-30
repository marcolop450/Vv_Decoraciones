# Proposal: Limpieza de Datos Simulados y Responsividad Nativa Real

## Why
El frontend contenía datos falsos y simulados (hardcodeados en seed inicial) y renderizaba un marco simulador de teléfono (`vv-phone-frame`) con botones de alternancia manual ("Ver en Móvil" / "Volver a Web") en pantallas de escritorio, lo cual distorsionaba la experiencia visual de producción y violaba la regla de no sobrecargar el diseño. Es necesario purgar los datos falsos, conectar exclusivamente con Supabase para datos reales (con estados vacíos elegantes) y aplicar un diseño responsivo puro (la vista móvil se activa únicamente en dispositivos móviles reales o pantallas de ancho reducido, sin marcos simulados en PC).

## What Changes
- **Remover el marco simulador de teléfono en escritorio**: Eliminar `vv-phone-frame` y los botones de toggle "Ver en Móvil" / "Volver a Web". El diseño de escritorio se muestra de forma natural a pantalla completa con su sidebar.
- **Responsividad Nativa para Móviles**: En pantallas móviles reales (<=768px), la interfaz se adapta fluidamente ocupando el 100% del viewport del teléfono con su barra inferior fija (`Bottom Navigation Bar`), sin bordes o chasis de teléfono falso superpuestos.
- **Limpieza de Datos Falsos / Simulados**: Reemplazar listas quemadas de eventos, fotos, mensajes de chat y logs ficticios por sincronización real con Supabase (`eventos`, `fotos_evento`, `categorias`, `configuracion_negocio`).
- **Estados Vacíos Elegantes (Empty States)**: Cuando no existan registros en Supabase, mostrar mensajes limpios y accionables para crear el primer registro sin inventar datos en `localStorage`.
- **Adherencia a Regla de Cero Sobrecontexto**: Respuestas y código directos al grano técnico, sin elementos redundantes ni sobrecargas decorativas no solicitadas.

## Capabilities

### Modified Capabilities
- `platform-navigation`: Actualizar requerimientos para eliminar el modo simulador manual de teléfono y requerir responsividad fluida por viewport, junto con la eliminación de datos ficticios en favor de Supabase y empty states.

## Impact
- `Frontend/src/context/VvAppContext.tsx`: Eliminación de `deviceMode` y toggle manual; inicialización limpia sin datos ficticios en fallback; sincronización prioritaria con Supabase.
- `Frontend/src/components/layout/PublicLayout.tsx`: Eliminación de botones de toggle de dispositivo y marco móvil en escritorio.
- `Frontend/src/components/layout/AdminLayout.tsx`: Eliminación del marco simulado; soporte responsivo puro con media queries / viewport.
- `Frontend/src/pages/`: Actualización de páginas para manejar estados vacíos cuando la base de datos no contenga elementos.
- `Frontend/e2e/`: Actualización de pruebas Playwright eliminando verificaciones de botones de alternancia y probando viewports reales de escritorio y móvil.
