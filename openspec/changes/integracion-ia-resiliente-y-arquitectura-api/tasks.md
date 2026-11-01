# Tasks: IA Gratuita, 3 Agentes, 6 Guardrails y Reglas de Negocio

## 1. Servicio de IA Gratuito y Fallback en Cascada

- [x] 1.1 Crear el servicio [`aiAssistantService.ts`](file:///D:/Eventos_Vero/Frontend/src/services/aiAssistantService.ts) conectando con Google Gemini Flash (capa gratuita de Google AI Studio) y Groq Llama 3.3 con timeout controlado y fallback determinístico local a costo $0.
- [x] 1.2 Implementar el motor determinístico local de contingencia para procesar consultas de eventos y saldos de forma instantánea sin requerir API keys externas.

## 2. Guardrails (Seis Correas) y Grounding RAG

- [x] 2.1 Implementar [`guardrailsService.ts`](file:///D:/Eventos_Vero/Frontend/src/services/guardrailsService.ts) con las 6 correas: filtros de contenido, temas denegados, filtros de palabras, enmascaramiento de PII, grounding contra Supabase y razonamiento matemático formal.
- [x] 2.2 Configurar los 3 Agentes Especializados (Finanzas, Agenda, Ventas) con system prompts breves y chips de consulta por defecto sin sobrecontexto.

## 3. Adaptaciones de Cotización WhatsApp y Reglas Financieras

- [x] 3.1 Actualizar [`WhatsAppQuoteModal.tsx`](file:///D:/Eventos_Vero/Frontend/src/components/modals/WhatsAppQuoteModal.tsx) para incorporar la URL pública de la fotografía en el mensaje de WhatsApp garantizando la previsualización de imagen en el chat.
- [x] 3.2 Actualizar [`EventFormContent.tsx`](file:///D:/Eventos_Vero/Frontend/src/components/modals/EventFormContent.tsx) para calcular y sugerir automáticamente el 50% (la mitad) como adelanto al escribir el precio total, manteniendo el campo editable.

## 4. UI de Reportes y Validación E2E

- [x] 4.1 Actualizar [`AdminReportesPage.tsx`](file:///D:/Eventos_Vero/Frontend/src/pages/admin/AdminReportesPage.tsx) integrando el selector de los 3 Agentes con sus chips de consulta por defecto y renderizado de tarjetas interactivas.
- [x] 4.2 Ejecutar `npm run build` y la suite de pruebas completa en Playwright (`npx playwright test`) con Google Chrome local verificando 100% de éxito.
