import React, { useState, useEffect } from 'react'
import { VvButton, VvHeading, VvBadge, VvCard } from '../../components/ui/VvPrimitives'
import { VvTextInput, VvTextArea } from '../../components/ui/VvFormControls'
import { useConfiguracion } from '../../hooks/useConfiguracion'

export function AdminPerfilPage() {
  const { config, loading, updateConfig } = useConfiguracion()

  const [businessName, setBusinessName] = useState('')
  const [brandSubtitle, setBrandSubtitle] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  useEffect(() => {
    if (config) {
      setBusinessName(config.businessName)
      setBrandSubtitle(config.brandSubtitle)
      setWhatsappPhone(config.whatsappPhone)
      setContactPhone(config.contactPhone)
      setInstagramUrl(config.instagramUrl || '')
      setFacebookUrl(config.facebookUrl || '')
      setTiktokUrl(config.tiktokUrl || '')
      setLocationAddress(config.locationAddress || '')
    }
  }, [config])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMsg(false)
    try {
      await updateConfig({
        businessName,
        brandSubtitle,
        whatsappPhone,
        contactPhone,
        instagramUrl,
        facebookUrl,
        tiktokUrl,
        locationAddress,
      })
      setSuccessMsg(true)
      setTimeout(() => setSuccessMsg(false), 4000)
    } catch {
      alert('Error al guardar la configuración en Supabase.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6 vv-animate-page">
      <div>
        <VvHeading level={2} variant="serif" metallic>
          Perfil Comercial & Variables Dinámicas
        </VvHeading>
        <p className="text-xs text-[#7D7568]">
          Cambia tus números de teléfono, WhatsApp y enlaces sin tocar código ni redesplegar.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span>Configuración guardada exitosamente en Supabase. Los cambios ya son visibles en la web.</span>
          <VvBadge variant="success">Actualizado</VvBadge>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#D4AF37] vv-shimmer">Cargando configuración...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Teléfonos y Contacto Clave */}
          <VvCard variant="elevated" className="space-y-4 border-l-4 border-l-[#D4AF37]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F3D37A]">
              Líneas de Atención al Cliente (Dinámicas)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <VvTextInput
                label="WhatsApp para Cotizaciones (Con código de país)"
                helperText="Ej: 59170012345 (sin espacios ni guiones para enlace wa.me)"
                value={whatsappPhone}
                onChange={setWhatsappPhone}
                required
              />
              <VvTextInput
                label="Teléfono para Llamadas Telefónicas"
                helperText="Ej: +591 2 2456789 o celular directo"
                value={contactPhone}
                onChange={setContactPhone}
                required
              />
            </div>
          </VvCard>

          {/* Identidad de Marca */}
          <VvCard variant="surface" className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F9F6F0]">
              Identidad de Marca
            </h3>
            <VvTextInput
              label="Nombre Comercial del Negocio"
              value={businessName}
              onChange={setBusinessName}
              required
            />
            <VvTextInput
              label="Lema / Subtítulo Oficial"
              value={brandSubtitle}
              onChange={setBrandSubtitle}
              required
            />
            <VvTextArea
              label="Dirección del Taller / Showroom"
              value={locationAddress}
              onChange={setLocationAddress}
              rows={2}
            />
          </VvCard>

          {/* Redes Sociales */}
          <VvCard variant="surface" className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F9F6F0]">
              Redes Sociales Oficiales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <VvTextInput label="URL Instagram" value={instagramUrl} onChange={setInstagramUrl} />
              <VvTextInput label="URL Facebook" value={facebookUrl} onChange={setFacebookUrl} />
              <VvTextInput label="URL TikTok" value={tiktokUrl} onChange={setTiktokUrl} />
            </div>
          </VvCard>

          <div className="flex justify-end pt-2">
            <VvButton variant="gold" size="lg" type="submit" disabled={isSaving}>
              {isSaving ? 'Guardando en Supabase...' : 'Guardar Cambios del Perfil'}
            </VvButton>
          </div>
        </form>
      )}
    </div>
  )
}
