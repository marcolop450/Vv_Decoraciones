import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useVvApp } from '../../context/VvAppContext'
import { VvTextInput } from '../../components/ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'

export function AdminConfiguracionPage() {
  const { state, updateBusinessConfig, navigate } = useVvApp()
  const [whatsappPhone, setWhatsappPhone] = useState(
    state.config?.whatsappPhone || '59177885220'
  )
  const [contactPhone, setContactPhone] = useState(
    state.config?.contactPhone || '+591 77885220'
  )
  const [businessName, setBusinessName] = useState(
    state.config?.businessName || 'V.v Decoración de eventos y cotillón'
  )
  const [brandSubtitle, setBrandSubtitle] = useState(
    state.config?.brandSubtitle ||
      'Gala Nocturna: Bodas, Quinceañeros, Cumpleaños y Galas Corporativas'
  )
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedSuccess(false)
    try {
      await updateBusinessConfig({
        whatsappPhone: whatsappPhone.trim(),
        contactPhone: contactPhone.trim(),
        businessName: businessName.trim(),
        brandSubtitle: brandSubtitle.trim(),
      })
      setSavedSuccess(true)
      setTimeout(() => {
        setSavedSuccess(false)
      }, 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout
      title="Variables de Negocio & Teléfonos"
      subtitle="Configuración comercial centralizada: edita teléfonos de WhatsApp, nombre y datos de contacto sin alterar código ni redesplegar."
      headerActions={
        <VvButton
          size="sm"
          variant="subtle"
          onClick={() => navigate('/landing')}
        >
          Ver Web Pública →
        </VvButton>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-xl vv-badge-success text-sm font-semibold vv-animate-fade">
            ✓ Variables actualizadas correctamente y persistidas en Supabase.
          </div>
        )}

        <VvCard variant="gold-highlight" className="p-6 sm:p-8 space-y-6">
          <div className="border-b vv-border-gold pb-4 flex items-center justify-between">
            <div>
              <VvBadge variant="gold">Parámetros Operativos</VvBadge>
              <VvHeading level={3} variant="serif" className="mt-1">
                Datos de Contacto y Marca
              </VvHeading>
            </div>
            <span className="text-xs vv-text-secondary">
              Persistencia en tiempo real
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <VvTextInput
              label="Número de WhatsApp para Cotizaciones *"
              required
              value={whatsappPhone}
              onChange={setWhatsappPhone}
              placeholder="Ej. 59177885220"
              helperText="El cliente enviará el mensaje predeterminado con foto a este número."
            />

            <VvTextInput
              label="Teléfono para Llamadas Telefónicas *"
              required
              value={contactPhone}
              onChange={setContactPhone}
              placeholder="Ej. +591 77885220"
              helperText="Mostrado en los encabezados y enlaces tel: del sitio web."
            />

            <VvTextInput
              label="Nombre Comercial de la Empresa *"
              required
              value={businessName}
              onChange={setBusinessName}
              placeholder="Ej. V.v Decoración de eventos y cotillón"
            />

            <VvTextInput
              label="Subtítulo o Eslogan Principal de Marca"
              value={brandSubtitle}
              onChange={setBrandSubtitle}
              placeholder="Ej. Gala Nocturna: Bodas, Quinceañeros, Cumpleaños y Galas Corporativas"
            />

            <div className="pt-4 border-t vv-border-gold flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs vv-text-muted">
                Los cambios se reflejan inmediatamente en la web pública y en el panel.
              </span>
              <VvButton
                type="submit"
                variant="gold"
                disabled={saving}
                className="w-full sm:w-auto min-w-[160px]"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </VvButton>
            </div>
          </form>
        </VvCard>
      </div>
    </AdminLayout>
  )
}
