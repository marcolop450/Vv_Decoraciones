import { VvButton } from '../ui/VvPrimitives'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import { buildWhatsAppLink } from '../../lib/utils'
import vvLogo from '../../assets/vv-logo.png'

export function PublicNavbar({
  currentPath,
  onNavigate,
  onOpenQuote,
}: {
  currentPath: string
  onNavigate: (path: string) => void
  onOpenQuote: () => void
}) {
  const { config } = useConfiguracion()
  const whatsappUrl = buildWhatsAppLink(
    config.whatsappPhone,
    'Hola V.v Decoraciones, deseo consultar sobre un evento.'
  )

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0E0E11] border border-[#D4AF37]/50 p-1 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] group-hover:border-[#F3D37A] transition-all">
            <img src={vvLogo} alt="Logo V.v" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="block font-['Great_Vibes'] text-xl text-[#F3D37A] leading-none">
              Decoración & Cotillón
            </span>
            <span className="block font-['Cormorant_Garamond'] text-lg font-bold text-[#F9F6F0] tracking-wide">
              V.v Eventos
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('/')}
            className={`text-sm font-medium transition-colors ${
              currentPath === '/' ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onNavigate('/catalogo')}
            className={`text-sm font-medium transition-colors ${
              currentPath === '/catalogo' ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
            }`}
          >
            Catálogo de Galas
          </button>
          <button
            onClick={() => onNavigate('/admin')}
            className={`text-sm font-medium transition-colors ${
              currentPath.startsWith('/admin') ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
            }`}
          >
            Acceso Dueño
          </button>
        </nav>

        {/* Call to Actions */}
        <div className="flex items-center gap-3">
          <VvButton size="sm" variant="gold" onClick={onOpenQuote}>
            Cotizar Evento
          </VvButton>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 text-xs font-semibold text-[#F3D37A] hover:bg-[#D4AF37]/10 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
