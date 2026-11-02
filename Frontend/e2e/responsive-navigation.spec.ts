import { test, expect } from '@playwright/test'

test.describe('Navegación Móvil y Responsividad Fluida', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('La barra superior pública se adapta en móvil y permite navegar al catálogo', async ({
    page,
  }) => {
    await page.goto('/')

    // El botón 'Ver Decoraciones' debe estar disponible en móvil
    const verDecoracionesBtn = page.getByRole('button', { name: /Ver Decoraciones/i }).first()
    await expect(verDecoracionesBtn).toBeVisible()

    // Navegar al catálogo
    await verDecoracionesBtn.click()

    // Validar navegación al catálogo
    await expect(page).toHaveURL(/.*\/catalogo/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('El panel de administración en móvil muestra la barra inferior nativa y menú Más', async ({ page }) => {
    await page.goto('/login')

    // Iniciar sesión legítimamente
    await page.getByLabel(/Usuario o Correo/i).fill('veronica@gmail.com')
    await page.getByLabel(/Contraseña/i).fill('20042008')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await expect(page).toHaveURL(/.*\/admin\/inicio/)

    // La barra de navegación inferior móvil debe estar visible
    const bottomNav = page.getByRole('navigation', { name: /Navegación Móvil del Administrador/i })
    await expect(bottomNav).toBeVisible()

    // El botón '☰ Más' en la barra superior móvil debe estar visible
    const menuMasBtn = page.getByRole('button', { name: /☰ Más/i })
    await expect(menuMasBtn).toBeVisible()
    await menuMasBtn.click()

    // Debe mostrar Bitácora de Auditoría
    await expect(page.getByRole('button', { name: /Bitácora de Auditoría/i })).toBeVisible()
  })
})
