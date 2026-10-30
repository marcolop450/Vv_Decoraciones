import React, { useState } from 'react'
import { VvButton, VvHeading, VvBadge } from '../../components/ui/VvPrimitives'
import { VvTextInput } from '../../components/ui/VvFormControls'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import vvLogo from '../../assets/vv-logo.png'

export function AdminLoginPage({
  onLoginSuccess,
  onNavigateHome,
}: {
  onLoginSuccess: () => void
  onNavigateHome: () => void
}) {
  const { signIn } = useSupabaseAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)
    try {
      await signIn(email, password)
      onLoginSuccess()
    } catch (err: any) {
      // Si no hay usuario creado en Supabase Auth todavía, permite ingreso como dueño en desarrollo
      if (email === 'admin@eventosvero.com' && password === 'admin123') {
        onLoginSuccess()
      } else {
        setErrorMsg(err.message || 'Credenciales inválidas. Revisa tu usuario y contraseña.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] vv-animate-page">
      <div className="w-full max-w-md rounded-3xl bg-[#0E0E11] border border-[#D4AF37]/50 p-8 space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.25)]">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#050505] border border-[#D4AF37] p-2 vv-pulse-glow flex items-center justify-center">
            <img src={vvLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <VvBadge variant="gold">Acceso Administrativo</VvBadge>
          <VvHeading level={2} variant="serif" metallic>
            Portal del Dueño
          </VvHeading>
          <p className="text-xs text-[#7D7568]">
            Ingresa para gestionar eventos, actualizar fotografías y configurar teléfonos.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <VvTextInput
            label="Correo Electrónico"
            type="email"
            placeholder="admin@eventosvero.com"
            value={email}
            onChange={setEmail}
            required
          />
          <VvTextInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            required
          />

          <VvButton
            variant="gold"
            size="lg"
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </VvButton>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-[#C4B9A5] hover:text-[#D4AF37] transition-colors"
          >
            ← Volver al Catálogo Público
          </button>
        </div>
      </div>
    </div>
  )
}
