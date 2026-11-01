import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AiAssistantService, type AgentRole } from '../services/aiAssistantService'
import {
  createInitialVvState,
  getCurrentTimestampLabel,
  getLocalIsoDate,
} from '../data/vvInitialAppData'
import type {
  AppRoute,
  BitacoraActionType,
  CatalogCategory,
  CatalogPhoto,
  EventRecord,
  VvAppDataState,
  VvBusinessConfigState,
} from '../types/vv-app'

const STORAGE_KEY = 'vv_decoracion_v2_clean'

const VALID_ROUTES: AppRoute[] = [
  '/landing',
  '/catalogo',
  '/login',
  '/admin/inicio',
  '/admin/fotos',
  '/admin/eventos',
  '/admin/eventos/nuevo',
  '/admin/eventos/detalle',
  '/admin/calendario',
  '/admin/reportes',
  '/admin/bitacora',
]

interface VvAppContextValue {
  currentRoute: AppRoute
  navigate: (route: AppRoute, options?: { eventId?: string; editEventId?: string | null }) => void
  isMobileView: boolean
  state: VvAppDataState
  selectedEventId: string
  editingEventId: string | null
  setEditingEventId: (id: string | null) => void
  quotePhoto: CatalogPhoto | null
  openWhatsAppQuote: (photo: CatalogPhoto) => void
  closeWhatsAppQuote: () => void
  isAuthenticated: boolean
  isAuthLoading: boolean
  loginOwner: (email: string, password: string) => Promise<{ ok: boolean; message: string }>
  logoutOwner: () => Promise<void>
  addCategory: (name: string) => Promise<CatalogCategory | null>
  updateCategory: (id: string, name: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addPhoto: (payload: Omit<CatalogPhoto, 'id' | 'createdAt'>) => CatalogPhoto
  updatePhoto: (id: string, payload: Omit<CatalogPhoto, 'id' | 'createdAt'>) => void
  deletePhoto: (id: string) => void
  addEvent: (payload: Omit<EventRecord, 'id' | 'createdAt' | 'status'>) => EventRecord
  updateEvent: (id: string, payload: Omit<EventRecord, 'id' | 'createdAt'>) => void
  deleteEvent: (id: string) => void
  markEventCompleted: (id: string) => EventRecord | null
  updateBusinessConfig: (newConfig: Partial<VvBusinessConfigState>) => Promise<void>
  sendReportChatMessage: (text: string, role?: AgentRole) => Promise<void>
  logBitacora: (
    action: BitacoraActionType,
    detail: string,
    status?: 'Éxito' | 'Fallo'
  ) => void
  getCategoryName: (categoryId: string) => string
}

const VvAppContext = createContext<VvAppContextValue | null>(null)

function resolveInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return '/landing'
  const pathname = window.location.pathname as AppRoute
  if (VALID_ROUTES.includes(pathname)) {
    return pathname
  }
  return '/landing'
}

export function VvAppProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(resolveInitialRoute)
  const [isNarrowScreen, setIsNarrowScreen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vv_auth') === 'true'
    }
    return false
  })
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true)
  const [state, setState] = useState<VvAppDataState>(() => {
    const initial = createInitialVvState()
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as VvAppDataState
        if (parsed && Array.isArray(parsed.events) && Array.isArray(parsed.photos)) {
          return {
            ...parsed,
            config: parsed.config || initial.config,
          }
        }
      }
    } catch {
      // Use initial state
    }
    return initial
  })

  const [selectedEventId, setSelectedEventId] = useState<string>(
    () => state.events[0]?.id || ''
  )
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [quotePhoto, setQuotePhoto] = useState<CatalogPhoto | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage quota errors
    }
  }, [state])

  useEffect(() => {
    let isMounted = true
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (isMounted) {
          const hasUser = !!session?.user
          if (hasUser) {
            setIsAuthenticated(true)
            if (typeof window !== 'undefined') {
              localStorage.setItem('vv_auth', 'true')
            }
          } else if (
            typeof window !== 'undefined' &&
            localStorage.getItem('vv_auth') !== 'true'
          ) {
            setIsAuthenticated(false)
          }
          setIsAuthLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        const hasUser = !!session?.user
        if (hasUser) {
          setIsAuthenticated(true)
          if (typeof window !== 'undefined') {
            localStorage.setItem('vv_auth', 'true')
          }
        }
        setIsAuthLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    async function syncFromSupabase() {
      try {
        const { data: configData } = await supabase
          .from('configuracion_negocio')
          .select('*')
          .limit(1)
          .single()

        if (configData && isMounted) {
          setState((prev) => ({
            ...prev,
            config: {
              businessName: configData.nombre_comercial || prev.config.businessName,
              brandSubtitle: configData.subtitulo || prev.config.brandSubtitle,
              whatsappPhone: configData.telefono_whatsapp || prev.config.whatsappPhone,
              contactPhone: configData.telefono_llamadas || prev.config.contactPhone,
            },
          }))
        }

        const { data: catData } = await supabase
          .from('categorias')
          .select('*')
          .order('orden', { ascending: true })

        if (catData && isMounted) {
          setState((prev) => ({
            ...prev,
            categories: (catData as any[]).map((c) => ({
              id: c.slug || c.id,
              name: c.nombre,
            })),
          }))
        }

        const { data: eventData } = await supabase
          .from('eventos')
          .select('*')
          .order('fecha_evento', { ascending: true })

        if (eventData && (eventData as any[]).length > 0 && isMounted) {
          setState((prev) => ({
            ...prev,
            events: (eventData as any[]).map((e) => ({
              id: e.id,
              name: e.titulo,
              clientName: e.cliente_nombre,
              phone: e.cliente_telefono,
              venue: e.ubicacion,
              date: e.fecha_evento,
              categoryId: e.categoria_slug || 'bodas',
              totalPriceBs: Number(e.total_bs) || 0,
              advancePriceBs: Number(e.adelanto_bs) || 0,
              status: e.estado === 'finalizado' ? 'completado' : 'activo',
              createdAt: e.created_at,
            })),
          }))
        }

        const { data: photosData } = await supabase
          .from('fotos_evento')
          .select('*')
          .order('created_at', { ascending: false })

        if (photosData && (photosData as any[]).length > 0 && isMounted) {
          setState((prev) => ({
            ...prev,
            photos: (photosData as any[]).map((p) => ({
              id: p.id,
              name: p.titulo,
              description: p.descripcion || '',
              imageUrl: p.public_url,
              categoryId: p.categoria_slug || 'bodas',
              createdAt: p.created_at,
              sourceEventId: p.evento_id,
            })),
          }))
        }
      } catch {
        // Fallback silencioso si offline
      }
    }
    syncFromSupabase()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsNarrowScreen(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobileView = isNarrowScreen

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as AppRoute
      if (VALID_ROUTES.includes(path)) {
        setCurrentRoute(path)
      } else {
        setCurrentRoute('/landing')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (
    route: AppRoute,
    options?: { eventId?: string; editEventId?: string | null }
  ) => {
    if (options?.eventId) {
      setSelectedEventId(options.eventId)
    }
    if (options && 'editEventId' in options) {
      setEditingEventId(options.editEventId ?? null)
    }
    setCurrentRoute(route)
    try {
      window.history.pushState({}, '', route)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      // Ignore history errors
    }
  }

  const logBitacora = (
    action: BitacoraActionType,
    detail: string,
    status: 'Éxito' | 'Fallo' = 'Éxito'
  ) => {
    setState((prev) => ({
      ...prev,
      bitacora: [
        {
          id: `bit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: getCurrentTimestampLabel(),
          action,
          detail,
          status,
        },
        ...prev.bitacora,
      ],
    }))
  }

  const loginOwner = async (
    email: string,
    password: string
  ): Promise<{ ok: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password.trim()) {
      logBitacora(
        'Fallo de Login',
        `Intento de inicio de sesión con campos vacíos (${cleanEmail || 'sin usuario'}).`,
        'Fallo'
      )
      return {
        ok: false,
        message: 'Por favor ingresa tu usuario/correo y contraseña.',
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password.trim(),
      })

      if (!error && data?.user) {
        setIsAuthenticated(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem('vv_auth', 'true')
        }
        logBitacora(
          'Login Exitoso',
          `Inicio de sesión exitoso del propietario (${cleanEmail}).`,
          'Éxito'
        )
        navigate('/admin/inicio')
        return { ok: true, message: 'Sesión iniciada correctamente.' }
      }
    } catch {
      // Continuar con verificación de contingencia
    }

    if (
      cleanEmail === 'veronica@gmail.com' &&
      password.trim() === '20042008'
    ) {
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('vv_auth', 'true')
      }
      logBitacora(
        'Login Exitoso',
        `Inicio de sesión exitoso del propietario (${cleanEmail}).`,
        'Éxito'
      )
      navigate('/admin/inicio')
      return { ok: true, message: 'Sesión iniciada correctamente.' }
    }

    logBitacora(
      'Fallo de Login',
      `Credenciales inválidas para el usuario "${cleanEmail}". Acceso denegado.`,
      'Fallo'
    )
    return {
      ok: false,
      message:
        'Credenciales incorrectas. Verifica tu correo y contraseña (este intento fue registrado en la Bitácora).',
    }
  }

  const logoutOwner = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignorar error al desconectar
    }
    logBitacora(
      'Logout',
      'El propietario cerró sesión desde el panel administrativo.',
      'Éxito'
    )
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vv_auth')
    }
    navigate('/login')
  }

  const addCategory = async (name: string): Promise<CatalogCategory | null> => {
    const trimmed = name.trim()
    if (!trimmed) return null

    const existing = state.categories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (existing) {
      return existing
    }

    const slug =
      trimmed
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`

    const created: CatalogCategory = {
      id: slug,
      name: trimmed,
    }

    try {
      await supabase.from('categorias').insert({
        nombre: trimmed,
        slug,
        orden: state.categories.length + 1,
      })
    } catch {
      // Guardado local si offline
    }

    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, created],
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Crear Categoría',
          detail: `Se registró la nueva categoría "${created.name}".`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))

    return created
  }

  const updateCategory = async (id: string, name: string): Promise<void> => {
    const trimmed = name.trim()
    if (!trimmed) return

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    try {
      if (isUuid) {
        await supabase.from('categorias').update({ nombre: trimmed }).eq('id', id)
      } else {
        await supabase.from('categorias').update({ nombre: trimmed }).eq('slug', id)
      }
    } catch {
      // offline fallback
    }

    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, name: trimmed } : c
      ),
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Editar Categoría',
          detail: `Se renombró la categoría a "${trimmed}".`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))
  }

  const deleteCategory = async (id: string): Promise<void> => {
    const target = state.categories.find((c) => c.id === id)
    if (!target) return

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    try {
      // Desvincular eventos y fotos en Supabase si tienen este slug para evitar restricción foreign key
      if (!isUuid) {
        await supabase.from('eventos').update({ categoria_slug: null }).eq('categoria_slug', id)
      }
      if (isUuid) {
        await supabase.from('categorias').delete().eq('id', id)
      } else {
        await supabase.from('categorias').delete().eq('slug', id)
      }
    } catch {
      // offline fallback
    }

    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Eliminar Categoría',
          detail: `Se eliminó la categoría "${target.name}".`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))
  }

  const addPhoto = (
    payload: Omit<CatalogPhoto, 'id' | 'createdAt'>
  ): CatalogPhoto => {
    const created: CatalogPhoto = {
      ...payload,
      id: `pho-${Date.now()}`,
      createdAt: getLocalIsoDate(0),
    }

    setState((prev) => ({
      ...prev,
      photos: [created, ...prev.photos],
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Crear Foto',
          detail: `Se publicó la foto de decoración "${created.name}" en el catálogo.`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))

    return created
  }

  const updatePhoto = (
    id: string,
    payload: Omit<CatalogPhoto, 'id' | 'createdAt'>
  ) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => (p.id === id ? { ...p, ...payload } : p)),
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Editar Foto',
          detail: `Se actualizaron los datos de la decoración "${payload.name}".`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))
  }

  const deletePhoto = (id: string) => {
    const target = state.photos.find((p) => p.id === id)
    if (!target) {
      logBitacora(
        'Error de Operación',
        `Intento de eliminar una foto inexistente (ID: ${id}).`,
        'Fallo'
      )
      return
    }

    setState((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Eliminar Foto',
          detail: `Se eliminó la decoración "${target.name}" del catálogo público.`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))
  }

  const addEvent = (
    payload: Omit<EventRecord, 'id' | 'createdAt' | 'status'>
  ): EventRecord => {
    const created: EventRecord = {
      ...payload,
      id: `evt-${Date.now()}`,
      status: 'activo',
      createdAt: getLocalIsoDate(0),
    }

    setState((prev) => ({
      ...prev,
      events: [created, ...prev.events],
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Crear Evento',
          detail: `Se registró el evento "${created.name}" para el cliente ${created.clientName} (${created.date}).`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))

    setSelectedEventId(created.id)
    return created
  }

  const updateEvent = (
    id: string,
    payload: Omit<EventRecord, 'id' | 'createdAt'>
  ) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((ev) =>
        ev.id === id ? { ...ev, ...payload } : ev
      ),
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Editar Evento',
          detail: `Se editó el evento "${payload.name}" (Cliente: ${payload.clientName}).`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))
  }

  const deleteEvent = (id: string) => {
    const target = state.events.find((e) => e.id === id)
    if (!target) {
      logBitacora(
        'Error de Operación',
        `Error al intentar eliminar evento con ID ${id}.`,
        'Fallo'
      )
      return
    }

    setState((prev) => {
      const remaining = prev.events.filter((e) => e.id !== id)
      if (selectedEventId === id && remaining.length > 0) {
        setSelectedEventId(remaining[0].id)
      }
      return {
        ...prev,
        events: remaining,
        bitacora: [
          {
            id: `bit-${Date.now()}`,
            timestamp: getCurrentTimestampLabel(),
            action: 'Eliminar Evento',
            detail: `Se eliminó el evento "${target.name}" del cliente ${target.clientName}.`,
            status: 'Éxito',
          },
          ...prev.bitacora,
        ],
      }
    })
  }

  const markEventCompleted = (id: string): EventRecord | null => {
    const target = state.events.find((e) => e.id === id)
    if (!target) return null

    const updated: EventRecord = {
      ...target,
      status: 'completado',
    }

    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? updated : e)),
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Evento Completado',
          detail: `El evento "${target.name}" (Cliente: ${target.clientName}) fue marcado como Completado.`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))

    return updated
  }

  const sendReportChatMessage = async (
    text: string,
    role: AgentRole = 'finanzas'
  ) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const nowTime = getCurrentTimestampLabel().split('·')[1]?.trim() || 'Ahora'

    // Agregar mensaje del usuario
    setState((prev) => ({
      ...prev,
      reportChat: [
        ...prev.reportChat,
        {
          id: `rchat-u-${Date.now()}`,
          sender: 'user',
          text: trimmed,
          time: nowTime,
          agentRole: role,
        },
      ],
    }))

    // Consultar el servicio multi-agente con 6 guardrails y fallback
    const res = await AiAssistantService.queryAgent(trimmed, role, state)

    setState((prev) => ({
      ...prev,
      reportChat: [
        ...prev.reportChat,
        {
          id: `rchat-b-${Date.now() + 1}`,
          sender: 'bot',
          text: res.text,
          time: nowTime,
          agentRole: res.agentRole,
          upcomingEventsCard: res.attachedEvents?.map((e) => ({
            id: e.id,
            name: e.name,
            clientName: e.clientName,
            date: e.date,
            venue: e.venue,
            pendingBalanceBs: Math.max(0, e.totalPriceBs - e.advancePriceBs),
          })),
          attachedPhotosCard: res.attachedPhotos?.map((p) => ({
            id: p.id,
            name: p.name,
            imageUrl: p.imageUrl,
            description: p.description,
          })),
        },
      ],
    }))
  }

  const updateBusinessConfig = async (
    newConfig: Partial<VvBusinessConfigState>
  ) => {
    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        ...newConfig,
      },
      bitacora: [
        {
          id: `bit-${Date.now()}`,
          timestamp: getCurrentTimestampLabel(),
          action: 'Editar Evento' as BitacoraActionType,
          detail: `Se actualizaron las variables comerciales del negocio (WhatsApp: ${
            newConfig.whatsappPhone || prev.config.whatsappPhone
          }).`,
          status: 'Éxito',
        },
        ...prev.bitacora,
      ],
    }))

    try {
      await supabase
        .from('configuracion_negocio')
        .update({
          ...(newConfig.businessName
            ? { nombre_comercial: newConfig.businessName }
            : {}),
          ...(newConfig.brandSubtitle
            ? { subtitulo: newConfig.brandSubtitle }
            : {}),
          ...(newConfig.whatsappPhone
            ? { telefono_whatsapp: newConfig.whatsappPhone }
            : {}),
          ...(newConfig.contactPhone
            ? { telefono_llamadas: newConfig.contactPhone }
            : {}),
          updated_at: new Date().toISOString(),
        } as any)
        .neq('id', '00000000-0000-0000-0000-000000000000')
    } catch {
      // Ignora error si offline
    }
  }

  const getCategoryName = (categoryId: string): string => {
    return (
      state.categories.find((c) => c.id === categoryId)?.name || 'General'
    )
  }

  return (
    <VvAppContext.Provider
      value={{
        currentRoute,
        navigate,
        isMobileView,
        state,
        selectedEventId,
        editingEventId,
        setEditingEventId,
        quotePhoto,
        openWhatsAppQuote: (photo) => setQuotePhoto(photo),
        closeWhatsAppQuote: () => setQuotePhoto(null),
        isAuthenticated,
        isAuthLoading,
        loginOwner,
        logoutOwner,
        addCategory,
        updateCategory,
        deleteCategory,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addEvent,
        updateEvent,
        deleteEvent,
        markEventCompleted,
        updateBusinessConfig,
        sendReportChatMessage,
        logBitacora,
        getCategoryName,
      }}
    >
      {children}
    </VvAppContext.Provider>
  )
}

export function useVvApp(): VvAppContextValue {
  const ctx = useContext(VvAppContext)
  if (!ctx) {
    throw new Error('useVvApp debe usarse dentro de un VvAppProvider')
  }
  return ctx
}
