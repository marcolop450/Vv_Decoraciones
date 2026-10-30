import React, { useEffect, useRef } from 'react'

export interface VvModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export function VvModal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
}: VvModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md vv-animate-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Ventana modal'}
    >
      <div
        ref={contentRef}
        className={`w-full ${sizeClasses[size]} max-h-[92dvh] flex flex-col rounded-2xl bg-[#0E0E11] border border-[#D4AF37]/50 shadow-[0_0_40px_rgba(212,175,55,0.25)] overflow-hidden`}
      >
        {/* Cabecera del modal */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/20 shrink-0">
            <div>
              {title && (
                <h3 className="text-base sm:text-lg font-bold font-['Cormorant_Garamond'] text-[#F9F6F0]">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-xs text-[#C4B9A5] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              type="button"
              aria-label="Cerrar modal"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#C4B9A5] hover:text-[#F9F6F0] hover:bg-[#16161B] transition-colors"
            >
              <span className="text-xl font-bold leading-none select-none">✕</span>
            </button>
          </div>
        )}

        {/* Contenido desplazable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
      </div>
    </div>
  )
}
