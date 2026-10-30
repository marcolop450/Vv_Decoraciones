-- ==========================================================
-- 001_seed_data.sql
-- Datos Semilla Iniciales para Eventos Vero
-- ==========================================================

-- Configuración comercial inicial
INSERT INTO configuracion_negocio (
    id,
    nombre_comercial,
    subtitulo,
    telefono_whatsapp,
    telefono_llamadas,
    instagram_url,
    facebook_url,
    tiktok_url,
    direccion_taller
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'V.v Decoración de eventos y cotillón',
    'Gala Nocturna: Bodas, Quinceañeros, Cumpleaños y Eventos Corporativos',
    '59170000000',
    '59170000000',
    'https://instagram.com/vvdecoraciones',
    'https://facebook.com/vvdecoraciones',
    'https://tiktok.com/@vvdecoraciones',
    'Zona Central, La Paz - Bolivia'
) ON CONFLICT (id) DO NOTHING;

-- Categorías iniciales
INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
('Bodas & Recepciones', 'bodas', 'Montajes de gala para bodas civiles y religiosas con arreglos florales y candelabros.', 1),
('XV Años & Quinceañeros', 'quinceaneros', 'Decoraciones temáticas juveniles de alta costura, mesas de honor y pasarelas.', 2),
('Cotillón VIP & Hora Loca', 'cotillon-vip', 'Sets premium de cotillón nocturno, antifaces venecianos y elementos lumínicos.', 3),
('Eventos Corporativos', 'corporativos', 'Ambientaciones sobrias y elegantes para aniversarios de empresas y cenas de gala.', 4),
('Cumpleaños & Fiestas Privadas', 'cumpleanos', 'Escenarios elegantes y personalizados para festejos de aniversarios y recepciones.', 5),
('Graduaciones & Proms', 'graduaciones', 'Celebraciones de egresados con ambientación de gala dorada y mesas imperiales.', 6)
ON CONFLICT (slug) DO NOTHING;
