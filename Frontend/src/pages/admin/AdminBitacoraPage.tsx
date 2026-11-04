import React, { useState, useMemo } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import {
  VvBadge,
  VvButton,
  VvCard,
} from '../../components/ui/VvPrimitives'
import { VvInlineInput } from '../../components/ui/VvFormControls'
import { VvPagination } from '../../components/ui/VvPagination'
import { useVvApp } from '../../context/VvAppContext'

const PAGE_SIZE = 10

function maskEmails(text: string): string {
  return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'Dueña (Administradora)')
}

export function AdminBitacoraPage() {
  const { state, isMobileView } = useVvApp()
  const [statusFilter, setStatusFilter] = useState<'all' | 'Éxito' | 'Fallo'>('all')
  const [actionCategory, setActionCategory] = useState<'all' | 'login' | 'evento' | 'foto' | 'categoria' | 'error'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredLogs = useMemo(() => {
    return state.bitacora.filter((entry) => {
      // Filtro por estado
      if (statusFilter !== 'all' && entry.status !== statusFilter) {
        return false
      }

      // Filtro por categoría de acción
      if (actionCategory !== 'all') {
        const actionLower = entry.action.toLowerCase()
        if (actionCategory === 'login' && !actionLower.includes('login') && !actionLower.includes('sesión')) {
          return false
        }
        if (actionCategory === 'evento' && !actionLower.includes('evento')) {
          return false
        }
        if (actionCategory === 'foto' && !actionLower.includes('foto')) {
          return false
        }
        if (actionCategory === 'categoria' && !actionLower.includes('categoría') && !actionLower.includes('categoria')) {
          return false
        }
        if (actionCategory === 'error' && !actionLower.includes('error') && !actionLower.includes('fallo')) {
          return false
        }
      }

      // Filtro por búsqueda textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const inAction = entry.action.toLowerCase().includes(query)
        const inDetail = entry.detail.toLowerCase().includes(query)
        const inTime = entry.timestamp.toLowerCase().includes(query)
        if (!inAction && !inDetail && !inTime) {
          return false
        }
      }

      return true
    })
  }, [state.bitacora, statusFilter, actionCategory, searchQuery])

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE) || 1
  const validPage = Math.min(currentPage, totalPages)
  const startIndex = (validPage - 1) * PAGE_SIZE
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleStatusChange = (status: 'all' | 'Éxito' | 'Fallo') => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleActionCategoryChange = (cat: typeof actionCategory) => {
    setActionCategory(cat)
    setCurrentPage(1)
  }

  return (
    <AdminLayout
      title="Bitácora del Sistema"
      subtitle="Registro cronológico y auditado de seguridad, accesos y operaciones sobre eventos, fotografías y configuración."
    >
      <div className="space-y-5">
        {/* Barra superior de Búsqueda y Filtros */}
        <VvCard variant="surface" className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <VvInlineInput
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val)
                  setCurrentPage(1)
                }}
                placeholder="Buscar por acción, fecha o detalle..."
              />
            </div>

            {/* Filtros por Estado */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs vv-text-muted mr-1">Estado:</span>
              <VvButton
                size="sm"
                variant={statusFilter === 'all' ? 'gold' : 'subtle'}
                onClick={() => handleStatusChange('all')}
              >
                Todos ({state.bitacora.length})
              </VvButton>
              <VvButton
                size="sm"
                variant={statusFilter === 'Éxito' ? 'gold' : 'subtle'}
                onClick={() => handleStatusChange('Éxito')}
              >
                Éxito ({state.bitacora.filter((b) => b.status === 'Éxito').length})
              </VvButton>
              <VvButton
                size="sm"
                variant={statusFilter === 'Fallo' ? 'gold' : 'subtle'}
                onClick={() => handleStatusChange('Fallo')}
              >
                Fallo ({state.bitacora.filter((b) => b.status === 'Fallo').length})
              </VvButton>
            </div>
          </div>

          {/* Filtros rápidos por Módulo */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t vv-border-gold text-xs">
            <span className="vv-text-muted mr-1">Módulo:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'login', label: 'Accesos' },
              { id: 'evento', label: 'Eventos' },
              { id: 'foto', label: 'Fotos' },
              { id: 'categoria', label: 'Categorías' },
              { id: 'error', label: 'Errores' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleActionCategoryChange(tab.id as typeof actionCategory)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  actionCategory === tab.id
                    ? 'vv-bg-gold-gradient vv-text-on-gold font-semibold shadow-xs'
                    : 'border vv-border-gold vv-bg-elevated vv-text-secondary hover:vv-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </VvCard>

        {/* Tabla en Desktop */}
        {!isMobileView ? (
          <VvCard variant="surface" className="overflow-hidden">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="vv-bg-elevated border-b vv-border-gold text-xs uppercase tracking-wider vv-text-gold-light">
                    <th className="py-3 px-4 font-semibold w-40">Fecha y Hora</th>
                    <th className="py-3 px-4 font-semibold w-44">Acción</th>
                    <th className="py-3 px-4 font-semibold">Detalle del Movimiento</th>
                    <th className="py-3 px-4 font-semibold text-right w-28">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y vv-border-gold text-sm">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center vv-text-muted text-xs">
                        No se encontraron registros en la bitácora con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((entry) => (
                      <tr key={entry.id} className="hover:vv-bg-elevated transition-colors">
                        <td className="py-3 px-4 vv-font-mono text-xs vv-text-muted whitespace-nowrap">
                          {entry.timestamp}
                        </td>
                        <td className="py-3 px-4 font-semibold vv-text-primary text-xs whitespace-nowrap">
                          {entry.action}
                        </td>
                        <td className="py-3 px-4 text-xs vv-text-secondary leading-relaxed">
                          {maskEmails(entry.detail)}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <VvBadge variant={entry.status === 'Éxito' ? 'success' : 'danger'}>
                            {entry.status === 'Éxito' ? '✓ Éxito' : '✕ Fallo'}
                          </VvBadge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="p-4">
              <VvPagination
                currentPage={validPage}
                totalPages={totalPages}
                totalItems={filteredLogs.length}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </div>
          </VvCard>
        ) : (
          /* Vista en Móvil (Tarjetas) */
          <div className="space-y-3">
            {paginatedLogs.length === 0 ? (
              <VvCard variant="surface" className="p-6 text-center text-xs vv-text-muted">
                No se encontraron registros con los filtros seleccionados.
              </VvCard>
            ) : (
              paginatedLogs.map((entry) => (
                <VvCard key={entry.id} variant="surface" className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs vv-text-primary">
                      {entry.action}
                    </span>
                    <VvBadge variant={entry.status === 'Éxito' ? 'success' : 'danger'}>
                      {entry.status === 'Éxito' ? '✓ Éxito' : '✕ Fallo'}
                    </VvBadge>
                  </div>
                  <p className="text-xs vv-text-secondary leading-relaxed">
                    {maskEmails(entry.detail)}
                  </p>
                  <div className="pt-2 border-t vv-border-gold flex items-center justify-between text-[11px] vv-font-mono vv-text-muted">
                    <span>Fecha:</span>
                    <span>{entry.timestamp}</span>
                  </div>
                </VvCard>
              ))
            )}

            {/* Paginación en móvil */}
            <VvPagination
              currentPage={validPage}
              totalPages={totalPages}
              totalItems={filteredLogs.length}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
