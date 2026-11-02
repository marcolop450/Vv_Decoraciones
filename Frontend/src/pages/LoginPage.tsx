import React, { useState } from 'react'
import vvLogo from '../assets/vv-logo.png'
import { VvTextInput } from '../components/ui/VvFormControls'
import {
  VvButton,
  VvCard,
  VvHeading,
} from '../components/ui/VvPrimitives'
import { useVvApp } from '../context/VvAppContext'

export function LoginPage() {
  const { loginOwner } = useVvApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorAlert, setErrorAlert] = useState<string | null>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorAlert(null)
    setLoading(true)
    try {
      const result = await loginOwner(email, password)
      if (!result.ok) {
        setErrorAlert(result.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen vv-bg-base vv-text-primary flex flex-col justify-between p-4 sm:p-6 vv-animate-page">
      <div className="h-6" />

      <div className="flex-1 flex items-center justify-center py-6">
        <VvCard
          variant="gold-highlight"
          className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6 vv-animate-card shadow-[0_12px_40px_rgba(0,0,0,0.85)] border vv-border-gold-strong"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <img
              src={vvLogo}
              alt="Logo V.v Decoración de eventos y cotillón"
              className="w-20 h-20 rounded-2xl object-contain border vv-border-gold-strong vv-bg-base p-1.5 vv-shadow-glow"
            />
            <VvHeading level={2} variant="serif" metallic className="text-2xl sm:text-3xl">
              Panel de Administración V.v
            </VvHeading>
          </div>

          {errorAlert && (
            <div
              role="alert"
              className="p-3.5 rounded-xl vv-badge-danger text-xs leading-relaxed space-y-1"
            >
              <div className="font-bold uppercase tracking-wider">
                ✕ Error de Autenticación
              </div>
              <div>{errorAlert}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <VvTextInput
              label="Usuario o Correo Electrónico"
              type="email"
              required
              value={email}
              onChange={setEmail}
              placeholder="correo@ejemplo.com"
            />
            <VvTextInput
              label="Contraseña"
              type="password"
              required
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <VvButton
              size="lg"
              variant="gold"
              type="submit"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </VvButton>
          </form>
        </VvCard>
      </div>

      <footer className="text-center text-xs vv-text-muted py-3">
        V.v Decoración de Eventos y Cotillón
      </footer>
    </div>
  )
}
