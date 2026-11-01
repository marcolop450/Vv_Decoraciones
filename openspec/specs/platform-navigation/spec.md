# platform-navigation Specification

## Purpose
Establece las reglas de enrutamiento real, división modular de las 11 pantallas de Figma y las 8 reglas de negocio operativas entre el rol Cliente y el rol Administrador de V.v Eventos.

## Requirements

### Requirement: Enrutamiento Real de 11 Pantallas
The system SHALL soportar navegación URL discreta mediante HTML5 History API (`window.history.pushState` y `popstate`) en las rutas: `/landing`, `/catalogo`, `/login`, `/admin/inicio`, `/admin/fotos`, `/admin/eventos`, `/admin/eventos/nuevo`, `/admin/eventos/detalle`, `/admin/calendario`, `/admin/reportes` y `/admin/bitacora`.

#### Scenario: Navegación directa por URL
- **WHEN** un usuario ingresa directamente a `localhost:3000/catalogo` o a `localhost:3000/admin/calendario`
- **THEN** el sistema carga la pantalla correspondiente reflejando la URL exacta en la barra de direcciones del navegador.

### Requirement: Flujo de Cotización WhatsApp con Bloqueo de Fechas Pasadas
The system SHALL presentar un modal de cotización rápida con mini calendario donde todas las fechas anteriores a la fecha actual queden deshabilitadas y tachadas.

#### Scenario: Cotización con fecha válida (Modo 1)
- **WHEN** el cliente selecciona una fecha igual o posterior al día de hoy
- **THEN** el sistema genera la vista previa estructurada con la fecha y habilita el botón "Enviar a WhatsApp".

#### Scenario: Cotización sin fecha (Modo 2)
- **WHEN** el cliente decide no seleccionar fecha
- **THEN** el sistema habilita el botón "Consultar sin fecha" con mensaje genérico de interés por la decoración.

### Requirement: Creación Integrada de Categorías Inline
The system SHALL permitir al dueño crear y guardar una nueva categoría directamente dentro del formulario de registro de fotos o eventos sin abandonar la pantalla actual.

#### Scenario: Creación de categoría dentro del selector
- **WHEN** el usuario pulsa "+ Nueva Categoría" en el selector
- **THEN** el sistema despliega el campo de texto inline, guarda la categoría en el sistema y la deja automáticamente seleccionada.

### Requirement: Cálculo Automático de Saldos
The system SHALL computar automáticamente en tiempo real el saldo pendiente como `totalPriceBs - advancePriceBs`.

#### Scenario: Registro o actualización de importes
- **WHEN** el dueño ingresa el precio total y el adelanto de un evento
- **THEN** el sistema actualiza de forma instantánea el saldo por cobrar sin intervención manual.

### Requirement: Conexión Automática entre Evento Completado y Catálogo
The system SHALL abrir automáticamente el modal de publicación de fotos al momento de marcar un evento como completado, preseleccionando el nombre, descripción sugerida y categoría.

#### Scenario: Marcar evento como completado
- **WHEN** el dueño pulsa "✓ Marcar Evento como Completado" en `/admin/eventos/detalle`
- **THEN** el evento pasa a la pestaña de eventos realizados y se despliega el modal para subir la fotografía del montaje al catálogo público.

### Requirement: Calendario Interactivo Mensual
The system SHALL presentar una vista de calendario mensual destacando el día de hoy en dorado y marcando los días con eventos mediante puntos dorados con contador interactivo.

#### Scenario: Selección de fecha en calendario
- **WHEN** el usuario hace clic sobre un día con eventos registrados
- **THEN** el sistema despliega la lista detallada de eventos de ese día con acceso directo a `/admin/eventos/detalle`.

### Requirement: ChatBot IA de Reportes
The system SHALL proporcionar en `/admin/reportes` un asistente conversacional capaz de responder consultas de agenda e ingresos mediante tarjetas interactivas de eventos.

#### Scenario: Consulta de eventos próximos por chat
- **WHEN** el usuario escribe "Quiero ver qué evento tengo los siguientes días"
- **THEN** el bot responde con tarjetas que contienen fecha, nombre, cliente y saldo, las cuales navegan al detalle al ser pulsadas.

### Requirement: Trazabilidad Integral en Bitácora
The system SHALL registrar cada acción operativa (login exitoso, fallo de login con alerta roja, creación, edición, eliminación de fotos, eventos y categorías) con fecha, hora, detalle y estado de éxito o fallo.

#### Scenario: Intento de inicio de sesión fallido
- **WHEN** se ingresan credenciales erróneas en `/login`
- **THEN** el sistema muestra una alerta roja en pantalla y persiste una entrada con acción "Fallo de Login" y estado "Fallo" en la bitácora.

### Requirement: Protección Estricta de Rutas Administrativas
The system SHALL interceptar la navegación y bloquear el acceso a cualquier ruta bajo `/admin/*` si el usuario no posee una sesión autenticada activa, redirigiendo a `/login`.

#### Scenario: Intento de acceso directo no autenticado a panel administrativo
- **WHEN** un usuario sin sesión activa navega por URL directa o enlace a `/admin/inicio`, `/admin/eventos`, `/admin/fotos`, `/admin/calendario`, `/admin/reportes` o `/admin/bitacora`
- **THEN** el enrutador bloquea el renderizado de la página administrativa y redirige automáticamente al usuario a `/login`.

#### Scenario: Acceso legítimo de usuario autenticado
- **WHEN** un usuario con sesión autenticada válida accede a cualquier ruta bajo `/admin/*`
- **THEN** el sistema permite el acceso y presenta el módulo administrativo correspondiente.

### Requirement: Botón Flotante Persistente de Cotización WhatsApp en Móvil
The system SHALL presentar un botón flotante táctil persistente de contacto directo por WhatsApp en la vista pública móvil de `/landing` y `/catalogo`.

#### Scenario: Visualización en vista móvil del visitante
- **WHEN** un visitante navega por `/landing` o `/catalogo` desde un dispositivo móvil (ancho <= 768px)
- **THEN** el sistema mantiene visible un botón flotante inferior con icono de WhatsApp y enlace dinámico al número oficial registrado.

### Requirement: Ergonomía Táctil y Safe Area en Barra Inferior del Dueño
The system SHALL asegurar objetivos táctiles de al menos 48x48 píxeles y espaciado de zona segura (`env(safe-area-inset-bottom)`) en la barra inferior móvil del administrador.

#### Scenario: Interacción táctil en barra inferior móvil
- **WHEN** el administrador interactúa con la barra de navegación inferior en dispositivos móviles
- **THEN** cada botón ofrece un área de contacto mínima de 48px sin solapamientos con la barra de gestos del sistema operativo.
