import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { EventFormContent } from '../../components/modals/EventFormContent'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'
import { formatReadableDate } from '../../data/vvInitialAppData'
import type { EventLifecycleStatus, EventRecord } from '../../types/vv-app'

export function AdminEventosPage() {
  const {
    state,
    navigate,
    deleteEvent,
    getCategoryName,
    isMobileView,
  } = useVvApp()

  const [activeTab, setActiveTab] = useState<EventLifecycleStatus>('activo')
  const [desktopModalOpen, setDesktopModalOpen] = useState(false)
  const [editingModalEvent, setEditingModalEvent] =
    useState<EventRecord | null>(null)
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)

  const activeEvents = state.events.filter((e) => e.status === 'activo')
  const completedEvents = state.events.filter((e) => e.status === 'completado')
  const displayedEvents =
    activeTab === 'activo' ? activeEvents : completedEvents

  const handleOpenCreateEvent = () => {
    if (isMobileView) {
      navigate('/admin/eventos/nuevo', { editEventId: null })
    } else {
      setEditingModalEvent(null)
      setDesktopModalOpen(true)
    }
  }

  const handleOpenEditEvent = (ev: EventRecord) => {
    if (isMobileView) {
      navigate('/admin/eventos/nuevo', { editEventId: ev.id })
    } else {
      setEditingModalEvent(ev)
      setDesktopModalOpen(true)
    }
  }

  const handleDeleteEvent = (ev: EventRecord) => {
    deleteEvent(ev.id)
    setBannerMessage(`El evento "${ev.name}" fue eliminado correctamente.`)
    setTimeout(() => setBannerMessage(null), 3000)
  }

  return (
    <AdminLayout
      title="Administrar Eventos"
      subtitle="Controla tus Eventos Actuales (Activos) y tus Eventos Realizados (Completados), con acceso rápido al detalle financiero."
      headerActions={
        <div className="flex flex-wrap items-center gap-2">
          <VvButton
            size="sm"
            variant="subtle"
            onClick={() =>
              navigate('/admin/eventos/nuevo', { editEventId: null })
            }
            title="Abrir vista de pantalla completa (/admin/eventos/nuevo)"
          >
            Pantalla /nuevo
          </VvButton>
          <VvButton
            size="md"
            variant="gold"
            onClick={handleOpenCreateEvent}
          >
            + Registrar Evento
          </VvButton>
        </div>
      }
    >
      {bannerMessage && (
        <div className="p-3.5 rounded-xl vv-badge-success text-xs font-medium">
          {bannerMessage}
        </div>
      )}

      {/* PESTAÑAS (TABS): Eventos Actuales (Activos) vs Eventos Realizados (Completados) */}
      <div
        className={`flex ${
          isMobileView ? 'flex-col items-stretch' : 'flex-wrap items-center'
        } gap-2.5 p-2.5 rounded-2xl vv-bg-surface border vv-border-gold`}
      >
        <VvButton
          size="md"
          variant={activeTab === 'activo' ? 'gold' : 'ghost'}
          onClick={() => setActiveTab('activo')}
          className={isMobileView ? 'w-full' : 'flex-1 sm:flex-initial'}
        >
          Eventos Actuales (Activos) ({activeEvents.length})
        </VvButton>
        <VvButton
          size="md"
          variant={activeTab === 'completado' ? 'gold' : 'ghost'}
          onClick={() => setActiveTab('completado')}
          className={isMobileView ? 'w-full' : 'flex-1 sm:flex-initial'}
        >
          Eventos Realizados (Completados) ({completedEvents.length})
        </VvButton>
      </div>

      {/* LISTA / GRILLA DE TARJETAS DE EVENTOS */}
      {displayedEvents.length === 0 ? (
        <VvCard variant="surface" className="p-10 text-center space-y-3">
          <VvHeading level={3} variant="serif">
            No hay eventos en esta pestaña
          </VvHeading>
          <p className="text-xs vv-text-secondary">
            Usa el botón &ldquo;+ Registrar Evento&rdquo; para añadir una nueva celebración.
          </p>
        </VvCard>
      ) : (
        <div
          className={`grid grid-cols-1 ${
            isMobileView ? 'gap-5' : 'lg:grid-cols-2 gap-6'
          }`}
        >
          {displayedEvents.map((ev) => {
            const pendingBs = Math.max(0, ev.totalPriceBs - ev.advancePriceBs)
            return (
              <VvCard
                key={ev.id}
                variant="surface"
                className="p-5 flex flex-col justify-between gap-4 hover:vv-border-gold-strong"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <VvBadge variant="gold">
                        {getCategoryName(ev.categoryId)}
                      </VvBadge>
                      <VvBadge
                        variant={ev.status === 'activo' ? 'info' : 'success'}
                      >
                        {ev.status === 'activo' ? 'Activo' : 'Completado'}
                      </VvBadge>
                    </div>
                    <span className="vv-font-mono text-xs vv-text-gold-light">
                      {formatReadableDate(ev.date)}
                    </span>
                  </div>

                  <div>
                    <VvHeading level={3} variant="serif">
                      {ev.name}
                    </VvHeading>
                    <p className="text-xs vv-text-secondary mt-1">
                      Cliente:{' '}
                      <strong className="vv-text-primary">{ev.clientName}</strong> ·
                      Tel: <span className="vv-font-mono">{ev.phone}</span>
                    </p>
                    <p className="text-xs vv-text-muted mt-0.5">
                      Lugar: {ev.venue}
                    </p>
                  </div>

                  {/* Resumen Financiero Compacto */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl vv-bg-elevated border vv-border-gold text-center">
                    <div>
                      <div className="text-xs vv-text-muted">Precio Total</div>
                      <div className="vv-font-mono text-xs font-semibold vv-text-primary">
                        Bs. {ev.totalPriceBs.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs vv-text-muted">Adelantado</div>
                      <div className="vv-font-mono text-xs font-semibold vv-text-secondary">
                        Bs. {ev.advancePriceBs.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs vv-text-muted">Falta Cobrar</div>
                      <div className="vv-font-mono text-xs font-bold vv-text-gold-light">
                        Bs. {pendingBs.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones de cada tarjeta: Ver Detalle, Editar, Eliminar */}
                <div className="pt-3 border-t vv-border-gold flex flex-wrap items-center justify-between gap-2">
                  <VvButton
                    size="sm"
                    variant="gold"
                    onClick={() =>
                      navigate('/admin/eventos/detalle', { eventId: ev.id })
                    }
                  >
                    Ver Detalle →
                  </VvButton>

                  <div className="flex items-center gap-2">
                    <VvButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEditEvent(ev)}
                    >
                      Editar
                    </VvButton>
                    <VvButton
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteEvent(ev)}
                    >
                      Eliminar
                    </VvButton>
                  </div>
                </div>
              </VvCard>
            )
          })}
        </div>
      )}

      {/* MODAL DE REGISTRO / EDICIÓN DE EVENTO EN DESKTOP */}
      {desktopModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Registrar o Editar Evento"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 vv-bg-glass overflow-y-auto"
        >
          <VvCard
            variant="gold-highlight"
            className="w-full max-w-2xl p-5 sm:p-6 space-y-5 my-auto vv-animate-modal"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <VvBadge variant="gold">Gestión de Eventos</VvBadge>
                <VvHeading level={3} variant="serif" className="mt-1">
                  {editingModalEvent
                    ? 'Editar Datos del Evento'
                    : 'Registrar Nuevo Evento'}
                </VvHeading>
              </div>
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => setDesktopModalOpen(false)}
              >
                ✕ Cerrar
              </VvButton>
            </div>

            <EventFormContent
              initialEvent={editingModalEvent}
              onCancel={() => setDesktopModalOpen(false)}
              onSuccess={(saved) => {
                setDesktopModalOpen(false)
                setBannerMessage(
                  `Evento "${saved.name}" guardado correctamente.`
                )
                setTimeout(() => setBannerMessage(null), 3000)
              }}
            />
          </VvCard>
        </div>
      )}
    </AdminLayout>
  )
}
