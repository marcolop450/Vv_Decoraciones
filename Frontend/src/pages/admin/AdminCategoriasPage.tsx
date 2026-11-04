import React, { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { useVvApp } from '../../context/VvAppContext'
import { VvTextInput } from '../../components/ui/VvFormControls'
import {
  VvBadge,
  VvButton,
  VvCard,
  VvHeading,
} from '../../components/ui/VvPrimitives'

export function AdminCategoriasPage() {
  const { state, addCategory, updateCategory, deleteCategory, navigate } = useVvApp()
  const [newCatName, setNewCatName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

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
      setFeedback('Categoría actualizada exitosamente.')
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
    <AdminLayout
      title="Gestión de Categorías"
      subtitle="Crea, edita y organiza las líneas de montaje del catálogo y eventos en tiempo real."
      headerActions={
        <VvButton
          size="sm"
          variant="subtle"
          onClick={() => navigate('/admin/fotos')}
        >
          Ver Fotos del Catálogo →
        </VvButton>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {feedback && (
          <div className="p-4 rounded-xl vv-badge-success text-sm font-semibold vv-animate-fade">
            {feedback}
          </div>
        )}

        {/* Formulario de Nueva Categoría */}
        <VvCard variant="gold-highlight" className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <VvBadge variant="gold">Nueva Línea de Negocio</VvBadge>
              <VvHeading level={3} variant="serif" className="mt-1">
                Registrar Nueva Categoría
              </VvHeading>
            </div>
            <span className="text-xs vv-text-muted">
              Total: {state.categories.length} categorías
            </span>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <VvTextInput
                label="Nombre de la Nueva Categoría *"
                placeholder="Ej. Graduaciones de Gala, Bautizos..."
                value={newCatName}
                onChange={setNewCatName}
                required
              />
            </div>
            <VvButton
              type="submit"
              variant="gold"
              disabled={submitting || !newCatName.trim()}
              className="w-full sm:w-auto h-11 shrink-0"
            >
              {submitting ? 'Guardando...' : '+ Crear Categoría'}
            </VvButton>
          </form>
        </VvCard>

        {/* Listado de Categorías */}
        <VvCard variant="surface" className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b vv-border-gold pb-3">
            <VvHeading level={3} variant="serif">
              Categorías Activas
            </VvHeading>
            <span className="text-xs vv-text-secondary">
              Sincronizadas con Supabase
            </span>
          </div>

          <div className="divide-y vv-border-gold">
            {state.categories.map((cat) => {
              const eventCount = state.events.filter((e) => e.categoryId === cat.id).length
              const photoCount = state.photos.filter((p) => p.categoryId === cat.id).length
              const isEditing = editingId === cat.id
              const isConfirming = confirmDeleteId === cat.id

              return (
                <div
                  key={cat.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:vv-bg-subtle px-2 rounded-xl transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2 max-w-md">
                        <VvTextInput
                          value={editingName}
                          onChange={setEditingName}
                          placeholder="Nombre de categoría"
                          className="flex-1"
                        />
                        <VvButton
                          size="sm"
                          variant="gold"
                          onClick={() => handleSaveEdit(cat.id)}
                          disabled={submitting}
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
                      <div>
                        <div className="font-semibold text-base vv-text-primary">
                          {cat.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs vv-text-muted">
                          <span className="vv-font-mono text-[11px] opacity-75">
                            ID: {cat.id}
                          </span>
                          <span>·</span>
                          <span>{eventCount} eventos</span>
                          <span>·</span>
                          <span>{photoCount} fotos de catálogo</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 shrink-0">
                      {isConfirming ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-400 font-semibold">
                            ¿Eliminar?
                          </span>
                          <VvButton
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(cat.id, cat.name)}
                            disabled={submitting}
                          >
                            Sí, Eliminar
                          </VvButton>
                          <VvButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            No
                          </VvButton>
                        </div>
                      ) : (
                        <>
                          <VvButton
                            size="sm"
                            variant="subtle"
                            onClick={() => handleStartEdit(cat.id, cat.name)}
                          >
                            Editar
                          </VvButton>
                          <VvButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmDeleteId(cat.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            Eliminar
                          </VvButton>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </VvCard>
      </div>
    </AdminLayout>
  )
}
