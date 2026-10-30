import React, { useState } from 'react'
import vvLogo from '../assets/vv-logo.png'
import { VvTextInput } from '../components/ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
  VvOrnamentDivider,
} from '../components/ui/VvPrimitives'
import { useVvApp } from '../context/VvAppContext'

export function LoginPage() {
  const { loginOwner, navigate } = useVvApp()
  const [email, setEmail] = useState('veronica@gmail.com')
  const [password, setPassword] = useState('20042008')
  const [errorAlert, setErrorAlert] = useState<string | null>(null)

  const handleSubmit = () => {
    setErrorAlert(null)
    const result = loginOwner(email, password)
    if (!result.ok) {
      setErrorAlert(result.message)
    }
  }

  const handleSimulateFailedAttempt = () => {
    setEmail('admin@vvdecoracion.com')
    setPassword('error')
    const result = loginOwner('admin@vvdecoracion.com', 'error')
    if (!result.ok) {
      setErrorAlert(result.message)
    }
  }

  return (
    <div className="min-h-screen vv-bg-base vv-text-primary flex flex-col justify-between p-4 sm:p-6 vv-animate-page">
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-2 py-2">
        <VvButton
          size="sm"
          variant="ghost"
          onClick={() => navigate('/landing')}
        >
          ← Volver a Inicio Público (/landing)
        </VvButton>
        <span className="vv-font-mono text-xs vv-text-muted">/login</span>
      </div>

      <div className="flex-1 flex items-center justify-center py-6">
        <VvCard
          variant="gold-highlight"
          className="w-full max-w-md p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <img
              src={vvLogo}
              alt="Logo V.v Decoración de eventos y cotillón"
              className="w-24 h-24 rounded-2xl object-contain border vv-border-gold-strong vv-bg-base p-1.5 vv-shadow-glow"
            />
            <VvBadge variant="gold">Acceso Exclusivo Propietario</VvBadge>
            <VvHeading level={2} variant="serif" metallic>
              Panel de Administración V.v
            </VvHeading>
            <p className="text-xs vv-text-secondary">
              Ingresa tus credenciales para gestionar fotos del catálogo, eventos,
              calendario, reportes y bitácora.
            </p>
          </div>

          {errorAlert && (
            <div
              role="alert"
              className="p-4 rounded-xl vv-badge-danger text-xs leading-relaxed space-y-1"
            >
              <div className="font-bold uppercase tracking-wider">
                ✕ Error de Autenticación
              </div>
              <div>{errorAlert}</div>
            </div>
          )}

          <div className="space-y-4">
            <VvTextInput
              label="Usuario o Correo Electrónico"
              type="email"
              required
              value={email}
              onChange={setEmail}
              placeholder="veronica@gmail.com"
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
              onClick={handleSubmit}
              className="w-full mt-2"
            >
              Iniciar Sesión
            </VvButton>
          </div>

          <VvOrnamentDivider label="Atajos de Prueba (Auditoría Bitácora)" />

          <div className="space-y-2">
            <p className="text-xs vv-text-muted text-center">
              Prueba rápida de los dos estados de autenticación (ambos se registran en{' '}
              <span className="vv-font-mono vv-text-gold-light">/admin/bitacora</span>):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <VvButton
                size="sm"
                variant="subtle"
                onClick={handleSimulateFailedAttempt}
              >
                Simular Fallo de Login
              </VvButton>
              <VvButton
                size="sm"
                variant="outline"
                onClick={() => {
                  setEmail('veronica@gmail.com')
                  setPassword('20042008')
                  loginOwner('veronica@gmail.com', '20042008')
                }}
              >
                Acceso Exitoso Directo
              </VvButton>
            </div>
          </div>
        </VvCard>
      </div>

      <div className="text-center text-xs vv-text-muted py-2">
        V.v Decoración de Eventos y Cotillón · Seguridad y Bitácora Activa
      </div>
    </div>
  )
}
