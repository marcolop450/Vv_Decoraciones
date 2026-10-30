import React from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { EventFormContent } from '../../components/modals/EventFormContent'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'

export function AdminEventoNuevoPage() {
  const { state, editingEventId, navigate } = useVvApp()

  const eventToEdit = editingEventId
    ? state.events.find((e) => e.id === editingEventId) || null
    : null

  return (
    <AdminLayout
      title={eventToEdit ? 'Editar Evento' : 'Registrar Nuevo Evento'}
      subtitle="Pantalla dedicada (/admin/eventos/nuevo) optimizada para registro cómodo desde dispositivos móviles o escritorio."
      headerActions={
        <VvButton
          size="sm"
          variant="outline"
          onClick={() => navigate('/admin/eventos')}
        >
          ← Volver a Eventos
        </VvButton>
      }
    >
      <VvCard variant="gold-highlight" className="p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b vv-border-gold">
          <div>
            <VvBadge variant="gold">Formulario Completo de Evento</VvBadge>
            <VvHeading level={3} variant="serif" className="mt-1">
              {eventToEdit
                ? `Editando: ${eventToEdit.name}`
                : 'Datos del Evento, Cliente y Presupuesto'}
            </VvHeading>
          </div>
          <span className="text-xs vv-text-muted">
            Se sincroniza con Calendario y Reportes
          </span>
        </div>

        <EventFormContent
          initialEvent={eventToEdit}
          onCancel={() => navigate('/admin/eventos')}
          onSuccess={(saved) =>
            navigate('/admin/eventos/detalle', { eventId: saved.id })
          }
        />
      </VvCard>
    </AdminLayout>
  )
}
