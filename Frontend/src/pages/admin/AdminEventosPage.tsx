import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
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
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)

  const activeEvents = state.events.filter((e) => e.status === 'activo')
  const completedEvents = state.events.filter((e) => e.status === 'completado')
  const displayedEvents =
    activeTab === 'activo' ? activeEvents : completedEvents

  const handleOpenCreateEvent = () => {
    navigate('/admin/eventos/nuevo', { editEventId: null })
  }

  const handleOpenEditEvent = (ev: EventRecord) => {
    navigate('/admin/eventos/nuevo', { editEventId: ev.id })
  }

  const handleDeleteEvent = (ev: EventRecord) => {
    deleteEvent(ev.id)
    setBannerMessage(`El evento "${ev.name}" fue eliminado correctamente.`)
    setTimeout(() => setBannerMessage(null), 3000)
  }

  return (
    <AdminLayout
      title="Administrar Eventos"
      headerActions={
        <VvButton
          size="md"
          variant="gold"
          onClick={handleOpenCreateEvent}
          className="whitespace-nowrap"
        >
          + Registrar Evento
        </VvButton>
      }
    >
      {bannerMessage && (
        <div className="p-3.5 rounded-xl vv-badge-success text-xs font-medium">
          {bannerMessage}
        </div>
      )}

      <div className="space-y-3">
        {/* Barra de control: Tabs de Eventos + Botón Registrar en móvil y escritorio */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex p-1 rounded-xl vv-bg-surface border vv-border-gold flex-1 sm:max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab('activo')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'activo'
                  ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                  : 'vv-text-muted hover:vv-text-secondary'
              }`}
            >
              Eventos Activos ({activeEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completado')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'completado'
                  ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                  : 'vv-text-muted hover:vv-text-secondary'
              }`}
            >
              Eventos Realizados ({completedEvents.length})
            </button>
          </div>

          <VvButton
            size="md"
            variant="gold"
            onClick={handleOpenCreateEvent}
            className="w-full sm:w-auto shadow-sm"
          >
            + Registrar Evento
          </VvButton>
        </div>

        {/* LISTA / GRILLA DE TARJETAS DE EVENTOS - Unificada sin separación excesiva */}
        {displayedEvents.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-2xl vv-bg-surface border vv-border-gold text-center space-y-3">
            <VvHeading level={3} variant="serif" className="text-lg sm:text-xl">
              No hay eventos en esta pestaña
            </VvHeading>
            <p className="text-xs vv-text-secondary leading-relaxed max-w-sm mx-auto">
              Usa el botón &ldquo;+ Registrar Evento&rdquo; para registrar una nueva celebración y agendar su fecha.
            </p>
            <div>
              <VvButton size="sm" variant="gold" onClick={handleOpenCreateEvent}>
                + Registrar Primer Evento
              </VvButton>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              isMobileView ? 'gap-4' : 'lg:grid-cols-2 gap-5'
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
      </div>
    </AdminLayout>
  )
}
