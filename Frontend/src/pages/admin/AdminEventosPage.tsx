import React, { useState } from 'react'
import { VvButton, VvHeading, VvBadge, VvCard } from '../../components/ui/VvPrimitives'
import { VvTextInput, VvTextArea } from '../../components/ui/VvFormControls'
import { useEventos } from '../../hooks/useEventos'
import { formatBs, formatReadableDate } from '../../lib/utils'
import type { EventStatus } from '@eventos-vero/shared'

export function AdminEventosPage() {
  const { events, loading, createEvent, updateEventStatus } = useEventos()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<string>('todos')

  // Form State
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [categorySlug, setCategorySlug] = useState('bodas')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [totalPriceBs, setTotalPriceBs] = useState('0')
  const [advancePriceBs, setAdvancePriceBs] = useState('0')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createEvent({
        title,
        clientName,
        clientPhone,
        categorySlug,
        eventDate,
        location,
        totalPriceBs: parseFloat(totalPriceBs) || 0,
        advancePriceBs: parseFloat(advancePriceBs) || 0,
        status: 'confirmado',
        notes,
      })
      setShowCreateModal(false)
      setTitle('')
      setClientName('')
      setClientPhone('')
      setEventDate('')
      setLocation('')
      setTotalPriceBs('0')
      setAdvancePriceBs('0')
      setNotes('')
    } catch {
      alert('Error al crear el evento. Verifica los datos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = events.filter((e) => filter === 'todos' || e.status === filter)

  return (
    <div className="space-y-6 vv-animate-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <VvHeading level={2} variant="serif" metallic>
            Control de Eventos & Montajes
          </VvHeading>
          <p className="text-xs text-[#7D7568]">
            Administra cotizaciones, montajes en curso y pagos de clientes.
          </p>
        </div>
        <VvButton variant="gold" size="md" onClick={() => setShowCreateModal(true)}>
          + Registrar Nuevo Evento
        </VvButton>
      </div>

      {/* Filtros por Estado */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#D4AF37]/20 pb-4">
        {['todos', 'confirmado', 'en_montaje', 'finalizado', 'cotizacion'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
              filter === st
                ? 'bg-[#D4AF37] text-[#050505]'
                : 'bg-[#0E0E11] text-[#C4B9A5] border border-[#D4AF37]/20 hover:border-[#D4AF37]'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Lista de Eventos */}
      {loading ? (
        <div className="text-center py-12 text-[#D4AF37] vv-shimmer">Cargando eventos...</div>
      ) : filtered.length === 0 ? (
        <VvCard variant="surface" className="text-center py-12 text-sm text-[#7D7568]">
          No hay eventos en esta categoría de estado.
        </VvCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((evt) => (
            <VvCard key={evt.id} variant="surface" className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-[#D4AF37]">
                    {formatReadableDate(evt.eventDate)}
                  </span>
                  <h3 className="text-base font-bold text-[#F9F6F0]">{evt.title}</h3>
                </div>
                <VvBadge
                  variant={
                    evt.status === 'finalizado'
                      ? 'success'
                      : evt.status === 'en_montaje'
                        ? 'warning'
                        : 'gold'
                  }
                >
                  {evt.status.replace('_', ' ').toUpperCase()}
                </VvBadge>
              </div>

              <div className="text-xs text-[#C4B9A5] space-y-1">
                <p>Cliente: <strong className="text-[#F9F6F0]">{evt.clientName}</strong> ({evt.clientPhone})</p>
                <p>Lugar: {evt.location}</p>
                {evt.notes && <p className="text-[#7D7568]">Notas: {evt.notes}</p>}
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#7D7568]">Total: {formatBs(evt.totalPriceBs)}</span>
                  <span className="ml-3 font-semibold text-[#4ADE80]">
                    Saldo: {formatBs(evt.totalPriceBs - evt.advancePriceBs)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {evt.status !== 'en_montaje' && (
                    <button
                      onClick={() => updateEventStatus(evt.id, 'en_montaje', evt.title)}
                      className="px-2 py-1 rounded bg-[#F5B041]/20 text-[#F5B041] hover:bg-[#F5B041]/40 text-[10px]"
                    >
                      Montaje
                    </button>
                  )}
                  {evt.status !== 'finalizado' && (
                    <button
                      onClick={() => updateEventStatus(evt.id, 'finalizado', evt.title)}
                      className="px-2 py-1 rounded bg-[#2ECC71]/20 text-[#2ECC71] hover:bg-[#2ECC71]/40 text-[10px]"
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              </div>
            </VvCard>
          ))}
        </div>
      )}

      {/* Modal de Creación de Evento */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm vv-animate-modal">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-2xl bg-[#0E0E11] border border-[#D4AF37]/60 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-3">
              <VvHeading level={3} variant="serif" metallic>
                Registrar Nuevo Evento
              </VvHeading>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[#C4B9A5] hover:text-[#F9F6F0]"
              >
                ✕
              </button>
            </div>

            <VvTextInput label="Título del Evento" placeholder="Ej: Boda Gómez & Silva" value={title} onChange={setTitle} required />
            <div className="grid grid-cols-2 gap-3">
              <VvTextInput label="Nombre del Cliente" placeholder="Ej: Marcela Gómez" value={clientName} onChange={setClientName} required />
              <VvTextInput label="Teléfono Cliente" placeholder="Ej: 71234567" value={clientPhone} onChange={setClientPhone} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <VvTextInput label="Fecha del Evento" type="date" value={eventDate} onChange={setEventDate} required />
              <VvTextInput label="Ubicación / Salón" placeholder="Ej: Salón Las Palmeras" value={location} onChange={setLocation} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <VvTextInput label="Precio Total (Bs.)" type="number" value={totalPriceBs} onChange={setTotalPriceBs} required />
              <VvTextInput label="Adelanto / Seña (Bs.)" type="number" value={advancePriceBs} onChange={setAdvancePriceBs} required />
            </div>
            <VvTextArea label="Notas Operativas" placeholder="Requerimientos florales, mantelería, cotillón..." value={notes} onChange={setNotes} />

            <div className="flex justify-end gap-3 pt-3 border-t border-[#D4AF37]/20">
              <VvButton variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </VvButton>
              <VvButton variant="gold" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Evento'}
              </VvButton>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
