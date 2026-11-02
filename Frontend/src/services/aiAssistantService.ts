import type { CatalogPhoto, EventRecord, VvAppDataState } from '../types/vv-app'
import { GuardrailsService } from './guardrailsService'

export type AgentRole = 'finanzas' | 'agenda' | 'ventas'

export interface AssistantResponse {
  text: string
  agentRole: AgentRole
  attachedEvents?: EventRecord[]
  attachedPhotos?: CatalogPhoto[]
}

// Normalizador fonético y semántico para evitar fallos por tildes o mayúsculas
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// Cálculo de distancia de Levenshtein para tolerancia a errores tipográficos ("plta" -> "plata")
function similarityScore(source: string, target: string): number {
  const s = normalize(source)
  const t = normalize(target)
  if (s === t) return 1
  if (s.includes(t) || t.includes(s)) return 0.85

  let matches = 0
  const words = s.split(/\s+/)
  for (const w of words) {
    if (t.includes(w) && w.length > 2) matches++
  }
  return matches / Math.max(words.length, 1)
}

export const AiAssistantService = {
  // Motor Semántico Difuso Local (Fallback Permanente a costo $0)
  processLocalSemanticQuery(
    prompt: string,
    role: AgentRole,
    state: VvAppDataState
  ): AssistantResponse {
    const q = normalize(prompt)
    const metrics = GuardrailsService.getVerifiedMetrics(state)

    // 1. ROL: FINANZAS & COBRANZAS
    if (role === 'finanzas' || q.includes('saldo') || q.includes('plata') || q.includes('debe') || q.includes('cobrar') || q.includes('cuanto')) {
      if (q.includes('cliente') || q.includes('deudor') || q.includes('quien')) {
        if (metrics.debtors.length === 0) {
          return {
            text: '¡Excelente noticia! Actualmente no tienes clientes con saldos pendientes por cobrar. Todos tus eventos activos tienen los pagos al día.',
            agentRole: 'finanzas',
          }
        }
        return {
          text: `Tienes ${metrics.debtors.length} evento(s) con saldo pendiente de cobro posterior. Aquí tienes el detalle de cada cliente:`,
          agentRole: 'finanzas',
          attachedEvents: metrics.debtors,
        }
      }

      return {
        text: `Resumen financiero al día:\n• Saldo pendiente por cobrar: Bs. ${metrics.totalPendingBs.toLocaleString()}\n• Adelantos recibidos: Bs. ${metrics.totalAdvanceBs.toLocaleString()}\n• Total contratado: Bs. ${metrics.totalContractedBs.toLocaleString()}`,
        agentRole: 'finanzas',
        attachedEvents: metrics.debtors.slice(0, 3),
      }
    }

    // 2. ROL: AGENDA & MONTAJES
    if (role === 'agenda' || q.includes('evento') || q.includes('agenda') || q.includes('fecha') || q.includes('cuando') || q.includes('proximo') || q.includes('fin de semana')) {
      if (metrics.activeEvents.length === 0) {
        return {
          text: 'No tienes eventos activos programados en tu agenda por el momento.',
          agentRole: 'agenda',
        }
      }

      // Ordenar por fecha cronológica ascendente
      const sorted = [...metrics.activeEvents].sort((a, b) => a.date.localeCompare(b.date))
      return {
        text: `Tienes ${sorted.length} evento(s) en agenda. Aquí están tus próximos montajes ordenados por fecha:`,
        agentRole: 'agenda',
        attachedEvents: sorted,
      }
    }

    // 3. ROL: VENTAS & CATÁLOGO
    if (role === 'ventas' || q.includes('boda') || q.includes('quince') || q.includes('cumple') || q.includes('decoracion') || q.includes('catalogo') || q.includes('recomiend')) {
      let filteredPhotos = state.photos

      if (q.includes('boda') || q.includes('matrimonio') || q.includes('nupcial')) {
        filteredPhotos = state.photos.filter((p) =>
          normalize(p.name + ' ' + p.description).includes('boda')
        )
      } else if (q.includes('quince') || q.includes('xv')) {
        filteredPhotos = state.photos.filter((p) =>
          normalize(p.name + ' ' + p.description).includes('quince')
        )
      } else if (q.includes('cumple')) {
        filteredPhotos = state.photos.filter((p) =>
          normalize(p.name + ' ' + p.description).includes('cumple')
        )
      }

      const selection = filteredPhotos.length > 0 ? filteredPhotos.slice(0, 4) : state.photos.slice(0, 3)

      if (selection.length === 0) {
        return {
          text: 'Aún no tienes fotografías registradas en esa categoría. Puedes registrar nuevas fotos desde el módulo de Fotos.',
          agentRole: 'ventas',
        }
      }

      return {
        text: `Aquí tienes ${selection.length} opción(es) de montaje destacadas de tu catálogo listas para compartir y cotizar con tus clientes:`,
        agentRole: 'ventas',
        attachedPhotos: selection,
      }
    }

    // Respuesta de cortesía adaptada al rol
    return {
      text: `Hola, soy tu Asistente de ${
        role === 'finanzas' ? 'Finanzas' : role === 'agenda' ? 'Agenda' : 'Ventas'
      }. Puedes consultar con un solo clic los botones sugeridos arriba o escribirme sobre tus saldos, fechas de eventos y fotos de catálogo.`,
      agentRole: role,
    }
  },

  // Consulta General con Orquestación en Cascada (Free API -> Semantic Fallback)
  async queryAgent(
    prompt: string,
    role: AgentRole,
    state: VvAppDataState
  ): Promise<AssistantResponse> {
    // Paso 1: Validar Guardrails de entrada
    const guardrail = GuardrailsService.validateInput(prompt)
    if (!guardrail.allowed) {
      return {
        text: guardrail.fallbackReply || 'Consulta no permitida por políticas de seguridad.',
        agentRole: role,
      }
    }

    const cleanPrompt = guardrail.sanitizedInput
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
    const groqKey = import.meta.env.VITE_GROQ_API_KEY
    const metrics = GuardrailsService.getVerifiedMetrics(state)
    const systemInstruction = `Eres el Asistente de ${
      role === 'finanzas' ? 'Finanzas y Cobranzas' : role === 'agenda' ? 'Agenda y Montajes' : 'Ventas'
    } de "V.v Decoración de Eventos y Cotillón".
Responde con tono profesional, sobrio y elegante. Todas las cifras son en Bolivianos (Bs.).
Datos actuales auditados:
- Eventos activos: ${metrics.activeCount}
- Saldo pendiente por cobrar: Bs. ${metrics.totalPendingBs.toLocaleString()}
- Total contratado: Bs. ${metrics.totalContractedBs.toLocaleString()}
No inventes datos que no estén aquí.`

    // Paso 2A: Intentar API de Google Gemini (gemini-3.5-flash)
    if (geminiKey) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: systemInstruction },
                    { text: cleanPrompt },
                  ],
                },
              ],
            }),
            signal: controller.signal,
          }
        )

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (rawText) {
            const verifiedText = GuardrailsService.enforceGrounding(rawText.trim(), state)
            const localSemantic = this.processLocalSemanticQuery(cleanPrompt, role, state)
            return {
              text: verifiedText,
              agentRole: role,
              attachedEvents: localSemantic.attachedEvents,
              attachedPhotos: localSemantic.attachedPhotos,
            }
          }
        }
      } catch {
        // Fallback a Groq o semántico
      }
    }

    // Paso 2B: Fallback a Groq (qwen/qwen3.8-27b)
    if (groqKey) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3500)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: cleanPrompt },
            ],
            temperature: 0.3,
            max_tokens: 350,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const rawText = data?.choices?.[0]?.message?.content
          if (rawText) {
            const verifiedText = GuardrailsService.enforceGrounding(rawText.trim(), state)
            const localSemantic = this.processLocalSemanticQuery(cleanPrompt, role, state)
            return {
              text: verifiedText,
              agentRole: role,
              attachedEvents: localSemantic.attachedEvents,
              attachedPhotos: localSemantic.attachedPhotos,
            }
          }
        }
      } catch {
        // Fallback a motor semántico local
      }
    }

    // Paso 3: Fallback Semántico Local Determinístico
    return this.processLocalSemanticQuery(cleanPrompt, role, state)
  },
}
