import type { ReactNode } from 'react'

type PageHeaderProps = {
  titel: string
  raum?: string
  aktion?: ReactNode
}

export function PageHeader({ titel, raum, aktion }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="nx-titel text-2xl font-semibold tracking-tight">{titel}</h1>
        {raum ? (
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-nx-muted">
            {raum}
          </p>
        ) : null}
        <span
          aria-hidden
          className="mt-3 block h-px w-20 bg-gradient-to-r from-[var(--nx-akzent)] to-transparent"
        />
      </div>
      {aktion}
    </div>
  )
}