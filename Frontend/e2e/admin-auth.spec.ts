import { test, expect } from '@playwright/test'

test.describe('Acceso Administrativo y Panel del Dueño', () => {
  test('Inicio de sesión en el portal del dueño', async ({ page }) => {
    // Navegar directamente a /login
    await page.goto('/login')

    // Verificar pantalla de login
    await expect(page.getByRole('heading', { name: /Panel de Administración V.v/i })).toBeVisible()

    // Llenar credenciales de acceso
    await page.getByLabel(/Usuario o Correo/i).fill('veronica@gmail.com')
    await page.getByLabel(/Contraseña/i).fill('20042008')

    // Enviar formulario
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()

    // Validar acceso al panel principal del dueño
    await expect(page.getByRole('heading', { name: /Panel Principal/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Variables & Teléfonos/i })).toBeVisible()
  })
})
