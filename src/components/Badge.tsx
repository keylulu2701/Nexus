import type { ReactNode } from 'react'

type Farbe = 'neutral' | 'violet' | 'cyan' | 'green'

const stile: Record<Farbe, string> = {
  neutral: 'bg-nx-text/10 text-nx-muted',
  violet: 'bg-nx-violet/15 text-nx-violet',
  cyan: 'bg-nx-cyan/15 text-nx-cyan',
  green: 'bg-nx-green/15 text-nx-green',
}

export function Badge({ farbe = 'neutral', children }: { farbe?: Farbe; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${stile[farbe]}`}>
      {children}
    </span>
  )
}