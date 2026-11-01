# ai-assistant-resilience Specification Delta

## Purpose
Orquestación resiliente del ecosistema de asistentes de IA mediante APIs 100% gratuitas, 3 agentes especializados, 6 guardrails de seguridad y reglas comerciales de cotización por WhatsApp y saldos.

## ADDED Requirements

### Requirement: Integración de APIs de IA 100% Gratuitas con Fallback
The system SHALL consultar exclusivamente APIs de lenguaje con capa gratuita (Google Gemini Flash o Groq Llama 3.3) y degradar automáticamente al motor de reglas determinístico local si la API externa falla, supera la cuota o no tiene credenciales configuradas.

#### Scenario: Consulta con API gratuita operativa
- **WHEN** el usuario envía una consulta en `/admin/reportes` y la clave de API gratuita es válida
- **THEN** el sistema procesa la respuesta a través del modelo de lenguaje incorporando las métricas solicitadas.

#### Scenario: Falla de red, cuota agotada o ausencia de credenciales
- **WHEN** la solicitud a la API externa produce un código de error o no hay clave registrada
- **THEN** el sistema activa el fallback de reglas determinístico local respondiendo de inmediato sin costo ni alertas de error.

### Requirement: Cotización WhatsApp con Previsualización de Imagen y Ubicación Universal
The system SHALL estructurar el mensaje de cotización de WhatsApp para una sola decoración a la vez, incorporando la URL pública de la fotografía para previsualización directa y permitiendo cualquier ubicación sin distinción de tipo de salón.

#### Scenario: Generación de mensaje de cotización WhatsApp
- **WHEN** el cliente pulsa "Enviar a WhatsApp" en una decoración seleccionada
- **THEN** el enlace incluye el nombre de la decoración, la fecha elegida y la URL de la imagen fotográfica.

### Requirement: Regla de Anticipo del 50% y Liquidación Posterior
The system SHALL sugerir automáticamente el 50% del total como adelanto al registrar un evento y clasificar el saldo pendiente como exigible después de la realización del evento.

#### Scenario: Cálculo inicial del adelanto
- **WHEN** la administradora ingresa el precio total contratado
- **THEN** el sistema sugiere automáticamente el 50% de adelanto manteniendo el campo editable.

### Requirement: Marco de Seis Guardrails de Seguridad
The system SHALL aplicar filtros de contenido, temas denegados, filtros de palabras, protección de información sensible (PII), grounding contextual RAG y razonamiento automatizado en cada interacción.

#### Scenario: Verificación contra alucinaciones mediante grounding
- **WHEN** la IA genera una respuesta que involucra eventos, saldos o fechas
- **THEN** el guardrail coteja los datos contra Supabase y rectifica cualquier discrepancia antes del renderizado.

### Requirement: Despacho por 3 Agentes con Consultas por Defecto
The system SHALL presentar 3 agentes especializados (Financiero, Operativo y Comercial) con botones de consulta rápida por defecto sin sobrecontexto.

#### Scenario: Uso de consultas rápidas predeterminadas
- **WHEN** la usuaria hace clic en un botón de consulta rápida por defecto
- **THEN** el agente seleccionado responde de manera concisa y genera tarjetas interactivas si corresponde.
