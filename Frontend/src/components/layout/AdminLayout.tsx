import React from 'react'
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

  const navItems = [
    { path: '/admin', label: 'Panel Principal' },
    { path: '/admin/eventos', label: 'Gestión de Eventos' },
    { path: '/admin/fotos', label: 'Fotos & Catálogo' },
    { path: '/admin/perfil', label: 'Perfil & Teléfonos' },
  ]

  return (
    <div className="min-h-screen flex bg-[#050505] text-[#F9F6F0]">
      {/* Sidebar de Escritorio */}
      <aside className="w-64 border-r border-[#D4AF37]/20 bg-[#0E0E11] flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3">
          <img src={vvLogo} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
          <div>
            <span className="block font-['Cormorant_Garamond'] text-lg font-bold text-[#F9F6F0]">
              {config.businessName}
            </span>
            <VvBadge variant="gold">Modo Administrador</VvBadge>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
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
            onClick={() => onNavigate('/')}
            className="w-full text-left text-xs text-[#C4B9A5] hover:text-[#D4AF37] transition-colors"
          >
            ← Volver a la Web Pública
          </button>
          <VvButton variant="danger" size="sm" onClick={onLogout} className="w-full">
            Cerrar Sesión
          </VvButton>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 border-b border-[#D4AF37]/20 bg-[#0E0E11]/80 backdrop-blur-md px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-['Cormorant_Garamond'] text-[#F9F6F0]">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-[#7D7568]">{subtitle}</p>}
          </div>
          <div className="text-xs text-[#C4B9A5]">
            WhatsApp Activo: <strong className="text-[#D4AF37]">{config.whatsappPhone}</strong>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
