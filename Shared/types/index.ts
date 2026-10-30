export * from './supabase'

export type EventStatus = 'cotizacion' | 'confirmado' | 'en_montaje' | 'finalizado' | 'cancelado'

export type CategorySlug =
  | 'bodas'
  | 'quinceaneros'
  | 'infantiles'
  | 'corporativos'
  | 'cotillon-vip'
  | 'graduaciones'

export interface VvCategory {
  id: string
  name: string
  slug: CategorySlug | string
  description?: string
  displayOrder?: number
  createdAt?: string
}

export interface VvEvent {
  id: string
  title: string
  clientName: string
  clientPhone: string
  categorySlug: string
  eventDate: string
  eventTime?: string
  location: string
  totalPriceBs: number
  advancePriceBs: number
  status: EventStatus
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface VvPhoto {
  id: string
  eventId?: string
  title: string
  description?: string
  storagePath: string
  publicUrl: string
  isCover: boolean
  isPublicCatalog: boolean
  categorySlug: string
  width?: number
  height?: number
  fileSizeBytes?: number
  createdAt: string
}

export interface VvBitacoraEntry {
  id: string
  timestamp: string
  action: 'crear' | 'editar' | 'eliminar' | 'login' | 'error' | 'estado'
  title: string
  detail: string
  userId?: string
}

export interface VvQuoteRequest {
  id?: string
  clientName: string
  clientPhone?: string
  eventType: string
  eventDate: string
  guestCount: number
  estimatedBudgetBs?: number
  colorPalette?: string
  notes?: string
  status?: 'pendiente' | 'contactado' | 'descartado'
  createdAt?: string
}

export interface VvBusinessConfig {
  id: string
  businessName: string
  brandSubtitle: string
  whatsappPhone: string
  contactPhone: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  locationAddress?: string
  updatedAt?: string
}
