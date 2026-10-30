-- ==========================================================
-- 003_storage_setup.sql
-- Configuración del Bucket de Almacenamiento en Supabase Storage
-- ==========================================================

-- 1. Crear el bucket 'eventos-fotos' si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'eventos-fotos',
    'eventos-fotos',
    true,
    10485760, -- 10MB máximo
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- 2. Políticas de Seguridad para Storage Objects
-- Lectura pública para cualquier visitante
CREATE POLICY "storage_fotos_public_read" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'eventos-fotos');

-- Carga, edición y eliminación exclusiva para el dueño autenticado
CREATE POLICY "storage_fotos_auth_insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'eventos-fotos');

CREATE POLICY "storage_fotos_auth_update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'eventos-fotos');

CREATE POLICY "storage_fotos_auth_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'eventos-fotos');
