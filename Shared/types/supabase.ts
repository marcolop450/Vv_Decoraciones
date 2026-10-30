export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      configuracion_negocio: {
        Row: {
          id: string
          nombre_comercial: string
          subtitulo: string | null
          telefono_whatsapp: string
          telefono_llamadas: string
          instagram_url: string | null
          facebook_url: string | null
          tiktok_url: string | null
          direccion_taller: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          nombre_comercial?: string
          subtitulo?: string | null
          telefono_whatsapp?: string
          telefono_llamadas?: string
          instagram_url?: string | null
          facebook_url?: string | null
          tiktok_url?: string | null
          direccion_taller?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          nombre_comercial?: string
          subtitulo?: string | null
          telefono_whatsapp?: string
          telefono_llamadas?: string
          instagram_url?: string | null
          facebook_url?: string | null
          tiktok_url?: string | null
          direccion_taller?: string | null
          updated_at?: string
        }
      }
      categorias: {
        Row: {
          id: string
          nombre: string
          slug: string
          descripcion: string | null
          orden: number
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          descripcion?: string | null
          orden?: number
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          descripcion?: string | null
          orden?: number
          created_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          cliente_nombre: string
          cliente_telefono: string
          categoria_slug: string | null
          fecha_evento: string
          hora_evento: string | null
          ubicacion: string
          total_bs: number
          adelanto_bs: number
          estado: 'cotizacion' | 'confirmado' | 'en_montaje' | 'finalizado' | 'cancelado'
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          cliente_nombre: string
          cliente_telefono: string
          categoria_slug?: string | null
          fecha_evento: string
          hora_evento?: string | null
          ubicacion: string
          total_bs?: number
          adelanto_bs?: number
          estado?: 'cotizacion' | 'confirmado' | 'en_montaje' | 'finalizado' | 'cancelado'
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          cliente_nombre?: string
          cliente_telefono?: string
          categoria_slug?: string | null
          fecha_evento?: string
          hora_evento?: string | null
          ubicacion?: string
          total_bs?: number
          adelanto_bs?: number
          estado?: 'cotizacion' | 'confirmado' | 'en_montaje' | 'finalizado' | 'cancelado'
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fotos_evento: {
        Row: {
          id: string
          evento_id: string | null
          titulo: string
          descripcion: string | null
          storage_path: string
          public_url: string
          es_portada: boolean
          es_catalogo_publico: boolean
          categoria_slug: string | null
          ancho: number | null
          alto: number | null
          peso_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          evento_id?: string | null
          titulo: string
          descripcion?: string | null
          storage_path: string
          public_url: string
          es_portada?: boolean
          es_catalogo_publico?: boolean
          categoria_slug?: string | null
          ancho?: number | null
          alto?: number | null
          peso_bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          evento_id?: string | null
          titulo?: string
          descripcion?: string | null
          storage_path?: string
          public_url?: string
          es_portada?: boolean
          es_catalogo_publico?: boolean
          categoria_slug?: string | null
          ancho?: number | null
          alto?: number | null
          peso_bytes?: number | null
          created_at?: string
        }
      }
      bitacora: {
        Row: {
          id: string
          accion: 'crear' | 'editar' | 'eliminar' | 'login' | 'error' | 'estado'
          titulo: string
          detalle: string
          usuario_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          accion: 'crear' | 'editar' | 'eliminar' | 'login' | 'error' | 'estado'
          titulo: string
          detalle: string
          usuario_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          accion?: 'crear' | 'editar' | 'eliminar' | 'login' | 'error' | 'estado'
          titulo?: string
          detalle?: string
          usuario_id?: string | null
          created_at?: string
        }
      }
      cotizaciones: {
        Row: {
          id: string
          cliente_nombre: string
          cliente_telefono: string | null
          tipo_evento: string
          fecha_evento: string | null
          cantidad_invitados: number | null
          presupuesto_estimado_bs: number | null
          notas: string | null
          estado: 'pendiente' | 'contactado' | 'descartado'
          created_at: string
        }
        Insert: {
          id?: string
          cliente_nombre: string
          cliente_telefono?: string | null
          tipo_evento: string
          fecha_evento?: string | null
          cantidad_invitados?: number | null
          presupuesto_estimado_bs?: number | null
          notas?: string | null
          estado?: 'pendiente' | 'contactado' | 'descartado'
          created_at?: string
        }
        Update: {
          id?: string
          cliente_nombre?: string
          cliente_telefono?: string | null
          tipo_evento?: string
          fecha_evento?: string | null
          cantidad_invitados?: number | null
          presupuesto_estimado_bs?: number | null
          notas?: string | null
          estado?: 'pendiente' | 'contactado' | 'descartado'
          created_at?: string
        }
      }
    }
  }
}
