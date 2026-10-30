import React, { useEffect, useRef } from 'react'
import vvLogo from '../../assets/vv-logo.png'
import { useVvApp } from '../../context/VvAppContext'
import { WhatsAppQuoteModal } from '../modals/WhatsAppQuoteModal'
import { VvBadge, VvButton, VvHeading } from '../ui/VvPrimitives'

function MobilePhoneIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  )
}

function DesktopMonitorIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const {
    currentRoute,
    navigate,
    deviceMode,
    isMobileView,
    toggleDeviceMode,
  } = useVvApp()
  const phoneScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (phoneScrollRef.current) {
      phoneScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentRoute])

  // VISTA MÓVIL DEDICADA (APARTE DE LA WEB)
  if (deviceMode === 'mobile') {
    return (
      <div className="h-screen overflow-hidden vv-bg-base vv-text-primary py-3 px-3 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm mb-2.5 flex items-center justify-between gap-2 px-4 py-2 rounded-2xl vv-bg-surface border vv-border-gold vv-shadow-card shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-medium vv-text-secondary">
              Vista Móvil Minimalista
            </span>
          </div>
          <VvButton size="sm" variant="gold" onClick={toggleDeviceMode}>
            <DesktopMonitorIcon />
            <span>Volver a Web</span>
          </VvButton>
        </div>

        <div className="vv-phone-frame rounded-3xl vv-bg-base border-2 vv-border-gold-strong vv-shadow-glow">
          {/* Barra de estado minimalista */}
          <div className="px-5 py-1.5 vv-bg-base flex items-center justify-between text-xs vv-text-muted shrink-0">
            <span className="vv-font-mono">09:41</span>
            <div className="w-16 h-3 rounded-full vv-bg-elevated border vv-border-gold" />
            <span className="vv-text-gold-light font-medium">5G</span>
          </div>

          {/* Navbar Móvil Limpio en 1 sola línea */}
          <header className="z-20 vv-bg-glass border-b vv-border-gold px-4 py-3 flex items-center justify-between gap-2 shrink-0">
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
              className="flex items-center gap-2.5 cursor-pointer min-w-0"
            >
              <img
                src={vvLogo}
                alt="Logo V.v"
                className="w-9 h-9 rounded-xl object-contain border vv-border-gold-strong vv-bg-base p-0.5 shrink-0"
              />
              <div className="vv-font-serif font-bold text-base vv-text-gold-metallic truncate">
                V.v Eventos
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <VvButton
                size="sm"
                variant={currentRoute === '/catalogo' ? 'gold' : 'subtle'}
                onClick={() => navigate('/catalogo')}
              >
                Decoraciones
              </VvButton>
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Dueño
              </VvButton>
            </div>
          </header>

          <div ref={phoneScrollRef} className="vv-phone-scroll">
            <div key={`${currentRoute}-mobile`} className="vv-animate-page">
              {children}
            </div>

            <footer className="vv-bg-surface border-t vv-border-gold p-4 text-center mt-6">
              <p className="text-xs vv-text-muted">
                V.v Decoración de Eventos y Cotillón
              </p>
            </footer>
          </div>

          <div className="py-2 vv-bg-elevated border-t vv-border-gold flex justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-amber-400/40" />
          </div>

          <WhatsAppQuoteModal insidePhoneFrame />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen vv-bg-base vv-text-primary flex flex-col">
      <header className="sticky top-0 z-30 vv-bg-glass border-b vv-border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
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
              className="w-12 h-12 rounded-xl object-contain border vv-border-gold-strong vv-bg-base p-0.5 shrink-0"
            />
            <div className="min-w-0">
              <div className="vv-font-serif font-bold text-lg sm:text-xl vv-text-gold-metallic truncate">
                V.v Decoración de Eventos y Cotillón
              </div>
              {!isMobileView && (
                <div className="text-xs vv-text-secondary">
                  Diseño de ambientes de gala, bodas, quinceañeros y eventos corporativos
                </div>
              )}
            </div>
          </div>

          <nav
            aria-label="Navegación Principal"
            className="flex flex-wrap items-center gap-2.5 shrink-0"
          >
            <VvButton
              size="sm"
              variant="outline"
              onClick={toggleDeviceMode}
              title="Ver cómo luce en Móvil (vista independiente)"
            >
              <MobilePhoneIcon />
              <span>Ver en Móvil</span>
            </VvButton>
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
              size="md"
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

      <main key={`${currentRoute}-desktop`} className="flex-1 vv-animate-page">
        {children}
      </main>

      <footer className="vv-bg-surface border-t vv-border-gold mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={vvLogo}
              alt="Logo V.v"
              className="w-9 h-9 rounded-lg object-contain border vv-border-gold"
            />
            <div>
              <VvHeading level={4} variant="serif" metallic>
                V.v Decoración de Eventos y Cotillón
              </VvHeading>
              <p className="text-xs vv-text-muted">
                Atención personalizada para cada celebración · Cotizaciones vía WhatsApp
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <VvButton
              size="sm"
              variant="outline"
              onClick={toggleDeviceMode}
            >
              <MobilePhoneIcon />
              <span>Ver en Móvil</span>
            </VvButton>
            <VvButton
              size="sm"
              variant="subtle"
              onClick={() => navigate('/catalogo')}
            >
              Catálogo Completo
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
