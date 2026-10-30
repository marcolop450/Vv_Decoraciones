import React from 'react'
import { PublicNavbar } from './PublicNavbar'
import { PublicFooter } from './PublicFooter'

export function PublicLayout({
  children,
  currentPath,
  onNavigate,
  onOpenQuote,
}: {
  children: React.ReactNode
  currentPath: string
  onNavigate: (path: string) => void
  onOpenQuote: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#F9F6F0]">
      <PublicNavbar currentPath={currentPath} onNavigate={onNavigate} onOpenQuote={onOpenQuote} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
