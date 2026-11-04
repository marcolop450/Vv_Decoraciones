import React from 'react'

export interface VvPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function VvPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
}: VvPaginationProps) {
  if (totalItems <= pageSize && totalPages <= 1) {
    return null
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | '...')[] = [1]
    const leftBound = Math.max(2, currentPage - 1)
    const rightBound = Math.min(totalPages - 1, currentPage + 1)

    if (leftBound > 2) {
      pages.push('...')
    }

    for (let p = leftBound; p <= rightBound; p++) {
      pages.push(p)
    }

    if (rightBound < totalPages - 1) {
      pages.push('...')
    }

    pages.push(totalPages)
    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav
      aria-label="Paginación de resultados"
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t vv-border-gold text-xs ${className}`}
    >
      <div className="vv-text-muted text-center sm:text-left">
        Mostrando <span className="font-semibold vv-text-primary">{startItem}</span> a{' '}
        <span className="font-semibold vv-text-primary">{endItem}</span> de{' '}
        <span className="font-semibold vv-text-gold-light">{totalItems}</span> registros
      </div>

      <div className="flex items-center gap-1.5 select-none">
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          className="px-3 py-1.5 rounded-lg border vv-border-gold vv-bg-elevated text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:vv-bg-subtle vv-text-primary cursor-pointer"
        >
          ← Anterior
        </button>

        {/* Páginas numéricas (ocultas en móviles muy pequeños para evitar quiebre) */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, index) => {
            if (p === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 vv-text-muted">
                  ...
                </span>
              )
            }
            const isActive = p === currentPage
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'vv-bg-gold-gradient vv-text-on-gold shadow-sm'
                    : 'border vv-border-gold vv-bg-surface vv-text-secondary hover:vv-text-primary hover:vv-bg-subtle'
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* Indicador compacto en móvil */}
        <span className="sm:hidden px-2 text-xs vv-text-secondary font-medium">
          {currentPage} / {totalPages}
        </span>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
          className="px-3 py-1.5 rounded-lg border vv-border-gold vv-bg-elevated text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:vv-bg-subtle vv-text-primary cursor-pointer"
        >
          Siguiente →
        </button>
      </div>
    </nav>
  )
}
