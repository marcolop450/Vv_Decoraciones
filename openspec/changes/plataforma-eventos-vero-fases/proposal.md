# Proposal

## Why

El negocio "V.v Decoracion de eventos y cotillon" requiere transformar su prototipo visual en una plataforma integral en produccion. Actualmente los procesos de difusion de portafolio, cotizacion, agenda de montajes y registro de evidencia fotografica se gestionan de forma dispersa, limitando el seguimiento operativo y la conversion comercial.

Esta iniciativa unifica la presencia publica de marca y la gestion operativa del dueno a traves de una solucion modular respaldada por Supabase, estructurada en fases progresivas y separada limpiamente en Frontend, Movil, Backend y Documentacion.

## What Changes

- Creacion de la estructura modular monorepo/multirepo del proyecto: `/Frontend`, `/Movil`, `/Backend`, `/Doc` y `/Shared`.
- Adopcion estricta del Sistema de Diseno "Gala Nocturna" (paleta `#050505`, acentos dorados `#D4AF37`, tipografias Cormorant Garamond, Great Vibes y Plus Jakarta Sans) extraido del prototipo en `D:\Eventos_Vero\Modelo de Frontend y Movil`.
- Implementacion de la Web Publica para clientes en `/Frontend`: catalogo interactivo de decoraciones, filtros por categoria (Bodas, XV Anos, etc.), galeria inmersiva y generador de cotizaciones para WhatsApp.
- Implementacion del Panel Web de Administracion para el dueno en `/Frontend`: gestion de eventos, carga y curaduria de fotos, calendario de montajes, bitacora de auditoria y reportes basicos.
- Implementacion de la Aplicacion Movil para el dueno en `/Movil`: navegacion inferior (Bottom Tabs), toma y carga directa de fotos en campo durante el montaje, consulta de agenda del dia y bitacora rapida.
- Configuracion del Backend en `/Backend`: esquemas relacionales en PostgreSQL (Supabase), autenticacion de dueno, almacenamiento de imagenes en Supabase Storage con politicas de acceso seguras (RLS).
- Repositorio centralizado de documentacion tecnica y operativa en `/Doc`.

## Capabilities

### New Capabilities
- `event-catalog`: Catalogo publico de decoraciones con navegacion por categorias, vistas de detalle y galeria optimizada de alta resolucion.
- `quote-request`: Formulario y flujo interactivo de cotizacion con integracion de mensajes preformateados hacia WhatsApp.
- `event-management`: Panel de control para el dueno (Web y Movil) con administracion de eventos, calendario operativo, estados (Cotizacion, Confirmado, En Montaje, Finalizado) y bitacora.
- `media-storage`: Servicio de almacenamiento, procesamiento y publicacion de fotografias asociadas a eventos usando buckets de Supabase Storage.

### Modified Capabilities
None.

## Impact

- Nuevos proyectos de frontend y movil en TypeScript con Vite y React / React Native.
- Dependencia externa en servicios de Supabase (PostgreSQL, GoTrue Auth, Storage).
- Contratos de tipos y tokens compartidos en `/Shared`.
- Reemplazo del almacenamiento de prototipo (`localStorage`) por persistencia relacional segura.
