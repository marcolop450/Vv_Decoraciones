import React, { useState } from 'react'
import { useVvApp } from '../../context/VvAppContext'
import { VvBadge, VvButton } from './VvPrimitives'

export interface VvTextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'tel' | 'number' | 'date' | 'email'
  min?: string
  required?: boolean
  helperText?: string
}

export function VvTextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  required,
  helperText,
}: VvTextInputProps) {
  const inputId = React.useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider vv-text-secondary">
        {label} {required && <span className="vv-text-gold">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl vv-bg-subtle border vv-border-gold vv-text-primary text-sm focus:outline-none focus:border-[#F3D37A] transition-colors"
      />
      {helperText && (
        <p className="text-xs vv-text-muted leading-snug">{helperText}</p>
      )}
    </div>
  )
}

export interface VvTextAreaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
}

export function VvTextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
}: VvTextAreaProps) {
  const areaId = React.useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={areaId} className="block text-xs font-semibold uppercase tracking-wider vv-text-secondary">
        {label} {required && <span className="vv-text-gold">*</span>}
      </label>
      <textarea
        id={areaId}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl vv-bg-subtle border vv-border-gold vv-text-primary text-sm focus:outline-none focus:border-[#F3D37A] transition-colors resize-none"
      />
    </div>
  )
}

export function VvInlineInput({
  type = 'text',
  value,
  onChange,
  onKeyDown,
  placeholder,
  min,
  className = '',
}: {
  type?: 'text' | 'date' | 'number' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  min?: string
  className?: string
}) {
  return (
    <input
      type={type}
      min={min}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`px-3.5 py-2.5 rounded-xl vv-bg-subtle border vv-border-gold vv-text-primary text-sm focus:outline-none focus:border-[#F3D37A] transition-colors ${className}`}
    />
  )
}

export function VvFilePicker({
  onImageLoaded,
}: {
  onImageLoaded: (dataUrl: string) => void
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageLoaded(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="block w-full text-xs vv-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:vv-bg-subtle file:vv-text-primary cursor-pointer"
    />
  )
}

export function CategorySelectorWithInlineCreate({
  selectedCategoryId,
  onSelectCategory,
  label = 'Categoría',
}: {
  selectedCategoryId: string
  onSelectCategory: (categoryId: string) => void
  label?: string
}) {
  const { state, addCategory } = useVvApp()
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleCreateCategory = () => {
    const created = addCategory(newCategoryName)
    if (!created) return
    onSelectCategory(created.id)
    setNewCategoryName('')
    setIsCreatingNew(false)
    setFeedback(`Categoría "${created.name}" creada y seleccionada`)
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div className="space-y-2.5 p-3.5 rounded-xl vv-bg-elevated border vv-border-gold">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider vv-text-secondary">
          {label} <span className="vv-text-gold">*</span>
        </span>
        <VvButton
          size="sm"
          variant={isCreatingNew ? 'ghost' : 'outline'}
          onClick={() => setIsCreatingNew(!isCreatingNew)}
        >
          {isCreatingNew ? 'Cancelar' : '+ Nueva Categoría'}
        </VvButton>
      </div>

      <div className="flex flex-wrap gap-2">
        {state.categories.map((cat) => {
          const isSelected = cat.id === selectedCategoryId
          return (
            <VvButton
              key={cat.id}
              size="sm"
              variant={isSelected ? 'gold' : 'subtle'}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.name}
            </VvButton>
          )
        })}
      </div>

      {isCreatingNew && (
        <div className="pt-2 border-t vv-border-gold space-y-2">
          <div className="text-xs vv-text-gold-light font-medium">
            Registrar nueva categoría sin salir del formulario:
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ej. Aniversarios, Graduaciones, Baby Shower..."
              className="flex-1 px-3 py-2 rounded-lg vv-bg-subtle border vv-border-gold-strong vv-text-primary text-xs focus:outline-none"
            />
            <VvButton
              size="sm"
              variant="gold"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Guardar Categoría
            </VvButton>
          </div>
        </div>
      )}

      {feedback && (
        <div className="pt-1">
          <VvBadge variant="success">{feedback}</VvBadge>
        </div>
      )}
    </div>
  )
}

export function VvImageDropzone({
  onFileSelect,
  previewUrl,
  label = 'Fotografía del Evento (Imagen Pura)',
}: {
  onFileSelect: (file: File) => void
  previewUrl?: string | null
  label?: string
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider vv-text-secondary">
        {label}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-4 rounded-xl border border-dashed vv-border-gold hover:border-[#F3D37A] bg-[#0E0E11] text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {previewUrl ? (
          <div className="relative w-full h-36 rounded-lg overflow-hidden border border-[#D4AF37]/40">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <>
            <svg
              className="w-8 h-8 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-xs text-[#C4B9A5]">
              Arrastra una foto o haz clic para seleccionarla
            </span>
            <span className="text-[10px] text-[#C4B9A5]">
              JPG, PNG o WebP de alta resolución
            </span>
          </>
        )}
      </div>
    </div>
  )
}
