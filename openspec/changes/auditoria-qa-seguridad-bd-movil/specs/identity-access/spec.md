# identity-access Specification Delta

## Purpose
Gestiona la autenticación segura, verificación de credenciales, tokens JWT y sesiones persistentes para administradores mediante Supabase Auth.

## ADDED Requirements

### Requirement: Autenticación Administrador con Supabase Auth
The system SHALL autenticar al administrador mediante `supabase.auth.signInWithPassword()` validando credenciales contra Supabase Auth y emitiendo un token JWT de sesión.

#### Scenario: Inicio de sesión exitoso del administrador
- **WHEN** el administrador ingresa correo y contraseña válidos
- **THEN** el sistema establece la sesión autenticada en Supabase, actualiza el estado de la aplicación a autenticado y redirige a `/admin/inicio`.

#### Scenario: Intento de inicio de sesión con credenciales inválidas
- **WHEN** se ingresan credenciales incorrectas en el formulario de acceso
- **THEN** el sistema deniega el acceso, muestra un mensaje de error y no emite sesión autenticada.

### Requirement: Cierre de Sesión Seguro
The system SHALL invalidar la sesión y revocar tokens locales mediante `supabase.auth.signOut()` al cerrar sesión.

#### Scenario: Cierre de sesión por el usuario
- **WHEN** el usuario autenticado pulsa "Cerrar Sesión"
- **THEN** el sistema revoca la sesión activa en Supabase, limpia el estado de autenticación y redirige a `/login`.

### Requirement: Persistencia de Sesión Activa
The system SHALL verificar la existencia de una sesión válida mediante `supabase.auth.getSession()` al cargar la aplicación.

#### Scenario: Restauración de sesión persistida
- **WHEN** un usuario con sesión activa en almacenamiento local recarga el navegador
- **THEN** el sistema restaura el estado autenticado sin solicitar credenciales nuevamente.
