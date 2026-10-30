import React from 'react'
import vvLogo from '../../assets/vv-logo.png'
import { useVvApp } from '../../context/VvAppContext'
import { WhatsAppQuoteModal } from '../modals/WhatsAppQuoteModal'
import { VvButton, VvHeading } from '../ui/VvPrimitives'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { currentRoute, navigate, isMobileView } = useVvApp()

  return (
    <div className="min-h-screen vv-bg-base vv-text-primary flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 vv-bg-glass border-b vv-border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/landing')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate('/landing')
              }
            }}
            className="flex items-center gap-3 cursor-pointer select-none min-w-0"
          >
            <img
              src={vvLogo}
              alt="Logo V.v Decoración de eventos y cotillón"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain border vv-border-gold-strong vv-bg-base p-0.5 shrink-0"
            />
            <div className="min-w-0">
              <div className="vv-font-serif font-bold text-base sm:text-xl vv-text-gold-metallic truncate">
                V.v Decoración de Eventos
              </div>
              {!isMobileView && (
                <div className="text-xs vv-text-secondary truncate">
                  Alta Decoración, Montajes de Gala y Cotillón VIP
                </div>
              )}
            </div>
          </div>

          <nav
            aria-label="Navegación Principal"
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            {currentRoute !== '/landing' && (
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => navigate('/landing')}
              >
                Inicio
              </VvButton>
            )}
            <VvButton
              size={isMobileView ? 'sm' : 'md'}
              variant={currentRoute === '/catalogo' ? 'outline' : 'gold'}
              onClick={() => navigate('/catalogo')}
            >
              Ver Decoraciones
            </VvButton>
            <VvButton
              size="sm"
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-xs opacity-80 hover:opacity-100"
              title="Acceso privado para el propietario"
            >
              Acceso Dueño
            </VvButton>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 vv-animate-page">
        {children}
      </main>

      {/* Footer */}
      <footer className="vv-bg-surface border-t vv-border-gold mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <img
              src={vvLogo}
              alt="Logo V.v"
              className="w-8 h-8 rounded-lg object-contain border vv-border-gold shrink-0"
            />
            <div>
              <VvHeading level={4} variant="serif" metallic>
                V.v Decoración de Eventos y Cotillón
              </VvHeading>
              <p className="text-xs vv-text-muted">
                Atención personalizada · Cotizaciones directas vía WhatsApp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <VvButton
              size="sm"
              variant="subtle"
              onClick={() => navigate('/catalogo')}
            >
              Catálogo
            </VvButton>
            <VvButton
              size="sm"
              variant="ghost"
              onClick={() => navigate('/login')}
            >
              Acceso Dueño
            </VvButton>
          </div>
        </div>
      </footer>

      <WhatsAppQuoteModal />
    </div>
  )
}
