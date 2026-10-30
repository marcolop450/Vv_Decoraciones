import { VvButton, VvHeading, VvBadge, VvCard, VvOrnamentDivider } from '../../components/ui/VvPrimitives'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import { useCatalogo } from '../../hooks/useCatalogo'
import vvLogo from '../../assets/vv-logo.png'

export function LandingPage({
  onNavigate,
  onOpenQuote,
  onSelectPhoto,
}: {
  onNavigate: (path: string) => void
  onOpenQuote: () => void
  onSelectPhoto: (photo: any) => void
}) {
  const { config } = useConfiguracion()
  const { photos, categories } = useCatalogo()

  const featuredPhotos = photos.slice(0, 3)

  return (
    <div className="space-y-16 pb-16 vv-animate-page">
      {/* HERO SECTION GALA NOCTURNA */}
      <section className="relative overflow-hidden border-b border-[#D4AF37]/20 py-16 md:py-24 bg-gradient-to-b from-[#0E0E11] to-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <VvBadge variant="gold">Alta Decoración & Montajes</VvBadge>
                <VvBadge variant="info">Cotillón VIP de Gala</VvBadge>
              </div>

              <div className="font-['Great_Vibes'] text-3xl sm:text-4xl text-[#F3D37A]">
                {config.brandSubtitle}
              </div>

              <VvHeading level={1} variant="serif" metallic>
                {config.businessName}
              </VvHeading>

              <p className="text-[#C4B9A5] text-base sm:text-lg leading-relaxed max-w-2xl">
                Transformamos salones, quintas y recepciones en escenarios inolvidables. Especialistas en diseño floral de autor, iluminación arquitectónica, mobiliario imperial y sets exclusivos para Bodas, Quinceañeros y Eventos de Gala.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <VvButton size="lg" variant="gold" onClick={onOpenQuote}>
                  Cotizar mi Celebración
                </VvButton>
                <VvButton size="lg" variant="outline" onClick={() => onNavigate('/catalogo')}>
                  Explorar Catálogo Completo
                </VvButton>
              </div>
            </div>

            {/* Logo Emblemático con Resplandor Dorado */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-[#0E0E11] border border-[#D4AF37]/60 p-6 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)] vv-pulse-glow">
                <img
                  src={vvLogo}
                  alt={config.businessName}
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="font-['Great_Vibes'] text-2xl text-[#F3D37A]">
            Especialidades de Gala
          </div>
          <VvHeading level={2} variant="serif" metallic>
            Líneas de Diseño & Ambientación
          </VvHeading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <VvCard variant="elevated" className="space-y-3 border-t-2 border-t-[#D4AF37]">
            <span className="text-2xl font-['Cormorant_Garamond'] text-[#F3D37A]">01.</span>
            <h3 className="text-lg font-bold text-[#F9F6F0]">Bodas & Recepciones Imperiales</h3>
            <p className="text-xs text-[#C4B9A5] leading-relaxed">
              Altares florales, candelabros dorados, mesas presidenciales de honor y vajilla fina para celebraciones nupciales únicas.
            </p>
          </VvCard>

          <VvCard variant="elevated" className="space-y-3 border-t-2 border-t-[#D4AF37]">
            <span className="text-2xl font-['Cormorant_Garamond'] text-[#F3D37A]">02.</span>
            <h3 className="text-lg font-bold text-[#F9F6F0]">XV Años & Quinceañeros de Gala</h3>
            <p className="text-xs text-[#C4B9A5] leading-relaxed">
              Pasarelas iluminadas, arcos orgánicos, sillones tronos y fondos fotográficos inmersivos para la noche soñada.
            </p>
          </VvCard>

          <VvCard variant="elevated" className="space-y-3 border-t-2 border-t-[#D4AF37]">
            <span className="text-2xl font-['Cormorant_Garamond'] text-[#F3D37A]">03.</span>
            <h3 className="text-lg font-bold text-[#F9F6F0]">Cotillón VIP & Hora Loca Nocturna</h3>
            <p className="text-xs text-[#C4B9A5] leading-relaxed">
              Sets premium con accesorios temáticos lumínicos, antifaces venecianos y elementos de animación para cerrar con broche de oro.
            </p>
          </VvCard>
        </div>
      </section>

      {/* PORTAFOLIO SELECTO (IMÁGENES PURAS) */}
      {featuredPhotos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <VvBadge variant="gold">Galería Reciente</VvBadge>
              <VvHeading level={2} variant="serif" metallic className="mt-1">
                Nuestros Últimos Montajes
              </VvHeading>
            </div>
            <VvButton variant="outline" size="sm" onClick={() => onNavigate('/catalogo')}>
              Ver Más en Catálogo →
            </VvButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className="group relative h-80 rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#0E0E11] cursor-pointer vv-animate-card"
              >
                <img
                  src={photo.publicUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
                  <VvBadge variant="gold" className="w-fit mb-2">
                    {photo.categorySlug}
                  </VvBadge>
                  <h4 className="text-base font-bold text-[#F9F6F0]">{photo.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BANNER DE COTIZACIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-[#16161B] via-[#0E0E11] to-[#16161B] border border-[#D4AF37]/50 text-center space-y-6 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
          <div className="font-['Great_Vibes'] text-3xl text-[#F3D37A]">
            Haz realidad tu evento
          </div>
          <VvHeading level={2} variant="serif" metallic>
            ¿Planeas una boda, quinceañero o celebración corporativa?
          </VvHeading>
          <p className="text-sm text-[#C4B9A5] max-w-xl mx-auto">
            Cotiza en segundos a través de WhatsApp o déjanos un mensaje con la fecha y lugar de tu recepción.
          </p>
          <VvButton size="lg" variant="gold" onClick={onOpenQuote}>
            Contactar por WhatsApp Directo
          </VvButton>
        </div>
      </section>
    </div>
  )
}
