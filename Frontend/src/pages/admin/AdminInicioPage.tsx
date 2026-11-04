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
    icon: React.ReactNode
  }[] = [
    {
      route: '/admin/eventos',
      title: 'Administrar Eventos',
      description:
        'Gestionar eventos activos y completados, registrar clientes, adelantos y saldos.',
      metric: `${activeEvents.length} Activos · ${completedEvents.length} Realizados`,
      icon: (
        <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      route: '/admin/calendario',
      title: 'Calendario de Eventos',
      description:
        'Revisa el mes actual, el día de hoy y las fechas ocupadas con acceso directo a la agenda.',
      metric: `${activeEvents.length} Fechas Programadas`,
      icon: (
        <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      route: '/admin/fotos',
      title: 'Fotos del Catálogo',
      description:
        'Subir nuevas decoraciones, editar descripciones o crear categorías para el público.',
      metric: `${state.photos.length} Fotos Publicadas`,
      icon: (
        <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M21 15l-5-5L5 20" />
        </svg>
      ),
    },
    {
      route: '/admin/reportes',
      title: 'Reportes + ChatBot IA',
      description:
        'Consulta ingresos, saldos pendientes por cobrar y pregunta al asistente inteligente.',
      metric: `Bs. ${totalPendingBs.toLocaleString()} por cobrar`,
      icon: (
        <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      route: '/admin/bitacora',
      title: 'Bitácora de la Página',
      description:
        'Historial cronológico de inicios de sesión, creaciones, ediciones, eliminaciones y registros.',
      metric: `${state.bitacora.length} Movimientos`,
      icon: (
        <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ]

  return (
    <AdminLayout
      title="Panel Principal"
      headerActions={
        <VvButton
          size="sm"
          variant="gold"
          onClick={() =>
            navigate('/admin/eventos/nuevo', { editEventId: null })
          }
          className="hidden md:flex whitespace-nowrap shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
        >
          + Registrar Evento
        </VvButton>
      }
    >
      {/* Botón flotante (+) anclado persistentemente a la pantalla */}
      {isMobileView && (
        <button
          type="button"
          onClick={() => navigate('/admin/eventos/nuevo', { editEventId: null })}
          className="fixed bottom-22 right-5 z-40 w-14 h-14 rounded-full vv-bg-gold-gradient text-[#0B0B0E] flex items-center justify-center shadow-[0_6px_25px_rgba(212,175,55,0.5)] border-2 border-[#fff3b0] hover:scale-105 active:scale-90 transition-transform cursor-pointer"
          aria-label="Registrar Evento"
        >
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

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
            {/* Cuadrados simples en móvil (2 columnas simétricas) */}
            <div className="grid grid-cols-2 gap-3">
              {shortcuts.map((item) => (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="aspect-square p-4 rounded-2xl vv-bg-surface border vv-border-gold hover:border-[#D4AF37] active:scale-95 transition-all flex flex-col items-center justify-center text-center gap-2.5 group shadow-sm cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl vv-bg-elevated border vv-border-gold flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform shadow-inner">
                    {item.icon}
                  </div>
                  <div className="font-semibold text-xs vv-text-primary leading-tight">
                    {item.title}
                  </div>
                </button>
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
          {/* Tarjetas Principales de Métricas (Sin texto redundante) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <VvCard variant="gold-highlight" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-gold-light font-semibold">
                Eventos Activos de la Semana
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-primary">
                {activeEvents.length} Eventos
              </div>
            </VvCard>

            <VvCard variant="surface" className="p-5 space-y-1 border vv-border-gold">
              <div className="text-xs uppercase tracking-wider vv-text-muted font-semibold">
                Saldo Pendiente por Cobrar
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-gold-metallic">
                Bs. {totalPendingBs.toLocaleString()}
              </div>
            </VvCard>

            <VvCard variant="surface" className="p-5 space-y-1 border vv-border-gold">
              <div className="text-xs uppercase tracking-wider vv-text-muted font-semibold">
                Decoraciones en Catálogo
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-primary">
                {state.photos.length} Fotos
              </div>
            </VvCard>
          </div>

          <VvOrnamentDivider label="Accesos Directos Rápidos" />

          {/* Grilla Recreada de Accesos Rápidos (Elegante y Limpia) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shortcuts.map((item) => (
              <VvCard
                key={item.route}
                variant="surface"
                onClick={() => navigate(item.route)}
                className="p-5 flex flex-col justify-between gap-4 vv-animate-card hover:-translate-y-1.5 hover:border-[#D4AF37]/80 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] border vv-border-gold"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl vv-bg-elevated border vv-border-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <VvHeading level={3} variant="serif" className="group-hover:text-[#F3D37A] transition-colors text-lg">
                      {item.title}
                    </VvHeading>
                  </div>
                  <p className="text-xs vv-text-secondary leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t vv-border-gold flex items-center justify-between">
                  <span className="text-xs font-semibold vv-text-gold-light">
                    {item.metric}
                  </span>
                  <span className="text-xs vv-text-primary font-semibold group-hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                    Abrir <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </VvCard>
            ))}
          </div>

          <VvOrnamentDivider label="Eventos Activos de la Semana" />

          <VvCard variant="surface" className="p-5 sm:p-6 space-y-4 border vv-border-gold">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <VvHeading level={3} variant="serif">
                  Agenda Próxima de Eventos Activos
                </VvHeading>
                <p className="text-xs vv-text-secondary">
                  Selecciona cualquier evento para consultar y actualizar sus detalles de montaje.
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
                      className="p-4 rounded-xl vv-bg-elevated border vv-border-gold hover:border-[#D4AF37] flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5"
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
                          Saldo pendiente:
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
