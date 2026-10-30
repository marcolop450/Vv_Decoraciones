# Spec Delta

## Purpose

Gestiona la carga, optimizacion, almacenamiento seguro y asociacion de fotografias de decoraciones realizadas a cada evento en Supabase Storage.

## ADDED Requirements

### Requirement: Carga de imagenes por el dueno
The system SHALL permitir la carga de fotografias en formatos JPG, PNG y WEBP con un limite maximo de 10 MB por archivo, asociandolas a un evento especifico.

#### Scenario: Subida exitosa de fotografia
- **WHEN** el dueno selecciona y envia una imagen desde la web o la camara movil
- **THEN** el sistema almacena el archivo en el bucket correspondiente de Supabase y vincula la URL publica al registro del evento

### Requirement: Curaduria y visibilidad publica
The system SHALL permitir al dueno marcar fotografias especificas como portada o visibles para el catalogo publico del cliente.

#### Scenario: Marcar fotografia como publica
- **WHEN** el dueno activa el selector de visibilidad publica en una foto de la galeria de evento
- **THEN** la imagen queda inmediatamente disponible para consulta en el catalogo publico
