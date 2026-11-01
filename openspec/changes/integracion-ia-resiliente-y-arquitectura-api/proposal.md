# Proposal

## Why

El asistente de reportes y el flujo comercial requieren conectarse a APIs 100% gratuitas (Google Gemini Flash en AI Studio y Groq Llama 3.3 con costo $0) sin recurrir a opciones de pago como Claude. Asimismo, se integran las reglas de vida del usuario definidas por la dueña: cotización individual de decoraciones con enlace a la fotografía en WhatsApp, ubicación neutra (hogar, colegio o salón sin sesgo), sugerencia del 50% de adelanto y saldo a cobrar después del evento, todo blindado por el marco de "Seis correas, un solo guardrail".

## What Changes

- **APIs de IA 100% Gratuitas**: Conexión a Google Gemini Flash (capa gratuita sin tarjeta de crédito) y Groq Llama 3.3 con fallback determinístico local a costo $0 garantizado.
- **Flujo de Cotización Cliente Calibrado**: Cotización de una sola decoración a la vez, incluyendo la URL de la imagen en el texto de WhatsApp para generar la previsualización gráfica y campo de ubicación abierto sin restricciones.
- **Reglas Financieras de la Dueña**: Cálculo sugerido automático del 50% (mitad) en adelanto, saldo pendiente liquidable después del evento y chips rápidos con las consultas por defecto sin sobrecontexto.
- **Arquitectura de 3 Agentes con 6 Guardrails**: Agente Financiero, Agente de Agenda y Agente Comercial, protegidos por filtros de contenido, temas denegados, filtros de palabras, protección PII, grounding contextual RAG y razonamiento formal.

## Capabilities

### New Capabilities
- `ai-assistant-resilience`: Motor de asistencia mediante IA multi-agente 100% gratuita, con arquitectura de 6 guardrails, grounding estricto sobre Supabase y fallback determinístico local.

### Modified Capabilities
<!-- No requirement changes to existing capabilities -->

## Impact

- Frontend: `AdminReportesPage.tsx`, `WhatsAppQuoteModal.tsx`, `EventFormContent.tsx`, servicios `aiAssistantService.ts` y `guardrailsService.ts`.
- Variables de entorno: `VITE_GEMINI_API_KEY` o `VITE_GROQ_API_KEY` (opcionales, degradación transparente a motor local).
- Supabase: Lectura de métricas y catálogo para grounding contextual.
