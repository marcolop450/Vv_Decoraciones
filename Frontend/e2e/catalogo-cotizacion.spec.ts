import { test, expect } from '@playwright/test'

test.describe('Flujo de Catálogo y Cotizador V.v', () => {
  test('La landing page carga el título oficial y permite abrir el cotizador de WhatsApp', async ({ page }) => {
    await page.goto('/')

    // Verificar presencia del encabezado de marca
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Abrir modal de cotización
    const quoteButton = page.getByRole('button', { name: /Cotizar mi Celebración/i })
    await expect(quoteButton).toBeVisible()
    await quoteButton.click()

    // Verificar que el modal interactivo esté visible
    await expect(page.getByRole('heading', { name: /Solicitar Cotización de Gala/i })).toBeVisible()
    await expect(page.getByPlaceholder(/Ej: Verónica Méndez/i)).toBeVisible()
  })

  test('Navegación al catálogo de decoraciones', async ({ page }) => {
    await page.goto('/')

    const catalogLink = page.getByRole('button', { name: /Catálogo de Galas/i })
    await catalogLink.click()

    await expect(page.getByRole('heading', { name: /Catálogo de Decoraciones/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Todos/i })).toBeVisible()
  })
})
