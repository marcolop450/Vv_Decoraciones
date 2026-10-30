import { VvButton, VvHeading, VvBadge, VvOrnamentDivider } from '../ui/VvPrimitives'
import { VvModal } from '../ui/VvModal'
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
    <VvModal
      isOpen={!!photo}
      onClose={onClose}
      title={photo.title}
      subtitle={`Registro fotográfico oficial · Categoría ${photo.categorySlug.toUpperCase()}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Imagen Pura de Alta Definición */}
        <div className="relative w-full h-56 sm:h-80 rounded-xl overflow-hidden bg-black border border-[#D4AF37]/30">
          <img
            src={photo.publicUrl}
            alt={photo.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-3 left-3">
            <VvBadge variant="gold">{photo.categorySlug.toUpperCase()}</VvBadge>
          </div>
        </div>

        {/* Ficha Técnica y Descripción */}
        <div className="space-y-3">
          <p className="text-sm text-[#C4B9A5] leading-relaxed">
            {photo.description ||
              'Montaje de gala exclusiva con diseño floral de autor, iluminación cálida y mobiliario imperial desarrollado a medida por V.v Decoración.'}
          </p>

          <VvOrnamentDivider className="my-3" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <span className="text-xs text-[#C4B9A5]">
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
    </VvModal>
  )
}
