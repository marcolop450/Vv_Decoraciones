import React, { useMemo, useState } from 'react'
import { PublicLayout } from '../components/layout/PublicLayout'
import { VvInlineInput } from '../components/ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
  VvOrnamentDivider,
} from '../components/ui/VvPrimitives'
import { useVvApp } from '../context/VvAppContext'

export function CatalogoPage() {
  const {
    state,
    openWhatsAppQuote,
    getCategoryName,
    isMobileView,
  } = useVvApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredPhotos = useMemo(() => {
    return state.photos.filter((photo) => {
      const matchesCategory =
        selectedCategory === 'all' || photo.categoryId === selectedCategory
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        photo.name.toLowerCase().includes(q) ||
        photo.description.toLowerCase().includes(q) ||
        getCategoryName(photo.categoryId).toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [state.photos, selectedCategory, searchQuery, getCategoryName])

  return (
    <PublicLayout>
      <section
        className={`max-w-7xl mx-auto ${
          isMobileView ? 'px-5 py-8 space-y-6' : 'px-4 sm:px-6 lg:px-8 py-12 space-y-9'
        }`}
      >
        {/* Encabezado del Catálogo */}
        <div className="space-y-2.5">
          <VvBadge variant="gold">Catálogo Oficial · /catalogo</VvBadge>
          <VvHeading level={1} variant="serif" metallic>
            Catálogo Completo de Decoraciones y Eventos
          </VvHeading>
          <p className="text-sm sm:text-base vv-text-secondary max-w-2xl">
            Filtra por categoría o busca el estilo que imaginas. Al pulsar{' '}
            <strong className="vv-text-gold-light">&ldquo;Cotizar por WhatsApp&rdquo;</strong>{' '}
            podrás elegir la fecha de tu evento o enviar una consulta rápida.
          </p>
        </div>

        {/* BARRA DE FILTROS SUPERIOR: Buscador + Chips de Categoría */}
        <VvCard variant="surface" className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <VvInlineInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar decoración por nombre, estilo o detalle (ej. altar, XV años, velas, cotillón)..."
                className="w-full"
              />
            </div>
            {searchQuery && (
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => setSearchQuery('')}
              >
                Limpiar búsqueda
              </VvButton>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs vv-text-muted mr-1">Categorías:</span>
            <VvButton
              size="sm"
              variant={selectedCategory === 'all' ? 'gold' : 'subtle'}
              onClick={() => setSelectedCategory('all')}
            >
              Todos ({state.photos.length})
            </VvButton>
            {state.categories.map((cat) => {
              const count = state.photos.filter(
                (p) => p.categoryId === cat.id
              ).length
              return (
                <VvButton
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? 'gold' : 'subtle'}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name} ({count})
                </VvButton>
              )
            })}
          </div>
        </VvCard>

        <VvOrnamentDivider
          label={`${filteredPhotos.length} Decoraciones Disponibles`}
        />

        {/* GRILLA COMPLETA DE DECORACIONES */}
        {filteredPhotos.length === 0 ? (
          <VvCard variant="surface" className="p-10 text-center space-y-3">
            <VvHeading level={3} variant="serif">
              No encontramos decoraciones con ese filtro
            </VvHeading>
            <p className="text-xs vv-text-secondary">
              Prueba seleccionando otra categoría o limpiando el texto de búsqueda.
            </p>
            <div>
              <VvButton
                size="sm"
                variant="gold"
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
              >
                Mostrar Todas las Decoraciones
              </VvButton>
            </div>
          </VvCard>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              isMobileView ? 'gap-6' : 'sm:grid-cols-2 lg:grid-cols-3 gap-7'
            }`}
          >
            {filteredPhotos.map((photo) => (
              <VvCard
                key={photo.id}
                variant="surface"
                className="overflow-hidden flex flex-col justify-between hover:vv-border-gold-strong"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <VvBadge variant="gold">
                        {getCategoryName(photo.categoryId)}
                      </VvBadge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <VvHeading level={3} variant="serif">
                      {photo.name}
                    </VvHeading>
                    <p className="text-xs sm:text-sm vv-text-secondary leading-relaxed">
                      {photo.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <VvButton
                    size="md"
                    variant="gold"
                    onClick={() => openWhatsAppQuote(photo)}
                    className="w-full"
                  >
                    Cotizar por WhatsApp
                  </VvButton>
                </div>
              </VvCard>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
