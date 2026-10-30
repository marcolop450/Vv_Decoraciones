# Guia de Despliegue en Vercel - Eventos Vero

## 1. Configuracion de Despliegue

Para desplegar la aplicacion web `/Frontend` en Vercel:

1. **Root Directory**: Configurar en Vercel como `Frontend`.
2. **Framework Preset**: `Vite`.
3. **Build Command**: `npm run build`.
4. **Output Directory**: `dist`.

## 2. Variables de Entorno Requeridas en Vercel

Configurar en el panel de Vercel (Project Settings > Environment Variables):

- `VITE_SUPABASE_URL`: URL del proyecto Supabase (ej: `https://zetuihzjpnbfhvzclajx.supabase.co`)
- `VITE_SUPABASE_ANON_KEY`: Clave publica anonima de Supabase
- `VITE_WHATSAPP_PHONE`: Telefono de contingencia para WhatsApp (ej: `59170000000`)
- `VITE_CONTACT_PHONE`: Telefono de contingencia para llamadas directas
