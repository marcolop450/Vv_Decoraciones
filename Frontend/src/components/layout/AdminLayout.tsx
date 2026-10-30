import React, { useState } from 'react'
import { VvButton, VvBadge } from '../ui/VvPrimitives'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import vvLogo from '../../assets/vv-logo.png'

export function AdminLayout({
  children,
  title,
  subtitle,
  currentPath,
  onNavigate,
  onLogout,
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
  currentPath: string
  onNavigate: (path: string) => void
  onLogout: () => void
}) {
  const { config } = useConfiguracion()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    { path: '/admin', label: 'Panel Principal' },
    { path: '/admin/eventos', label: 'Gestión de Eventos' },
    { path: '/admin/fotos', label: 'Fotos & Catálogo' },
    { path: '/admin/perfil', label: 'Perfil & Teléfonos' },
  ]

  const handleNavClick = (path: string) => {
    onNavigate(path)
    setIsSidebarOpen(false)
  }

  const renderNavList = () => (
    <>
      <div className="flex items-center gap-3">
        <img src={vvLogo} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
        <div>
          <span className="block font-['Cormorant_Garamond'] text-lg font-bold text-[#F9F6F0]">
            {config.businessName}
          </span>
          <VvBadge variant="gold">Modo Administrador</VvBadge>
        </div>
      </div>

      <nav className="flex-1 space-y-2 pt-4" aria-label="Menú administrativo">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentPath === item.path
                ? 'bg-[#D4AF37] text-[#050505] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'text-[#C4B9A5] hover:bg-[#16161B] hover:text-[#F9F6F0]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-[#D4AF37]/20 space-y-3">
        <button
          onClick={() => handleNavClick('/')}
          className="w-full text-left text-xs text-[#C4B9A5] hover:text-[#D4AF37] transition-colors"
        >
          ← Volver a la Web Pública
        </button>
        <VvButton variant="danger" size="sm" onClick={onLogout} className="w-full">
          Cerrar Sesión
        </VvButton>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-[#050505] text-[#F9F6F0]">
      {/* Sidebar fijo en escritorio */}
      <aside className="hidden md:flex w-64 border-r border-[#D4AF37]/20 bg-[#0E0E11] flex-col p-6 space-y-6 shrink-0">
        {renderNavList()}
      </aside>

      {/* Drawer móvil con Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación del panel de administración"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-[#0E0E11] border-r border-[#D4AF37]/40 p-6 flex flex-col space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <span className="text-xs font-semibold text-[#F3D37A] uppercase tracking-wider">
                Menú de Control
              </span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Cerrar menú lateral"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#C4B9A5] hover:text-[#F9F6F0]"
              >
                <span className="text-xl font-bold leading-none select-none">✕</span>
              </button>
            </div>
            {renderNavList()}
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 border-b border-[#D4AF37]/20 bg-[#0E0E11]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Toggle de menú móvil */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menú de administración"
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[#D4AF37]/40 text-[#F3D37A] hover:bg-[#16161B] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-['Cormorant_Garamond'] text-[#F9F6F0]">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-[#C4B9A5]">{subtitle}</p>}
            </div>
          </div>
          <div className="text-xs text-[#C4B9A5] text-right">
            WhatsApp: <strong className="text-[#D4AF37] block sm:inline">{config.whatsappPhone}</strong>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
