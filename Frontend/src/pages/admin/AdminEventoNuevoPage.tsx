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
      title={eventToEdit ? 'Editar Evento' : 'Crear Evento'}
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
