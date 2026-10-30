import { test, expect } from '@playwright/test'

test.describe('Acceso Administrativo y Panel del Dueño', () => {
  test('Inicio de sesión en el portal del dueño', async ({ page }) => {
    await page.goto('/')

    // Navegar a Acceso Dueño
    await page.getByRole('button', { name: /Acceso Dueño/i }).first().click()

    // Verificar pantalla de login
    await expect(page.getByRole('heading', { name: /Panel de Administración V.v/i })).toBeVisible()

    // Llenar credenciales de acceso
    await page.getByPlaceholder(/veronica@gmail.com/i).fill('veronica@gmail.com')
    await page.getByPlaceholder(/••••••••/i).fill('20042008')

    // Enviar formulario
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()

    // Validar acceso al panel principal del dueño
    await expect(page.getByRole('heading', { name: /Panel Principal del Dueño/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Variables & Teléfonos/i })).toBeVisible()
  })
})
