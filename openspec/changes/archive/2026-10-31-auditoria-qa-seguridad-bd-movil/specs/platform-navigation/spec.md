# platform-navigation Specification Delta

## ADDED Requirements

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
