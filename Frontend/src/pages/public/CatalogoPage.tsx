import { useState, useMemo } from 'react'
import { VvHeading, VvBadge, VvButton } from '../../components/ui/VvPrimitives'
import { useCatalogo } from '../../hooks/useCatalogo'
import type { VvPhoto } from '@eventos-vero/shared'

export function CatalogoPage({
  onSelectPhoto,
  onOpenQuote,
}: {
  onSelectPhoto: (photo: VvPhoto) => void
  onOpenQuote: () => void
}) {
  const { categories, photos, loading } = useCatalogo()
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const matchCat =
        selectedCategory === 'todos' ||
        p.categorySlug.toLowerCase() === selectedCategory.toLowerCase()
      const matchSearch =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [photos, selectedCategory, searchTerm])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 vv-animate-page">
      {/* Cabecera */}
      <div className="text-center space-y-3">
        <VvBadge variant="gold">Portafolio Oficial</VvBadge>
        <VvHeading level={1} variant="serif" metallic>
          Catálogo de Decoraciones & Galas
        </VvHeading>
        <p className="text-sm text-[#C4B9A5] max-w-2xl mx-auto leading-relaxed">
          Explora los montajes realizados por nuestro equipo. Todas las fotografías corresponden a eventos reales decorados y organizados por V.v.
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
        {/* Chips de Categorías */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'todos'
                ? 'bg-[#D4AF37] text-[#050505] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'bg-[#0E0E11] text-[#C4B9A5] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
            }`}
          >
            Todos ({photos.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#D4AF37] text-[#050505] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : 'bg-[#0E0E11] text-[#C4B9A5] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Input de Búsqueda */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar por estilo o detalle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#0E0E11] border border-[#D4AF37]/30 text-xs text-[#F9F6F0] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Grid de Fotos Puras */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#D4AF37] vv-shimmer rounded-2xl">
          Cargando fotografías de alta resolución...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#0E0E11]/60 rounded-2xl border border-[#D4AF37]/20">
          <p className="text-base text-[#F9F6F0]">No se encontraron fotografías para esta selección.</p>
          <VvButton variant="outline" size="sm" onClick={() => setSelectedCategory('todos')}>
            Ver todas las categorías
          </VvButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-end">
                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                  {photo.categorySlug}
                </span>
                <h3 className="text-base font-bold text-[#F9F6F0] leading-snug">{photo.title}</h3>
                <span className="text-xs text-[#C4B9A5] mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[#F3D37A]">
                  Ver ficha y cotizar →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón Flotante para Cotizar */}
      <div className="text-center pt-8 border-t border-[#D4AF37]/20">
        <VvButton size="lg" variant="gold" onClick={onOpenQuote}>
          ¿Te gustó un estilo? Solicita tu Presupuesto
        </VvButton>
      </div>
    </div>
  )
}
