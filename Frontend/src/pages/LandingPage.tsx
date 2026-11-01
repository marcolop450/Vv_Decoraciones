import React, { useMemo, useState } from 'react'
import { PublicLayout } from '../components/layout/PublicLayout'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
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

  return (
    <PublicLayout>
      {/* HERO SECTION PRINCIPAL - GALA NOCTURNA LIMPIA Y CENTRADA */}
      <section className="relative overflow-hidden border-b vv-border-gold py-14 sm:py-20 md:py-28">
        {/* Resplandor ambiental dorado suave de fondo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(212, 175, 55, 0.18) 0%, rgba(5, 5, 5, 0) 75%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <div className="vv-font-script text-3xl sm:text-5xl md:text-6xl vv-text-gold-light tracking-wide">
              {state.config?.brandSubtitle ||
                'Gala Nocturna: Bodas, Quinceañeros, Cumpleaños y Eventos Corporativos'}
            </div>

            <VvHeading
              level={1}
              variant="serif"
              metallic
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              {state.config?.businessName ||
                'V.v Decoración de eventos y cotillón'}
            </VvHeading>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2 max-w-md sm:max-w-none mx-auto">
            <VvButton
              size="lg"
              variant="gold"
              onClick={() => navigate('/catalogo')}
              className="w-full sm:w-auto shadow-lg hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all duration-300"
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
                  handleGeneralWhatsAppQuote()
                }
              }}
              className="w-full sm:w-auto hover:vv-bg-gold-surface transition-all duration-300"
            >
              Cotizar Evento por WhatsApp
            </VvButton>
          </div>
        </div>
      </section>

      {/* SECCIÓN MUESTRA DE DECORACIONES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center space-y-2">
          <VvHeading
            level={2}
            variant="serif"
            className="text-2xl sm:text-4xl font-bold"
          >
            Muestra de Decoraciones
          </VvHeading>
          {state.photos.length > 3 && (
            <div className="pt-1">
              <VvButton
                size="sm"
                variant="subtle"
                onClick={() => setShuffleSeed((s) => s + 1)}
              >
                ↻ Mostrar otra selección aleatoria
              </VvButton>
            </div>
          )}
        </div>

        {randomThreePhotos.length === 0 ? (
          <VvCard
            variant="surface"
            className="p-8 sm:p-14 text-center space-y-5 max-w-xl mx-auto border vv-border-gold"
          >
            <VvHeading
              level={3}
              variant="serif"
              className="text-xl sm:text-2xl"
            >
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
                Cotizar por WhatsApp
              </VvButton>
            </div>
          </VvCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {randomThreePhotos.map((photo) => (
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

        {state.photos.length > 0 && (
          <div className="pt-4 flex flex-col items-center justify-center text-center">
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
