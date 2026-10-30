-- ==========================================================
-- 002_rls_policies.sql
-- Políticas de Seguridad de Nivel de Fila (RLS) en Supabase
-- ==========================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE configuracion_negocio ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_evento ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitacora ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para configuracion_negocio
-- Lectura pública para inyectar WhatsApp y teléfonos en la web
CREATE POLICY "config_lectura_publica" ON configuracion_negocio
    FOR SELECT TO anon, authenticated USING (true);

-- Modificación solo para el dueño autenticado
CREATE POLICY "config_modificacion_dueno" ON configuracion_negocio
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Políticas para categorias
CREATE POLICY "categorias_lectura_publica" ON categorias
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "categorias_crud_dueno" ON categorias
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Políticas para fotos_evento
-- El público puede ver solo fotos marcadas como catálogo público
CREATE POLICY "fotos_lectura_publica" ON fotos_evento
    FOR SELECT TO anon, authenticated USING (es_catalogo_publico = true);

-- El dueño puede ver y gestionar todas las fotos
CREATE POLICY "fotos_crud_dueno" ON fotos_evento
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Políticas para eventos (privado del dueño)
CREATE POLICY "eventos_crud_dueno" ON eventos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Políticas para bitacora (privado del dueño)
CREATE POLICY "bitacora_crud_dueno" ON bitacora
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Políticas para cotizaciones
-- Visitantes públicos pueden enviar su cotización
CREATE POLICY "cotizaciones_crear_publico" ON cotizaciones
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Solo el dueño puede leer o modificar solicitudes de cotización
CREATE POLICY "cotizaciones_gestion_dueno" ON cotizaciones
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
