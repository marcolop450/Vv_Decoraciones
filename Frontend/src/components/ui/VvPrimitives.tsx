import React from 'react'

export interface VvHeadingProps {
  level?: 1 | 2 | 3 | 4
  variant?: 'serif' | 'script' | 'sans'
  metallic?: boolean
  className?: string
  children: React.ReactNode
}

export function VvHeading({
  level = 2,
  variant = 'serif',
  metallic = false,
  className = '',
  children,
}: VvHeadingProps) {
  const fontClass =
    variant === 'script'
      ? 'vv-font-script'
      : variant === 'serif'
        ? 'vv-font-serif'
        : 'vv-font-sans'

  const sizeMap: Record<1 | 2 | 3 | 4, string> = {
    1: 'text-3xl md:text-5xl font-semibold tracking-tight leading-tight',
    2: 'text-2xl md:text-3xl font-semibold tracking-tight leading-snug',
    3: 'text-xl md:text-2xl font-semibold leading-snug',
    4: 'text-base md:text-lg font-semibold leading-normal',
  }

  const colorClass = metallic ? 'vv-text-gold-metallic' : 'vv-text-primary'
  const combined = `${fontClass} ${sizeMap[level]} ${colorClass} ${className}`.trim()

  return (
    <div role="heading" aria-level={level} className={combined}>
      {children}
    </div>
  )
}

export interface VvButtonProps {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
  title?: string
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
}

export function VvButton({
  variant = 'gold',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  title,
  type = 'button',
  children,
}: VvButtonProps) {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  }

  const variantClasses: Record<'gold' | 'outline' | 'ghost' | 'danger' | 'subtle', string> = {
    gold: 'vv-bg-gold-gradient vv-text-on-gold font-semibold vv-shadow-glow hover:opacity-95 active:scale-98',
    outline:
      'vv-bg-surface border vv-border-gold-strong vv-text-gold-light font-medium hover:vv-bg-gold-surface',
    ghost:
      'bg-transparent vv-text-secondary hover:vv-text-primary hover:vv-bg-elevated font-medium',
    danger: 'vv-badge-danger font-medium hover:opacity-90',
    subtle:
      'vv-bg-subtle border vv-border-gold vv-text-primary font-medium hover:vv-border-gold-strong',
  }

  const disabledClass = disabled ? 'opacity-45 pointer-events-none' : 'cursor-pointer'

  return (
    <button
      type={type}
      disabled={disabled}
      title={title}
      onClick={disabled ? undefined : onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 select-none ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  )
}

export interface VvBadgeProps {
  variant?: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  className?: string
  children: React.ReactNode
}

export function VvBadge({ variant = 'gold', className = '', children }: VvBadgeProps) {
  const variantMap: Record<NonNullable<VvBadgeProps['variant']>, string> = {
    gold: 'vv-badge-gold',
    success: 'vv-badge-success',
    warning: 'vv-badge-warning',
    danger: 'vv-badge-danger',
    info: 'vv-badge-info',
    neutral: 'vv-bg-subtle border vv-border-gold vv-text-secondary',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export interface VvCardProps {
  variant?: 'surface' | 'elevated' | 'glass' | 'gold-highlight'
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

export function VvCard({
  variant = 'surface',
  className = '',
  onClick,
  children,
}: VvCardProps) {
  const variantMap: Record<NonNullable<VvCardProps['variant']>, string> = {
    surface: 'vv-bg-surface border vv-border-gold vv-shadow-card',
    elevated: 'vv-bg-elevated border vv-border-gold vv-shadow-card',
    glass: 'vv-bg-glass border vv-border-gold-strong vv-shadow-card',
    'gold-highlight': 'vv-bg-surface vv-bg-gold-subtle border vv-border-gold-strong vv-shadow-glow',
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 ${variantMap[variant]} ${onClick ? 'cursor-pointer hover:border-[#F3D37A] transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function VvOrnamentDivider({
  label,
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
      {label ? (
        <span className="text-xs uppercase tracking-widest font-semibold vv-text-gold-light px-2 whitespace-nowrap">
          {label}
        </span>
      ) : (
        <span className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#D4AF37]/20" />
      )}
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
    </div>
  )
}
