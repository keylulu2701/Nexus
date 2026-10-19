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
        <h1 className="text-xl font-semibold">{titel}</h1>
        {raum ? <p className="mt-1 text-sm text-nx-muted">{raum}</p> : null}
      </div>
      {aktion}
    </div>
  )
}