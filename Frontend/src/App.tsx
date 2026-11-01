import { useEffect } from 'react'
import { VvAppProvider, useVvApp } from './context/VvAppContext'
import { LandingPage } from './pages/LandingPage'
import { CatalogoPage } from './pages/CatalogoPage'
import { LoginPage } from './pages/LoginPage'
import { AdminInicioPage } from './pages/admin/AdminInicioPage'
import { AdminFotosPage } from './pages/admin/AdminFotosPage'
import { AdminEventosPage } from './pages/admin/AdminEventosPage'
import { AdminEventoNuevoPage } from './pages/admin/AdminEventoNuevoPage'
import { AdminEventoDetallePage } from './pages/admin/AdminEventoDetallePage'
import { AdminCalendarioPage } from './pages/admin/AdminCalendarioPage'
import { AdminReportesPage } from './pages/admin/AdminReportesPage'
import { AdminBitacoraPage } from './pages/admin/AdminBitacoraPage'

function VvRouterSwitch() {
  const { currentRoute, isAuthenticated, isAuthLoading, navigate } = useVvApp()

  useEffect(() => {
    document.title = `V.v Decoración de Eventos — ${currentRoute}`
  }, [currentRoute])

  const isAdminRoute = currentRoute.startsWith('/admin')

  useEffect(() => {
    if (!isAuthLoading && isAdminRoute && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAdminRoute, isAuthenticated, isAuthLoading, navigate])

  if (isAdminRoute && !isAuthenticated) {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37]"></div>
        </div>
      )
    }
    return <LoginPage />
  }

  switch (currentRoute) {
    case '/landing':
      return <LandingPage />
    case '/catalogo':
      return <CatalogoPage />
    case '/login':
      return <LoginPage />
    case '/admin/inicio':
      return <AdminInicioPage />
    case '/admin/fotos':
      return <AdminFotosPage />
    case '/admin/eventos':
      return <AdminEventosPage />
    case '/admin/eventos/nuevo':
      return <AdminEventoNuevoPage />
    case '/admin/eventos/detalle':
      return <AdminEventoDetallePage />
    case '/admin/calendario':
      return <AdminCalendarioPage />
    case '/admin/reportes':
      return <AdminReportesPage />
    case '/admin/bitacora':
      return <AdminBitacoraPage />
    default:
      return <LandingPage />
  }
}

export function App() {
  return (
    <VvAppProvider>
      <VvRouterSwitch />
    </VvAppProvider>
  )
}

export default App
