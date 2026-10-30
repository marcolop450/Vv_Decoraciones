import React, { useState } from 'react'
import { useVvApp } from '../../context/VvAppContext'
import { VvTextInput } from '../ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../ui/VvPrimitives'

export function BusinessConfigModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { state, updateBusinessConfig } = useVvApp()
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

  if (!isOpen) return null

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
        onClose()
      }, 1500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Variables de Negocio y Teléfonos"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 vv-bg-glass overflow-y-auto"
    >
      <VvCard
        variant="gold-highlight"
        className="w-full max-w-lg p-5 sm:p-6 space-y-4 my-auto vv-animate-modal"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <VvBadge variant="gold">Configuración Comercial</VvBadge>
            <VvHeading level={3} variant="serif" className="mt-1">
              Variables de Negocio & Teléfonos
            </VvHeading>
            <p className="text-xs vv-text-secondary mt-1">
              Cambia el número de WhatsApp y datos de contacto sin alterar código ni redesplegar.
            </p>
          </div>
          <VvButton size="sm" variant="ghost" onClick={onClose}>
            ✕ Cerrar
          </VvButton>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl vv-badge-success text-xs font-semibold">
            ✓ Variables actualizadas correctamente en Supabase.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <VvTextInput
            label="Número de WhatsApp para Cotizaciones"
            required
            value={whatsappPhone}
            onChange={setWhatsappPhone}
            placeholder="Ej. 77885220 o 59177885220"
          />

          <VvTextInput
            label="Teléfono para Llamadas Telefónicas"
            required
            value={contactPhone}
            onChange={setContactPhone}
            placeholder="Ej. +591 77885220"
          />

          <VvTextInput
            label="Nombre Comercial"
            required
            value={businessName}
            onChange={setBusinessName}
            placeholder="Ej. V.v Decoración de eventos y cotillón"
          />

          <VvTextInput
            label="Eslogan / Subtítulo"
            value={brandSubtitle}
            onChange={setBrandSubtitle}
            placeholder="Ej. Gala Nocturna: Bodas, Quinceañeros..."
          />

          <div className="pt-3 border-t vv-border-gold flex items-center justify-end gap-2">
            <VvButton size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </VvButton>
            <VvButton size="md" variant="gold" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Variables'}
            </VvButton>
          </div>
        </form>
      </VvCard>
    </div>
  )
}
