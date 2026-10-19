type Art = 'demo' | 'nichtVerbunden' | 'bald'

const inhalt: Record<Art, { text: string; stil: string }> = {
  demo: { text: 'Demo', stil: 'border-nx-violet/40 text-nx-violet' },
  nichtVerbunden: { text: 'Nicht verbunden', stil: 'border-nx-cyan/40 text-nx-cyan' },
  bald: { text: 'Bald', stil: 'border-nx-line text-nx-muted' },
}

export function StatusLabel({ art }: { art: Art }) {
  const { text, stil } = inhalt[art]
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-1 text-xs ${stil}`}>
      {text}
    </span>
  )
}