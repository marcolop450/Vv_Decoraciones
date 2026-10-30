import { test, expect } from '@playwright/test'

test.describe('Flujo de Catálogo y Cotizador V.v', () => {
  test('La landing page carga el título oficial y permite explorar el catálogo', async ({ page }) => {
    await page.goto('/')

    // Verificar presencia del encabezado de marca
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Navegar a Catálogo
    const catalogButton = page.getByRole('button', { name: /Explorar Catálogo de Decoraciones/i })
    await expect(catalogButton).toBeVisible()
    await catalogButton.click()

    // Validar llegada a /catalogo
    await expect(page).toHaveURL(/.*\/catalogo/)
    await expect(page.getByPlaceholder(/Buscar decoración por nombre/i)).toBeVisible()
  })

  test('Navegación directa al catálogo de decoraciones desde Navbar', async ({ page }) => {
    await page.goto('/')

    const navCatalogLink = page.getByRole('button', { name: /Ver Decoraciones/i }).first()
    await navCatalogLink.click()

    await expect(page).toHaveURL(/.*\/catalogo/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
