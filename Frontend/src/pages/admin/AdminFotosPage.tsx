import React, { useState } from 'react'
import { VvButton, VvHeading, VvBadge, VvCard } from '../../components/ui/VvPrimitives'
import { VvTextInput, VvTextArea, VvImageDropzone } from '../../components/ui/VvFormControls'
import { useCatalogo } from '../../hooks/useCatalogo'

export function AdminFotosPage() {
  const { categories, photos, loading, uploadPhoto } = useCatalogo()
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categorySlug, setCategorySlug] = useState('bodas')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Por favor selecciona una fotografía real para subir.')
      return
    }

    setIsUploading(true)
    try {
      await uploadPhoto(selectedFile, {
        title,
        description,
        categorySlug,
      })
      setShowUploadModal(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      setTitle('')
      setDescription('')
      alert('¡Fotografía de alta resolución subida y publicada con éxito!')
    } catch (err: any) {
      alert(`Error al subir la imagen a Supabase Storage: ${err.message || 'Error desconocido'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 vv-animate-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <VvHeading level={2} variant="serif" metallic>
            Curaduría de Fotografías & Catálogo
          </VvHeading>
          <p className="text-xs text-[#7D7568]">
            Sube imágenes puras de tus montajes directo a Supabase Storage.
          </p>
        </div>
        <VvButton variant="gold" size="md" onClick={() => setShowUploadModal(true)}>
          + Subir Fotografía al Catálogo
        </VvButton>
      </div>

      {/* Grid de Fotos Existentes */}
      {loading ? (
        <div className="text-center py-12 text-[#D4AF37] vv-shimmer">Cargando portafolio...</div>
      ) : photos.length === 0 ? (
        <VvCard variant="surface" className="text-center py-16 space-y-4">
          <p className="text-sm text-[#F9F6F0]">Aún no has subido fotografías al catálogo de Supabase.</p>
          <VvButton variant="gold" size="sm" onClick={() => setShowUploadModal(true)}>
            Subir la primera foto
          </VvButton>
        </VvCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#0E0E11] space-y-2 p-3"
            >
              <div className="h-44 rounded-lg overflow-hidden bg-black">
                <img src={p.publicUrl} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <VvBadge variant="gold" className="text-[10px]">
                  {p.categorySlug}
                </VvBadge>
                <h4 className="text-xs font-bold text-[#F9F6F0] truncate">{p.title}</h4>
                {p.description && (
                  <p className="text-[11px] text-[#7D7568] line-clamp-2">{p.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Subida de Imagen Pura */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm vv-animate-modal">
          <form
            onSubmit={handleUpload}
            className="w-full max-w-lg rounded-2xl bg-[#0E0E11] border border-[#D4AF37]/60 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-3">
              <VvHeading level={3} variant="serif" metallic>
                Subir Fotografía Real (Imagen Pura)
              </VvHeading>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-[#C4B9A5] hover:text-[#F9F6F0]"
              >
                ✕
              </button>
            </div>

            <VvImageDropzone onFileSelect={handleFileSelect} previewUrl={previewUrl} />

            <VvTextInput
              label="Título del Montaje"
              placeholder="Ej: Mesa Presidencial Boda Gómez"
              value={title}
              onChange={setTitle}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C4B9A5]">
                Categoría del Evento
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#D4AF37]/40 text-[#F9F6F0] text-sm focus:outline-none focus:border-[#F3D37A]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <VvTextArea
              label="Descripción o Ficha del Montaje"
              placeholder="Candelabros dorados, flores orquídeas blancas, mantelería de terciopelo..."
              value={description}
              onChange={setDescription}
              rows={2}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-[#D4AF37]/20">
              <VvButton variant="ghost" size="sm" type="button" onClick={() => setShowUploadModal(false)}>
                Cancelar
              </VvButton>
              <VvButton variant="gold" size="md" type="submit" disabled={isUploading || !selectedFile}>
                {isUploading ? 'Subiendo a Storage...' : 'Publicar Fotografía'}
              </VvButton>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
