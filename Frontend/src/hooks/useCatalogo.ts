import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { VvCategory, VvPhoto } from '@eventos-vero/shared'

export function useCatalogo() {
  const [categories, setCategories] = useState<VvCategory[]>([])
  const [photos, setPhotos] = useState<VvPhoto[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [catsRes, photosRes] = await Promise.all([
        supabase.from('categorias').select('*').order('orden', { ascending: true }),
        supabase.from('fotos_evento').select('*').eq('es_catalogo_publico', true).order('created_at', { ascending: false }),
      ])

      if (catsRes.data) {
        setCategories(
          catsRes.data.map((c) => ({
            id: c.id,
            name: c.nombre,
            slug: c.slug,
            description: c.descripcion || undefined,
            displayOrder: c.orden,
            createdAt: c.created_at,
          }))
        )
      }

      if (photosRes.data) {
        setPhotos(
          photosRes.data.map((p) => ({
            id: p.id,
            eventId: p.evento_id || undefined,
            title: p.titulo,
            description: p.descripcion || undefined,
            storagePath: p.storage_path,
            publicUrl: p.public_url,
            isCover: p.es_portada,
            isPublicCatalog: p.es_catalogo_publico,
            categorySlug: p.categoria_slug || '',
            createdAt: p.created_at,
          }))
        )
      }
    } catch {
      // Ignora errores transitorios de red
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const uploadPhoto = async (
    file: File,
    metadata: { title: string; description?: string; categorySlug: string; isCover?: boolean }
  ) => {
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const storagePath = `catalogo/${fileName}`

    // 1. Subir binario puro a Supabase Storage
    const { error: storageErr } = await supabase.storage
      .from('eventos-fotos')
      .upload(storagePath, file, { contentType: file.type, upsert: false })

    if (storageErr) throw storageErr

    // 2. Obtener URL pública
    const { data: urlData } = supabase.storage.from('eventos-fotos').getPublicUrl(storagePath)

    // 3. Insertar registro en fotos_evento
    const { error: dbErr } = await supabase.from('fotos_evento').insert({
      titulo: metadata.title,
      descripcion: metadata.description || null,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      categoria_slug: metadata.categorySlug,
      es_portada: metadata.isCover || false,
      es_catalogo_publico: true,
      peso_bytes: file.size,
    })

    if (dbErr) throw dbErr
    await loadData()
  }

  return { categories, photos, loading, reloadCatalogo: loadData, uploadPhoto }
}
