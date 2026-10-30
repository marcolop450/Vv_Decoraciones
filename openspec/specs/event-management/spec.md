# event-management Specification

## Purpose
Proporciona al administrador y dueno de V.v las herramientas operativas para crear, programar, monitorear y documentar eventos y montajes tanto desde escritorio como desde dispositivos moviles.

## Requirements

### Requirement: Autenticacion administrativa
The system SHALL requerir autenticacion mediante correo electronico y contrasena a traves de Supabase Auth para acceder a los modulos administrativos de la web y de la aplicacion movil.

#### Scenario: Inicio de sesion exitoso
- **WHEN** el dueno ingresa credenciales validas en el formulario de inicio de sesion
- **THEN** el sistema genera una sesion autenticada y redirige al panel de inicio administrativo

### Requirement: Gestion de ciclo de vida de eventos
The system SHALL permitir crear, editar y cambiar el estado de eventos entre Cotizacion, Confirmado, En Montaje y Finalizado.

#### Scenario: Cambio de estado de evento
- **WHEN** el administrador actualiza el estado de un evento de "Confirmado" a "En Montaje"
- **THEN** el sistema persiste el cambio en la base de datos y registra una entrada en la bitacora de auditoria

### Requirement: Calendario de eventos y montajes
The system SHALL presentar una vista de calendario mensual y diaria que muestre las fechas comprometidas de montaje, entregas de cotillon y horarios.

#### Scenario: Consulta de agenda del dia
- **WHEN** el dueno consulta la vista de agenda diaria
- **THEN** el sistema despliega la lista de eventos programados para esa fecha con su ubicacion y estado
