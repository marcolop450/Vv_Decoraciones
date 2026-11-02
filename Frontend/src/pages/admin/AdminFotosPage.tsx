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
  } = useVvApp()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<CatalogPhoto | null>(null)
  const [detailPhoto, setDetailPhoto] = useState<CatalogPhoto | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(
    state.categories[0]?.id || ''
  )
  const [imageUrl, setImageUrl] = useState(GALLERY_PRESET_IMAGES[0].url)
  const [statusBanner, setStatusBanner] = useState<string | null>(null)

  const filteredPhotos = state.photos.filter((p) => {
    if (selectedCategory === 'all') return true
    return p.categoryId === selectedCategory
  })

  const openCreateModal = () => {
    setEditingPhoto(null)
    setName('')
    setDescription('')
    setCategoryId(state.categories[0]?.id || '')
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
      if (detailPhoto && detailPhoto.id === editingPhoto.id) {
        setDetailPhoto({
          ...detailPhoto,
          name: name.trim(),
          description: description.trim(),
          categoryId,
          imageUrl,
        })
      }
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
    if (detailPhoto && detailPhoto.id === photo.id) {
      setDetailPhoto(null)
    }
    setStatusBanner(`Decoración "${photo.name}" eliminada del catálogo.`)
    setTimeout(() => setStatusBanner(null), 3000)
  }

  return (
    <AdminLayout
      title="Administrar Fotos del Catálogo"
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

      {/* VISTA DE DETALLE EN PANTALLA COMPLETA */}
      {detailPhoto ? (
        <div className="space-y-5 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b vv-border-gold">
            <VvButton
              size="sm"
              variant="outline"
              onClick={() => setDetailPhoto(null)}
            >
              ← Volver a Fotos
            </VvButton>
            <div className="flex items-center gap-2">
              <VvButton
                size="sm"
                variant="outline"
                onClick={() => openEditModal(detailPhoto)}
              >
                Editar
              </VvButton>
              <VvButton
                size="sm"
                variant="danger"
                onClick={() => handleDelete(detailPhoto)}
              >
                Eliminar
              </VvButton>
            </div>
          </div>

          <VvCard variant="gold-highlight" className="p-5 sm:p-7 space-y-5">
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border vv-border-gold relative">
              <img
                src={detailPhoto.imageUrl}
                alt={detailPhoto.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <VvBadge variant="gold">
                  {getCategoryName(detailPhoto.categoryId)}
                </VvBadge>
              </div>
            </div>

            <div className="space-y-3">
              <VvHeading level={2} variant="serif" metallic className="text-2xl sm:text-3xl">
                {detailPhoto.name}
              </VvHeading>
              <p className="text-sm sm:text-base vv-text-secondary leading-relaxed whitespace-pre-line">
                {detailPhoto.description}
              </p>
            </div>
          </VvCard>
        </div>
      ) : (
        <div className="space-y-5">
          {/* BARRA DE ACCIÓN SUPERIOR: Filtro de Categorías y Botón Crear */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                    : 'vv-bg-surface border vv-border-gold vv-text-secondary hover:vv-text-primary'
                }`}
              >
                Todos ({state.photos.length})
              </button>
              {state.categories.map((cat) => {
                const count = state.photos.filter((p) => p.categoryId === cat.id).length
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                        : 'vv-bg-surface border vv-border-gold vv-text-secondary hover:vv-text-primary'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                )
              })}
            </div>

            <VvButton
              size="md"
              variant="gold"
              onClick={openCreateModal}
              className="w-full sm:w-auto shrink-0 shadow-sm"
            >
              + Subir Nueva Foto
            </VvButton>
          </div>

          {/* Grilla de Fotos Publicadas o Estado Vacío */}
          {state.photos.length === 0 ? (
            <VvCard
              variant="surface"
              className="p-10 sm:p-14 text-center space-y-4 max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl vv-bg-elevated border vv-border-gold flex items-center justify-center mx-auto text-amber-400">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="8.5" cy="9.5" r="1.5" />
                  <path d="M21 15l-5-5L5 20" />
                </svg>
              </div>
              <VvHeading level={3} variant="serif">
                Aún no hay fotos en el catálogo
              </VvHeading>
              <p className="text-xs sm:text-sm vv-text-secondary leading-relaxed">
                Registra tu primera fotografía para mostrarla en la página principal y
                en el catálogo público de clientes.
              </p>
              <div>
                <VvButton size="md" variant="gold" onClick={openCreateModal}>
                  + Registrar Primera Foto
                </VvButton>
              </div>
            </VvCard>
          ) : filteredPhotos.length === 0 ? (
            <div className="p-8 rounded-2xl vv-bg-surface border vv-border-gold text-center space-y-2">
              <p className="text-xs vv-text-secondary">
                No hay fotografías en esta categoría.
              </p>
              <VvButton
                size="sm"
                variant="outline"
                onClick={() => setSelectedCategory('all')}
              >
                Ver Todas las Fotos
              </VvButton>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 ${
                isMobileView ? 'gap-5' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6'
              }`}
            >
              {filteredPhotos.map((photo) => (
                <VvCard
                  key={photo.id}
                  variant="surface"
                  className="overflow-hidden flex flex-col justify-between hover:border-[#D4AF37] transition-all cursor-pointer group"
                >
                  <div onClick={() => setDetailPhoto(photo)}>
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt={photo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                      <p className="text-xs vv-text-secondary leading-relaxed line-clamp-2">
                        {photo.description}
                      </p>
                      <span className="text-xs vv-text-gold-light underline inline-block pt-1">
                        Ver Detalles →
                      </span>
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
          )}
        </div>
      )}

      {/* MODAL PARA REGISTRAR / EDITAR FOTO */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Registrar o Editar Foto del Catálogo"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 vv-bg-glass overflow-y-auto"
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
