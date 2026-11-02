import React, { useMemo, useState } from 'react'
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

async function getImageFile(imageUrl: string, name: string): Promise<File | null> {
  try {
    let blob: Blob
    if (imageUrl.startsWith('data:')) {
      const parts = imageUrl.split(',')
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
      const bstr = atob(parts[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      blob = new Blob([u8arr], { type: mime })
    } else {
      const res = await fetch(imageUrl, { mode: 'cors' })
      blob = await res.blob()
    }

    const mimeType = blob.type || 'image/jpeg'
    const ext = mimeType.includes('png') ? 'png' : 'jpg'
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    return new File([blob], `decoracion_${safeName}.${ext}`, { type: mimeType })
  } catch {
    return null
  }
}

export function WhatsAppQuoteModal() {
  const { quotePhoto, closeWhatsAppQuote, getCategoryName, state } = useVvApp()
  const todayIso = useMemo(() => getLocalIsoDate(0), [])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [copiedImageAlert, setCopiedImageAlert] = useState(false)

  if (!quotePhoto) return null

  const targetPhone = (state.config?.whatsappPhone || '59177885220').replace(/[^0-9]/g, '')
  
  const isRealHttpUrl = Boolean(
    quotePhoto.imageUrl &&
    (quotePhoto.imageUrl.startsWith('http://') || quotePhoto.imageUrl.startsWith('https://'))
  )

  const hasValidDate = Boolean(selectedDate && selectedDate >= todayIso)
  const readableDate = hasValidDate ? formatReadableDate(selectedDate) : ''
  
  // Descripción unificada que acompaña a la foto como leyenda / pie de foto
  const captionDescription = hasValidDate
    ? `Hola V.v Decoración, quiero cotizar la decoración "${quotePhoto.name}" para la fecha ${readableDate} (${selectedDate}).`
    : `Hola V.v Decoración, quiero consultar por la decoración "${quotePhoto.name}".`

  const handleSendWhatsApp = async () => {
    // 1. Enviar [Foto + Descripción] juntos como un solo mensaje en móviles y tablets (Web Share API)
    if (typeof navigator !== 'undefined' && quotePhoto.imageUrl) {
      try {
        const file = await getImageFile(quotePhoto.imageUrl, quotePhoto.name)
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          // Al omitir 'title', WhatsApp coloca 'text' directamente como la leyenda (caption) de la foto en un solo mensaje
          await navigator.share({
            files: [file],
            text: captionDescription,
          })
          handleClose()
          return
        }
      } catch {
        // Fallback silencioso a enlace directo si el usuario cancela
      }
    }

    // 2. En escritorio / WhatsApp Web: abrir chat con tarjeta o imagen en portapapeles
    if (isRealHttpUrl) {
      const fullText = `${captionDescription}\n\n${quotePhoto.imageUrl}`
      const encoded = encodeURIComponent(fullText)
      window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank', 'noopener,noreferrer')
    } else {
      await handleCopyImage()
      const encoded = encodeURIComponent(captionDescription)
      window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank', 'noopener,noreferrer')
    }
    handleClose()
  }

  const handleCopyImage = async () => {
    if (!quotePhoto.imageUrl) return
    try {
      const file = await getImageFile(quotePhoto.imageUrl, quotePhoto.name)
      if (file && typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = quotePhoto.imageUrl
        await new Promise((resolve) => {
          img.onload = resolve
        })
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob(async (pngBlob) => {
          if (pngBlob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob }),
            ])
            setCopiedImageAlert(true)
            setTimeout(() => setCopiedImageAlert(false), 3000)
          }
        }, 'image/png')
      }
    } catch {
      // Ignora permisos bloqueados
    }
  }

  const handleClose = () => {
    setSelectedDate('')
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
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl vv-bg-subtle border vv-border-gold vv-text-primary text-sm focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
            />
            {selectedDate && (
              <VvButton
                size="sm"
                variant="ghost"
                onClick={() => setSelectedDate('')}
                className="text-xs shrink-0"
              >
                Limpiar
              </VvButton>
            )}
          </div>
        </div>

        {/* Vista previa limpia del mensaje [Foto + Descripción] */}
        <div className="p-3.5 rounded-xl border vv-border-gold space-y-2" style={{ backgroundColor: 'var(--vv-bg-subtle)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider vv-text-secondary">
              Mensaje [Foto + Descripción]:
            </span>
            <span className="text-[10px] vv-text-gold font-medium">
              Pie de foto unificado
            </span>
          </div>
          <div className="p-2.5 rounded-lg vv-bg-surface text-xs vv-font-mono vv-text-gold-light border vv-border-gold break-words">
            &ldquo;{captionDescription}&rdquo;
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <VvButton size="md" variant="ghost" onClick={handleClose}>
            Cancelar
          </VvButton>
          <VvButton
            size="md"
            variant={hasValidDate ? 'gold' : 'outline'}
            onClick={handleSendWhatsApp}
          >
            {hasValidDate ? 'Enviar [Foto + Fecha]' : 'Consultar sin fecha'}
          </VvButton>
        </div>
      </VvCard>
    </div>
  )
}
