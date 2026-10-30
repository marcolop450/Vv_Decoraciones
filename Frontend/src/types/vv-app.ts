export type AppRoute =
  | '/landing'
  | '/catalogo'
  | '/login'
  | '/admin/inicio'
  | '/admin/fotos'
  | '/admin/eventos'
  | '/admin/eventos/nuevo'
  | '/admin/eventos/detalle'
  | '/admin/calendario'
  | '/admin/reportes'
  | '/admin/bitacora'

export interface CatalogCategory {
  id: string
  name: string
}

export interface CatalogPhoto {
  id: string
  name: string
  description: string
  imageUrl: string
  categoryId: string
  createdAt: string
  sourceEventId?: string
}

export type EventLifecycleStatus = 'activo' | 'completado'

export interface EventRecord {
  id: string
  name: string
  clientName: string
  phone: string
  venue: string
  date: string // YYYY-MM-DD
  categoryId: string
  totalPriceBs: number
  advancePriceBs: number
  status: EventLifecycleStatus
  createdAt: string
}

export type BitacoraActionType =
  | 'Login Exitoso'
  | 'Fallo de Login'
  | 'Crear Foto'
  | 'Editar Foto'
  | 'Eliminar Foto'
  | 'Crear Evento'
  | 'Editar Evento'
  | 'Eliminar Evento'
  | 'Evento Completado'
  | 'Crear Categoría'
  | 'Error de Operación'
  | 'Logout'

export interface BitacoraEntry {
  id: string
  timestamp: string
  action: BitacoraActionType
  detail: string
  status: 'Éxito' | 'Fallo'
}

export interface ReportChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  time: string
  upcomingEventsCard?: {
    id: string
    name: string
    clientName: string
    date: string
    venue: string
    pendingBalanceBs: number
  }[]
}

export interface VvBusinessConfigState {
  businessName: string
  brandSubtitle: string
  whatsappPhone: string
  contactPhone: string
}

export interface VvAppDataState {
  categories: CatalogCategory[]
  photos: CatalogPhoto[]
  events: EventRecord[]
  bitacora: BitacoraEntry[]
  reportChat: ReportChatMessage[]
  config: VvBusinessConfigState
}
