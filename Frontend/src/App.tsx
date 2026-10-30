import { useState } from 'react'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { LandingPage } from './pages/public/LandingPage'
import { CatalogoPage } from './pages/public/CatalogoPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminEventosPage } from './pages/admin/AdminEventosPage'
import { AdminFotosPage } from './pages/admin/AdminFotosPage'
import { AdminPerfilPage } from './pages/admin/AdminPerfilPage'
import { WhatsAppQuoteModal } from './components/modals/WhatsAppQuoteModal'
import { EventDetailModal } from './components/modals/EventDetailModal'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import type { VvPhoto } from '@eventos-vero/shared'

export function App() {
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<VvPhoto | null>(null)
  const { user, signOut } = useSupabaseAuth()
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  const isAuth = !!user || isAdminAuthenticated

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {
      // Ignora errores si la sesión era local
    }
    setIsAdminAuthenticated(false)
    setCurrentPath('/')
  }

  // Rutas Administrativas
  if (currentPath.startsWith('/admin')) {
    if (!isAuth) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true)
            setCurrentPath('/admin')
          }}
          onNavigateHome={() => setCurrentPath('/')}
        />
      )
    }

    return (
      <AdminLayout
        title={
          currentPath === '/admin/eventos'
            ? 'Gestión de Eventos & Montajes'
            : currentPath === '/admin/fotos'
              ? 'Portafolio & Fotografías Puras'
              : currentPath === '/admin/perfil'
                ? 'Perfil Comercial & Teléfonos'
                : 'Panel Principal del Dueño'
        }
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {currentPath === '/admin/eventos' && <AdminEventosPage />}
        {currentPath === '/admin/fotos' && <AdminFotosPage />}
        {currentPath === '/admin/perfil' && <AdminPerfilPage />}
        {currentPath === '/admin' && <AdminDashboardPage onNavigate={handleNavigate} />}
      </AdminLayout>
    )
  }

  // Rutas Públicas (Cliente)
  return (
    <PublicLayout
      currentPath={currentPath}
      onNavigate={handleNavigate}
      onOpenQuote={() => setIsQuoteOpen(true)}
    >
      {currentPath === '/catalogo' ? (
        <CatalogoPage
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
          onOpenQuote={() => setIsQuoteOpen(true)}
        />
      ) : (
        <LandingPage
          onNavigate={handleNavigate}
          onOpenQuote={() => setIsQuoteOpen(true)}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />
      )}

      {/* Modales Interactivos */}
      <WhatsAppQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />

      <EventDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onInquire={() => setIsQuoteOpen(true)}
      />
    </PublicLayout>
  )
}
