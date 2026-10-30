import { VvButton, VvHeading, VvBadge, VvOrnamentDivider } from '../ui/VvPrimitives'
import type { VvPhoto } from '@eventos-vero/shared'

export function EventDetailModal({
  photo,
  onClose,
  onInquire,
}: {
  photo: VvPhoto | null
  onClose: () => void
  onInquire: (photoTitle: string) => void
}) {
  if (!photo) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md vv-animate-modal">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0E0E11] border border-[#D4AF37]/50 overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.3)]">
        {/* Imagen Pura Principal */}
        <div className="relative w-full h-80 sm:h-96 bg-black">
          <img
            src={photo.publicUrl}
            alt={photo.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-[#D4AF37]/50 text-[#F9F6F0] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#050505] transition-all"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4">
            <VvBadge variant="gold">{photo.categorySlug.toUpperCase()}</VvBadge>
          </div>
        </div>

        {/* Ficha Técnica y Acciones */}
        <div className="p-6 space-y-4">
          <div>
            <VvHeading level={2} variant="serif" metallic>
              {photo.title}
            </VvHeading>
            <p className="text-xs text-[#7D7568] mt-1">
              Registro del evento · Formato de Imagen Alta Fidelidad
            </p>
          </div>

          <p className="text-sm text-[#C4B9A5] leading-relaxed">
            {photo.description ||
              'Montaje de gala exclusiva con diseño floral de autor, iluminación cálida y mobiliario imperial desarrollado a medida por V.v Decoración.'}
          </p>

          <VvOrnamentDivider className="my-4" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#7D7568]">
              Consulte fecha y disponibilidad para este estilo
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <VvButton variant="ghost" size="sm" onClick={onClose} className="flex-1 sm:flex-none">
                Cerrar
              </VvButton>
              <VvButton
                variant="gold"
                size="md"
                onClick={() => {
                  onInquire(photo.title)
                  onClose()
                }}
                className="flex-1 sm:flex-none"
              >
                Cotizar este Estilo
              </VvButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
