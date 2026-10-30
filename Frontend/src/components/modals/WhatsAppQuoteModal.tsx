import { useState } from 'react'
import { VvButton, VvBadge } from '../ui/VvPrimitives'
import { VvTextInput, VvTextArea } from '../ui/VvFormControls'
import { VvModal } from '../ui/VvModal'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import { buildWhatsAppLink } from '../../lib/utils'

export function WhatsAppQuoteModal({
  isOpen,
  onClose,
  initialCategory,
  quotedPhoto,
}: {
  isOpen: boolean
  onClose: () => void
  initialCategory?: string
  quotedPhoto?: { title: string; publicUrl: string } | null
}) {
  const { config } = useConfiguracion()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState(initialCategory || 'Boda & Recepción')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('100')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSendQuote = () => {
    const photoLine = quotedPhoto
      ? `- *Diseño de Referencia*: ${quotedPhoto.title}\n- *Ver Foto*: ${quotedPhoto.publicUrl}\n`
      : ''

    const text =
      `Hola *${config.businessName}*, deseo cotizar una decoración:\n\n` +
      `- *Cliente*: ${name || 'Sin especificar'}\n` +
      `- *Teléfono*: ${phone || 'Sin especificar'}\n` +
      `- *Tipo de Evento*: ${eventType}\n` +
      `- *Fecha Estimada*: ${eventDate || 'Por definir'}\n` +
      `- *Invitados aprox.*: ${guestCount}\n` +
      photoLine +
      (notes ? `- *Detalles/Colores*: ${notes}\n\n` : '\n') +
      `¿Podrían confirmarme disponibilidad y paquetes de gala? Muchas gracias.`

    const url = buildWhatsAppLink(config.whatsappPhone, text)
    window.open(url, '_blank')
    onClose()
  }

  return (
    <VvModal
      isOpen={isOpen}
      onClose={onClose}
      title="Solicitar Cotización de Gala"
      subtitle="Presupuesto y disponibilidad directa por WhatsApp"
      size="md"
    >
      <div className="space-y-4">
        {/* Banner de Diseño / Fotografía seleccionada */}
        {quotedPhoto && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#16161B] border border-[#D4AF37]/40">
            <img
              src={quotedPhoto.publicUrl}
              alt={quotedPhoto.title}
              className="w-14 h-14 object-cover rounded-lg border border-[#D4AF37]/30"
            />
            <div className="flex-1 min-w-0">
              <VvBadge variant="gold" className="text-[10px] uppercase tracking-wider mb-1">
                Diseño del catálogo
              </VvBadge>
              <p className="text-xs font-bold text-[#F9F6F0] truncate">{quotedPhoto.title}</p>
              <p className="text-[11px] text-[#C4B9A5]">Se adjuntará el enlace directo en el mensaje</p>
            </div>
          </div>
        )}

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

        {/* Acciones del formulario */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/20">
          <VvButton variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </VvButton>
          <VvButton variant="gold" size="md" onClick={handleSendQuote}>
            Enviar a WhatsApp Directo
          </VvButton>
        </div>
      </div>
    </VvModal>
  )
}
