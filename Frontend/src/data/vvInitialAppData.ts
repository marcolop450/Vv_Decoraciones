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
  const today = getLocalIsoDate(0)
  const inTwoDays = getLocalIsoDate(2)
  const inFiveDays = getLocalIsoDate(5)
  const inEightDays = getLocalIsoDate(8)
  const fiveDaysAgo = getLocalIsoDate(-5)
  const twelveDaysAgo = getLocalIsoDate(-12)

  const initialEvents = [
    {
      id: 'evt-101',
      name: 'Boda Imperial "Noche de Oro"',
      clientName: 'Marco Alejandro',
      phone: '70145892',
      venue: 'Salón Gran Emperador — Av. Principal #450',
      date: today,
      categoryId: 'cat-bodas',
      totalPriceBs: 14500,
      advancePriceBs: 8500,
      status: 'activo' as const,
      createdAt: fiveDaysAgo,
    },
    {
      id: 'evt-102',
      name: 'XV Años Gala Real — Valentina',
      clientName: 'Carla Patricia Méndez',
      phone: '76523910',
      venue: 'Jardines La Riviera — Salón Cristal',
      date: inTwoDays,
      categoryId: 'cat-quince',
      totalPriceBs: 11800,
      advancePriceBs: 6800,
      status: 'activo' as const,
      createdAt: fiveDaysAgo,
    },
    {
      id: 'evt-103',
      name: 'Cena Anual & Premiación Grupo Altamira',
      clientName: 'Rodrigo Vargas',
      phone: '71088432',
      venue: 'Hotel Los Tajibos — Salón Real',
      date: inFiveDays,
      categoryId: 'cat-corporativos',
      totalPriceBs: 18200,
      advancePriceBs: 11200,
      status: 'activo' as const,
      createdAt: today,
    },
    {
      id: 'evt-104',
      name: 'Cumpleaños 50 Años "Obsidiana & Champán"',
      clientName: 'Fernanda Villarroel',
      phone: '72199045',
      venue: 'Terraza Mirador VIP',
      date: inEightDays,
      categoryId: 'cat-cumpleanos',
      totalPriceBs: 7600,
      advancePriceBs: 4000,
      status: 'activo' as const,
      createdAt: today,
    },
    {
      id: 'evt-105',
      name: 'Boda Civil & Recepción Familia Suárez',
      clientName: 'Daniela Suárez',
      phone: '75312098',
      venue: 'Quinta Los Olivos',
      date: fiveDaysAgo,
      categoryId: 'cat-bodas',
      totalPriceBs: 12400,
      advancePriceBs: 12400,
      status: 'completado' as const,
      createdAt: twelveDaysAgo,
    },
    {
      id: 'evt-106',
      name: 'Quinceañero Estelar con Cotillón LED',
      clientName: 'Jorge Luis Camacho',
      phone: '78941200',
      venue: 'Club Social Real',
      date: twelveDaysAgo,
      categoryId: 'cat-quince',
      totalPriceBs: 9500,
      advancePriceBs: 9500,
      status: 'completado' as const,
      createdAt: twelveDaysAgo,
    },
  ]

  return {
    categories: [
      { id: 'cat-bodas', name: 'Bodas' },
      { id: 'cat-cumpleanos', name: 'Cumpleaños' },
      { id: 'cat-corporativos', name: 'Corporativos' },
      { id: 'cat-quince', name: 'Quinceañeros' },
      { id: 'cat-cotillon', name: 'Cotillón VIP' },
    ],
    photos: [
      {
        id: 'pho-1',
        name: 'Altar & Mesa Imperial en Oro y Cristal',
        description:
          'Montaje de lujo para bodas con candelabros dorados, arreglos de rosas marfil, cubertería dorada y cortinaje iluminado.',
        imageUrl: GALLERY_PRESET_IMAGES[0].url,
        categoryId: 'cat-bodas',
        createdAt: twelveDaysAgo,
      },
      {
        id: 'pho-2',
        name: 'Escenografía XV Años "Reina de la Noche"',
        description:
          'Backdrop negro obsidiana con estructura circular dorada, trono real, alfombra de destellos y kit completo de Hora Loca.',
        imageUrl: GALLERY_PRESET_IMAGES[1].url,
        categoryId: 'cat-quince',
        createdAt: twelveDaysAgo,
      },
      {
        id: 'pho-3',
        name: 'Banquete de Gala con Velas Cálidas',
        description:
          'Decoración de mesas largas imperiales con caminos florales, candelabros de bronce y ambientación cálida nocturna.',
        imageUrl: GALLERY_PRESET_IMAGES[2].url,
        categoryId: 'cat-bodas',
        createdAt: fiveDaysAgo,
      },
      {
        id: 'pho-4',
        name: 'Arco Orgánico Champán & Pampas Gold',
        description:
          'Set fotográfico principal ideal para cumpleaños de gala, aniversarios y recepciones al aire libre o en salón.',
        imageUrl: GALLERY_PRESET_IMAGES[3].url,
        categoryId: 'cat-cumpleanos',
        createdAt: fiveDaysAgo,
      },
      {
        id: 'pho-5',
        name: 'Escenario Ejecutivo & Gala Empresarial',
        description:
          'Diseño sobrio en negro profundo y dorado metálico para cenas de fin de año, aniversarios de empresa y premiaciones.',
        imageUrl: GALLERY_PRESET_IMAGES[4].url,
        categoryId: 'cat-corporativos',
        createdAt: today,
      },
      {
        id: 'pho-6',
        name: 'Pack Hora Loca & Cotillón Luminoso Dorado',
        description:
          'Incluye sombreros personalizados con iniciales en oro, gafas espejadas, globos cromados y cañones de confeti metálico.',
        imageUrl: GALLERY_PRESET_IMAGES[5].url,
        categoryId: 'cat-cotillon',
        createdAt: today,
      },
    ],
    events: initialEvents,
    bitacora: [
      {
        id: 'bit-1',
        timestamp: `${today} · 09:40`,
        action: 'Login Exitoso',
        detail: 'Inicio de sesión correcto del propietario (admin@vvdecoracion.com).',
        status: 'Éxito',
      },
      {
        id: 'bit-2',
        timestamp: `${today} · 09:38`,
        action: 'Fallo de Login',
        detail: 'Intento de acceso con contraseña incorrecta para usuario admin@vvdecoracion.com.',
        status: 'Fallo',
      },
      {
        id: 'bit-3',
        timestamp: `${today} · 09:15`,
        action: 'Crear Evento',
        detail: 'Se registró el evento "Boda Imperial Noche de Oro" — Cliente: Marco Alejandro.',
        status: 'Éxito',
      },
      {
        id: 'bit-4',
        timestamp: `${fiveDaysAgo} · 18:22`,
        action: 'Crear Foto',
        detail: 'Se publicó la decoración "Altar & Mesa Imperial en Oro y Cristal" en el catálogo.',
        status: 'Éxito',
      },
      {
        id: 'bit-5',
        timestamp: `${fiveDaysAgo} · 17:05`,
        action: 'Evento Completado',
        detail: 'Evento "Boda Civil & Recepción Familia Suárez" marcado como Completado.',
        status: 'Éxito',
      },
      {
        id: 'bit-6',
        timestamp: `${twelveDaysAgo} · 21:10`,
        action: 'Error de Operación',
        detail: 'Intento de eliminar categoría en uso "Bodas" bloqueado por integridad del catálogo.',
        status: 'Fallo',
      },
      {
        id: 'bit-7',
        timestamp: `${twelveDaysAgo} · 22:00`,
        action: 'Logout',
        detail: 'Cierre de sesión seguro desde el panel de administración.',
        status: 'Éxito',
      },
    ],
    reportChat: [
      {
        id: 'rchat-1',
        sender: 'bot',
        text: '¡Hola! Soy tu Asistente IA de Reportes de V.v Decoración. Puedes consultarme por tus eventos próximos, saldos pendientes por cobrar o métricas por categoría.',
        time: '09:40',
      },
      {
        id: 'rchat-2',
        sender: 'user',
        text: 'Quiero ver qué evento tengo los siguientes días',
        time: '09:41',
      },
      {
        id: 'rchat-3',
        sender: 'bot',
        text: 'Aquí tienes el listado de tus eventos activos programados para hoy y los siguientes días, junto con su saldo pendiente por cobrar:',
        time: '09:41',
        upcomingEventsCard: initialEvents
          .filter((e) => e.status === 'activo')
          .map((e) => ({
            id: e.id,
            name: e.name,
            clientName: e.clientName,
            date: e.date,
            venue: e.venue,
            pendingBalanceBs: Math.max(0, e.totalPriceBs - e.advancePriceBs),
          })),
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
