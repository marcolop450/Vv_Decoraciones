import React from 'react'

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
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider vv-text-secondary">
        {label} {required && <span className="vv-text-gold">*</span>}
      </label>
      <input
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
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider vv-text-secondary">
        {label} {required && <span className="vv-text-gold">*</span>}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl vv-bg-subtle border vv-border-gold vv-text-primary text-sm focus:outline-none focus:border-[#F3D37A] transition-colors resize-none"
      />
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
        className="border-2 border-dashed border-[#D4AF37]/40 hover:border-[#F3D37A] rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#0E0E11]/80 hover:bg-[#16161B]"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFile}
          className="hidden"
        />
        {previewUrl ? (
          <div className="relative mx-auto max-h-48 rounded-xl overflow-hidden">
            <img src={previewUrl} alt="Vista previa" className="mx-auto max-h-48 object-cover rounded-xl" />
            <span className="inline-block mt-2 text-xs text-[#D4AF37]">Haz clic para cambiar la imagen</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              +
            </div>
            <p className="text-sm font-medium text-[#F9F6F0]">Arrastra tu fotografía o haz clic aquí</p>
            <p className="text-xs text-[#7D7568]">JPG, PNG, WEBP hasta 10MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
