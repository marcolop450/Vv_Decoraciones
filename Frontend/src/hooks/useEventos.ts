import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { VvEvent, VvBitacoraEntry, EventStatus } from '@eventos-vero/shared'

export function useEventos() {
  const [events, setEvents] = useState<VvEvent[]>([])
  const [bitacora, setBitacora] = useState<VvBitacoraEntry[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [eventsRes, bitacoraRes] = await Promise.all([
        supabase.from('eventos').select('*').order('fecha_evento', { ascending: true }),
        supabase.from('bitacora').select('*').order('created_at', { ascending: false }).limit(50),
      ])

      if (eventsRes.data) {
        setEvents(
          eventsRes.data.map((e) => ({
            id: e.id,
            title: e.titulo,
            clientName: e.cliente_nombre,
            clientPhone: e.cliente_telefono,
            categorySlug: e.categoria_slug || '',
            eventDate: e.fecha_evento,
            eventTime: e.hora_evento || undefined,
            location: e.ubicacion,
            totalPriceBs: Number(e.total_bs),
            advancePriceBs: Number(e.adelanto_bs),
            status: e.estado,
            notes: e.notas || undefined,
            createdAt: e.created_at,
            updatedAt: e.updated_at,
          }))
        )
      }

      if (bitacoraRes.data) {
        setBitacora(
          bitacoraRes.data.map((b) => ({
            id: b.id,
            timestamp: b.created_at,
            action: b.accion,
            title: b.titulo,
            detail: b.detalle,
            userId: b.usuario_id || undefined,
          }))
        )
      }
    } catch {
      // Manejo silencioso de red
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const createEvent = async (event: Omit<VvEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('eventos')
      .insert({
        titulo: event.title,
        cliente_nombre: event.clientName,
        cliente_telefono: event.clientPhone,
        categoria_slug: event.categorySlug || null,
        fecha_evento: event.eventDate,
        hora_evento: event.eventTime || null,
        ubicacion: event.location,
        total_bs: event.totalPriceBs,
        adelanto_bs: event.advancePriceBs,
        estado: event.status,
        notas: event.notes || null,
      })
      .select()
      .single()

    if (error) throw error

    // Registrar en bitácora
    await supabase.from('bitacora').insert({
      accion: 'crear',
      titulo: `Evento creado: ${event.title}`,
      detalle: `Cliente: ${event.clientName}. Total: Bs. ${event.totalPriceBs}`,
    })

    await loadData()
    return data
  }

  const updateEventStatus = async (id: string, status: EventStatus, title: string) => {
    const { error } = await supabase
      .from('eventos')
      .update({ estado: status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    await supabase.from('bitacora').insert({
      accion: 'estado',
      titulo: `Cambio de estado: ${title}`,
      detalle: `Nuevo estado: ${status}`,
    })

    await loadData()
  }

  return { events, bitacora, loading, reloadEventos: loadData, createEvent, updateEventStatus }
}
