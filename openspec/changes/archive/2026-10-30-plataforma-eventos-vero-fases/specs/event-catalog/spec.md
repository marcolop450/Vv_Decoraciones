# Spec Delta

## Purpose

Permite a los clientes explorar el portafolio visual de decoraciones y eventos realizados, filtrando por categorias tematicas y consultando detalles de diseno.

## ADDED Requirements

### Requirement: Exploracion de catalogo publico
The system SHALL mostrar una lista paginada o con scroll de eventos decorados ordenados cronologicamente de forma descendente, destacando imagen principal, titulo del evento y fecha.

#### Scenario: Visualizacion inicial del catalogo
- **WHEN** el usuario accede a la seccion de catalogo
- **THEN** el sistema presenta las tarjetas de eventos decorados con diseno Gala Nocturna y datos cargados

### Requirement: Filtrado tematico por categoria
The system SHALL permitir filtrar la galeria de eventos por categorias tematicas predefinidas como Bodas, XV Anos, Infantiles, Graduaciones y Cotillon VIP.

#### Scenario: Aplicar filtro de categoria
- **WHEN** el usuario selecciona la categoria "Bodas"
- **THEN** la vista actualiza la lista mostrando unicamente los eventos asociados a esa categoria

### Requirement: Vista de detalle de decoracion
The system SHALL desplegar una vista detallada para cada evento seleccionado, incluyendo descripcion del montaje, gama cromatica empleada y carrusel de fotografias en alta resolucion.

#### Scenario: Apertura de detalle de evento
- **WHEN** el usuario hace clic en una tarjeta de evento
- **THEN** el sistema abre la vista detallada con la galeria de fotos y la ficha tecnica de la decoracion
