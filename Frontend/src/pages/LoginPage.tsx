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
  const {
    loginOwner,
    navigate,
    deviceMode,
    toggleDeviceMode,
  } = useVvApp()
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

  if (deviceMode === 'mobile') {
    return (
      <div className="h-screen overflow-hidden vv-bg-base vv-text-primary py-3 px-3 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm mb-2.5 flex items-center justify-between gap-2 px-4 py-2 rounded-2xl vv-bg-surface border vv-border-gold-strong vv-shadow-card shrink-0">
          <div className="flex items-center gap-2">
            <VvBadge variant="gold">Vista Móvil</VvBadge>
            <span className="vv-font-mono text-xs vv-text-muted">/login</span>
          </div>
          <VvButton size="sm" variant="gold" onClick={toggleDeviceMode}>
            Ver en Web (Desktop)
          </VvButton>
        </div>

        <div className="vv-phone-frame rounded-3xl vv-bg-base border-2 vv-border-gold-strong vv-shadow-glow">
          <div className="px-5 py-2 vv-bg-elevated border-b vv-border-gold flex items-center justify-between text-xs vv-text-muted shrink-0">
            <span className="vv-font-mono">09:41</span>
            <div className="w-20 h-3.5 rounded-full vv-bg-base border vv-border-gold" />
            <span className="vv-text-gold-light font-semibold">V.v Acceso</span>
          </div>

          <div className="px-4 py-3 vv-bg-glass border-b vv-border-gold flex items-center justify-between shrink-0">
            <VvButton
              size="sm"
              variant="ghost"
              onClick={() => navigate('/landing')}
            >
              ← Inicio Público
            </VvButton>
            <span className="vv-font-mono text-xs vv-text-gold">/login</span>
          </div>

          <div className="vv-phone-scroll p-4 flex flex-col justify-between">
            <VvCard
              variant="gold-highlight"
              className="w-full p-5 space-y-5 vv-animate-page"
            >
              <div className="flex flex-col items-center text-center space-y-2.5">
                <img
                  src={vvLogo}
                  alt="Logo V.v"
                  className="w-20 h-20 rounded-2xl object-contain border vv-border-gold-strong vv-bg-base p-1.5 vv-shadow-glow"
                />
                <VvBadge variant="gold">Acceso Propietario</VvBadge>
                <VvHeading level={3} variant="serif" metallic>
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

              <div className="space-y-3.5">
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
                  className="w-full"
                >
                  Iniciar Sesión
                </VvButton>
              </div>

              <VvOrnamentDivider label="Atajos de Prueba" />

              <div className="grid grid-cols-1 gap-2">
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
            </VvCard>
          </div>

          <div className="py-2 vv-bg-elevated border-t vv-border-gold flex justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-amber-400/40" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen vv-bg-base vv-text-primary flex flex-col justify-between p-4 sm:p-6 vv-animate-page">
      <div className="max-w-5xl w-full mx-auto flex flex-wrap items-center justify-between gap-2 py-2">
        <VvButton
          size="sm"
          variant="ghost"
          onClick={() => navigate('/landing')}
        >
          ← Volver a Inicio Público (/landing)
        </VvButton>
        <div className="flex items-center gap-2">
          <VvButton
            size="sm"
            variant="outline"
            onClick={toggleDeviceMode}
          >
            Ver en Móvil
          </VvButton>
          <span className="vv-font-mono text-xs vv-text-muted">/login</span>
        </div>
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
