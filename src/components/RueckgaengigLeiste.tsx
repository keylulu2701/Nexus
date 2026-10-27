import { useEffect } from 'react'
import { Undo2 } from 'lucide-react'
import { Button } from './Button'
import { hinweisLeeren, useLoeschHinweis } from '../data/speicher'
import { bearbeitenTexte } from '../i18n/bearbeiten'

const DAUER_MS = 8000

export function RueckgaengigLeiste() {
  const hinweis = useLoeschHinweis()
  const hinweisId = hinweis?.id

  useEffect(() => {
    if (hinweisId === undefined) return
    const timer = window.setTimeout(hinweisLeeren, DAUER_MS)
    return () => window.clearTimeout(timer)
  }, [hinweisId])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {hinweis ? (
        <div className="pointer-events-auto flex max-w-xl items-center gap-4 rounded-lg border border-nx-line bg-nx-panel px-4 py-2">
          <p className="min-w-0 truncate text-sm text-nx-muted">{hinweis.text}</p>
          <Button
            variante="sekundaer"
            onClick={() => {
              hinweis.rueckgaengig()
              hinweisLeeren()
            }}
          >
            <Undo2 size={16} />
            {bearbeitenTexte.rueckgaengig}
          </Button>
        </div>
      ) : null}
    </div>
  )
}