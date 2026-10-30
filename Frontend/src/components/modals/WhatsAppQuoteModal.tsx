import React, { useMemo, useState } from 'react'
import { useVvApp } from '../../context/VvAppContext'
import {
  formatReadableDate,
  getLocalIsoDate,
} from '../../data/vvInitialAppData'
import { VvInlineInput } from '../ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../ui/VvPrimitives'

export function WhatsAppQuoteModal() {
  const { quotePhoto, closeWhatsAppQuote, getCategoryName, state } = useVvApp()
  const todayIso = useMemo(() => getLocalIsoDate(0), [])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [sentConfirmation, setSentConfirmation] = useState<string | null>(null)

  const calendarCells = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstWeekDay = (new Date(year, month, 1).getDay() + 6) % 7

    const cells: {
      dayNum: number
      iso: string
      isPast: boolean
      isToday: boolean
    }[] = []

    for (let d = 1; d <= daysInMonth; d++) {
      const monthPadded = String(month + 1).padStart(2, '0')
      const dayPadded = String(d).padStart(2, '0')
      const iso = `${year}-${monthPadded}-${dayPadded}`
      cells.push({
        dayNum: d,
        iso,
        isPast: iso < todayIso,
        isToday: iso === todayIso,
      })
    }

    return {
      firstWeekDay,
      cells,
      monthName: now.toLocaleString('es-ES', {
        month: 'long',
        year: 'numeric',
      }),
    }
  }, [todayIso])

  if (!quotePhoto) return null

  const targetPhone = (state.config?.whatsappPhone || '59177885220').replace(/[^0-9]/g, '')
  const photoUrlInfo = quotePhoto.imageUrl && quotePhoto.imageUrl.startsWith('http')
    ? `\nFoto de referencia: ${quotePhoto.imageUrl}`
    : ''
  const hasValidDate = Boolean(selectedDate && selectedDate >= todayIso)
  const whatsappMessage = hasValidDate
    ? `Hola, quiero cotizar la decoración ${quotePhoto.name} para la fecha ${selectedDate}.${photoUrlInfo}`
    : `Hola, quiero consultar por la decoración ${quotePhoto.name}.${photoUrlInfo}`

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage)
    const url = `https://wa.me/${targetPhone}?text=${encoded}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSentConfirmation(whatsappMessage)
  }

  const handleClose = () => {
    setSelectedDate('')
    setSentConfirmation(null)
    closeWhatsAppQuote()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cotizar Decoración por WhatsApp"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 vv-bg-glass overflow-y-auto"
    >
      <VvCard
        variant="gold-highlight"
        className="w-full max-w-lg p-4 sm:p-6 space-y-4 my-auto vv-animate-modal"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <VvBadge variant="gold">Cotización Directa por WhatsApp</VvBadge>
            <VvHeading level={3} variant="serif" className="mt-1">
              {quotePhoto.name}
            </VvHeading>
            <p className="text-xs vv-text-secondary mt-0.5">
              Categoría:{' '}
              <span className="vv-text-gold-light font-medium">
                {getCategoryName(quotePhoto.categoryId)}
              </span>
            </p>
          </div>
          <VvButton size="sm" variant="ghost" onClick={handleClose}>
            ✕
          </VvButton>
        </div>

        <div className="flex gap-3 p-3 rounded-xl vv-bg-elevated border vv-border-gold">
          <div className="w-20 h-20 rounded-lg overflow-hidden border vv-border-gold shrink-0">
            <img
              src={quotePhoto.imageUrl}
              alt={quotePhoto.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 text-xs space-y-1">
            <p className="vv-text-secondary line-clamp-3">
              {quotePhoto.description}
            </p>
          </div>
        </div>

        {/* REGLA 1: Mini Calendario con Bloqueo de Fechas Pasadas */}
        <div className="space-y-2 p-3.5 rounded-xl vv-bg-elevated border vv-border-gold">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider vv-text-secondary">
              ¿Para qué fecha deseas cotizar? (Opcional)
            </span>
            {selectedDate && (
              <span className="text-xs vv-text-gold font-medium">
                {formatReadableDate(selectedDate)}
              </span>
            )}
          </div>

          <div className="text-[11px] vv-text-muted capitalize">
            {calendarCells.monthName} · Fechas pasadas bloqueadas
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs pt-1">
            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((day) => (
              <span key={day} className="text-[10px] vv-text-muted font-bold py-0.5">
                {day}
              </span>
            ))}

            {Array.from({ length: calendarCells.firstWeekDay }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}

            {calendarCells.cells.map((cell) => {
              const isSelected = selectedDate === cell.iso
              if (cell.isPast) {
                return (
                  <span
                    key={cell.iso}
                    title="Fecha pasada no permitida"
                    className="py-1 rounded text-[11px] opacity-30 line-through cursor-not-allowed select-none vv-text-muted"
                  >
                    {cell.dayNum}
                  </span>
                )
              }

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => setSelectedDate(cell.iso)}
                  className={`py-1 rounded text-xs font-medium transition-all ${
                    isSelected
                      ? 'vv-bg-gold-gradient vv-text-on-gold font-bold shadow-sm scale-105'
                      : cell.isToday
                        ? 'border border-amber-400 vv-text-gold-light'
                        : 'vv-text-primary hover:vv-bg-subtle'
                  }`}
                >
                  {cell.dayNum}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t vv-border-gold">
            <span className="text-xs vv-text-secondary">O elige una fecha:</span>
            <VvInlineInput
              type="date"
              min={todayIso}
              value={selectedDate}
              onChange={(val) => setSelectedDate(val)}
              className="text-xs py-1.5"
            />
            {selectedDate && (
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => setSelectedDate('')}
                className="text-xs"
              >
                Limpiar fecha
              </VvButton>
            )}
          </div>
        </div>

        {/* REGLA 2: Dos Modos de Envío con Previsualización */}
        <div className="p-3.5 rounded-xl vv-bg-surface border vv-border-gold space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider vv-text-secondary">
              Mensaje que se enviará al WhatsApp:
            </span>
            <VvBadge variant={hasValidDate ? 'gold' : 'neutral'}>
              {hasValidDate ? 'Modo 1: Con Fecha' : 'Modo 2: Sin Fecha'}
            </VvBadge>
          </div>
          <div className="p-2.5 rounded-lg vv-bg-subtle text-xs vv-font-mono vv-text-gold-light border vv-border-gold">
            "{whatsappMessage}"
          </div>
        </div>

        {sentConfirmation && (
          <div className="p-3 rounded-xl vv-badge-success text-xs flex items-center justify-between">
            <span>Enlace de WhatsApp abierto en tu navegador.</span>
            <VvButton size="sm" variant="ghost" onClick={handleClose}>
              Cerrar
            </VvButton>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <VvButton size="md" variant="ghost" onClick={handleClose}>
            Cancelar
          </VvButton>
          <VvButton
            size="md"
            variant={hasValidDate ? 'gold' : 'outline'}
            onClick={handleSendWhatsApp}
          >
            {hasValidDate ? 'Enviar a WhatsApp' : 'Consultar sin fecha'}
          </VvButton>
        </div>
      </VvCard>
    </div>
  )
}
