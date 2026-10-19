import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { de } from '../i18n/de'

const seiten = [
  { pfad: '/', ...de.nav.uebersicht },
  { pfad: '/projekte', ...de.nav.projekte },
  { pfad: '/ki', ...de.nav.ki },
  { pfad: '/ideen', ...de.nav.ideen },
  { pfad: '/wissen', ...de.nav.wissen },
  { pfad: '/einstellungen', ...de.nav.einstellungen },
]

type Props = { offen: boolean; onSchliessen: () => void }

export function KommandoPalette({ offen, onSchliessen }: Props) {
  if (!offen) return null
  return <PaletteInhalt onSchliessen={onSchliessen} />
}

function PaletteInhalt({ onSchliessen }: { onSchliessen: () => void }) {
  const navigate = useNavigate()
  const [suche, setSuche] = useState('')
  const [index, setIndex] = useState(0)

  const begriff = suche.trim().toLowerCase()
  const treffer = seiten.filter(
    (s) => s.titel.toLowerCase().includes(begriff) || s.raum.toLowerCase().includes(begriff),
  )
  const aktiv = Math.min(index, treffer.length - 1)

  function oeffnen(pfad: string) {
    navigate(pfad)
    onSchliessen()
  }

  function taste(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onSchliessen()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex(Math.min(aktiv + 1, treffer.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex(Math.max(aktiv - 1, 0))
    } else if (e.key === 'Enter' && treffer[aktiv]) {
      oeffnen(treffer[aktiv].pfad)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-32"
      onMouseDown={onSchliessen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={de.palette.titel}
        className="w-full max-w-lg overflow-hidden rounded-lg border border-nx-line bg-nx-panel"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={taste}
      >
        <div className="flex items-center gap-3 border-b border-nx-line px-4 py-3">
          <Search size={16} className="shrink-0 text-nx-muted" />
          <input
            autoFocus
            value={suche}
            onChange={(e) => {
              setSuche(e.target.value)
              setIndex(0)
            }}
            placeholder={de.palette.platzhalter}
            className="w-full bg-transparent text-sm text-nx-text placeholder:text-nx-muted focus:outline-none"
          />
        </div>

        <ul className="max-h-80 overflow-y-auto p-2">
          {treffer.length === 0 ? (
            <li className="px-3 py-3 text-sm text-nx-muted">{de.palette.keineTreffer}</li>
          ) : (
            treffer.map((s, i) => (
              <li key={s.pfad}>
                <button
                  type="button"
                  onClick={() => oeffnen(s.pfad)}
                  onMouseEnter={() => setIndex(i)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                    i === aktiv ? 'bg-nx-violet/15 text-nx-text' : 'text-nx-muted'
                  }`}
                >
                  <span>{s.titel}</span>
                  <span className="text-xs text-nx-muted">{s.raum}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <p className="border-t border-nx-line px-4 py-2 text-xs text-nx-muted">
          {de.palette.hinweis}
        </p>
      </div>
    </div>
  )
}