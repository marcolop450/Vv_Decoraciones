import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import {
  CategorySelectorWithInlineCreate,
  VvFilePicker,
  VvTextArea,
  VvTextInput,
} from '../../components/ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'
import { GALLERY_PRESET_IMAGES } from '../../data/vvInitialAppData'
import type { CatalogPhoto } from '../../types/vv-app'

export function AdminFotosPage() {
  const {
    state,
    addPhoto,
    updatePhoto,
    deletePhoto,
    getCategoryName,
    isMobileView,
    deviceMode,
  } = useVvApp()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<CatalogPhoto | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(
    state.categories[0]?.id || 'cat-bodas'
  )
  const [imageUrl, setImageUrl] = useState(GALLERY_PRESET_IMAGES[0].url)
  const [statusBanner, setStatusBanner] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingPhoto(null)
    setName('')
    setDescription('')
    setCategoryId(state.categories[0]?.id || 'cat-bodas')
    setImageUrl(GALLERY_PRESET_IMAGES[0].url)
    setModalOpen(true)
  }

  const openEditModal = (photo: CatalogPhoto) => {
    setEditingPhoto(photo)
    setName(photo.name)
    setDescription(photo.description)
    setCategoryId(photo.categoryId)
    setImageUrl(photo.imageUrl)
    setModalOpen(true)
  }

  const handleSavePhoto = () => {
    if (!name.trim() || !description.trim()) return

    if (editingPhoto) {
      updatePhoto(editingPhoto.id, {
        name: name.trim(),
        description: description.trim(),
        categoryId,
        imageUrl,
      })
      setStatusBanner(`Decoración "${name.trim()}" actualizada correctamente.`)
    } else {
      addPhoto({
        name: name.trim(),
        description: description.trim(),
        categoryId,
        imageUrl,
      })
      setStatusBanner(
        `Nueva decoración "${name.trim()}" publicada en el catálogo.`
      )
    }

    setModalOpen(false)
    setTimeout(() => setStatusBanner(null), 3000)
  }

  const handleDelete = (photo: CatalogPhoto) => {
    deletePhoto(photo.id)
    setStatusBanner(`Decoración "${photo.name}" eliminada del catálogo.`)
    setTimeout(() => setStatusBanner(null), 3000)
  }

  return (
    <AdminLayout
      title="Administrar Fotos del Catálogo"
      subtitle="Publica nuevas decoraciones, edita la galería que ven los clientes en /landing y /catalogo, o registra nuevas categorías al instante."
      headerActions={
        <VvButton size="md" variant="gold" onClick={openCreateModal}>
          + Registrar Nueva Foto
        </VvButton>
      }
    >
      {statusBanner && (
        <div className="p-3.5 rounded-xl vv-badge-success text-xs font-medium">
          {statusBanner}
        </div>
      )}

      {/* Grilla de Fotos Publicadas */}
      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-5' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}
      >
        {state.photos.map((photo) => (
          <VvCard
            key={photo.id}
            variant="surface"
            className="overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <VvBadge variant="gold">
                    {getCategoryName(photo.categoryId)}
                  </VvBadge>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <VvHeading level={4} variant="serif">
                  {photo.name}
                </VvHeading>
                <p className="text-xs vv-text-secondary leading-relaxed">
                  {photo.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-3 border-t vv-border-gold flex items-center justify-end gap-2">
              <VvButton
                size="sm"
                variant="outline"
                onClick={() => openEditModal(photo)}
              >
                Editar
              </VvButton>
              <VvButton
                size="sm"
                variant="danger"
                onClick={() => handleDelete(photo)}
              >
                Eliminar
              </VvButton>
            </div>
          </VvCard>
        ))}
      </div>

      {/* MODAL PARA REGISTRAR / EDITAR FOTO */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Registrar o Editar Foto del Catálogo"
          className={`${
            deviceMode === 'mobile' ? 'absolute' : 'fixed'
          } inset-0 z-50 flex items-center justify-center p-3 sm:p-4 vv-bg-glass overflow-y-auto`}
        >
          <VvCard
            variant="gold-highlight"
            className="w-full max-w-xl p-4 sm:p-6 space-y-4 my-auto vv-animate-modal"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <VvBadge variant="gold">Catálogo Público</VvBadge>
                <VvHeading level={3} variant="serif" className="mt-1">
                  {editingPhoto
                    ? 'Editar Foto del Catálogo'
                    : 'Registrar Nueva Foto'}
                </VvHeading>
              </div>
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                ✕ Cerrar
              </VvButton>
            </div>

            {/* Campo 1: Subir Imagen */}
            <div className="p-4 rounded-xl vv-bg-elevated border vv-border-gold space-y-3">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={imageUrl}
                  alt="Vista previa"
                  className="w-full sm:w-36 h-28 rounded-xl object-cover border vv-border-gold shrink-0"
                />
                <div className="space-y-2 flex-1 w-full">
                  <label className="block text-xs font-semibold uppercase tracking-wider vv-text-gold-light">
                    Subir Imagen (Archivo o Galería Rápida)
                  </label>
                  <VvFilePicker onImageLoaded={setImageUrl} />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {GALLERY_PRESET_IMAGES.map((preset, idx) => (
                      <VvButton
                        key={preset.label}
                        size="sm"
                        variant={imageUrl === preset.url ? 'gold' : 'subtle'}
                        onClick={() => setImageUrl(preset.url)}
                      >
                        Imagen #{idx + 1}
                      </VvButton>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Campo 2: Nombre */}
            <VvTextInput
              label="Nombre de la Decoración"
              required
              value={name}
              onChange={setName}
              placeholder="Ej. Altar Imperial & Mesa de Honor Dorada"
            />

            {/* Campo 3: Descripción */}
            <VvTextArea
              label="Descripción"
              required
              value={description}
              onChange={setDescription}
              placeholder="Describe los elementos principales (flores, iluminación, mobiliario, cotillón)..."
              rows={3}
            />

            {/* Campo 4: Selector de Categoría con botón '+ Nueva Categoría' integrado */}
            <CategorySelectorWithInlineCreate
              selectedCategoryId={categoryId}
              onSelectCategory={setCategoryId}
              label="Selector de Categoría"
            />

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t vv-border-gold">
              <VvButton
                size="md"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </VvButton>
              <VvButton
                size="md"
                variant="gold"
                onClick={handleSavePhoto}
                disabled={!name.trim() || !description.trim()}
                className="w-full sm:w-auto"
              >
                {editingPhoto ? 'Guardar Cambios' : 'Publicar Foto en Catálogo'}
              </VvButton>
            </div>
          </VvCard>
        </div>
      )}
    </AdminLayout>
  )
}
