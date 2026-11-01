import React, { useState } from 'react'
import { useVvApp } from '../../context/VvAppContext'
import { getLocalIsoDate } from '../../data/vvInitialAppData'
import type { EventRecord } from '../../types/vv-app'
import {
  CategorySelectorWithInlineCreate,
  VvTextInput,
} from '../ui/VvFormControls'
import { VvBadge, VvButton } from '../ui/VvPrimitives'

export function EventFormContent({
  initialEvent,
  onSuccess,
  onCancel,
}: {
  initialEvent?: EventRecord | null
  onSuccess: (saved: EventRecord) => void
  onCancel: () => void
}) {
  const { state, addEvent, updateEvent, isMobileView } = useVvApp()

  const [name, setName] = useState(initialEvent?.name || '')
  const [clientName, setClientName] = useState(
    initialEvent?.clientName || ''
  )
  const [phone, setPhone] = useState(initialEvent?.phone || '')
  const [venue, setVenue] = useState(
    initialEvent?.venue || ''
  )
  const [date, setDate] = useState(
    initialEvent?.date || getLocalIsoDate(1)
  )
  const [categoryId, setCategoryId] = useState(
    initialEvent?.categoryId || state.categories[0]?.id || ''
  )
  const [totalPriceStr, setTotalPriceStr] = useState(
    initialEvent?.totalPriceBs !== undefined ? String(initialEvent.totalPriceBs) : '0'
  )
  const [advancePriceStr, setAdvancePriceStr] = useState(
    initialEvent?.advancePriceBs !== undefined ? String(initialEvent.advancePriceBs) : '0'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const totalNum = Math.max(0, Number(totalPriceStr) || 0)
  const advanceNum = Math.max(0, Number(advancePriceStr) || 0)
  const pendingBalance = Math.max(0, totalNum - advanceNum)

  const handleSubmit = () => {
    if (!name.trim() || !clientName.trim() || !venue.trim() || !date) {
      setErrorMessage(
        'Por favor completa el Nombre del Evento, Cliente, Lugar y Fecha.'
      )
      return
    }

    if (initialEvent) {
      const updated: EventRecord = {
        ...initialEvent,
        name: name.trim(),
        clientName: clientName.trim(),
        phone: phone.trim(),
        venue: venue.trim(),
        date,
        categoryId,
        totalPriceBs: totalNum,
        advancePriceBs: advanceNum,
      }
      updateEvent(initialEvent.id, updated)
      onSuccess(updated)
    } else {
      const created = addEvent({
        name: name.trim(),
        clientName: clientName.trim(),
        phone: phone.trim(),
        venue: venue.trim(),
        date,
        categoryId,
        totalPriceBs: totalNum,
        advancePriceBs: advanceNum,
      })
      onSuccess(created)
    }
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-xl vv-badge-danger text-xs font-medium">
          {errorMessage}
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-4' : 'sm:grid-cols-2 gap-4'
        }`}
      >
        <VvTextInput
          label="Nombre del Evento"
          required
          value={name}
          onChange={setName}
          placeholder="Ej. Boda Nupcial Gómez & Silva"
        />
        <VvTextInput
          label="Nombre del Cliente"
          required
          value={clientName}
          onChange={setClientName}
          placeholder="Ej. Marco Alejandro"
        />
      </div>

      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-4' : 'sm:grid-cols-2 gap-4'
        }`}
      >
        <VvTextInput
          label="Teléfono de Contacto"
          type="tel"
          required
          value={phone}
          onChange={setPhone}
          placeholder="70145892"
        />
        <VvTextInput
          label="Lugar / Salón de Recepciones"
          required
          value={venue}
          onChange={setVenue}
          placeholder="Ej. Salón Gran Emperador"
        />
      </div>

      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-4' : 'sm:grid-cols-2 gap-4'
        }`}
      >
        <VvTextInput
          label="Fecha del Evento"
          type="date"
          required
          min={getLocalIsoDate(0)}
          value={date}
          onChange={setDate}
          helperText="Fechas anteriores a hoy no están permitidas para nuevos eventos"
        />
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider vv-text-secondary">
            Cálculo Automático de Saldo
          </label>
          <div className="p-3 rounded-xl vv-bg-subtle border vv-border-gold flex items-center justify-between">
            <span className="text-xs vv-text-secondary">Saldo Pendiente:</span>
            <span className="text-base font-bold vv-font-mono vv-text-gold-metallic">
              Bs. {pendingBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-4' : 'sm:grid-cols-2 gap-4'
        }`}
      >
        <VvTextInput
          label="Precio Total Contratado (Bs.)"
          type="number"
          required
          value={totalPriceStr}
          onChange={setTotalPriceStr}
          placeholder="12000"
        />
        <VvTextInput
          label="Adelanto / Seña Recibida (Bs.)"
          type="number"
          required
          value={advancePriceStr}
          onChange={setAdvancePriceStr}
          placeholder="5000"
        />
      </div>

      <CategorySelectorWithInlineCreate
        label="Categoría del Evento"
        selectedCategoryId={categoryId}
        onSelectCategory={setCategoryId}
      />

      <div className="pt-2 flex items-center justify-end gap-3 border-t vv-border-gold">
        <VvButton size="md" variant="ghost" onClick={onCancel}>
          Cancelar
        </VvButton>
        <VvButton size="md" variant="gold" onClick={handleSubmit}>
          {initialEvent ? 'Guardar Cambios' : 'Registrar Evento'}
        </VvButton>
      </div>
    </div>
  )
}
