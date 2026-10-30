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

  // Selecciona de forma aleatoria 3 fotos registradas en el sistema
  const randomThreePhotos = useMemo(() => {
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
      {/* HERO SECTION PRINCIPAL */}
      <section className="relative overflow-hidden border-b vv-border-gold">
        {isMobileView ? (
          <div className="px-4 py-6 text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-2xl vv-bg-surface border vv-border-gold-strong p-2 vv-shadow-glow">
              <img
                src={vvLogo}
                alt="Logo V.v"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <div className="vv-font-script text-2xl vv-text-gold-light">
                Decoración de eventos y cotillón
              </div>
              <VvHeading level={2} variant="serif" metallic>
                V.v Decoración de Eventos
              </VvHeading>
              <p className="text-xs vv-text-secondary leading-relaxed">
                Ambientes de gala para Bodas, Quinceañeros, Cumpleaños y Eventos
                Corporativos.
              </p>
            </div>
            <VvButton
              size="md"
              variant="gold"
              onClick={() => navigate('/catalogo')}
              className="w-full"
            >
              Ver Catálogo de Decoraciones
            </VvButton>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <VvBadge variant="gold">Diseño & Organización Integral</VvBadge>
                  <VvBadge variant="info">
                    {state.photos.length} Decoraciones en Catálogo
                  </VvBadge>
                </div>

                <div className="vv-font-script text-3xl sm:text-4xl vv-text-gold-light">
                  Decoración de eventos y cotillón
                </div>

                <VvHeading level={1} variant="serif" metallic>
                  V.v Decoración y Organización de Eventos
                </VvHeading>

                <p className="vv-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl">
                  Transformamos salones, jardines y recepciones en escenarios de gala
                  inolvidables. Especialistas en montaje floral de lujo, iluminación
                  arquitectónica cálida, mobiliario imperial y sets de cotillón
                  personalizados para{' '}
                  <strong className="vv-text-primary">
                    Bodas, Quinceañeros, Cumpleaños y Galas Corporativas
                  </strong>
                  .
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <VvButton
                    size="lg"
                    variant="gold"
                    onClick={() => navigate('/catalogo')}
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
                  >
                    Cotizar Evento por WhatsApp
                  </VvButton>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-5 border-t vv-border-gold max-w-lg">
                  <div>
                    <div className="vv-font-serif text-2xl font-bold vv-text-gold-light">
                      100%
                    </div>
                    <div className="text-xs vv-text-muted">Montajes a Medida</div>
                  </div>
                  <div>
                    <div className="vv-font-serif text-2xl font-bold vv-text-gold-light">
                      {state.categories.length} Líneas
                    </div>
                    <div className="text-xs vv-text-muted">Categorías de Gala</div>
                  </div>
                  <div>
                    <div className="vv-font-serif text-2xl font-bold vv-text-gold-light">
                      Directo
                    </div>
                    <div className="text-xs vv-text-muted">Atención por WhatsApp</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <VvCard
                  variant="gold-highlight"
                  className="p-6 w-full max-w-md space-y-4"
                >
                  <div className="aspect-square rounded-2xl vv-bg-base border vv-border-gold-strong p-5 flex items-center justify-center">
                    <img
                      src={vvLogo}
                      alt="Emblema V.v Decoración de eventos y cotillón"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="vv-font-serif text-lg font-semibold vv-text-gold-light">
                      Sello de Excelencia en Cada Detalle
                    </div>
                    <p className="text-xs vv-text-secondary">
                      Selecciona tu decoración favorita y consulta disponibilidad de fecha al
                      instante.
                    </p>
                  </div>
                </VvCard>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN "MUESTRA ALEATORIA DE DECORACIONES" (3 FOTOS REGISTRADAS) */}
      <section
        className={`max-w-7xl mx-auto ${
          isMobileView ? 'px-4 py-6 space-y-5' : 'px-4 sm:px-6 lg:px-8 py-16 space-y-9'
        }`}
      >
        <div
          className={`flex flex-col ${
            isMobileView ? 'items-start' : 'sm:flex-row sm:items-end'
          } justify-between gap-4`}
        >
          <div>
            <VvBadge variant="gold">Selección Destacada del Catálogo</VvBadge>
            <VvHeading level={2} variant="serif" className="mt-2">
              Muestra Aleatoria de Decoraciones
            </VvHeading>
            <p className="text-sm vv-text-secondary mt-1">
              Descubre 3 de nuestras ambientaciones registradas y solicita tu cotización
              directa por WhatsApp.
            </p>
          </div>

          <VvButton
            size="sm"
            variant="subtle"
            onClick={() => setShuffleSeed((s) => s + 1)}
          >
            ↻ Mostrar otra selección aleatoria
          </VvButton>
        </div>

        <VvOrnamentDivider label="3 Ambientes Registrados" />

        {/* Grilla de 3 columnas en Desktop y vertical en Móvil */}
        <div
          className={`grid grid-cols-1 ${
            isMobileView ? 'gap-6' : 'md:grid-cols-3 gap-7'
          }`}
        >
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

        {/* Botón final hacia /catalogo */}
        <div className="pt-5 flex flex-col items-center justify-center text-center space-y-3.5">
          <p className="text-xs vv-text-muted">
            Mostrando 3 de {state.photos.length} decoraciones disponibles en nuestro
            portafolio oficial
          </p>
          <VvButton
            size="lg"
            variant="outline"
            onClick={() => navigate('/catalogo')}
            className={isMobileView ? 'w-full' : ''}
          >
            Ver todas las decoraciones →
          </VvButton>
        </div>
      </section>
    </PublicLayout>
  )
}
