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

  const targetWhatsAppPhone = (state.config?.whatsappPhone || '59177885220').replace(/[^0-9]/g, '')

  const handleGeneralWhatsAppQuote = () => {
    const text = encodeURIComponent(
      'Hola V.v Decoración, deseo consultar disponibilidad y cotizar una decoración para mi evento.'
    )
    window.open(
      `https://wa.me/${targetWhatsAppPhone}?text=${text}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

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
          isMobileView ? 'px-5 py-8 space-y-6' : 'px-4 sm:px-6 lg:px-8 py-10 space-y-8'
        }`}
      >
        {/* Encabezado del Catálogo (Sin insignia innecesaria) */}
        <div className="space-y-2">
          <VvHeading level={1} variant="serif" metallic className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Catálogo Completo de Decoraciones y Eventos
          </VvHeading>
          <p className="text-sm sm:text-base vv-text-secondary max-w-2xl leading-relaxed">
            Filtra por categoría o busca el estilo que imaginas. Al pulsar{' '}
            <strong className="vv-text-gold-light">&ldquo;Cotizar por WhatsApp&rdquo;</strong>{' '}
            podrás elegir la fecha de tu evento o enviar una consulta rápida.
          </p>
        </div>

        {/* BARRA DE FILTROS: Buscador + Chips de Categoría */}
        <VvCard variant="surface" className="p-4 sm:p-5 space-y-4 border vv-border-gold">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <VvInlineInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar decoración por nombre, estilo o detalle (ej. altar, XV años, velas, cotillón)..."
                className="w-full text-sm"
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

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t vv-border-gold">
            <span className="text-xs vv-text-muted mr-1 font-medium">Categorías:</span>
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

        {state.photos.length > 0 && (
          <VvOrnamentDivider
            label={`${filteredPhotos.length} Decoraciones Disponibles`}
          />
        )}

        {/* ESTADO VACÍO 1: Si no hay fotos en la base de datos (Y si no hay BD?) */}
        {state.photos.length === 0 ? (
          <VvCard
            variant="surface"
            className="p-8 sm:p-14 text-center space-y-5 max-w-xl mx-auto border vv-border-gold"
          >
            <VvHeading level={3} variant="serif" className="text-xl sm:text-2xl">
              Catálogo en Preparación
            </VvHeading>
            <p className="text-xs sm:text-sm vv-text-secondary leading-relaxed max-w-md mx-auto">
              Actualmente se están preparando las fotografías de alta resolución para esta galería. Puedes consultar fechas y cotizar tu evento directamente a través de WhatsApp.
            </p>
            <div>
              <VvButton
                size="md"
                variant="gold"
                onClick={handleGeneralWhatsAppQuote}
                className="shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all"
              >
                Consultar al Dueño
              </VvButton>
            </div>
          </VvCard>
        ) : filteredPhotos.length === 0 ? (
          /* ESTADO VACÍO 2: Si hay fotos en la BD pero no coinciden con la búsqueda */
          <VvCard variant="surface" className="p-10 text-center space-y-3 border vv-border-gold max-w-lg mx-auto">
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
          /* GRILLA DE FOTOGRAFÍAS CON ANIMACIONES FLUIDAS */
          <div
            className={`grid grid-cols-1 ${
              isMobileView ? 'gap-6' : 'sm:grid-cols-2 lg:grid-cols-3 gap-7'
            }`}
          >
            {filteredPhotos.map((photo) => (
              <VvCard
                key={photo.id}
                variant="surface"
                className="overflow-hidden flex flex-col justify-between hover:border-[#d4af37]/70 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
                    className="w-full shadow-sm hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all"
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
