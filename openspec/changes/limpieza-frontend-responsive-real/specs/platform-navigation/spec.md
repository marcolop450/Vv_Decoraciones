# platform-navigation Delta Specification

## MODIFIED Requirements

### Requirement: Enrutamiento Real de 11 Pantallas
The system SHALL soportar navegación URL discreta mediante HTML5 History API (`window.history.pushState` y `popstate`) en las rutas: `/landing`, `/catalogo`, `/login`, `/admin/inicio`, `/admin/fotos`, `/admin/eventos`, `/admin/eventos/nuevo`, `/admin/eventos/detalle`, `/admin/calendario`, `/admin/reportes` y `/admin/bitacora`, adaptando la visualización mediante responsividad fluida (Desktop en pantallas amplias y Móvil en pantallas reducidas) sin marcos o chasis de teléfono simulados en PC ni botones manuales de alternancia de dispositivo.

#### Scenario: Navegación directa por URL
- **WHEN** un usuario ingresa directamente a `localhost:3000/catalogo` o a `localhost:3000/admin/calendario`
- **THEN** el sistema carga la pantalla correspondiente reflejando la URL exacta en la barra de direcciones del navegador.

#### Scenario: Visualización en Escritorio
- **WHEN** un usuario ingresa desde una pantalla de escritorio (>768px)
- **THEN** el sistema presenta la interfaz completa con barra lateral fija (Sidebar), grillas de múltiples columnas y sin chasis ni botones de cambio de dispositivo.

#### Scenario: Visualización en Móvil Real
- **WHEN** un usuario ingresa desde un teléfono móvil o pantalla reducida (<=768px)
- **THEN** el sistema se adapta ocupando el 100% del viewport con cabecera minimalista y barra de navegación inferior fija (`Bottom Navigation Bar`).

## ADDED Requirements

### Requirement: Limpieza de Datos Simulados y Estados Vacíos
The system SHALL cargar la información operativa únicamente desde las tablas de Supabase (`eventos`, `fotos_evento`, `categorias`, `configuracion_negocio`) y mostrar estados vacíos elegantes y accionables cuando la base de datos no contenga registros, sin inyectar datos ficticios ni clientes simulados.

#### Scenario: Carga con base de datos sin eventos
- **WHEN** la tabla `eventos` de Supabase no contiene filas
- **THEN** la lista de eventos muestra un estado vacío con el mensaje "No hay eventos registrados" e invitación a registrar el primero mediante "+ Registrar Evento".

#### Scenario: Carga con catálogo sin fotografías
- **WHEN** la tabla `fotos_evento` de Supabase no contiene fotografías publicadas
- **THEN** la galería muestra un estado vacío claro invitando al dueño a publicar la primera decoración.
