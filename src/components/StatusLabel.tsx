import { de } from '../i18n/de'

type Art = 'demo' | 'nichtVerbunden' | 'bald'

const stile: Record<Art, string> = {
  demo: 'border-nx-violet/40 text-nx-violet',
  nichtVerbunden: 'border-nx-cyan/40 text-nx-cyan',
  bald: 'border-nx-line text-nx-muted',
}

export function StatusLabel({ art }: { art: Art }) {
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-1 text-xs ${stile[art]}`}>
      {de.status[art]}
    </span>
  )
}