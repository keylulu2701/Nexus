import { useCallback, useEffect, useState } from 'react'
import { desktop, istFehler } from './desktop'
import type { GitInfo, OrdnerInfo } from './desktop'

type Daten =
  | { status: 'fehler'; text: string }
  | { status: 'bereit'; info: OrdnerInfo; git: GitInfo | null; gitFehler: string | null }

export type OrdnerZustand = { status: 'keineApp' } | { status: 'leer' } | { status: 'laedt' } | Daten

export function useOrdner(pfad: string | undefined) {
  const [zaehler, setZaehler] = useState(0)
  const [ergebnis, setErgebnis] = useState<{ schluessel: string; daten: Daten } | null>(null)
  const schluessel = `${pfad ?? ''}#${zaehler}`

  useEffect(() => {
    if (!desktop || !pfad) return
    let aktiv = true
    ;(async () => {
      const info = await desktop.ordnerLesen(pfad)
      if (!aktiv) return
      if (istFehler(info)) {
        setErgebnis({ schluessel, daten: { status: 'fehler', text: info.fehler } })
        return
      }
      let git: GitInfo | null = null
      let gitFehler: string | null = null
      if (info.hatGit) {
        const g = await desktop.gitStatus(pfad)
        if (!aktiv) return
        if (istFehler(g)) gitFehler = g.fehler
        else git = g
      }
      setErgebnis({ schluessel, daten: { status: 'bereit', info, git, gitFehler } })
    })()
    return () => {
      aktiv = false
    }
  }, [pfad, schluessel])

  const neuLaden = useCallback(() => setZaehler((z) => z + 1), [])

  let zustand: OrdnerZustand
  if (!desktop) zustand = { status: 'keineApp' }
  else if (!pfad) zustand = { status: 'leer' }
  else if (!ergebnis || ergebnis.schluessel !== schluessel) zustand = { status: 'laedt' }
  else zustand = ergebnis.daten

  return { zustand, neuLaden }
}