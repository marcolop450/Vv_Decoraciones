# Design

## Context

El usuario especifica con claridad que no se deben emplear modelos de pago como Claude, sino opciones 100% gratuitas como Google Gemini Flash y Groq Llama 3.3. Asimismo, se integran las decisiones de ciclo de vida del negocio: cotización individual con foto compartida, ubicación universal sin sesgo, adelanto sugerido del 50%, saldo liquidable después del evento y consultas rápidas por defecto sin sobrecontexto.

## Goals / Non-Goals

**Goals:**
- Conectar APIs de IA 100% gratuitas con costo $0 permanente y fallback determinístico local.
- Estructurar el mensaje de WhatsApp con la URL de la foto para habilitar la vista previa visual en la app de mensajería.
- Sugerir automáticamente el 50% de adelanto al crear un evento (`advancePrice = Math.round(totalPrice / 2)`).
- Implementar los 3 Agentes de Negocio con prompts cortos y chips de consulta por defecto.
- Aplicar las "Seis correas, un solo guardrail" para blindar seguridad y grounding contextual contra Supabase.

**Non-Goals:**
- No integrar APIs de pago que requieran tarjetas de crédito o suscripciones mensuales.
- No sobrecargar la interfaz con opciones de tipos de salón (el campo de ubicación permanece genérico y abierto para casa, colegio o salón).

## Decisions

### 1. Proveedores de IA 100% Gratuitos (Costo $0)

1. **Google Gemini Flash (Google AI Studio Free Tier)**:
   - Capa gratuita permanente con 15 RPM y 1,500 peticiones diarias sin necesidad de tarjeta de crédito.
2. **Groq Cloud API (Llama 3.3 70B Free Tier)**:
   - Capa gratuita de alta velocidad (< 400ms) especializada en salida JSON y seguimiento estricto de prompts.
3. **Motor Determinístico Local (Fallback Permanente)**:
   - Procesador local en TypeScript que se ejecuta en el navegador si no hay clave de API o si hay corte de conexión.

### 2. Flujo de Cotización de Clientes (Reglas Validadas)

- **Una sola decoración por mensaje**: Al hacer clic en "Cotizar por WhatsApp", se procesa únicamente la decoración seleccionada.
- **Enlace de fotografía en el mensaje**: El texto codificado para WhatsApp incluye:
  `Hola, deseo cotizar la decoración "[Nombre]" para la fecha [Fecha]. Foto de referencia: [URL_FOTO]`
  Esto permite que WhatsApp genere automáticamente la previsualización visual con la imagen en el chat.
- **Ubicación universal**: El campo de ubicación no clasifica salones; acepta cualquier dirección, colegio, hogar o recinto.

### 3. Reglas Financieras de Verónica (Dueña)

- **Sugerencia del 50% de Adelanto**: Al teclear el precio total en el formulario de eventos, el campo de adelanto sugiere automáticamente la mitad, manteniendo la libertad de editarlo.
- **Liquidación Post-Evento**: La interfaz y reportes clasifican los saldos pendientes como cobrables al concluir el evento.
- **Chips de Consulta por Defecto**: Cada agente cuenta con 2 a 3 botones rápidos directos sin saturar a la dueña con menús extensos.

### 4. Implementación de las "Seis Correas, Un Solo Guardrail"

| Correa | Mecanismo |
|---|---|
| **1. Contenido** | Filtro de entrada contra insultos o prompt injection. |
| **2. Temas denegados** | Restricción estricta al negocio de eventos y decoración. |
| **3. Palabras** | Bloqueo de nombres de competidores o datos técnicos del sistema. |
| **4. PII** | Enmascaramiento de números de tarjetas o datos bancarios. |
| **5. Grounding** | Cotejo obligatorio contra los datos reales de Supabase. |
| **6. Razonamiento** | Verificación matemática formal: `Saldo = Total - Adelanto`. |

## Risks / Trade-offs

- **[Riesgo: Cuota diaria de API gratuita agotada]** → Mitigación: Paso instantáneo al motor de reglas determinístico sin que el usuario reciba ningún error.
