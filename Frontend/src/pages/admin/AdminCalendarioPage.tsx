import React, { useMemo, useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'
import {
  formatReadableDate,
  getLocalIsoDate,
} from '../../data/vvInitialAppData'

export function AdminCalendarioPage() {
  const { state, navigate, getCategoryName, isMobileView } = useVvApp()
  const todayIso = useMemo(() => getLocalIsoDate(0), [])

  const initialYearMonth = useMemo(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  }, [])

  const [viewYear, setViewYear] = useState(initialYearMonth.year)
  const [viewMonth, setViewMonth] = useState(initialYearMonth.month)
  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso)

  const calendarGrid = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const firstDayWeekIndex =
      (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7 // Lunes = 0

    const days: {
      dayNum: number
      iso: string
      isToday: boolean
      eventsCount: number
      hasActiveEvent: boolean
    }[] = []

    for (let d = 1; d <= daysInMonth; d++) {
      const mPadded = String(viewMonth + 1).padStart(2, '0')
      const dPadded = String(d).padStart(2, '0')
      const iso = `${viewYear}-${mPadded}-${dPadded}`
      const dayEvents = state.events.filter((ev) => ev.date === iso)
      days.push({
        dayNum: d,
        iso,
        isToday: iso === todayIso,
        eventsCount: dayEvents.length,
        hasActiveEvent: dayEvents.some((ev) => ev.status === 'activo'),
      })
    }

    const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString(
      'es-ES',
      {
        month: 'long',
        year: 'numeric',
      }
    )

    return { firstDayWeekIndex, days, monthLabel }
  }, [viewYear, viewMonth, state.events, todayIso])

  const selectedDayEvents = useMemo(
    () => state.events.filter((ev) => ev.date === selectedDateIso),
    [state.events, selectedDateIso]
  )

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const handleJumpToday = () => {
    const now = new Date()
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    setSelectedDateIso(todayIso)
  }

  return (
    <AdminLayout
      title="Calendario de Eventos"
      subtitle="Calendario mensual interactivo con resaltado del Día Actual (Hoy), puntos de eventos registrados y acceso directo al detalle."
      headerActions={
        <div className="flex items-center gap-2">
          <VvButton size="sm" variant="subtle" onClick={handleJumpToday}>
            Ir a Hoy ({todayIso})
          </VvButton>
          <VvButton
            size="sm"
            variant="gold"
            onClick={() =>
              navigate('/admin/eventos/nuevo', { editEventId: null })
            }
          >
            + Nuevo Evento
          </VvButton>
        </div>
      }
    >
      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-6' : 'lg:grid-cols-12 gap-6'
        } items-start`}
      >
        {/* CALENDARIO MENSUAL INTERACTIVO */}
        <VvCard
          variant="surface"
          className={`${
            isMobileView ? '' : 'lg:col-span-7'
          } p-5 sm:p-6 space-y-5`}
        >
          <div className="flex items-center justify-between gap-2">
            <VvButton size="sm" variant="subtle" onClick={handlePrevMonth}>
              ← Mes Anterior
            </VvButton>
            <VvHeading
              level={3}
              variant="serif"
              className="capitalize text-center"
            >
              {calendarGrid.monthLabel}
            </VvHeading>
            <VvButton size="sm" variant="subtle" onClick={handleNextMonth}>
              Mes Siguiente →
            </VvButton>
          </div>

          {/* Leyenda de Indicadores */}
          <div className="flex flex-wrap items-center gap-4 text-xs vv-text-secondary pb-2 border-b vv-border-gold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 vv-border-gold-strong inline-block" />
              <span>Día Actual (Hoy)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Día con Evento(s)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded vv-bg-gold-gradient inline-block" />
              <span>Fecha Seleccionada</span>
            </div>
          </div>

          {/* Cabecera Días de la Semana */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold vv-text-muted">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Celdas del Mes */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: calendarGrid.firstDayWeekIndex }).map(
              (_, idx) => (
                <div key={`empty-${idx}`} className="h-14 sm:h-16" />
              )
            )}

            {calendarGrid.days.map((day) => {
              const isSelected = day.iso === selectedDateIso
              return (
                <div
                  key={day.iso}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedDateIso(day.iso)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedDateIso(day.iso)
                    }
                  }}
                  className={`h-14 sm:h-16 rounded-xl p-1.5 flex flex-col items-center justify-between transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'vv-bg-gold-gradient vv-text-on-gold font-bold vv-shadow-glow'
                      : day.isToday
                        ? 'vv-bg-elevated border-2 vv-border-gold-strong vv-text-gold-light font-bold'
                        : day.eventsCount > 0
                          ? 'vv-bg-elevated border vv-border-gold-strong vv-text-primary font-semibold'
                          : 'vv-bg-elevated border vv-border-gold vv-text-secondary hover:vv-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-between w-full px-0.5">
                    <span className="text-xs sm:text-sm">{day.dayNum}</span>
                    {day.isToday && (
                      <span
                        className={`text-xs uppercase px-1 rounded ${
                          isSelected
                            ? 'vv-bg-base vv-text-gold-light'
                            : 'vv-badge-gold'
                        }`}
                      >
                        Hoy
                      </span>
                    )}
                  </div>

                  {/* Indicadores de Eventos en el Día */}
                  <div className="flex items-center gap-1">
                    {day.eventsCount > 0 && (
                      <>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'vv-bg-base' : 'bg-amber-400'
                          }`}
                        />
                        <span className="text-xs font-mono">
                          {day.eventsCount} ev.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </VvCard>

        {/* LISTA DE EVENTOS DEL DÍA SELECCIONADO (Lateral en Desktop / Debajo en Móvil) */}
        <VvCard
          variant="gold-highlight"
          className={`${
            isMobileView ? '' : 'lg:col-span-5'
          } p-5 sm:p-6 space-y-4`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <VvBadge variant="gold">
                {selectedDateIso === todayIso
                  ? 'Día Actual (Hoy)'
                  : 'Fecha Seleccionada'}
              </VvBadge>
              <VvHeading level={3} variant="serif" className="mt-1">
                {formatReadableDate(selectedDateIso)}
              </VvHeading>
            </div>
            <span className="vv-font-mono text-xs vv-text-muted">
              {selectedDayEvents.length} evento(s)
            </span>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="p-6 rounded-xl vv-bg-surface border vv-border-gold text-center space-y-3">
              <p className="text-xs vv-text-secondary">
                No hay eventos registrados para esta fecha. Haz clic en los días
                marcados con punto dorado en el calendario o registra un evento
                nuevo.
              </p>
              <VvButton
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate('/admin/eventos/nuevo', { editEventId: null })
                }
              >
                + Registrar Evento en esta Fecha
              </VvButton>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs vv-text-secondary">
                Haz clic en cualquier evento de la lista para ir directamente a{' '}
                <span className="vv-font-mono vv-text-gold-light">
                  /admin/eventos/detalle
                </span>
                :
              </p>
              {selectedDayEvents.map((ev) => {
                const pending = Math.max(
                  0,
                  ev.totalPriceBs - ev.advancePriceBs
                )
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
                    className="p-4 rounded-xl vv-bg-surface border vv-border-gold hover:vv-border-gold-strong space-y-2 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <VvBadge variant="gold">
                        {getCategoryName(ev.categoryId)}
                      </VvBadge>
                      <VvBadge
                        variant={ev.status === 'activo' ? 'info' : 'success'}
                      >
                        {ev.status === 'activo' ? 'Activo' : 'Completado'}
                      </VvBadge>
                    </div>
                    <div className="font-semibold text-sm vv-text-primary">
                      {ev.name}
                    </div>
                    <div className="text-xs vv-text-secondary">
                      Cliente: <strong className="vv-text-primary">{ev.clientName}</strong>{' '}
                      · {ev.venue}
                    </div>
                    <div className="pt-2 border-t vv-border-gold flex items-center justify-between text-xs">
                      <span className="vv-text-gold-light font-semibold">
                        Saldo pendiente: Bs. {pending.toLocaleString()}
                      </span>
                      <span className="vv-text-primary underline font-medium">
                        Abrir Detalle →
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </VvCard>
      </div>
    </AdminLayout>
  )
}
