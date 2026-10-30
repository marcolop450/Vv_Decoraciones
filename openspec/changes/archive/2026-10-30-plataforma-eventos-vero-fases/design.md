# Design

## Context

El proyecto parte de un prototipo interactivo ubicado en `D:\Eventos_Vero\Modelo de Frontend y Movil` que valida el diseno visual "Gala Nocturna" (paleta `#050505` y dorados `#D4AF37`), tipografias (Cormorant Garamond, Great Vibes, Plus Jakarta Sans) y los flujos basicos usando `localStorage`.

Para llevar esta solucion a un entorno productivo y escalable, se implementara una arquitectura desacoplada respaldada por Supabase (PostgreSQL, Storage y Auth), organizada en carpetas independientes para frontend web, aplicacion movil, backend y documentacion.

## Goals / Non-Goals

**Goals:**
- Separar limpiamente el codigo en carpetas de responsabilidad unica: `/Frontend`, `/Movil`, `/Backend`, `/Doc` y `/Shared`.
- Conectar Supabase como backend unico para autenticacion del dueno, persistencia relacional y almacenamiento de fotografias en la nube.
- Portar y aplicar fielmente los tokens de diseno de "Gala Nocturna" y componentes de Impeccable a las aplicaciones Web y Movil.
- Disenar una estrategia de implementacion progresiva dividida en 4 fases ejecutables.

**Non-Goals:**
- Pasarelas de cobro complejas en linea para clientes finales (los pagos y senas se gestionan de forma directa y presencial/transferencia).
- Creacion de un backend NodeJS personalizado desde cero cuando Supabase cubre nativamente las necesidades de persistencia, seguridad (RLS) y storage.

## Architecture and Directory Structure

El repositorio se estructurara con las siguientes carpetas en la raiz:

```
/Eventos_Vero
  ├── /Frontend       # Aplicacion Web React + Vite + Tailwind (Web Publica + Panel Admin)
  ├── /Movil          # Aplicacion Movil para el dueno (React Native / Expo o PWA dedicada)
  ├── /Backend        # Configuracion Supabase (SQL migrations, schemas, RLS, storage policies, seeds)
  ├── /Doc            # Documentacion tecnica, manual de marca, diagramas de BD y guias de despliegue
  ├── /Shared         # Tipos TypeScript compartidos (@eventos-vero/types) y tokens de diseno
  ├── /openspec       # Especificaciones formales del proyecto (OpenSpec SDD)
  ├── AGENTS.md       # Reglas del workspace para agentes
  └── GEMINI.md       # Reglas del workspace para Gemini CLI
```

## Decisions

### 1. Backend: Supabase Gestionado
- **Decision**: Usar Supabase (PostgreSQL gestionado, GoTrue Auth, Supabase Storage y RLS).
- **Justificacion**: Elimina la necesidad de mantener servidores Express/Fastify redundantes. Ofrece SDK para Web y React Native con soporte de TypeScript inmediato.
- **Alternativas descartadas**: Firebase (bloqueo de proveedor y consultas relacionales deficientes), backend custom en Express (mayor costo de mantenimiento y tiempo de desarrollo).

### 2. Frontend Web: React + Vite + Tailwind CSS
- **Decision**: Mantener el stack del prototipo (`Vite`, `React 19`, `Tailwind CSS v4`).
- **Justificacion**: Permite reutilizar de forma directa los componentes visuales ya validados en el prototipo (`VvPrimitives`, `AdminLayout`, `PublicLayout`), reduciendo friccion.

### 3. Aplicacion Movil: React Native con Expo
- **Decision**: Expo (SDK 52+) con TypeScript y NativeWind/Tailwind.
- **Justificacion**: Facilita la publicacion multiplataforma (Android/iOS) y permite acceso directo a camara nativa para subir fotos en vivo desde los eventos a Supabase Storage con la navegacion por Bottom Tabs requerida por el dueno.
- **Alternativa**: PWA instalable. Se deja como alternativa si se prefiere un unico codebase web, pero Expo brinda mejor rendimiento de camara en campo.

### 4. Estructura de Fases de Desarrollo

- **Fase 1: Fundaciones y Backend (Supabase + Shared Types)**
  - Creacion del esquema SQL (tablas `categorias`, `eventos`, `fotos_evento`, `bitacora`, `cotizaciones`).
  - Politicas de seguridad RLS (lectura publica para catalogo, escritura restringida al rol admin).
  - Configuracion de buckets de Supabase Storage para fotos de eventos.
  - Creacion de paquete `/Shared` con contratos tipados.

- **Fase 2: Frontend Web Publico (Catalogo y Cotizaciones)**
  - Montaje de `/Frontend` consumiendo datos reales de Supabase.
  - Landing page con identidad Gala Nocturna.
  - Catalogo interactivo y filtros tematicos.
  - Modal generador de cotizaciones hacia WhatsApp.

- **Fase 3: Panel de Administracion Web (Escritorio Dueno)**
  - Autenticacion con Supabase Auth.
  - Gestion CRUD de eventos y calendario de montajes.
  - Modulo de curaduria y publicacion de fotos.
  - Registro de auditoria en bitacora.

- **Fase 4: Aplicacion Movil (Dueno en Campo)**
  - Inicializacion de `/Movil` con Expo.
  - Bottom Tab Bar (Agenda, Fotos en Vivo, Eventos, Bitacora rapida).
  - Integracion de camara del dispositivo para subida directa de fotos a Supabase Storage.

## Risks / Trade-offs

- [Consumo de cuota de almacenamiento en Supabase Storage] -> Compresion del lado del cliente (Web y Movil) a formato WEBP antes de emitir la peticion de carga.
- [Conectividad inestable en zonas de eventos/quintas] -> Cache local en la aplicacion movil para permitir registro de bitacora y encolar fotos cuando vuelva la red.
