import type { VvAppDataState } from '../types/vv-app'

export function getLocalIsoDate(offsetDays = 0): string {
  const now = new Date()
  now.setDate(now.getDate() + offsetDays)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatReadableDate(isoDate: string): string {
  if (!isoDate) return ''
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  const [year, month, day] = parts.map(Number)
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  return `${day} de ${months[(month - 1) % 12]} ${year}`
}

export function getCurrentTimestampLabel(): string {
  const now = new Date()
  const dateStr = getLocalIsoDate(0)
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${dateStr} · ${hours}:${minutes}`
}

export const GALLERY_PRESET_IMAGES = [
  {
    label: 'Gala Imperial con Candelabros Dorados',
    url: 'https://images.unsplash.com/photo-1572387147902-d7d137cb0fbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwd2VkZGluZyUyMGV2ZW50JTIwZGVjb3JhdGlvbiUyMGdhbGF8ZW58MXx8fHwxNzkzMjIwMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    label: 'Mesa de Honor Oro & Terciopelo Nocturno',
    url: 'https://images.unsplash.com/photo-1768851142314-c4ebf49ad45b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBnb2xkJTIwd2VkZGluZyUyMGV2ZW50JTIwZGVjb3JhdGlvbiUyMGdhbGF8ZW58MXx8fHwxNzkzMjIwMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    label: 'Salón de Recepción con Velas y Cristalería',
    url: 'https://images.unsplash.com/photo-1782686223394-af72f7de562c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBnb2xkJTIwd2VkZGluZyUyMGV2ZW50JTIwZGVjb3JhdGlvbiUyMGdhbGF8ZW58MXx8fHwxNzkzMjIwMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    label: 'Ambientación Floral Pampas & Oro Real',
    url: 'https://images.unsplash.com/photo-1782686197550-879b6fcb51b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBnb2xkJTIwd2VkZGluZyUyMGV2ZW50JTIwZGVjb3JhdGlvbiUyMGdhbGF8ZW58MXx8fHwxNzkzMjIwMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    label: 'Escenario Ejecutivo & Gala Empresarial',
    url: 'https://images.unsplash.com/photo-1769230361357-8278572302d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBnb2xkJTIwd2VkZGluZyUyMGV2ZW50JTIwZGVjb3JhdGlvbiUyMGdhbGF8ZW58MXx8fHwxNzkzMjIwMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    label: 'Celebración Nocturna con Globos Oro & Champán',
    url: 'https://images.unsplash.com/photo-1702044542400-44a412422e9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGJhbGxvb25zJTIwY2hhbXBhZ25lJTIwY2VsZWJyYXRpb24lMjBnb2xkJTIwbmlnaHR8ZW58MXx8fHwxNzkzMjIwMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
]

export function createInitialVvState(): VvAppDataState {
  return {
    categories: [
      { id: 'bodas', name: 'Bodas & Recepciones' },
      { id: 'quinceaneros', name: 'XV Años & Quinceañeros' },
      { id: 'cotillon-vip', name: 'Cotillón VIP & Hora Loca' },
      { id: 'corporativos', name: 'Eventos Corporativos' },
      { id: 'cumpleanos', name: 'Cumpleaños & Fiestas Privadas' },
      { id: 'graduaciones', name: 'Graduaciones & Proms' },
    ],
    photos: [],
    events: [],
    bitacora: [],
    reportChat: [
      {
        id: 'rchat-1',
        sender: 'bot',
        text: '¡Hola! Soy tu Asistente IA de Reportes de V.v Decoración. Puedes consultarme por tus eventos próximos, saldos pendientes por cobrar o métricas por categoría.',
        time: getCurrentTimestampLabel().split('·')[1]?.trim() || '09:00',
      },
    ],
    config: {
      businessName: 'V.v Decoración de eventos y cotillón',
      brandSubtitle: 'Gala Nocturna: Bodas, Quinceañeros, Cumpleaños y Galas Corporativas',
      whatsappPhone: import.meta.env.VITE_WHATSAPP_PHONE || '59177885220',
      contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+591 77885220',
    },
  }
}
