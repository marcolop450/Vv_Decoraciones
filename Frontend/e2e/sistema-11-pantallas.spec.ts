import { test, expect } from '@playwright/test'

test.describe('Sistema 11 Pantallas Figma - Eventos Vero', () => {
  test('1. Rutas Públicas: /landing y /catalogo con cotización WhatsApp', async ({ page }) => {
    // 1. Cargar /landing
    await page.goto('/landing')
    await expect(page).toHaveTitle(/V\.v Decoración de Eventos/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Verificar botón para cambiar entre Web y Móvil
    const toggleDeviceBtn = page.getByRole('button', { name: /Ver en Móvil/i }).first()
    await expect(toggleDeviceBtn).toBeVisible()

    // Verificar muestra aleatoria de 3 decoraciones
    const shuffleBtn = page.getByRole('button', { name: /Mostrar otra selección aleatoria/i })
    await expect(shuffleBtn).toBeVisible()

    // Abrir modal de cotización de WhatsApp desde una tarjeta
    const cotizarBtns = page.getByRole('button', { name: /Cotizar por WhatsApp/i })
    await expect(cotizarBtns.first()).toBeVisible()
    await cotizarBtns.first().click()

    // El modal de cotización debe abrirse
    const modal = page.getByRole('dialog', { name: /Cotizar Decoración por WhatsApp/i })
    await expect(modal).toBeVisible()

    // Modo 2: Consultar sin fecha
    const sinFechaBtn = modal.getByRole('button', { name: /Consultar sin fecha/i })
    await expect(sinFechaBtn).toBeVisible()

    // Cerrar modal
    await modal.getByRole('button', { name: /✕/i }).click()
    await expect(modal).toBeHidden()

    // 2. Navegar a /catalogo
    await page.getByRole('button', { name: /Ver Decoraciones/i }).first().click()
    await expect(page).toHaveURL(/.*\/catalogo/)
    await expect(page.getByPlaceholder(/Buscar decoración por nombre/i)).toBeVisible()

    // Filtrar por categoría
    const chips = page.getByRole('button', { name: /Bodas/i })
    if (await chips.count() > 0) {
      await chips.first().click()
    }
  })

  test('2. Autenticación y Bitácora: /login con fallos y éxito', async ({ page }) => {
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

  test('3. Gestión de Eventos y Nuevo: /admin/eventos y /admin/eventos/nuevo', async ({ page }) => {
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
    await page.getByLabel(/Lugar \/ Salón de Recepciones/i).fill('Hotel Radisson')

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

  test('4. Detalle y Flujo de Cierre Conectado con Fotos: /admin/eventos/detalle', async ({ page }) => {
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
    }
  })

  test('5. Calendario Interactivo: /admin/calendario', async ({ page }) => {
    await page.goto('/admin/calendario')
    await expect(page).toHaveTitle(/calendario/i)
    await expect(page.getByRole('heading', { name: /Calendario de Eventos/i })).toBeVisible()

    // Indicador del día actual (Hoy)
    await expect(page.getByText(/Día Actual \(Hoy\)/i).first()).toBeVisible()

    // Botones de navegación mensual
    await expect(page.getByRole('button', { name: /Mes Siguiente/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Mes Anterior/i })).toBeVisible()
  })

  test('6. Reportes y ChatBot IA: /admin/reportes', async ({ page }) => {
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

  test('7. Bitácora de Auditoría y Variables de Negocio: /admin/bitacora', async ({ page }) => {
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
    await page.getByRole('button', { name: /Variables & Teléfonos/i }).click()
    const varModal = page.getByRole('dialog', { name: /Variables de Negocio y Teléfonos/i })
    await expect(varModal).toBeVisible()

    // Cerrar modal
    await varModal.getByRole('button', { name: /✕ Cerrar/i }).click()
    await expect(varModal).toBeHidden()
  })
})
