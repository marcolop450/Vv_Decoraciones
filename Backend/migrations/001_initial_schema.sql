-- ==========================================================
-- 001_initial_schema.sql
-- Base de Datos Relacional: Eventos Vero (V.v Decoración)
-- ==========================================================

-- Extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Configuración de Negocio (Parametrizable por Dueño)
CREATE TABLE IF NOT EXISTS configuracion_negocio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_comercial VARCHAR(150) NOT NULL DEFAULT 'V.v Decoración de eventos y cotillón',
    subtitulo VARCHAR(255) DEFAULT 'Gala Nocturna: Bodas, Quinceañeros y Eventos Corporativos',
    telefono_whatsapp VARCHAR(30) NOT NULL DEFAULT '59170000000',
    telefono_llamadas VARCHAR(30) NOT NULL DEFAULT '59170000000',
    instagram_url VARCHAR(255) DEFAULT 'https://instagram.com',
    facebook_url VARCHAR(255) DEFAULT 'https://facebook.com',
    tiktok_url VARCHAR(255) DEFAULT 'https://tiktok.com',
    direccion_taller TEXT DEFAULT 'Zona Central, La Paz - Bolivia',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categorías de Eventos y Decoración
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    orden INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Eventos y Montajes
CREATE TABLE IF NOT EXISTS eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(200) NOT NULL,
    cliente_nombre VARCHAR(150) NOT NULL,
    cliente_telefono VARCHAR(50) NOT NULL,
    categoria_slug VARCHAR(100) REFERENCES categorias(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    fecha_evento DATE NOT NULL,
    hora_evento TIME,
    ubicacion TEXT NOT NULL,
    total_bs NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    adelanto_bs NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(30) NOT NULL DEFAULT 'cotizacion' CHECK (estado IN ('cotizacion', 'confirmado', 'en_montaje', 'finalizado', 'cancelado')),
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Fotografías de Decoración (Imágenes Puras en Storage)
CREATE TABLE IF NOT EXISTS fotos_evento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID REFERENCES eventos(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    es_portada BOOLEAN DEFAULT FALSE,
    es_catalogo_publico BOOLEAN DEFAULT TRUE,
    categoria_slug VARCHAR(100) REFERENCES categorias(slug) ON UPDATE CASCADE ON DELETE SET NULL,
    ancho INT,
    alto INT,
    peso_bytes INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bitácora de Auditoría Operativa
CREATE TABLE IF NOT EXISTS bitacora (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('crear', 'editar', 'eliminar', 'login', 'error', 'estado')),
    titulo VARCHAR(200) NOT NULL,
    detalle TEXT NOT NULL,
    usuario_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Solicitudes de Cotización
CREATE TABLE IF NOT EXISTS cotizaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_nombre VARCHAR(150) NOT NULL,
    cliente_telefono VARCHAR(50),
    tipo_evento VARCHAR(100) NOT NULL,
    fecha_evento DATE,
    cantidad_invitados INT DEFAULT 50,
    presupuesto_estimado_bs NUMERIC(12, 2) DEFAULT 0.00,
    notas TEXT,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'contactado', 'descartado')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de consulta frecuente
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON eventos(estado);
CREATE INDEX IF NOT EXISTS idx_fotos_catalogo ON fotos_evento(es_catalogo_publico, categoria_slug);
CREATE INDEX IF NOT EXISTS idx_bitacora_fecha ON bitacora(created_at DESC);
