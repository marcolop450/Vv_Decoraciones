# Diseño Técnico: Sistema de 11 Pantallas Figma y Enrutador Histórico

## 1. Arquitectura de Navegación y Rutas
Se implementará un enrutador ligero basado en HTML5 History API (`window.history.pushState` y evento `popstate`), permitiendo que cada pantalla tenga una URL real sin dependencias pesadas:

- **Rutas Públicas (Cliente)**:
  * `/landing`: Landing page con Hero, Muestra aleatoria de 3 decoraciones ("Mostrar otra selección aleatoria"), botón "Ver en Móvil / Volver a Web", y modal de WhatsApp.
  * `/catalogo`: Catálogo completo con buscador en tiempo real y chips de categorías dinámicas.
- **Rutas de Autenticación**:
  * `/login`: Portal de acceso administrativo con validación contra Supabase Auth / credenciales locales y registro automático en Bitácora.
- **Rutas Administrativas (Dueño)**:
  * `/admin/inicio`: Panel principal con KPIs financieros, 5 accesos directos táctiles y agenda semanal.
  * `/admin/fotos`: Administración del portafolio con selector y creación integrada inline de categorías (`+ Nueva Categoría`).
  * `/admin/eventos`: Pestañas de Eventos Activos vs Completados. En desktop abre modal; en móvil navega a `/admin/eventos/nuevo`.
  * `/admin/eventos/nuevo`: Pantalla dedicada de alta de evento en vista móvil vertical con bloqueo de fechas pasadas.
  * `/admin/eventos/detalle`: Ficha técnica del evento con cálculo automático de saldos y disparador automático del modal "Registrar Foto del Evento".
  * `/admin/calendario`: Calendario mensual interactivo con marcas en días ocupados y vista de detalle diaria.
  * `/admin/reportes`: Resumen de métricas financieras e integración del ChatBot IA de reportes interactivo.
  * `/admin/bitacora`: Registro cronológico de auditoría con estados Éxito y Fallo.

## 2. Shell Dual Adaptable (Desktop vs Móvil)
El layout maestro soportará dos modos de visualización gobernados por `deviceMode`:
- **Desktop Shell**: Barra lateral fija a la izquierda (`w-64`), header con estado del negocio y contenido amplio en grilla.
- **Mobile Shell**: Contenedor vertical centrado de dimensiones móviles estándar (`max-w-[420px]`) con borde de teléfono, scroll interno y **Bottom Navigation Bar fija** con 5 accesos principales (*Inicio*, *Fotos*, *Eventos*, *Agenda*, *Reportes*) y menú **☰ Más** (*Bitácora*, *Web Pública*, *Cerrar Sesión*).

## 3. Manejo de Estado y Persistencia
- Estado centralizado mediante Context (`VvAppContext`), sincronizado bidireccionalmente con Supabase (tablas `eventos`, `fotos_evento`, `categorias`, `bitacora` y `configuracion_negocio`) con fallback reactivo en `localStorage` para garantizar fluidez inmediata sin latencia de red.
