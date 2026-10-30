import { VvCard, VvHeading, VvBadge, VvButton } from '../../components/ui/VvPrimitives'
import { useEventos } from '../../hooks/useEventos'
import { formatBs, formatReadableDate } from '../../lib/utils'

export function AdminDashboardPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void
}) {
  const { events, bitacora, loading } = useEventos()

  const activeEvents = events.filter((e) => e.status === 'confirmado' || e.status === 'en_montaje')
  const totalPendingBs = activeEvents.reduce(
    (acc, e) => acc + Math.max(0, e.totalPriceBs - e.advancePriceBs),
    0
  )

  return (
    <div className="space-y-8 vv-animate-page">
      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <VvCard variant="elevated" className="space-y-2 border-l-4 border-l-[#D4AF37]">
          <span className="text-xs uppercase tracking-wider text-[#C4B9A5]">Eventos Activos</span>
          <div className="text-3xl font-bold font-['JetBrains_Mono'] text-[#F9F6F0]">
            {loading ? '...' : activeEvents.length}
          </div>
          <p className="text-xs text-[#7D7568]">En montaje o confirmados</p>
        </VvCard>

        <VvCard variant="elevated" className="space-y-2 border-l-4 border-l-[#4ADE80]">
          <span className="text-xs uppercase tracking-wider text-[#C4B9A5]">Saldo Pendiente de Cobro</span>
          <div className="text-3xl font-bold font-['JetBrains_Mono'] text-[#4ADE80]">
            {loading ? '...' : formatBs(totalPendingBs)}
          </div>
          <p className="text-xs text-[#7D7568]">Por liquidar al momento del montaje</p>
        </VvCard>

        <VvCard variant="elevated" className="space-y-2 border-l-4 border-l-[#60A5FA]">
          <span className="text-xs uppercase tracking-wider text-[#C4B9A5]">Registros en Bitácora</span>
          <div className="text-3xl font-bold font-['JetBrains_Mono'] text-[#60A5FA]">
            {loading ? '...' : bitacora.length}
          </div>
          <p className="text-xs text-[#7D7568]">Movimientos de auditoría</p>
        </VvCard>
      </div>

      {/* Accesos Rápidos */}
      <div className="flex flex-wrap items-center gap-4">
        <VvButton variant="gold" size="md" onClick={() => onNavigate('/admin/eventos')}>
          + Nuevo Evento o Cotización
        </VvButton>
        <VvButton variant="outline" size="md" onClick={() => onNavigate('/admin/fotos')}>
          + Subir Foto al Catálogo
        </VvButton>
        <VvButton variant="subtle" size="md" onClick={() => onNavigate('/admin/perfil')}>
          Configurar Teléfonos & WhatsApp
        </VvButton>
      </div>

      {/* Grid: Próximos Eventos & Últimos Movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Agenda de Montajes */}
        <div className="lg:col-span-7 space-y-4">
          <VvHeading level={3} variant="serif" metallic>
            Agenda de Próximos Montajes
          </VvHeading>
          {activeEvents.length === 0 ? (
            <VvCard variant="surface" className="p-8 text-center text-sm text-[#7D7568]">
              No hay eventos activos programados en este momento.
            </VvCard>
          ) : (
            <div className="space-y-3">
              {activeEvents.map((evt) => (
                <VvCard key={evt.id} variant="surface" className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <span className="text-xs text-[#D4AF37] font-mono">
                      {formatReadableDate(evt.eventDate)} {evt.eventTime ? `· ${evt.eventTime}` : ''}
                    </span>
                    <h4 className="text-base font-bold text-[#F9F6F0]">{evt.title}</h4>
                    <p className="text-xs text-[#C4B9A5]">
                      Cliente: {evt.clientName} ({evt.clientPhone}) · Lugar: {evt.location}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <VvBadge variant={evt.status === 'en_montaje' ? 'warning' : 'gold'}>
                      {evt.status.replace('_', ' ').toUpperCase()}
                    </VvBadge>
                    <div className="text-xs font-mono text-[#F9F6F0]">
                      Saldo: {formatBs(evt.totalPriceBs - evt.advancePriceBs)}
                    </div>
                  </div>
                </VvCard>
              ))}
            </div>
          )}
        </div>

        {/* Bitácora de Auditoría */}
        <div className="lg:col-span-5 space-y-4">
          <VvHeading level={3} variant="serif" metallic>
            Bitácora Reciente
          </VvHeading>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {bitacora.map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-[#0E0E11] border border-[#D4AF37]/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F3D37A]">{b.title}</span>
                  <span className="text-[10px] text-[#7D7568]">{b.timestamp.split('T')[0]}</span>
                </div>
                <p className="text-[#C4B9A5]">{b.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
