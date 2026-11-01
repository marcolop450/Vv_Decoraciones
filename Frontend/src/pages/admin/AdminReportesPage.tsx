import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { VvInlineInput } from '../../components/ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'
import { formatReadableDate } from '../../data/vvInitialAppData'
import type { AgentRole } from '../../services/aiAssistantService'

export function AdminReportesPage() {
  const { state, sendReportChatMessage, navigate, openWhatsAppQuote, isMobileView } = useVvApp()
  const [chatInput, setChatInput] = useState('')
  const [mobileSectionTab, setMobileSectionTab] = useState<'resumen' | 'chatbot'>('chatbot')
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('finanzas')
  const [isSending, setIsSending] = useState(false)

  const activeEvents = state.events.filter((e) => e.status === 'activo')
  const completedEvents = state.events.filter((e) => e.status === 'completado')

  const totalContractedBs = state.events.reduce(
    (acc, e) => acc + e.totalPriceBs,
    0
  )
  const totalCollectedBs = state.events.reduce(
    (acc, e) =>
      acc +
      (e.status === 'completado' ? e.totalPriceBs : e.advancePriceBs),
    0
  )
  const totalPendingBs = activeEvents.reduce(
    (acc, e) => acc + Math.max(0, e.totalPriceBs - e.advancePriceBs),
    0
  )

  const handleSend = async (promptToSend?: string) => {
    const text = (promptToSend || chatInput).trim()
    if (!text || isSending) return
    setIsSending(true)
    setChatInput('')
    try {
      await sendReportChatMessage(text, selectedAgent)
    } finally {
      setIsSending(false)
    }
  }

  const agentDefaultPrompts: Record<AgentRole, string[]> = {
    finanzas: [
      '¿Cuánto falta por cobrar en saldos pendientes?',
      '¿Qué clientes tienen saldo pendiente?',
    ],
    agenda: [
      'Quiero ver qué evento tengo los siguientes días',
      '¿Qué eventos tengo este fin de semana?',
    ],
    ventas: [
      'Recomiéndame decoraciones para Bodas',
      'Recomiéndame opciones para Quinceañeros',
    ],
  }

  return (
    <AdminLayout
      title="Reportes Generales + ChatBot IA"
      subtitle="Vista dividida con resumen financiero de ingresos, saldos pendientes por cobrar, eventos por categoría y asistente IA interactivo."
    >
      {isMobileView && (
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl vv-bg-surface border vv-border-gold">
          <VvButton
            size="sm"
            variant={mobileSectionTab === 'chatbot' ? 'gold' : 'ghost'}
            onClick={() => setMobileSectionTab('chatbot')}
            className="w-full"
          >
            ChatBot IA
          </VvButton>
          <VvButton
            size="sm"
            variant={mobileSectionTab === 'resumen' ? 'gold' : 'ghost'}
            onClick={() => setMobileSectionTab('resumen')}
            className="w-full"
          >
            Resumen Ingresos
          </VvButton>
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${
          isMobileView ? 'gap-6' : 'lg:grid-cols-12 gap-6'
        } items-start`}
      >
        {/* SECCIÓN DE REPORTES GENERALES */}
        {(!isMobileView || mobileSectionTab === 'resumen') && (
          <div className={`${isMobileView ? '' : 'lg:col-span-6'} space-y-6`}>
          <div
            className={`grid grid-cols-1 ${
              isMobileView ? 'gap-4' : 'sm:grid-cols-2 gap-4'
            }`}
          >
            <VvCard variant="gold-highlight" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-gold-light font-semibold">
                Ingresos Totales Contratados
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-primary">
                Bs. {totalContractedBs.toLocaleString()}
              </div>
              <p className="text-xs vv-text-secondary">
                Suma de {state.events.length} eventos registrados
              </p>
            </VvCard>

            <VvCard variant="surface" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted font-semibold">
                Saldos Pendientes por Cobrar
              </div>
              <div className="vv-font-serif text-3xl font-bold vv-text-gold-metallic">
                Bs. {totalPendingBs.toLocaleString()}
              </div>
              <p className="text-xs vv-text-secondary">
                En {activeEvents.length} eventos activos
              </p>
            </VvCard>

            <VvCard variant="surface" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted font-semibold">
                Monto Ya Recaudado (Adelantos + Cerrados)
              </div>
              <div className="vv-font-serif text-2xl font-bold vv-text-primary">
                Bs. {totalCollectedBs.toLocaleString()}
              </div>
              <p className="text-xs vv-text-secondary">
                {completedEvents.length} eventos completados al 100%
              </p>
            </VvCard>

            <VvCard variant="surface" className="p-5 space-y-1">
              <div className="text-xs uppercase tracking-wider vv-text-muted font-semibold">
                Decoraciones en Catálogo
              </div>
              <div className="vv-font-serif text-2xl font-bold vv-text-gold-light">
                {state.photos.length} Publicadas
              </div>
              <p className="text-xs vv-text-secondary">
                Visibles para cotización WhatsApp
              </p>
            </VvCard>
          </div>

          {/* Cantidad de Eventos por Categoría */}
          <VvCard variant="surface" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <VvHeading level={3} variant="serif">
                Cantidad de Eventos por Categoría
              </VvHeading>
              <VvBadge variant="gold">
                {state.categories.length} Categorías
              </VvBadge>
            </div>

            <div className="space-y-3">
              {state.categories.map((cat) => {
                const catEvents = state.events.filter(
                  (e) => e.categoryId === cat.id
                )
                const catRevenue = catEvents.reduce(
                  (acc, e) => acc + e.totalPriceBs,
                  0
                )
                return (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-xl vv-bg-elevated border vv-border-gold flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-sm vv-text-primary">
                        {cat.name}
                      </div>
                      <div className="text-xs vv-text-muted">
                        Volumen contratado: Bs. {catRevenue.toLocaleString()}
                      </div>
                    </div>
                    <VvBadge variant="gold">
                      {catEvents.length} evento(s)
                    </VvBadge>
                  </div>
                )
              })}
            </div>
          </VvCard>
        </div>
        )}

        {/* SECCIÓN CHATBOT IA DE REPORTES */}
        {(!isMobileView || mobileSectionTab === 'chatbot') && (
          <VvCard
            variant="gold-highlight"
            className={`${
              isMobileView ? '' : 'lg:col-span-6'
            } p-5 sm:p-6 flex flex-col justify-between space-y-4`}
          >
          <div className="flex flex-col gap-3 pb-3 border-b vv-border-gold">
            <div className="flex items-center justify-between gap-2">
              <div>
                <VvBadge variant="gold">Asistente Inteligente de Negocio</VvBadge>
                <VvHeading level={3} variant="serif" className="mt-1">
                  {selectedAgent === 'finanzas'
                    ? 'Asistente de Finanzas & Cobranzas'
                    : selectedAgent === 'agenda'
                    ? 'Asistente de Agenda & Montajes'
                    : 'Asistente de Ventas & Catálogo'}
                </VvHeading>
              </div>
              <VvBadge variant="success">En Línea</VvBadge>
            </div>

            {/* Selector de los 3 Agentes Especializados */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl vv-bg-surface border vv-border-gold">
              <button
                type="button"
                onClick={() => setSelectedAgent('finanzas')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedAgent === 'finanzas'
                    ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                    : 'vv-text-secondary hover:vv-text-primary'
                }`}
              >
                Finanzas
              </button>
              <button
                type="button"
                onClick={() => setSelectedAgent('agenda')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedAgent === 'agenda'
                    ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                    : 'vv-text-secondary hover:vv-text-primary'
                }`}
              >
                Agenda
              </button>
              <button
                type="button"
                onClick={() => setSelectedAgent('ventas')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedAgent === 'ventas'
                    ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                    : 'vv-text-secondary hover:vv-text-primary'
                }`}
              >
                Ventas
              </button>
            </div>
          </div>

          {/* Historial de Conversación */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {state.reportChat.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-3 ${
                    msg.sender === 'user'
                      ? 'vv-bg-gold-gradient vv-text-on-gold font-semibold'
                      : 'vv-bg-surface border vv-border-gold vv-text-primary'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Tarjeta compacta de Eventos Próximos dentro de la respuesta del Bot */}
                  {msg.upcomingEventsCard &&
                    msg.upcomingEventsCard.length > 0 && (
                      <div className="space-y-2 pt-2 border-t vv-border-gold">
                        {msg.upcomingEventsCard.map((item) => (
                          <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              navigate('/admin/eventos/detalle', {
                                eventId: item.id,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                navigate('/admin/eventos/detalle', {
                                  eventId: item.id,
                                })
                              }
                            }}
                            className="p-3 rounded-xl vv-bg-elevated border vv-border-gold-strong hover:vv-bg-gold-surface cursor-pointer transition-all space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-xs vv-text-gold-light">
                                {formatReadableDate(item.date)}
                              </span>
                              <span className="vv-font-mono text-xs vv-text-primary font-bold">
                                Falta: Bs.{' '}
                                {item.pendingBalanceBs.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs font-semibold vv-text-primary">
                              {item.name}
                            </div>
                            <div className="text-xs vv-text-secondary">
                              Cliente: <strong>{item.clientName}</strong> ·{' '}
                              {item.venue}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Tarjetas de fotos recomendadas */}
                  {msg.attachedPhotosCard &&
                    msg.attachedPhotosCard.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t vv-border-gold">
                        {msg.attachedPhotosCard.map((p) => (
                          <div
                            key={p.id}
                            className="p-2 rounded-xl vv-bg-elevated border vv-border-gold space-y-1"
                          >
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <div className="text-xs font-medium truncate vv-text-gold-light">
                              {p.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <span className="vv-font-mono text-xs vv-text-muted mt-1 px-1">
                  {msg.sender === 'user' ? 'Verónica (Dueña)' : 'Bot Reportes V.v'} ·{' '}
                  {msg.time}
                </span>
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-xs vv-text-gold-light italic">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
                Consultando...
              </div>
            )}
          </div>

          {/* Botones de Consulta Rápida por Defecto + Input */}
          <div className="space-y-3 pt-3 border-t vv-border-gold">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider vv-text-muted">
                Preguntas sugeridas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {agentDefaultPrompts[selectedAgent].map((prompt) => (
                  <VvButton
                    key={prompt}
                    size="sm"
                    variant="subtle"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </VvButton>
                ))}
                {selectedAgent !== 'agenda' && (
                  <VvButton
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleSend(
                        'Quiero ver qué evento tengo los siguientes días'
                      )
                    }
                  >
                    Quiero ver qué evento tengo los siguientes días
                  </VvButton>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <VvInlineInput
                value={chatInput}
                onChange={setChatInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={`Preguntar a ${
                  selectedAgent === 'finanzas'
                    ? 'Finanzas'
                    : selectedAgent === 'agenda'
                    ? 'Agenda'
                    : 'Ventas'
                }...`}
                className="flex-1"
              />
              <VvButton
                size="md"
                variant="gold"
                onClick={() => handleSend()}
                disabled={isSending}
              >
                {isSending ? '...' : 'Consultar'}
              </VvButton>
            </div>
          </div>
        </VvCard>
        )}
      </div>
    </AdminLayout>
  )
}
