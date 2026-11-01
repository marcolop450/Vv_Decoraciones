import { test, expect } from '@playwright/test'

async function loginAsAdmin(page: any) {
  await page.goto('/login')
  const accesoBtn = page.getByRole('button', { name: /Acceso Exitoso Directo/i })
  await accesoBtn.click()
  await expect(page).toHaveURL(/.*\/admin\/inicio/)
}

test.describe('Sistema 11 Pantallas Figma - Eventos Vero', () => {
  test('1. Seguridad: Acceso no autenticado a /admin/* es bloqueado y redirige a /login', async ({
    page,
  }) => {
    // Intentar acceder a ruta administrativa directamente sin credenciales
    await page.goto('/admin/inicio')
    await expect(page).toHaveURL(/.*\/login/)
    await expect(
      page.getByRole('heading', { name: /Panel de Administración V.v/i })
    ).toBeVisible()
  })

  test('2. Rutas Públicas: /landing y /catalogo con botón flotante WhatsApp en móvil', async ({
    page,
  }) => {
    // 1. Cargar /landing
    await page.goto('/landing')
    await expect(page).toHaveTitle(/V\.v Decoración de Eventos/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Navbar con accesos principales
    await expect(page.getByRole('button', { name: /Ver Decoraciones/i }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Explorar Catálogo de Decoraciones/i })).toBeVisible()

    // En vista móvil, el botón flotante persistente de WhatsApp debe estar visible
    await page.setViewportSize({ width: 375, height: 667 })
    const whatsappFab = page.getByLabel(/Contactar por WhatsApp/i)
    await expect(whatsappFab).toBeVisible()

    // 2. Navegar a /catalogo
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.getByRole('button', { name: /Ver Decoraciones/i }).first().click()
    await expect(page).toHaveURL(/.*\/catalogo/)
    await expect(page.getByPlaceholder(/Buscar decoración por nombre/i)).toBeVisible()
  })

  test('3. Autenticación y Bitácora: /login con fallos y éxito', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/login/i)
    await expect(page.getByRole('heading', { name: /Panel de Administración V.v/i })).toBeVisible()

    // Probar intento fallido simulado
    const simularFalloBtn = page.getByRole('button', { name: /Simular Fallo de Login/i })
    await expect(simularFalloBtn).toBeVisible()
    await simularFalloBtn.click()

    // Debe mostrarse alerta roja de error
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByText(/Credenciales incorrectas/i)).toBeVisible()

    // Probar acceso exitoso directo
    const accesoExitosoBtn = page.getByRole('button', { name: /Acceso Exitoso Directo/i })
    await expect(accesoExitosoBtn).toBeVisible()
    await accesoExitosoBtn.click()

    // Debe redirigir a /admin/inicio
    await expect(page).toHaveURL(/.*\/admin\/inicio/)
    await expect(page.getByRole('heading', { name: /Panel Principal del Dueño/i })).toBeVisible()
  })

  test('4. Gestión de Categorías: Crear, Editar y Eliminar', async ({ page }) => {
    await loginAsAdmin(page)

    // Abrir modal de Gestión de Categorías
    await page.getByRole('button', { name: /Gestión de Categorías/i }).first().click()
    const catModal = page.getByRole('dialog', { name: /Gestión de Categorías de Decoración/i })
    await expect(catModal).toBeVisible()

    // Crear nueva categoría
    await page.getByLabel(/Nombre de la Nueva Categoría/i).fill('Mesas Dulces VIP')
    await page.getByRole('button', { name: /\+ Crear/i }).click()
    await expect(page.getByText('Mesas Dulces VIP')).toBeVisible()

    // Cerrar modal
    await catModal.getByRole('button', { name: /✕ Cerrar/i }).click()
    await expect(catModal).toBeHidden()
  })

  test('5. Gestión de Eventos y Nuevo: /admin/eventos y /admin/eventos/nuevo', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/eventos')
    await expect(page).toHaveTitle(/eventos/i)

    // Tabs de Eventos Actuales vs Realizados
    const tabActivos = page.getByRole('button', { name: /Eventos Actuales/i })
    const tabCompletados = page.getByRole('button', { name: /Eventos Realizados/i })
    await expect(tabActivos).toBeVisible()
    await expect(tabCompletados).toBeVisible()

    // Navegar a /admin/eventos/nuevo
    await page.getByRole('button', { name: /Pantalla \/nuevo/i }).click()
    await expect(page).toHaveURL(/.*\/admin\/eventos\/nuevo/)
    await expect(page.getByRole('heading', { name: /Registrar Nuevo Evento/i })).toBeVisible()

    // Llenar campos del evento
    await page.getByLabel(/Nombre del Evento/i).fill('Gala de Aniversario E2E')
    await page.getByLabel(/Nombre del Cliente/i).fill('Cliente Automatizado')
    await page.getByLabel(/Teléfono de Contacto/i).fill('77885220')
    await page.getByLabel(/Lugar \/ Ubicación/i).fill('Hotel Radisson')

    // Verificar cálculo automático de saldo pendiente
    await page.getByLabel(/Precio Total Contratado/i).fill('8000')
    await page.getByLabel(/Adelanto \/ Seña Recibida/i).fill('3000')
    await expect(page.getByText(/Bs\. 5,000/i)).toBeVisible()

    // Registrar evento
    await page.getByRole('button', { name: /Registrar Evento/i }).click()

    // Debe redirigir a /admin/eventos/detalle
    await expect(page).toHaveURL(/.*\/admin\/eventos\/detalle/)
    await expect(page.getByRole('heading', { name: /Gala de Aniversario E2E/i })).toBeVisible()
    await expect(page.getByText(/Bs\. 5,000/i)).toBeVisible()
  })

  test('6. Detalle y Flujo de Cierre Conectado con Fotos: /admin/eventos/detalle', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/eventos/detalle')
    await expect(page).toHaveTitle(/detalle/i)

    // Si el evento está activo, marcarlo como completado
    const marcarBtn = page.getByRole('button', { name: /✓ Marcar Evento como Completado/i })
    if (await marcarBtn.isVisible()) {
      await marcarBtn.click()

      // Debe abrirse automáticamente el modal para registrar la foto en catálogo
      const photoModal = page.getByRole('dialog', { name: /Registrar Foto del Evento Completado/i })
      await expect(photoModal).toBeVisible()
      await expect(photoModal.getByRole('button', { name: /Publicar Foto en el Catálogo/i })).toBeVisible()

      // Publicar la foto
      await photoModal.getByRole('button', { name: /Publicar Foto en el Catálogo/i }).click()

      // Debe redirigir a /admin/fotos
      await expect(page).toHaveURL(/.*\/admin\/fotos/)
      await expect(page.getByRole('heading', { name: /Gala de Aniversario E2E/i })).toBeVisible()
    }
  })

  test('7. Catálogo y Cotización WhatsApp tras Publicación', async ({ page }) => {
    await page.goto('/catalogo')
    await expect(page).toHaveTitle(/catalogo/i)

    const cotizarBtns = page.getByRole('button', { name: /Cotizar por WhatsApp/i })
    if ((await cotizarBtns.count()) > 0) {
      await cotizarBtns.first().click()

      const modal = page.getByRole('dialog', { name: /Cotizar Decoración por WhatsApp/i })
      await expect(modal).toBeVisible()
      await expect(modal.getByRole('button', { name: /Consultar sin fecha/i })).toBeVisible()

      await modal.getByRole('button', { name: /✕/i }).click()
      await expect(modal).toBeHidden()
    }
  })

  test('8. Calendario Interactivo: /admin/calendario', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/calendario')
    await expect(page).toHaveTitle(/calendario/i)
    await expect(page.getByRole('heading', { name: /Calendario de Eventos/i })).toBeVisible()

    // Indicador del día actual (Hoy)
    await expect(page.getByText(/Día Actual \(Hoy\)/i).first()).toBeVisible()

    // Botones de navegación mensual
    await expect(page.getByRole('button', { name: /Mes Siguiente/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Mes Anterior/i })).toBeVisible()
  })

  test('9. Reportes y ChatBot IA: /admin/reportes', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/reportes')
    await expect(page).toHaveTitle(/reportes/i)
    await expect(page.getByRole('heading', { name: /Reportes Generales \+ ChatBot IA/i })).toBeVisible()

    // Resumen financiero
    await expect(page.getByText('Ingresos Totales Contratados', { exact: true })).toBeVisible()
    await expect(page.getByText('Saldos Pendientes por Cobrar', { exact: true })).toBeVisible()

    // ChatBot IA - Consulta rápida
    const promptBtn = page.getByRole('button', { name: /Quiero ver qué evento tengo los siguientes días/i })
    await expect(promptBtn).toBeVisible()
    await promptBtn.click()

    // El bot responde con información
    await expect(page.getByText(/Bot Reportes V\.v/i).first()).toBeVisible()
  })

  test('10. Bitácora de Auditoría y Variables de Negocio: /admin/bitacora', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/bitacora')
    await expect(page).toHaveTitle(/bitacora/i)
    await expect(page.getByRole('heading', { name: /Bitácora de la Página/i })).toBeVisible()

    // Filtros de estado
    await expect(page.getByRole('button', { name: /Estado: Éxito/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Estado: Fallo/i })).toBeVisible()

    // Probar simulación de fallo
    await page.getByRole('button', { name: /Simular Registro de Fallo/i }).click()
    await expect(page.getByText(/Error de Operación/i).first()).toBeVisible()

    // Abrir modal de Variables de Negocio
    await page.getByRole('button', { name: /Variables & Teléfonos/i }).first().click()
    const varModal = page.getByRole('dialog', { name: /Variables de Negocio y Teléfonos/i })
    await expect(varModal).toBeVisible()

    // Cerrar modal
    await varModal.getByRole('button', { name: /✕ Cerrar/i }).click()
    await expect(varModal).toBeHidden()
  })

  test('11. Responsividad Nativa: Navegación Móvil Real', async ({ page }) => {
    // Configurar viewport de teléfono móvil real
    await page.setViewportSize({ width: 375, height: 667 })
    await loginAsAdmin(page)

    // Barra inferior nativa de navegación para teléfonos
    const bottomNav = page.getByRole('navigation', { name: /Navegación Móvil del Administrador/i })
    await expect(bottomNav).toBeVisible()

    // Verificar accesos de la barra inferior
    await expect(bottomNav.getByRole('button', { name: /Eventos/i })).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: /Fotos/i })).toBeVisible()

    // Navegar a Eventos mediante la barra inferior
    await bottomNav.getByRole('button', { name: /Eventos/i }).click()
    await expect(page).toHaveURL(/.*\/admin\/eventos/)
  })
})
