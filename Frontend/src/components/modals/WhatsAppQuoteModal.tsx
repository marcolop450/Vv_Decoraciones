import { useState } from 'react'
import { VvButton, VvHeading, VvBadge } from '../ui/VvPrimitives'
import { VvTextInput, VvTextArea } from '../ui/VvFormControls'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import { buildWhatsAppLink } from '../../lib/utils'

export function WhatsAppQuoteModal({
  isOpen,
  onClose,
  initialCategory,
}: {
  isOpen: boolean
  onClose: () => void
  initialCategory?: string
}) {
  const { config } = useConfiguracion()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState(initialCategory || 'Boda')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('100')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSendQuote = () => {
    const text = `Hola *${config.businessName}*, deseo cotizar una decoración:\n\n` +
      `- *Cliente*: ${name || 'Sin especificar'}\n` +
      `- *Teléfono*: ${phone || 'Sin especificar'}\n` +
      `- *Tipo de Evento*: ${eventType}\n` +
      `- *Fecha Estimada*: ${eventDate || 'Por definir'}\n` +
      `- *Invitados aprox.*: ${guestCount}\n` +
      (notes ? `- *Detalles/Colores*: ${notes}\n\n` : '\n') +
      `¿Podrían brindarme disponibilidad y opciones de paquetes de gala? Muchas gracias.`

    const url = buildWhatsAppLink(config.whatsappPhone, text)
    window.open(url, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm vv-animate-modal">
      <div className="w-full max-w-lg rounded-2xl bg-[#0E0E11] border border-[#D4AF37]/50 p-6 space-y-5 shadow-[0_0_35px_rgba(212,175,55,0.25)]">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
          <div>
            <VvBadge variant="gold">Cotizador Inmediato</VvBadge>
            <VvHeading level={3} variant="serif" metallic className="mt-1">
              Solicitar Cotización de Gala
            </VvHeading>
          </div>
          <button
            onClick={onClose}
            className="text-[#C4B9A5] hover:text-[#F9F6F0] text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <VvTextInput
            label="Tu Nombre Completo"
            placeholder="Ej: Verónica Méndez"
            value={name}
            onChange={setName}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C4B9A5]">
                Tipo de Celebración
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#D4AF37]/40 text-[#F9F6F0] text-sm focus:outline-none focus:border-[#F3D37A]"
              >
                <option value="Boda & Recepción">Boda & Recepción</option>
                <option value="XV Años Gala">XV Años Gala</option>
                <option value="Cotillón VIP / Hora Loca">Cotillón VIP / Hora Loca</option>
                <option value="Evento Corporativo">Evento Corporativo</option>
                <option value="Cumpleaños Exclusivo">Cumpleaños Exclusivo</option>
                <option value="Graduación">Graduación</option>
              </select>
            </div>

            <VvTextInput
              label="Fecha Estimada"
              type="date"
              value={eventDate}
              onChange={setEventDate}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <VvTextInput
              label="Teléfono / Celular"
              type="tel"
              placeholder="Ej: 70012345"
              value={phone}
              onChange={setPhone}
            />
            <VvTextInput
              label="Cantidad de Invitados"
              type="number"
              placeholder="100"
              value={guestCount}
              onChange={setGuestCount}
            />
          </div>

          <VvTextArea
            label="Estilo, Gama de Colores o Notas"
            placeholder="Ej: Salón en zona sur, colores negro con oro imperial, candelabros altos..."
            value={notes}
            onChange={setNotes}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/20">
          <VvButton variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </VvButton>
          <VvButton variant="gold" size="md" onClick={handleSendQuote}>
            Enviar a WhatsApp Directo
          </VvButton>
        </div>
      </div>
    </div>
  )
}
