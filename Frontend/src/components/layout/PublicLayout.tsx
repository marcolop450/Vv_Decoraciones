import React from 'react'
import vvLogo from '../../assets/vv-logo.png'
import { useVvApp } from '../../context/VvAppContext'
import { WhatsAppQuoteModal } from '../modals/WhatsAppQuoteModal'
import { VvButton, VvHeading } from '../ui/VvPrimitives'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { currentRoute, navigate, isMobileView, state } = useVvApp()

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
          </div>
        </div>
      </footer>

      {/* Botón Flotante Persistente de WhatsApp en Móvil */}
      <aside aria-label="Contacto directo por WhatsApp" className="md:hidden fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${state.config?.whatsappPhone || '59177885220'}?text=${encodeURIComponent('Hola V.v Decoración, deseo consultar información sobre sus servicios de decoración de eventos.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl border-2 border-amber-400/70 active:scale-95 transition-transform"
          aria-label="Contactar por WhatsApp"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </a>
      </aside>

      <WhatsAppQuoteModal />
    </div>
  )
}
