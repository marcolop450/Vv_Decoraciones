import React, { useMemo, useState } from 'react'
import vvLogo from '../assets/vv-logo.png'
import { PublicLayout } from '../components/layout/PublicLayout'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
  VvOrnamentDivider,
} from '../components/ui/VvPrimitives'
import { useVvApp } from '../context/VvAppContext'

export function LandingPage() {
  const {
    state,
    navigate,
    openWhatsAppQuote,
    getCategoryName,
    isMobileView,
  } = useVvApp()
  const [shuffleSeed, setShuffleSeed] = useState(0)

  // Selecciona de forma aleatoria hasta 3 fotos registradas en el sistema
  const randomThreePhotos = useMemo(() => {
    if (state.photos.length === 0) return []
    const list = [...state.photos]
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(
        Math.abs(Math.sin(shuffleSeed + i * 17.31) * 10000) % (i + 1)
      )
      const temp = list[i]
      list[i] = list[j]
      list[j] = temp
    }
    return list.slice(0, 3)
  }, [state.photos, shuffleSeed])

  return (
    <PublicLayout>
      {/* HERO SECTION PRINCIPAL - RESPONSIVO NATIVO */}
      <section className="relative overflow-hidden border-b vv-border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <VvBadge variant="gold">Alta Decoración & Montajes</VvBadge>
                <VvBadge variant="info">Cotillón VIP de Gala</VvBadge>
              </div>

              <div className="vv-font-script text-2xl sm:text-4xl vv-text-gold-light">
                {state.config?.brandSubtitle || 'Decoración de eventos y cotillón'}
              </div>

              <VvHeading level={1} variant="serif" metallic>
                {state.config?.businessName || 'V.v Decoración y Organización de Eventos'}
              </VvHeading>

              <p className="vv-text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transformamos salones, jardines y recepciones en escenarios de gala
                inolvidables. Especialistas en montaje floral de lujo, iluminación
                cálida, mobiliario imperial y cotillón personalizado para{' '}
                <strong className="vv-text-primary">
                  Bodas, Quinceañeros, Cumpleaños y Galas Corporativas
                </strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <VvButton
                  size="lg"
                  variant="gold"
                  onClick={() => navigate('/catalogo')}
                  className="w-full sm:w-auto"
                >
                  Explorar Catálogo de Decoraciones
                </VvButton>
                <VvButton
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    if (randomThreePhotos[0]) {
                      openWhatsAppQuote(randomThreePhotos[0])
                    } else {
                      navigate('/catalogo')
                    }
                  }}
                  className="w-full sm:w-auto"
                >
                  Cotizar Evento por WhatsApp
                </VvButton>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t vv-border-gold max-w-lg mx-auto lg:mx-0 text-center">
                <div>
                  <div className="vv-font-serif text-xl sm:text-2xl font-bold vv-text-gold-light">
                    100%
                  </div>
                  <div className="text-[11px] sm:text-xs vv-text-muted">Montajes a Medida</div>
                </div>
                <div>
                  <div className="vv-font-serif text-xl sm:text-2xl font-bold vv-text-gold-light">
                    {state.categories.length} Líneas
                  </div>
                  <div className="text-[11px] sm:text-xs vv-text-muted">Categorías de Gala</div>
                </div>
                <div>
                  <div className="vv-font-serif text-xl sm:text-2xl font-bold vv-text-gold-light">
                    Directo
                  </div>
                  <div className="text-[11px] sm:text-xs vv-text-muted">Atención por WhatsApp</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center">
              <VvCard
                variant="gold-highlight"
                className="p-5 sm:p-6 w-full max-w-md space-y-4"
              >
                <div className="aspect-square rounded-2xl vv-bg-base border vv-border-gold-strong p-4 sm:p-5 flex items-center justify-center">
                  <img
                    src={vvLogo}
                    alt="Emblema V.v Decoración de eventos y cotillón"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="text-center space-y-1">
                  <div className="vv-font-serif text-base sm:text-lg font-semibold vv-text-gold-light">
                    Sello de Excelencia en Cada Detalle
                  </div>
                  <p className="text-xs vv-text-secondary">
                    Selecciona tu decoración favorita y consulta disponibilidad de fecha al instante.
                  </p>
                </div>
              </VvCard>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN MUESTRA ALEATORIA DE DECORACIONES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 sm:space-y-9">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <VvBadge variant="gold">Selección Destacada del Catálogo</VvBadge>
            <VvHeading level={2} variant="serif" className="mt-2">
              Muestra de Decoraciones
            </VvHeading>
            <p className="text-sm vv-text-secondary mt-1">
              Ambientaciones de gala y solicitud de cotización directa por WhatsApp.
            </p>
          </div>

          {state.photos.length > 3 && (
            <VvButton
              size="sm"
              variant="subtle"
              onClick={() => setShuffleSeed((s) => s + 1)}
            >
              ↻ Mostrar otra selección aleatoria
            </VvButton>
          )}
        </div>

        <VvOrnamentDivider label="Ambientes de Gala" />

        {randomThreePhotos.length === 0 ? (
          <VvCard variant="surface" className="p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
            <VvHeading level={3} variant="serif">
              Catálogo en Preparación
            </VvHeading>
            <p className="text-xs sm:text-sm vv-text-secondary leading-relaxed">
              Actualmente se están preparando las fotografías de alta resolución para esta galería. Puedes consultar fechas y cotizar tu evento directamente a través de WhatsApp.
            </p>
            <VvButton
              size="md"
              variant="gold"
              onClick={() => navigate('/catalogo')}
            >
              Consultar al Dueño
            </VvButton>
          </VvCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {randomThreePhotos.map((photo) => (
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

        {state.photos.length > 0 && (
          <div className="pt-4 flex flex-col items-center justify-center text-center space-y-3">
            <VvButton
              size="lg"
              variant="outline"
              onClick={() => navigate('/catalogo')}
              className={isMobileView ? 'w-full' : ''}
            >
              Ver todas las decoraciones en el Catálogo →
            </VvButton>
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
