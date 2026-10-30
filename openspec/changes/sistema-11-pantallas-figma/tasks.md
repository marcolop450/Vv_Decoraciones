# Tareas de Implementación: Sistema 11 Pantallas Figma

- [x] 1. Configurar el enrutador histórico (`VvAppContext` y `App.tsx`) con soporte para las 11 rutas discretas (`/landing`, `/catalogo`, `/login`, `/admin/inicio`, `/admin/fotos`, `/admin/eventos`, `/admin/eventos/nuevo`, `/admin/eventos/detalle`, `/admin/calendario`, `/admin/reportes`, `/admin/bitacora`) y sincronización con `window.history`. <!-- id: 1 -->
- [x] 2. Implementar soporte dual de visualización `deviceMode` (Desktop Shell vs Mobile Shell con marco de teléfono y barra inferior fija de 5 módulos). <!-- id: 2 -->
- [x] 3. Adaptar `/landing` con botón "Ver en Móvil / Volver a Web", muestra aleatoria de 3 decoraciones ("Mostrar otra selección aleatoria") y flujo de cotización WhatsApp con bloqueo de fechas pasadas y dos modos de envío. <!-- id: 3 -->
- [x] 4. Adaptar `/catalogo` con búsqueda en tiempo real, chips de categorías dinámicas y apertura de modal de WhatsApp. <!-- id: 4 -->
- [x] 5. Implementar `/login` con feedback de alerta roja y trazabilidad automática de `Login Exitoso` y `Fallo de Login` en Bitácora. <!-- id: 5 -->
- [x] 6. Implementar `/admin/inicio` con KPIs de saldo pendiente, accesos directos táctiles y agenda de eventos de la semana con enlace a detalle. <!-- id: 6 -->
- [x] 7. Implementar `/admin/fotos` con grilla editable/eliminable y creación integrada inline de nuevas categorías (`+ Nueva Categoría`). <!-- id: 7 -->
- [x] 8. Implementar `/admin/eventos` y `/admin/eventos/nuevo` con tabs de activos/completados, bloqueo de fechas pasadas y adaptación modal en desktop vs pantalla completa en móvil. <!-- id: 8 -->
- [x] 9. Implementar `/admin/eventos/detalle` con cálculo automático de saldos y disparador automático del modal "Registrar Foto del Evento" al pulsar "✓ Marcar Evento como Completado". <!-- id: 9 -->
- [x] 10. Implementar `/admin/calendario` con visualización mensual, resaltado de hoy, puntos dorados en días con eventos y navegación a detalle. <!-- id: 10 -->
- [x] 11. Implementar `/admin/reportes` con resumen financiero y ChatBot IA de reportes con tarjetas clickeables de eventos. <!-- id: 11 -->
- [x] 12. Implementar `/admin/bitacora` con vista en tabla (Desktop) y lista de tarjetas (Móvil) con trazabilidad de todas las operaciones del sistema. <!-- id: 12 -->
- [x] 13. Conectar el estado con Supabase (`eventos`, `fotos_evento`, `categorias`, `bitacora`, `configuracion_negocio`). <!-- id: 13 -->
- [x] 14. Escribir y ejecutar suite completa de pruebas Playwright en Chrome validando las 11 rutas y los flujos de negocio. <!-- id: 14 -->
