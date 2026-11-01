import React, { useState } from 'react'
import { useVvApp } from '../../context/VvAppContext'
import { VvTextInput } from '../ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../ui/VvPrimitives'

export function CategoryManagementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { state, addCategory, updateCategory, deleteCategory } = useVvApp()
  const [newCatName, setNewCatName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    setSubmitting(true)
    setFeedback(null)
    try {
      await addCategory(newCatName.trim())
      setNewCatName('')
      setFeedback('Categoría creada exitosamente.')
      setTimeout(() => setFeedback(null), 2500)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
    setConfirmDeleteId(null)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return
    setSubmitting(true)
    try {
      await updateCategory(id, editingName.trim())
      setEditingId(null)
      setFeedback('Categoría actualizada.')
      setTimeout(() => setFeedback(null), 2500)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    setSubmitting(true)
    try {
      await deleteCategory(id)
      setConfirmDeleteId(null)
      setFeedback(`Categoría "${name}" eliminada.`)
      setTimeout(() => setFeedback(null), 2500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gestión de Categorías de Decoración"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 vv-bg-glass overflow-y-auto"
    >
      <VvCard
        variant="gold-highlight"
        className="w-full max-w-xl p-5 sm:p-6 space-y-4 my-auto vv-animate-modal"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <VvBadge variant="gold">Líneas de Negocio</VvBadge>
            <VvHeading level={3} variant="serif" className="mt-1">
              Gestión de Categorías
            </VvHeading>
            <p className="text-xs vv-text-secondary mt-1">
              Crea, edita o elimina las categorías del catálogo y eventos en tiempo real.
            </p>
          </div>
          <VvButton size="sm" variant="ghost" onClick={onClose}>
            ✕ Cerrar
          </VvButton>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl vv-badge-success text-xs font-semibold">
            {feedback}
          </div>
        )}

        {/* Formulario para Crear Nueva Categoría */}
        <form onSubmit={handleCreate} className="flex gap-2 items-end">
          <div className="flex-1">
            <VvTextInput
              label="Nombre de la Nueva Categoría"
              required
              value={newCatName}
              onChange={setNewCatName}
              placeholder="Ej. Bautizos & Baby Showers"
            />
          </div>
          <VvButton
            type="submit"
            variant="gold"
            disabled={submitting || !newCatName.trim()}
          >
            + Crear
          </VvButton>
        </form>

        {/* Lista de Categorías Existentes */}
        <div className="space-y-2 pt-2 border-t vv-border-gold">
          <div className="text-xs font-semibold uppercase tracking-wider vv-text-gold-light">
            Categorías Registradas ({state.categories.length})
          </div>

          {state.categories.length === 0 ? (
            <div className="p-6 rounded-xl vv-bg-surface border vv-border-gold text-center space-y-2">
              <p className="text-xs vv-text-secondary">
                No hay categorías registradas en este momento. Usa el campo superior para crear tu primera categoría.
              </p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {state.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl vv-bg-surface border vv-border-gold"
                >
                  {editingId === cat.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg vv-bg-base border vv-border-gold text-primary outline-none focus:border-amber-400"
                        autoFocus
                      />
                      <VvButton
                        size="sm"
                        variant="gold"
                        onClick={() => handleSaveEdit(cat.id)}
                        disabled={submitting || !editingName.trim()}
                      >
                        Guardar
                      </VvButton>
                      <VvButton
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </VvButton>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold vv-text-primary truncate">
                          {cat.name}
                        </div>
                        <div className="text-[10px] vv-text-muted font-mono">
                          slug: {cat.id}
                        </div>
                      </div>

                      {confirmDeleteId === cat.id ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] text-red-400 font-medium">¿Seguro?</span>
                          <VvButton
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(cat.id, cat.name)}
                            disabled={submitting}
                          >
                            Sí, eliminar
                          </VvButton>
                          <VvButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={submitting}
                          >
                            No
                          </VvButton>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <VvButton
                            size="sm"
                            variant="subtle"
                            onClick={() => handleStartEdit(cat.id, cat.name)}
                            disabled={submitting}
                          >
                            Editar
                          </VvButton>
                          <VvButton
                            size="sm"
                            variant="danger"
                            onClick={() => setConfirmDeleteId(cat.id)}
                            disabled={submitting}
                          >
                            Eliminar
                          </VvButton>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </VvCard>
    </div>
  )
}
