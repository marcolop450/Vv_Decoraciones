import React, { useEffect, useMemo, useState } from 'react'
import { useVvApp } from '../../context/VvAppContext'
import {
  formatReadableDate,
  getLocalIsoDate,
} from '../../data/vvInitialAppData'
import {
  VvButton,
  VvCard,
  VvHeading,
} from '../ui/VvPrimitives'

async function copyImageBlobToClipboard(imageUrl: string): Promise<boolean> {
  if (!imageUrl || typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
    return false
  }

  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0)

    return new Promise<boolean>((resolve) => {
      canvas.toBlob(async (pngBlob) => {
        if (pngBlob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob }),
            ])
            resolve(true)
          } catch {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      }, 'image/png')
    })
  } catch {
    return false
  }
}

export function WhatsAppQuoteModal() {
  const { quotePhoto, closeWhatsAppQuote, getCategoryName, state } = useVvApp()
  const todayIso = useMemo(() => getLocalIsoDate(0), [])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isCustomEdited, setIsCustomEdited] = useState<boolean>(false)
  const [copiedImageAlert, setCopiedImageAlert] = useState<boolean>(false)

  // Genera y actualiza el mensaje predeterminado cuando cambia la fecha, salvo que el usuario lo haya editado manualmente
  useEffect(() => {
    if (!quotePhoto) return
    if (isCustomEdited) return

    const hasDate = Boolean(selectedDate && selectedDate >= todayIso)
    const readableDate = hasDate ? formatReadableDate(selectedDate) : ''
    const baseText = hasDate
      ? `Hola V.v Decoración, quiero cotizar la decoración "${quotePhoto.name}" para la fecha ${readableDate} (${selectedDate}).`
      : `Hola V.v Decoración, quiero consultar por la decoración "${quotePhoto.name}".`

    setMessage(baseText)
  }, [quotePhoto, selectedDate, todayIso, isCustomEdited])

  if (!quotePhoto) return null

  const targetPhone = (state.config?.whatsappPhone || '59177885220').replace(/[^0-9]/g, '')

  const handleCopyImage = async () => {
    if (!quotePhoto.imageUrl) return
    const ok = await copyImageBlobToClipboard(quotePhoto.imageUrl)
    if (ok) {
      setCopiedImageAlert(true)
      setTimeout(() => setCopiedImageAlert(false), 3000)
    }
  }

  const handleSendWhatsApp = async () => {
    // 1. Copiar imagen al portapapeles para disponibilidad inmediata en WhatsApp Web / Desktop
    await handleCopyImage()

    // 2. Construir el texto final con enlace de imagen si es URL pública para previsualización directa en el chat
    const isRealHttpUrl = Boolean(
      quotePhoto.imageUrl &&
      (quotePhoto.imageUrl.startsWith('http://') || quotePhoto.imageUrl.startsWith('https://'))
    )

    let textToSend = message.trim()
    if (isRealHttpUrl && !textToSend.includes(quotePhoto.imageUrl)) {
      textToSend += `\n\nFoto: ${quotePhoto.imageUrl}`
    }

    // 3. Enlace directo a WhatsApp sin abrir diálogos nativos del sistema operativo
    const encoded = encodeURIComponent(textToSend)
    const url = `https://wa.me/${targetPhone}?text=${encoded}`
    window.open(url, '_blank', 'noopener,noreferrer')
    handleClose()
  }

  const handleClose = () => {
    setSelectedDate('')
    setMessage('')
    setIsCustomEdited(false)
    setCopiedImageAlert(false)
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
          <VvButton size="sm" variant="ghost" onClick={handleClose} aria-label="Cerrar modal">
            ✕
          </VvButton>
        </div>

        <div className="flex gap-3 p-3 rounded-xl vv-bg-elevated border vv-border-gold items-center">
          <div className="w-20 h-20 rounded-lg overflow-hidden border vv-border-gold shrink-0">
            <img
              src={quotePhoto.imageUrl}
              alt={quotePhoto.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-xs space-y-1.5">
            <p className="vv-text-secondary line-clamp-2">
              {quotePhoto.description}
            </p>
            <button
              type="button"
              onClick={handleCopyImage}
              className="text-[11px] vv-text-gold hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{copiedImageAlert ? '✓ Foto copiada para pegar en WhatsApp' : 'Copiar foto al portapapeles'}</span>
            </button>
          </div>
        </div>

        {/* Selector minimalista de fecha con bloqueo de fechas pasadas */}
        <div className="space-y-2 p-3.5 rounded-xl vv-bg-elevated border vv-border-gold">
          <div className="flex items-center justify-between">
            <label htmlFor="quote-date-input" className="text-xs font-semibold uppercase tracking-wider vv-text-secondary">
              ¿Para qué fecha deseas cotizar? (Opcional)
            </label>
            {selectedDate && (
              <span className="text-xs vv-text-gold font-medium">
                {formatReadableDate(selectedDate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              id="quote-date-input"
              type="date"
              min={todayIso}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
              }}
              className="w-full px-3.5 py-2.5 rounded-xl vv-bg-subtle border vv-border-gold vv-text-primary text-sm focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
            />
            {selectedDate && (
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedDate('')
                }}
                className="text-xs shrink-0"
              >
                Limpiar
              </VvButton>
            )}
          </div>
        </div>

        {/* Sección de mensaje editable por el cliente */}
        <div className="p-3.5 rounded-xl border vv-border-gold space-y-2" style={{ backgroundColor: 'var(--vv-bg-subtle)' }}>
          <div className="flex items-center justify-between">
            <label htmlFor="quote-message-textarea" className="text-xs font-semibold uppercase tracking-wider vv-text-secondary">
              Mensaje:
            </label>
            <span className="text-[11px] vv-text-gold font-medium">
              Editable
            </span>
          </div>
          <textarea
            id="quote-message-textarea"
            rows={3}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setIsCustomEdited(true)
            }}
            placeholder="Escribe tu mensaje para WhatsApp..."
            className="w-full p-2.5 rounded-lg vv-bg-surface text-xs vv-font-mono vv-text-gold-light border vv-border-gold focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <VvButton size="md" variant="ghost" onClick={handleClose}>
            Cancelar
          </VvButton>
          <VvButton
            size="md"
            variant="gold"
            onClick={handleSendWhatsApp}
          >
            Enviar
          </VvButton>
        </div>
      </VvCard>
    </div>
  )
}
