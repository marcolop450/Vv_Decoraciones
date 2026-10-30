import { useState } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const whatsappUrl = buildWhatsAppLink(
    config.whatsappPhone,
    'Hola V.v Decoraciones, deseo consultar sobre un evento.'
  )

  const handleNavClick = (path: string) => {
    onNavigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleNavClick('/')
          }}
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          <button
            onClick={() => handleNavClick('/')}
            className={`text-sm font-medium transition-colors ${
              currentPath === '/' ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick('/catalogo')}
            className={`text-sm font-medium transition-colors ${
              currentPath === '/catalogo' ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
            }`}
          >
            Catálogo de Galas
          </button>
          <button
            onClick={() => handleNavClick('/admin')}
            className={`text-sm font-medium transition-colors ${
              currentPath.startsWith('/admin') ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
            }`}
          >
            Acceso Dueño
          </button>
        </nav>

        {/* Call to Actions & Mobile Menu Toggle */}
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

          {/* Botón Hamburguesa Móvil (Área táctil >=44x44px) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-panel"
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[#D4AF37]/40 text-[#F3D37A] hover:bg-[#16161B] transition-colors"
          >
            {isMobileMenuOpen ? (
              <span className="text-xl font-bold leading-none select-none">✕</span>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Drawer / Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden bg-[#0E0E11] border-b border-[#D4AF37]/30 px-6 py-5 space-y-4 shadow-[0_15px_30px_rgba(0,0,0,0.8)] vv-animate-page"
        >
          <nav className="flex flex-col space-y-3" aria-label="Navegación móvil">
            <button
              onClick={() => handleNavClick('/')}
              className={`text-left py-2.5 text-base font-medium transition-colors border-b border-[#D4AF37]/10 ${
                currentPath === '/' ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('/catalogo')}
              className={`text-left py-2.5 text-base font-medium transition-colors border-b border-[#D4AF37]/10 ${
                currentPath === '/catalogo' ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
              }`}
            >
              Catálogo de Galas
            </button>
            <button
              onClick={() => handleNavClick('/admin')}
              className={`text-left py-2.5 text-base font-medium transition-colors border-b border-[#D4AF37]/10 ${
                currentPath.startsWith('/admin') ? 'text-[#D4AF37]' : 'text-[#C4B9A5] hover:text-[#F9F6F0]'
              }`}
            >
              Acceso Dueño
            </button>
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl border border-[#D4AF37]/50 text-center text-sm font-semibold text-[#F3D37A] hover:bg-[#D4AF37]/10 transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
