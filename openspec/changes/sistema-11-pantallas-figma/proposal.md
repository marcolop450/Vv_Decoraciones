# Propuesta: Sistema Completo de 11 Pantallas Figma y Enrutamiento Real

## 1. Contexto y Diagnóstico
Actualmente la aplicación en `Frontend/` se ejecuta bajo una navegación basada en estado interno que mantiene la URL fija en `localhost:3000/`. Además, solo cuenta con 4 páginas básicas, mientras que el diseño oficial entregado por Figma en `D:\Eventos_Vero\Modelo de Frontend y Movil` define una suite completa de **11 pantallas discretas**, soporte dual Desktop / Vista Móvil (con barra inferior fija y marco de teléfono) y 8 reglas de negocio fundamentales:

1. **Enrutamiento Real en Navegador**: Rutas visibles e independientes para cada pantalla (`/landing`, `/catalogo`, `/login`, `/admin/inicio`, `/admin/fotos`, `/admin/eventos`, `/admin/eventos/nuevo`, `/admin/eventos/detalle`, `/admin/calendario`, `/admin/reportes`, `/admin/bitacora`) con soporte para historial (`pushState` y `popstate`).
2. **Vista Cliente (Pública)**:
   - `/landing`: Hero con llamada a la acción, botón de alternancia "Ver en Móvil / Volver a Web", muestra aleatoria de 3 decoraciones con botón para refrescar selección, y tarjetas con botón "Cotizar por WhatsApp".
   - `/catalogo`: Buscador en tiempo real por nombre/descripción/estilo, chips dinámicos de categorías y grilla completa de fotos.
   - **Cotizador WhatsApp**: Mini calendario con fechas pasadas bloqueadas/tachadas, Modo 1 (con fecha seleccionada) y Modo 2 (consulta general sin fecha).
3. **Vista Administrador (Dueño)**:
   - `/login`: Formulario de acceso con registro de login exitoso o fallo de login en bitácora y alerta roja en pantalla.
   - `/admin/inicio`: KPIs (Eventos Activos, Saldo Pendiente por Cobrar en Bs.), 5 accesos directos táctiles y agenda semanal interactiva.
   - `/admin/fotos`: Grilla con edición y eliminación, formulario de registro con selector de categoría y botón integrado **"+ Nueva Categoría"** (creación inline sin salir del modal).
   - `/admin/eventos` y `/admin/eventos/nuevo`: Pestañas de "Activos" y "Completados", modal en desktop y pantalla vertical `/admin/eventos/nuevo` en móvil, bloqueo de fechas pasadas.
   - `/admin/eventos/detalle`: Bloque financiero (`Saldo = Total - Adelanto`) y botón **"✓ Marcar Evento como Completado"** que dispara automáticamente el modal para registrar la foto del evento con datos precargados para el catálogo.
   - `/admin/calendario`: Calendario mensual con día de hoy en dorado, marcas en días con eventos, lista lateral/inferior por día y enlace directo a `/admin/eventos/detalle`.
   - `/admin/reportes`: Resumen financiero con ingresos totales, pendientes y recaudados, desglose por categoría y **ChatBot IA interactivo** que responde con tarjetas clickeables de eventos.
   - `/admin/bitacora`: Auditoría en tabla (Desktop) o tarjetas (Móvil) con fecha/hora, acción, detalle y estado (`✓ Éxito` / `✕ Fallo`).

## 2. Alcance
- Integrar la arquitectura de 11 pantallas discretas en `Frontend/` con enrutador URL que soporte recarga directa y navegación `pushState`.
- Incorporar el selector de vista de dispositivo (`desktop` vs `mobile` frame) tal como lo presenta la demo de Figma.
- Conectar los flujos con Supabase (con sincronización en base de datos PostgreSQL remota y persistencia local reactiva).
- Solucionar las incidencias de renderizado de modales (P1/P2) y bloqueo de fechas pasadas.

## 3. Fuera de Alcance
- Modificaciones al backend SQL existente (las tablas ya soportan eventos, fotos, categorías y bitácora).
