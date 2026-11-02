import React from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { EventFormContent } from '../../components/modals/EventFormContent'
import { VvButton } from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'

export function AdminEventoNuevoPage() {
  const { state, editingEventId, navigate } = useVvApp()

  const eventToEdit = editingEventId
    ? state.events.find((e) => e.id === editingEventId) || null
    : null

  return (
    <AdminLayout
      title={eventToEdit ? 'Editar Evento' : 'Crear Evento'}
      hideBottomNav={true}
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
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Barra de retorno rápida en móvil */}
        <div className="flex md:hidden items-center justify-between pb-2 border-b vv-border-gold">
          <button
            type="button"
            onClick={() => navigate('/admin/eventos')}
            className="text-xs font-semibold vv-text-gold-light hover:underline flex items-center gap-1 cursor-pointer py-1"
          >
            ← Volver a Eventos
          </button>
          <span className="text-xs vv-text-muted">
            {eventToEdit ? 'Modo Edición' : 'Nuevo Registro'}
          </span>
        </div>

        {/* Formulario a pantalla completa en móvil sin bordes de tarjeta ni apariencia de modal */}
        <div className="rounded-2xl sm:border sm:vv-border-gold sm:vv-bg-surface p-0 sm:p-6 md:p-8 space-y-5">
          <EventFormContent
            initialEvent={eventToEdit}
            onCancel={() => navigate('/admin/eventos')}
            onSuccess={(saved) =>
              navigate('/admin/eventos/detalle', { eventId: saved.id })
            }
          />
        </div>
      </div>
    </AdminLayout>
  )
}
