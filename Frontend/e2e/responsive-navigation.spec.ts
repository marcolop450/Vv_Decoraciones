import { test, expect } from '@playwright/test'

test.describe('Navegación Móvil y Modales Accesibles (P0)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('El menú móvil público se despliega, permite navegar al catálogo y cierra con interacción', async ({
    page,
  }) => {
    await page.goto('/')

    // Verificar que los enlaces de escritorio están ocultos en móvil
    const desktopNav = page.getByRole('navigation', { name: /Navegación principal/i })
    await expect(desktopNav).toBeHidden()

    // El botón hamburguesa móvil debe estar visible
    const hamburgerBtn = page.getByRole('button', { name: /Abrir menú/i })
    await expect(hamburgerBtn).toBeVisible()

    // Abrir menú móvil
    await hamburgerBtn.click()

    // El drawer móvil debe estar visible con sus enlaces
    const mobileNav = page.getByRole('navigation', { name: /Navegación móvil/i })
    await expect(mobileNav).toBeVisible()

    const catalogoLink = mobileNav.getByRole('button', { name: /Catálogo de Galas/i })
    await expect(catalogoLink).toBeVisible()

    // Navegar al catálogo
    await catalogoLink.click()

    // Verificar que navegó al catálogo y el menú se cerró
    await expect(page.getByRole('heading', { name: /Catálogo de Decoraciones/i })).toBeVisible()
    await expect(mobileNav).toBeHidden()
  })

  test('Los modales capturan la tecla Escape y cierran correctamente', async ({ page }) => {
    await page.goto('/')

    // Abrir el modal de cotización
    const cotizarBtn = page.getByRole('button', { name: /Cotizar Evento/i }).first()
    await cotizarBtn.click()

    // Verificar que el diálogo modal está visible
    const modalDialog = page.getByRole('dialog', { name: /Solicitar Cotización de Gala/i })
    await expect(modalDialog).toBeVisible()

    // Presionar tecla Escape para cerrar
    await page.keyboard.press('Escape')

    // El modal debe haberse cerrado
    await expect(modalDialog).toBeHidden()
  })

  test('La barra de administración se adapta a móvil con drawer colapsable', async ({ page }) => {
    await page.goto('/')

    // Abrir menú móvil y acceder al login del dueño
    await page.getByRole('button', { name: /Abrir menú/i }).click()
    const mobileNav = page.getByRole('navigation', { name: /Navegación móvil/i })
    await mobileNav.getByRole('button', { name: /Acceso Dueño/i }).click()

    // Iniciar sesión
    await page.getByPlaceholder(/admin@eventosvero.com/i).fill('admin@eventosvero.com')
    await page.getByPlaceholder(/••••••••/i).fill('admin123')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()

    // Validar acceso al panel administrativo
    await expect(page.getByRole('heading', { name: /Panel Principal del Dueño/i })).toBeVisible()

    // El botón de menú lateral móvil debe estar visible en el header
    const adminMenuBtn = page.getByRole('button', { name: /Abrir menú de administración/i })
    await expect(adminMenuBtn).toBeVisible()

    // Abrir el drawer de administración
    await adminMenuBtn.click()

    // El diálogo de navegación administrativa debe estar visible
    const adminDrawer = page.getByRole('dialog', { name: /Navegación del panel de administración/i })
    await expect(adminDrawer).toBeVisible()

    // Hacer clic en 'Gestión de Eventos'
    await adminDrawer.getByRole('button', { name: /Gestión de Eventos/i }).click()

    // Verificar que navegó a gestión de eventos y el drawer cerró
    await expect(page.getByRole('heading', { name: /Gestión de Eventos & Montajes/i })).toBeVisible()
    await expect(adminDrawer).toBeHidden()
  })
})
