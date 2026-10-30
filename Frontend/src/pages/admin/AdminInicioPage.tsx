import React from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
  VvOrnamentDivider,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'
import { formatReadableDate } from '../../data/vvInitialAppData'
import type { AppRoute } from '../../types/vv-app'

export function AdminInicioPage() {
  const { state, navigate, getCategoryName, isMobileView } = useVvApp()

  const activeEvents = state.events.filter((e) => e.status === 'activo')
  const completedEvents = state.events.filter((e) => e.status === 'completado')
  const totalPendingBs = activeEvents.reduce(
    (acc, e) => acc + Math.max(0, e.totalPriceBs - e.advancePriceBs),
    0
  )

  const shortcuts: {
    route: AppRoute
    title: string
    description: string
    metric: string
    badge: string
  }[] = [
    {
      route: '/admin/fotos',
      title: 'Fotos del Catálogo',
      description:
        'Subir nuevas decoraciones, editar descripciones o crear categorías para el público.',
      metric: `${state.photos.length} Fotos Publicadas`,
      badge: 'Catálogo Público',
    },
    {
      route: '/admin/eventos',
      title: 'Administrar Eventos',
      description:
        'Gestionar eventos activos y completados, registrar clientes, adelantos y saldos.',
      metric: `${activeEvents.length} Activos · ${completedEvents.length} Realizados`,
      badge: 'Operaciones',
    },
    {
      route: '/admin/calendario',
      title: 'Calendario de Eventos',
      description:
        'Revisa el mes actual, el día de hoy y las fechas ocupadas con acceso directo al detalle.',
      metric: `${activeEvents.length} Fechas Programadas`,
      badge: 'Agenda Mensual',
    },
    {
      route: '/admin/reportes',
      title: 'Reportes + ChatBot IA',
      description:
        'Consulta ingresos, saldos pendientes por cobrar y pregunta al asistente inteligente.',
      metric: `Bs. ${totalPendingBs.toLocaleString()} por cobrar`,
      badge: 'Finanzas & IA',
    },
    {
      route: '/admin/bitacora',
      title: 'Bitácora de la Página',
      description:
        'Historial cronológico de inicios de sesión, creaciones, ediciones, eliminaciones y errores.',
      metric: `${state.bitacora.length} Movimientos`,
      badge: 'Auditoría',
    },
  ]

  return (
    <AdminLayout
      title="Panel Principal del Dueño"
      subtitle="Accesos directos rápidos optimizados para escritorio y móvil, junto con el estado de tus eventos activos de la semana."
      headerActions={
        <VvButton
          size="md"
          variant="gold"
          onClick={() =>
            navigate('/admin/eventos/nuevo', { editEventId: null })
          }
        >
          + Registrar Nuevo Evento
        </VvButton>
      }
    >
      {isMobileView ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <VvCard variant="gold-highlight" className="p-4 space-y-1">
              <div className="text-xs vv-text-gold-light font-medium">
                Eventos Activos
              </div>
              <div className="vv-font-serif text-2xl font-bold vv-text-primary">
                {activeEvents.length}
              </div>
            </VvCard>
            <VvCard variant="surface" className="p-4 space-y-1">
              <div className="text-xs vv-text-muted font-medium">
                Por Cobrar
              </div>
              <div className="vv-font-serif text-2xl font-bold vv-text-gold-metallic">
                Bs. {totalPendingBs.toLocaleString()}
              </div>
            </VvCard>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider vv-text-muted">
              Accesos Rápidos
            </div>
            <div className="grid grid-cols-2 gap-3">
              {shortcuts.map((item) => (
                <VvCard
                  key={item.route}
                  variant="surface"
                  onClick={() => navigate(item.route)}
                  className="p-3.5 flex flex-col justify-between gap-2 hover:vv-border-gold-strong"
                >
                  <div className="font-semibold text-sm vv-text-primary">
                    {item.title}
                  </div>
                  <div className="text-xs vv-text-gold-light font-medium">
                    {item.metric}
                  </div>
                </VvCard>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider vv-text-muted">
                Próximos Eventos ({activeEvents.length})
              </span>
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => navigate('/admin/eventos')}
              >
                Ver todos →
              </VvButton>
            </div>

            <div className="space-y-2.5">
              {activeEvents.length === 0 ? (
                <div className="p-4 rounded-xl vv-bg-surface border vv-border-gold text-center space-y-2">
                  <p className="text-xs vv-text-secondary">
                    No hay eventos activos programados en este momento.
                  </p>
                  <VvButton
                    size="sm"
                    variant="gold"
                    onClick={() =>
                      navigate('/admin/eventos/nuevo', { editEventId: null })
                    }
                  >
                    + Registrar Evento
                  </VvButton>
                </div>
              ) : (
                activeEvents.map((ev) => {
                  const pending = Math.max(0, ev.totalPriceBs - ev.advancePriceBs)
                  return (
                    <VvCard
                      key={ev.id}
                      variant="surface"
                      onClick={() =>
                        navigate('/admin/eventos/detalle', { eventId: ev.id })
                      }
                      className="p-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-semibold text-sm vv-text-primary truncate">
                          {ev.name}
                        </div>
                        <div className="text-xs vv-text-secondary truncate">
                          {ev.clientName} · {formatReadableDate(ev.date)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="vv-font-mono text-xs font-bold vv-text-gold-light">
                          Bs. {pending.toLocaleString()}
                        </div>
                        <div className="text-xs vv-text-muted">por cobrar</div>
                      </div>
                    </VvCard>
                  )
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <VvCard variant="gold-highlight" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-gold-light font-semibold">
                Eventos Activos de la Semana
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-primary">
                {activeEvents.length} Eventos
              </div>
              <p className="text-xs vv-text-secondary">
                En preparación y montaje programado
              </p>
            </VvCard>

            <VvCard variant="surface" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted font-semibold">
                Saldo Pendiente por Cobrar
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-gold-metallic">
                Bs. {totalPendingBs.toLocaleString()}
              </div>
              <p className="text-xs vv-text-secondary">
                Calculado sobre eventos activos
              </p>
            </VvCard>

            <VvCard variant="surface" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted font-semibold">
                Decoraciones en Catálogo
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-primary">
                {state.photos.length} Fotos
              </div>
              <p className="text-xs vv-text-secondary">
                En {state.categories.length} categorías activas
              </p>
            </VvCard>
          </div>

          <VvOrnamentDivider label="Accesos Directos Rápidos" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shortcuts.map((item) => (
              <VvCard
                key={item.route}
                variant="surface"
                onClick={() => navigate(item.route)}
                className="p-5 flex flex-col justify-between gap-4 hover:vv-border-gold-strong"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <VvBadge variant="gold">{item.badge}</VvBadge>
                    <span className="vv-font-mono text-xs vv-text-muted">
                      {item.route}
                    </span>
                  </div>
                  <VvHeading level={3} variant="serif">
                    {item.title}
                  </VvHeading>
                  <p className="text-xs vv-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t vv-border-gold flex items-center justify-between">
                  <span className="text-xs font-semibold vv-text-gold-light">
                    {item.metric}
                  </span>
                  <span className="text-xs vv-text-primary font-semibold">
                    Abrir →
                  </span>
                </div>
              </VvCard>
            ))}
          </div>

          <VvOrnamentDivider label="Eventos Activos de la Semana" />

          <VvCard variant="surface" className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <VvHeading level={3} variant="serif">
                  Agenda Próxima de Eventos Activos
                </VvHeading>
                <p className="text-xs vv-text-secondary">
                  Haz clic en cualquier evento para abrir su ficha completa en{' '}
                  <span className="vv-font-mono vv-text-gold-light">
                    /admin/eventos/detalle
                  </span>
                  .
                </p>
              </div>
              <VvButton
                size="sm"
                variant="outline"
                onClick={() => navigate('/admin/eventos')}
              >
                Ver Todos los Eventos
              </VvButton>
            </div>

            <div className="space-y-3.5">
              {activeEvents.length === 0 ? (
                <div className="p-8 rounded-xl vv-bg-surface border vv-border-gold text-center space-y-3">
                  <p className="text-sm vv-text-secondary">
                    No tienes eventos activos programados para los próximos días.
                  </p>
                  <div>
                    <VvButton
                      size="sm"
                      variant="gold"
                      onClick={() =>
                        navigate('/admin/eventos/nuevo', { editEventId: null })
                      }
                    >
                      + Registrar Primer Evento
                    </VvButton>
                  </div>
                </div>
              ) : (
                activeEvents.map((ev) => {
                  const pending = Math.max(0, ev.totalPriceBs - ev.advancePriceBs)
                  return (
                    <div
                      key={ev.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        navigate('/admin/eventos/detalle', { eventId: ev.id })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/admin/eventos/detalle', { eventId: ev.id })
                        }
                      }}
                      className="p-4 rounded-xl vv-bg-elevated border vv-border-gold hover:vv-border-gold-strong flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <VvBadge variant="gold">
                            {getCategoryName(ev.categoryId)}
                          </VvBadge>
                          <span className="vv-font-mono text-xs vv-text-gold-light">
                            {formatReadableDate(ev.date)}
                          </span>
                        </div>
                        <div className="font-semibold text-base vv-text-primary">
                          {ev.name}
                        </div>
                        <div className="text-xs vv-text-secondary">
                          Cliente:{' '}
                          <strong className="vv-text-primary">
                            {ev.clientName}
                          </strong>{' '}
                          ({ev.phone}) · Lugar: {ev.venue}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 vv-border-gold">
                        <div className="text-xs vv-text-muted">
                          Saldo que falta:
                        </div>
                        <div className="vv-font-serif text-lg font-bold vv-text-gold-metallic">
                          Bs. {pending.toLocaleString()}
                        </div>
                        <span className="text-xs vv-text-gold-light underline">
                          Ver Detalle →
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </VvCard>
        </>
      )}
    </AdminLayout>
  )
}
