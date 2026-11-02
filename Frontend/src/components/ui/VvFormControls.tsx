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
  const selectId = React.useId()

  const handleCreateCategory = async () => {
    const created = await addCategory(newCategoryName)
    if (!created) return
    onSelectCategory(created.id)
    setNewCategoryName('')
    setIsCreatingNew(false)
    setFeedback(`Categoría "${created.name}" creada`)
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider vv-text-secondary"
        >
          {label} <span className="vv-text-gold">*</span>
        </label>
        <button
          type="button"
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="text-xs vv-text-gold-light hover:underline font-medium transition-colors"
        >
          {isCreatingNew ? 'Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      <div className="relative">
        <select
          id={selectId}
          aria-label={label}
          value={selectedCategoryId}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl vv-bg-subtle border vv-border-gold vv-text-primary text-sm focus:outline-none focus:border-[#F3D37A] transition-colors appearance-none pr-10 cursor-pointer"
        >
          {state.categories.length === 0 ? (
            <option value="" disabled>
              Sin categorías disponibles
            </option>
          ) : (
            state.categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                className="bg-[#121217] text-[#F9F6F0]"
              >
                {cat.name}
              </option>
            ))
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#D4AF37]">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isCreatingNew && (
        <div className="pt-2 flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCreateCategory()
              }
            }}
            placeholder="Nombre de la nueva categoría..."
            className="flex-1 px-3 py-2 rounded-lg vv-bg-subtle border vv-border-gold-strong vv-text-primary text-xs focus:outline-none"
          />
          <VvButton
            size="sm"
            variant="gold"
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim()}
          >
            Crear
          </VvButton>
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
