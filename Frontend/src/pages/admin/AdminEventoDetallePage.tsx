import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PublishEventPhotoModal } from '../../components/modals/PublishEventPhotoModal'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
  VvOrnamentDivider,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'
import { formatReadableDate } from '../../data/vvInitialAppData'

export function AdminEventoDetallePage() {
  const {
    state,
    selectedEventId,
    navigate,
    markEventCompleted,
    getCategoryName,
    isMobileView,
  } = useVvApp()

  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const event =
    state.events.find((e) => e.id === selectedEventId) || state.events[0]

  if (!event) {
    return (
      <AdminLayout title="Detalle de Evento">
        <VvCard variant="surface" className="p-8 text-center space-y-3">
          <VvHeading level={3} variant="serif">
            No hay ningún evento seleccionado
          </VvHeading>
          <VvButton
            size="md"
            variant="gold"
            onClick={() => navigate('/admin/eventos')}
          >
            Ir a Lista de Eventos
          </VvButton>
        </VvCard>
      </AdminLayout>
    )
  }

  const pendingBalanceBs = Math.max(
    0,
    event.totalPriceBs - event.advancePriceBs
  )

  const handleCompleteAndPromptPhoto = () => {
    markEventCompleted(event.id)
    setPhotoModalOpen(true)
    setToastMessage(
      '¡Evento marcado como Completado! Ahora puedes publicar su foto en el catálogo.'
    )
  }

  return (
    <AdminLayout
      title="Detalle de Evento"
      subtitle="Ficha completa del evento, estado financiero con cálculo automático de saldo pendiente y conexión directa con el catálogo de fotos."
      headerActions={
        <div className="flex flex-wrap items-center gap-2">
          <VvButton
            size="sm"
            variant="subtle"
            onClick={() => navigate('/admin/eventos')}
          >
            ← Volver a Eventos
          </VvButton>
          <VvButton
            size="sm"
            variant="outline"
            onClick={() =>
              navigate('/admin/eventos/nuevo', { editEventId: event.id })
            }
          >
            Editar Evento
          </VvButton>
        </div>
      }
    >
      {!isMobileView && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs vv-text-muted">Cambiar evento:</span>
          {state.events.map((item) => (
            <VvButton
              key={item.id}
              size="sm"
              variant={item.id === event.id ? 'gold' : 'subtle'}
              onClick={() =>
                navigate('/admin/eventos/detalle', { eventId: item.id })
              }
            >
              {item.name}
            </VvButton>
          ))}
        </div>
      )}

      {toastMessage && (
        <div className="p-4 rounded-xl vv-badge-success text-xs font-medium">
          {toastMessage}
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-6' : 'lg:grid-cols-12 gap-6'
        }`}
      >
        {/* INFORMACIÓN GENERAL DEL EVENTO */}
        <VvCard
          variant="surface"
          className={`${isMobileView ? '' : 'lg:col-span-7'} p-6 space-y-6`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <VvBadge variant="gold">
                {getCategoryName(event.categoryId)}
              </VvBadge>
              <VvBadge
                variant={event.status === 'activo' ? 'info' : 'success'}
              >
                {event.status === 'activo'
                  ? '● Evento Activo'
                  : '✓ Evento Completado'}
              </VvBadge>
            </div>
            <span className="vv-font-mono text-xs vv-text-muted">
              ID: {event.id}
            </span>
          </div>

          <div>
            <VvHeading level={2} variant="serif" metallic>
              {event.name}
            </VvHeading>
            <p className="text-xs vv-text-secondary mt-1">
              Fecha programada:{' '}
              <strong className="vv-text-gold-light">
                {formatReadableDate(event.date)} ({event.date})
              </strong>
            </p>
          </div>

          <div
            className={`grid grid-cols-1 ${
              isMobileView ? 'gap-3.5' : 'sm:grid-cols-2 gap-4'
            }`}
          >
            <div className="p-4 rounded-xl vv-bg-elevated border vv-border-gold space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted">
                Cliente
              </div>
              <div className="font-semibold text-base vv-text-primary">
                {event.clientName}
              </div>
            </div>

            <div className="p-4 rounded-xl vv-bg-elevated border vv-border-gold space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted">
                Número de Teléfono
              </div>
              <div className="vv-font-mono font-semibold text-base vv-text-gold-light">
                {event.phone}
              </div>
            </div>

            <div
              className={`${
                isMobileView ? '' : 'sm:col-span-2'
              } p-4 rounded-xl vv-bg-elevated border vv-border-gold space-y-1`}
            >
              <div className="text-xs uppercase tracking-wider vv-text-muted">
                Lugar del Evento
              </div>
              <div className="font-medium text-sm vv-text-primary">
                {event.venue}
              </div>
            </div>

            <div className="p-4 rounded-xl vv-bg-elevated border vv-border-gold space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted">
                Fecha del Evento
              </div>
              <div className="font-medium text-sm vv-text-primary">
                {formatReadableDate(event.date)}
              </div>
            </div>

            <div className="p-4 rounded-xl vv-bg-elevated border vv-border-gold space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted">
                Categoría
              </div>
              <div className="font-medium text-sm vv-text-gold-light">
                {getCategoryName(event.categoryId)}
              </div>
            </div>
          </div>
        </VvCard>

        {/* BLOQUE FINANCIERO DESTACADO Y ACCIONES DE ESTADO */}
        <div className={`${isMobileView ? '' : 'lg:col-span-5'} space-y-6`}>
          <VvCard variant="gold-highlight" className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <VvBadge variant="gold">Resumen Financiero</VvBadge>
              <span className="vv-font-mono text-xs vv-text-muted">
                Moneda: Bolivianos (Bs)
              </span>
            </div>

            <VvHeading level={3} variant="serif">
              Estado de Cuenta del Evento
            </VvHeading>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl vv-bg-surface border vv-border-gold flex items-center justify-between">
                <span className="text-xs vv-text-secondary">Precio Total</span>
                <span className="vv-font-mono text-base font-semibold vv-text-primary">
                  Bs. {event.totalPriceBs.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl vv-bg-surface border vv-border-gold flex items-center justify-between">
                <span className="text-xs vv-text-secondary">
                  Precio Adelantado
                </span>
                <span className="vv-font-mono text-base font-semibold vv-text-gold-light">
                  - Bs. {event.advancePriceBs.toLocaleString()}
                </span>
              </div>

              {/* PRECIO QUE FALTA / SALDO PENDIENTE CALCULADO AUTOMÁTICAMENTE */}
              <div className="p-4 rounded-xl vv-bg-elevated border-2 vv-border-gold-strong flex items-center justify-between vv-shadow-glow">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider vv-text-gold-light">
                    Precio que Falta / Saldo Pendiente
                  </div>
                  <div className="text-xs vv-text-muted mt-0.5">
                    Cálculo automático: Total − Adelantado
                  </div>
                </div>
                <div className="vv-font-serif text-2xl sm:text-3xl font-bold vv-text-gold-metallic">
                  Bs. {pendingBalanceBs.toLocaleString()}
                </div>
              </div>
            </div>
          </VvCard>

          {/* ACCIONES DE ESTADO CONECTADAS CON FOTOS */}
          <VvCard variant="surface" className="p-6 space-y-4">
            <VvHeading level={4} variant="serif">
              Acciones de Cierre y Catálogo
            </VvHeading>

            {event.status === 'activo' ? (
              <div className="space-y-3">
                <p className="text-xs vv-text-secondary leading-relaxed">
                  Este evento está actualmente <strong className="vv-text-primary">Activo</strong>.
                  Al marcarlo como completado, podrás registrar inmediatamente la
                  fotografía del evento en el catálogo público (
                  <span className="vv-font-mono vv-text-gold-light">/admin/fotos</span>).
                </p>
                <VvButton
                  size="lg"
                  variant="gold"
                  onClick={handleCompleteAndPromptPhoto}
                  className="w-full"
                >
                  ✓ Marcar Evento como Completado
                </VvButton>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl vv-badge-success text-xs">
                  Este evento ya se encuentra marcado como{' '}
                  <strong>Completado</strong>.
                </div>
                <p className="text-xs vv-text-secondary">
                  ¿Deseas publicar otra fotografía de este evento en el catálogo de
                  decoraciones?
                </p>
                <VvButton
                  size="md"
                  variant="outline"
                  onClick={() => setPhotoModalOpen(true)}
                  className="w-full"
                >
                  + Registrar Foto del Evento en Catálogo
                </VvButton>
              </div>
            )}
          </VvCard>
        </div>
      </div>

      <VvOrnamentDivider />

      {/* MODAL CONECTADO PARA REGISTRAR FOTO DEL EVENTO */}
      {photoModalOpen && (
        <PublishEventPhotoModal
          event={event}
          onClose={() => setPhotoModalOpen(false)}
          onPublished={() => {
            setPhotoModalOpen(false)
            navigate('/admin/fotos')
          }}
        />
      )}
    </AdminLayout>
  )
}
