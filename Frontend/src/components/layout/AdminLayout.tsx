import React, { useState } from 'react'
import vvLogo from '../../assets/vv-logo.png'
import { useVvApp } from '../../context/VvAppContext'
import type { AppRoute } from '../../types/vv-app'
import { VvBadge, VvButton, VvHeading } from '../ui/VvPrimitives'

interface NavItem {
  route: AppRoute
  label: string
  shortLabel: string
  icon: React.ReactNode
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    route: '/admin/inicio',
    label: 'Inicio / Panel',
    shortLabel: 'Inicio',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-10.5z" />
      </svg>
    ),
  },
  {
    route: '/admin/eventos',
    label: 'Administrar Eventos',
    shortLabel: 'Eventos',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    route: '/admin/calendario',
    label: 'Calendario',
    shortLabel: 'Agenda',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    route: '/admin/fotos',
    label: 'Fotos del Catálogo',
    shortLabel: 'Fotos',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="M21 15l-5-5L5 20" />
      </svg>
    ),
  },
  {
    route: '/admin/reportes',
    label: 'Reportes + ChatBot',
    shortLabel: 'Reportes',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    route: '/admin/bitacora',
    label: 'Bitácora del Sistema',
    shortLabel: 'Bitácora',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
]

const MOBILE_BOTTOM_NAV_ITEMS: NavItem[] = ADMIN_NAV_ITEMS.slice(0, 5)

export function AdminLayout({
  title,
  subtitle,
  headerActions,
  hideBottomNav = false,
  floatingAction,
  children,
}: {
  title: string
  subtitle?: string
  headerActions?: React.ReactNode
  hideBottomNav?: boolean
  floatingAction?: {
    onClick: () => void
    label: string
  } | boolean
  children: React.ReactNode
}) {
  const { currentRoute, navigate, logoutOwner } = useVvApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isRouteActive = (itemRoute: AppRoute) => {
    if (
      itemRoute === '/admin/eventos' &&
      (currentRoute === '/admin/eventos' ||
        currentRoute === '/admin/eventos/nuevo' ||
        currentRoute === '/admin/eventos/detalle')
    ) {
      return true
    }
    return currentRoute === itemRoute
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden vv-bg-base vv-text-primary flex flex-col md:flex-row">
      {/* Sidebar de escritorio (visible solo en >= 768px) */}
      <aside className="hidden md:flex md:w-64 vv-bg-surface border-r vv-border-gold flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto z-30">
        <div>
          <div className="p-6 border-b vv-border-gold">
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/admin/inicio')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate('/admin/inicio')
                }
              }}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <img
                src={vvLogo}
                alt="Logo V.v"
                className="w-11 h-11 rounded-xl object-contain border vv-border-gold-strong vv-bg-base p-0.5 shrink-0"
              />
              <div>
                <div className="vv-font-serif font-bold text-lg vv-text-gold-metallic leading-tight">
                  V.v Eventos
                </div>
                <VvBadge variant="gold" className="text-[10px] mt-1">
                  Panel del Dueño
                </VvBadge>
              </div>
            </div>
          </div>

          <nav aria-label="Menú del Administrador" className="p-4 space-y-1.5">
            {ADMIN_NAV_ITEMS.map((item) => {
              const active = isRouteActive(item.route)
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    active
                      ? 'vv-bg-gold-gradient vv-text-on-gold font-semibold shadow-sm'
                      : 'vv-text-secondary hover:vv-text-primary hover:vv-bg-subtle'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t vv-border-gold space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider vv-text-muted px-1">
            Configuración
          </div>
          <VvButton
            size="sm"
            variant={currentRoute === '/admin/categorias' ? 'gold' : 'outline'}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/admin/categorias')}
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Gestión de Categorías</span>
          </VvButton>

          <VvButton
            size="sm"
            variant={currentRoute === '/admin/configuracion' ? 'gold' : 'outline'}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/admin/configuracion')}
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Variables & Teléfonos</span>
          </VvButton>

          <VvButton
            size="sm"
            variant="ghost"
            className="w-full justify-start text-xs opacity-75 hover:opacity-100"
            onClick={() => navigate('/landing')}
          >
            ← Volver a Web Pública
          </VvButton>

          <button
            type="button"
            onClick={logoutOwner}
            className="w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left font-medium cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Header móvil nativo (visible solo en < 768px) - Limpio, sin botones apiñados */}
      <header className="md:hidden sticky top-0 z-30 vv-bg-glass border-b vv-border-gold px-4 py-2.5 flex items-center justify-between gap-3">
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate('/admin/inicio')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/admin/inicio')
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
        >
          <img
            src={vvLogo}
            alt="Logo V.v"
            className="w-8 h-8 rounded-xl object-contain border vv-border-gold-strong vv-bg-base shrink-0"
          />
          <div className="min-w-0">
            <div className="vv-font-serif font-bold text-base vv-text-gold-metallic leading-tight truncate">
              {title}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="☰ Más"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-8 px-3 rounded-lg border vv-border-gold vv-bg-elevated vv-text-secondary hover:vv-text-primary text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          {mobileMenuOpen ? '✕' : '☰ Más'}
        </button>
      </header>

      {/* Menú desplegable móvil con Backdrop Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-30 vv-animate-fade"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="md:hidden fixed top-[54px] inset-x-3 z-40 p-3.5 rounded-2xl vv-bg-surface border border-[#d4af37]/40 shadow-[0_12px_40px_rgba(0,0,0,0.9)] space-y-1.5 vv-animate-modal backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider vv-text-gold-light pb-2 px-2 border-b vv-border-gold flex items-center justify-between">
              <span>Módulos y Configuración</span>
              <span className="text-[10px] vv-text-muted">Eventos Vero</span>
            </div>

            <button
              type="button"
              onClick={() => {
                navigate('/admin/bitacora')
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs vv-text-primary hover:vv-bg-subtle text-left transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 vv-text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="font-medium">Bitácora de Auditoría</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/admin/categorias')
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs vv-text-primary hover:vv-bg-subtle text-left transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 vv-text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="font-medium">Gestión de Categorías</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/admin/configuracion')
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs vv-text-primary hover:vv-bg-subtle text-left transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 vv-text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="font-medium">Variables de Negocio & Teléfonos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/landing')
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs vv-text-secondary hover:vv-bg-subtle text-left transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Ver Sitio Web Público</span>
            </button>

            <div className="pt-2 border-t vv-border-gold">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  logoutOwner()
                }}
                className="w-full px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 text-left font-medium transition-colors cursor-pointer"
              >
                Cerrar Sesión del Dueño
              </button>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal antidesbordamiento */}
      <div className="min-w-0 flex-1 flex flex-col overflow-x-hidden">
        {/* Header escritorio (solo visible en >= 768px) */}
        <header className="hidden md:flex sticky top-0 z-20 vv-bg-glass border-b vv-border-gold px-6 py-4 items-center justify-between gap-4">
          <div>
            <VvHeading level={2} variant="serif" metallic>
              {title}
            </VvHeading>
            {subtitle && (
              <p className="text-xs vv-text-secondary mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-3">{headerActions}</div>
          )}
        </header>

        {/* Cuerpo de página */}
        <main
          key={currentRoute}
          className={`flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto vv-animate-page ${
            hideBottomNav ? 'pb-8' : 'pb-24 md:pb-8'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Botón flotante (+) anclado de forma fija e inamovible al viewport (fuera de contenedores con transform) */}
      {floatingAction && (
        <button
          type="button"
          onClick={
            typeof floatingAction === 'object' && 'onClick' in floatingAction
              ? floatingAction.onClick
              : () => navigate('/admin/eventos/nuevo', { editEventId: null })
          }
          aria-label={
            typeof floatingAction === 'object' && 'label' in floatingAction
              ? floatingAction.label
              : 'Registrar Evento'
          }
          className="md:hidden fixed bottom-[76px] right-4 z-40 w-14 h-14 rounded-full vv-bg-gold-gradient text-[#0B0B0E] flex items-center justify-center shadow-[0_6px_25px_rgba(212,175,55,0.5)] border-2 border-[#fff3b0] hover:scale-105 active:scale-90 transition-transform cursor-pointer"
        >
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Barra inferior de navegación nativa para Móviles (<= 768px) */}
      {!hideBottomNav && (
        <nav
          aria-label="Navegación Móvil del Administrador"
          className="md:hidden fixed bottom-0 inset-x-0 z-30 vv-bg-surface/95 backdrop-blur-md border-t vv-border-gold px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] grid grid-cols-5 gap-1 shadow-lg"
        >
          {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
            const active = isRouteActive(item.route)
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate(item.route)
                }}
                className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                  active
                    ? 'vv-text-gold-light font-bold bg-amber-400/10'
                    : 'vv-text-muted hover:vv-text-secondary'
                }`}
              >
                <span className={active ? 'vv-text-gold' : 'currentColor'}>
                  {item.icon}
                </span>
                <span className="text-[10px] mt-1 leading-none truncate max-w-full">
                  {item.shortLabel}
                </span>
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}
