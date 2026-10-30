import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { VvBusinessConfig } from '@eventos-vero/shared'

const DEFAULT_CONFIG: VvBusinessConfig = {
  id: '00000000-0000-0000-0000-000000000001',
  businessName: 'V.v Decoración de eventos y cotillón',
  brandSubtitle: 'Gala Nocturna: Bodas, Quinceañeros, Cumpleaños y Galas Corporativas',
  whatsappPhone: import.meta.env.VITE_WHATSAPP_PHONE || '59170000000',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '59170000000',
  instagramUrl: 'https://instagram.com/vvdecoraciones',
  facebookUrl: 'https://facebook.com/vvdecoraciones',
  tiktokUrl: 'https://tiktok.com/@vvdecoraciones',
  locationAddress: 'Zona Central, La Paz - Bolivia',
}

export function useConfiguracion() {
  const [config, setConfig] = useState<VvBusinessConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  const fetchConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('configuracion_negocio')
        .select('*')
        .limit(1)
        .single()

      if (data && !error) {
        setConfig({
          id: data.id,
          businessName: data.nombre_comercial,
          brandSubtitle: data.subtitulo || DEFAULT_CONFIG.brandSubtitle,
          whatsappPhone: data.telefono_whatsapp,
          contactPhone: data.telefono_llamadas,
          instagramUrl: data.instagram_url || DEFAULT_CONFIG.instagramUrl,
          facebookUrl: data.facebook_url || DEFAULT_CONFIG.facebookUrl,
          tiktokUrl: data.tiktok_url || DEFAULT_CONFIG.tiktokUrl,
          locationAddress: data.direccion_taller || DEFAULT_CONFIG.locationAddress,
          updatedAt: data.updated_at,
        })
      }
    } catch {
      // Usa fallback silencioso
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const updateConfig = async (newConfig: Partial<VvBusinessConfig>) => {
    const payload = {
      nombre_comercial: newConfig.businessName,
      subtitulo: newConfig.brandSubtitle,
      telefono_whatsapp: newConfig.whatsappPhone,
      telefono_llamadas: newConfig.contactPhone,
      instagram_url: newConfig.instagramUrl,
      facebook_url: newConfig.facebookUrl,
      tiktok_url: newConfig.tiktokUrl,
      direccion_taller: newConfig.locationAddress,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('configuracion_negocio')
      .update(payload)
      .eq('id', config.id)

    if (error) throw error
    await fetchConfig()
  }

  return { config, loading, updateConfig, refreshConfig: fetchConfig }
}
