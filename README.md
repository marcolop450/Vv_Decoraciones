# V.v Decoración de Eventos y Cotillón

Plataforma integral para gestión y comercialización de eventos y alta decoración con identidad visual **"Gala Nocturna"** (Negro Puro `#050505` y Dorado Imperial `#D4AF37`).

---

## 1. Estructura del Proyecto

El repositorio está estructurado en módulos desacoplados e independientes:

- **`/Frontend`**: Aplicación Web React 19 + Vite + Tailwind CSS v4 con Framer Motion (Catálogo público interactivo, cotizador de WhatsApp y Panel de Administración de escritorio). Lista para despliegue en Vercel.
- **`/Movil`**: Aplicación móvil autónoma en React Native (Expo SDK 52) con navegación inferior (Bottom Tabs) y módulo para captura de fotos en vivo desde eventos.
- **`/Backend`**: Scripts DDL de base de datos relacional para Supabase (PostgreSQL), políticas de seguridad Row Level Security (RLS) y configuración del bucket `eventos-fotos`.
- **`/Shared`**: Paquete TypeScript con tipos unificados (`@eventos-vero/shared`) y tokens de diseño.
- **`/Doc`**: Guías de arquitectura, tokens de diseño y directrices de despliegue.
- **`/openspec`**: Especificación formal y control de cambios guiado por especificaciones (OpenSpec SDD).

---

## 2. Puesta en Marcha Local

### A. Variables de Entorno
Copia el archivo `.env.example` como `.env` tanto en la raíz como en `/Frontend` y completa tus credenciales públicas de Supabase:

```bash
VITE_SUPABASE_URL=https://zetuihzjpnbfhvzclajx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_WHATSAPP_PHONE=59170000000
VITE_CONTACT_PHONE=59170000000
```

### B. Ejecutar la Web en Desarrollo
```bash
cd Frontend
npm install
npm run dev
```

### C. Pruebas E2E (Playwright)
```bash
cd Frontend
npm run build
npx playwright test
```

---

## 3. Despliegue en Vercel

1. Conecta este repositorio en tu cuenta de Vercel.
2. Configura el **Root Directory** como `Frontend` (o usa la configuración raíz con `vercel.json`).
3. Agrega las variables de entorno en el panel de Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_PHONE`
   - `VITE_CONTACT_PHONE`
4. Presiona **Deploy**.
