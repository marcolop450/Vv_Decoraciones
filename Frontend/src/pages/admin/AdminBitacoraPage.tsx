import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'
import { useVvApp } from '../../context/VvAppContext'

export function AdminBitacoraPage() {
  const { state, logBitacora, isMobileView } = useVvApp()
  const [statusFilter, setStatusFilter] = useState<'all' | 'Éxito' | 'Fallo'>(
    'all'
  )

  const filteredLogs =
    statusFilter === 'all'
      ? state.bitacora
      : state.bitacora.filter((entry) => entry.status === statusFilter)

  const handleSimulateErrorLog = () => {
    logBitacora(
      'Error de Operación',
      'Fallo al eliminar categoría protegida: existen eventos activos vinculados a esta categoría.',
      'Fallo'
    )
  }

  return (
    <AdminLayout
      title="Bitácora de la Página"
      subtitle="Registro cronológico de seguridad y auditoría: Login exitoso, Fallos de Login, Crear, Editar, Eliminar (incluyendo errores) y Logout."
      headerActions={
        <VvButton
          size="sm"
          variant="subtle"
          onClick={handleSimulateErrorLog}
          title="Generar un registro de fallo en la bitácora para prueba"
        >
          + Simular Registro de Fallo
        </VvButton>
      }
    >
      {/* Filtros por Estado (Todos / Éxito / Fallo) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <VvButton
            size="sm"
            variant={statusFilter === 'all' ? 'gold' : 'subtle'}
            onClick={() => setStatusFilter('all')}
          >
            Todos ({state.bitacora.length})
          </VvButton>
          <VvButton
            size="sm"
            variant={statusFilter === 'Éxito' ? 'gold' : 'subtle'}
            onClick={() => setStatusFilter('Éxito')}
          >
            Estado: Éxito (
            {state.bitacora.filter((b) => b.status === 'Éxito').length})
          </VvButton>
          <VvButton
            size="sm"
            variant={statusFilter === 'Fallo' ? 'gold' : 'subtle'}
            onClick={() => setStatusFilter('Fallo')}
          >
            Estado: Fallo / Error (
            {state.bitacora.filter((b) => b.status === 'Fallo').length})
          </VvButton>
        </div>

        <span className="text-xs vv-text-muted">
          Vista adaptable: Tabla en Desktop · Tarjetas en Móvil
        </span>
      </div>

      {/* VISTA TABLA EN DESKTOP */}
      {!isMobileView ? (
        <VvCard variant="surface" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="vv-bg-elevated border-b vv-border-gold text-xs uppercase tracking-wider vv-text-gold-light">
                  <th className="py-3.5 px-5 font-semibold">Fecha y Hora</th>
                  <th className="py-3.5 px-5 font-semibold">Acción Realizada</th>
                  <th className="py-3.5 px-5 font-semibold">
                    Detalle del Movimiento
                  </th>
                  <th className="py-3.5 px-5 font-semibold text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y vv-border-gold text-sm">
                {filteredLogs.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:vv-bg-elevated transition-colors"
                  >
                    <td className="py-3.5 px-5 vv-font-mono text-xs vv-text-muted whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-3.5 px-5 font-semibold vv-text-primary whitespace-nowrap">
                      {entry.action}
                    </td>
                    <td className="py-3.5 px-5 text-xs vv-text-secondary leading-relaxed">
                      {entry.detail}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <VvBadge
                        variant={entry.status === 'Éxito' ? 'success' : 'danger'}
                      >
                        {entry.status === 'Éxito' ? '✓ Éxito' : '✕ Fallo'}
                      </VvBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VvCard>
      ) : (
        <div className="space-y-3.5">
          {filteredLogs.map((entry) => (
            <VvCard key={entry.id} variant="surface" className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm vv-text-primary">
                  {entry.action}
                </span>
                <VvBadge
                  variant={entry.status === 'Éxito' ? 'success' : 'danger'}
                >
                  {entry.status === 'Éxito' ? '✓ Éxito' : '✕ Fallo'}
                </VvBadge>
              </div>
              <p className="text-xs vv-text-secondary leading-relaxed">
                {entry.detail}
              </p>
              <div className="pt-2 border-t vv-border-gold flex items-center justify-between text-xs vv-font-mono vv-text-muted">
                <span>Fecha/Hora:</span>
                <span>{entry.timestamp}</span>
              </div>
            </VvCard>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
