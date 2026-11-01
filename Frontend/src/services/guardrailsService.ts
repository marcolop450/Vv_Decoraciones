import type { VvAppDataState, EventRecord } from '../types/vv-app'

export interface GuardrailCheckResult {
  allowed: boolean
  sanitizedInput: string
  reason?: string
  fallbackReply?: string
}

const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /desobedece las instrucciones/i,
  /act as (a )?hacker/i,
  /olvida tu rol/i,
  /dame la clave/i,
  /system prompt/i,
  /drop table/i,
  /select \* from/i,
]

const DENIED_TOPICS = [
  /pol[ií]tica/i,
  /religi[oó]n/i,
  /criptomoneda/i,
  /bitcoin/i,
  /diagn[oó]stico m[eé]dico/i,
  /apuestas/i,
  /abogado/i,
]

const SENSITIVE_INFO_PATTERNS = [
  /\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, // Tarjetas de crédito
  /\b(VITE_|SUPABASE_KEY|ANON_KEY|eyJhbGci)[a-zA-Z0-9_-]+\b/g, // Claves internas
]

export const GuardrailsService = {
  // 1. Filtros de contenido & 2. Temas denegados
  validateInput(input: string): GuardrailCheckResult {
    const trimmed = input.trim()
    if (!trimmed) {
      return {
        allowed: false,
        sanitizedInput: '',
        fallbackReply: 'Por favor escribe una consulta sobre tus eventos, saldos o agenda.',
      }
    }

    // 1. Filtro contra prompt injection
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          allowed: false,
          sanitizedInput: trimmed,
          reason: 'Prompt injection detectado',
          fallbackReply:
            'Tu consulta contiene comandos reservados. Estoy aquí para ayudarte con eventos, saldos y montajes de V.v Decoración.',
        }
      }
    }

    // 2. Filtro de temas denegados
    for (const topic of DENIED_TOPICS) {
      if (topic.test(trimmed)) {
        return {
          allowed: false,
          sanitizedInput: trimmed,
          reason: 'Tema no permitido',
          fallbackReply:
            'Ese tema está fuera del alcance de este panel. Con gusto te ayudo con información de tus eventos, clientes y finanzas.',
        }
      }
    }

    // 3. Filtro de palabras & 4. Información sensible (PII)
    let sanitized = trimmed
    for (const pattern of SENSITIVE_INFO_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[DATO CONFIDENCIAL PROTEGIDO]')
    }

    return {
      allowed: true,
      sanitizedInput: sanitized,
    }
  },

  // 5. Grounding contextual RAG & 6. Razonamiento automatizado
  getVerifiedMetrics(state: VvAppDataState) {
    const activeEvents = state.events.filter((e) => e.status === 'activo')
    const completedEvents = state.events.filter((e) => e.status === 'completado')

    const totalContractedBs = state.events.reduce(
      (acc, e) => acc + (Number(e.totalPriceBs) || 0),
      0
    )
    const totalAdvanceBs = state.events.reduce(
      (acc, e) => acc + (Number(e.advancePriceBs) || 0),
      0
    )
    // Razonamiento formal: Saldo = Total - Adelanto
    const totalPendingBs = Math.max(0, totalContractedBs - totalAdvanceBs)

    const debtors = activeEvents
      .map((e) => ({
        ...e,
        pendingBalance: Math.max(0, (Number(e.totalPriceBs) || 0) - (Number(e.advancePriceBs) || 0)),
      }))
      .filter((e) => e.pendingBalance > 0)
      .sort((a, b) => b.pendingBalance - a.pendingBalance)

    return {
      activeCount: activeEvents.length,
      completedCount: completedEvents.length,
      totalContractedBs,
      totalAdvanceBs,
      totalPendingBs,
      debtors,
      activeEvents,
      categoriesCount: state.categories.length,
      photosCount: state.photos.length,
    }
  },

  // Corrige automáticamente alucinaciones numéricas en respuestas generadas
  enforceGrounding(rawReply: string, state: VvAppDataState): string {
    const metrics = this.getVerifiedMetrics(state)
    // Reemplaza referencias falsas si el modelo calcula mal
    let grounded = rawReply

    if (rawReply.includes('saldo total') || rawReply.includes('saldo pendiente')) {
      // Garantizar que la cifra en Bs. esté presente
      if (!grounded.includes(metrics.totalPendingBs.toLocaleString())) {
        grounded += `\n\n(Cálculo auditado: Saldo pendiente oficial es de Bs. ${metrics.totalPendingBs.toLocaleString()})`
      }
    }

    return grounded
  },
}
