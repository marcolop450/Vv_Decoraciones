import React, { useState } from 'react'
import { useVvApp } from '../../context/VvAppContext'
import { GALLERY_PRESET_IMAGES } from '../../data/vvInitialAppData'
import type { EventRecord } from '../../types/vv-app'
import {
  CategorySelectorWithInlineCreate,
  VvFilePicker,
  VvTextArea,
  VvTextInput,
} from '../ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../ui/VvPrimitives'

export function PublishEventPhotoModal({
  event,
  onClose,
  onPublished,
}: {
  event: EventRecord
  onClose: () => void
  onPublished: () => void
}) {
  const { addPhoto } = useVvApp()
  const [photoName, setPhotoName] = useState(event.name)
  const [description, setDescription] = useState(
    `Decoración realizada en ${event.venue} para nuestro cliente ${event.clientName}. Montaje completo con iluminación cálida y detalles en dorado imperial.`
  )
  const [categoryId, setCategoryId] = useState(event.categoryId)
  const [imageUrl, setImageUrl] = useState(GALLERY_PRESET_IMAGES[0].url)

  const handlePublish = () => {
    if (!photoName.trim()) return
    addPhoto({
      name: photoName.trim(),
      description: description.trim(),
      imageUrl,
      categoryId,
      sourceEventId: event.id,
    })
    onPublished()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Registrar Foto del Evento Completado"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 vv-bg-glass overflow-y-auto"
    >
      <VvCard
        variant="gold-highlight"
        className="w-full max-w-xl p-4 sm:p-6 space-y-4 my-auto vv-animate-modal"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <VvBadge variant="success">Evento Completado ✓</VvBadge>
              <VvBadge variant="gold">Conexión con Catálogo de Fotos</VvBadge>
            </div>
            <VvHeading level={3} variant="serif" className="mt-1.5">
              Registrar Foto del Evento en el Catálogo Público
            </VvHeading>
            <p className="text-xs vv-text-secondary mt-0.5">
              Publica el resultado de este evento directamente en{' '}
              <span className="vv-font-mono vv-text-gold-light">/admin/fotos</span> y{' '}
              <span className="vv-font-mono vv-text-gold-light">/catalogo</span> con su
              categoría ya preseleccionada.
            </p>
          </div>
          <VvButton size="sm" variant="ghost" onClick={onClose}>
            ✕ Omitir
          </VvButton>
        </div>

        <div className="space-y-4 pt-1">
          <VvTextInput
            label="Título de la Decoración para el Catálogo"
            required
            value={photoName}
            onChange={setPhotoName}
            placeholder="Ej. Boda Imperial Noche de Oro"
          />

          <VvTextArea
            label="Descripción o Ficha del Montaje"
            required
            rows={3}
            value={description}
            onChange={setDescription}
            placeholder="Detalles de candelabros, flores, vajilla y mantelería..."
          />

          <CategorySelectorWithInlineCreate
            label="Categoría en el Catálogo"
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
          />

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider vv-text-secondary">
              Seleccionar Fotografía Real del Montaje
            </span>
            <div className="p-3 rounded-xl vv-bg-elevated border vv-border-gold space-y-3">
              <VvFilePicker onImageLoaded={(dataUrl) => setImageUrl(dataUrl)} />
              <div className="text-xs vv-text-muted">
                O selecciona de la galería de muestra de alta fidelidad:
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {GALLERY_PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      imageUrl === img.url
                        ? 'vv-border-gold-strong scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl vv-bg-surface border vv-border-gold flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden border vv-border-gold shrink-0">
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-semibold vv-text-primary block">
                Vista previa del resultado:
              </span>
              <span className="vv-text-secondary block">
                {photoName || 'Sin título'}
              </span>
              <span className="vv-text-muted block text-[11px]">
                Quedará visible de inmediato en /catalogo
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t vv-border-gold">
          <VvButton size="md" variant="ghost" onClick={onClose}>
            No publicar ahora
          </VvButton>
          <VvButton size="md" variant="gold" onClick={handlePublish}>
            Publicar Foto en el Catálogo
          </VvButton>
        </div>
      </VvCard>
    </div>
  )
}
