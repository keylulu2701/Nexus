import { useState } from 'react'
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import {
  aufgabeLoeschen,
  aufgabeStatusSetzen,
  aufgabenStati,
  aufgabenStatus,
} from '../data/speicher'
import type { Aufgabe, AufgabeStatus } from '../data/speicher'
import { de } from '../i18n/de'

const punkt: Record<AufgabeStatus, string> = {
  Offen: 'bg-nx-muted',
  'In Arbeit': 'bg-nx-cyan',
  Erledigt: 'bg-nx-green',
}

const knopf =
  'rounded-sm p-1 text-nx-muted transition-colors hover:bg-nx-text/10 hover:text-nx-text disabled:cursor-not-allowed disabled:opacity-30'

export function KanbanBoard({ projektId, aufgaben }: { projektId: string; aufgaben: Aufgabe[] }) {
  const [ueber, setUeber] = useState<AufgabeStatus | null>(null)

  return (
    <div className="grid grid-cols-3 gap-4">
      {aufgabenStati.map((s, spaltenIndex) => {
        const inSpalte = aufgaben.filter((a) => aufgabenStatus(a) === s)
        return (
          <div
            key={s}
            onDragOver={(e) => {
              e.preventDefault()
              setUeber(s)
            }}
            onDragLeave={() => setUeber(null)}
            onDrop={(e) => {
              e.preventDefault()
              setUeber(null)
              const id = e.dataTransfer.getData('text/plain')
              if (id) aufgabeStatusSetzen(projektId, id, s)
            }}
            className={`grid content-start gap-3 rounded-lg border p-3 transition-colors ${
              ueber === s ? 'border-nx-cyan/60 bg-nx-cyan/5' : 'border-nx-line bg-nx-bg/40'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className={`h-2 w-2 rounded-full ${punkt[s]}`} />
              {s}
              <span className="font-mono text-xs text-nx-muted">{inSpalte.length}</span>
            </div>

            {inSpalte.length === 0 ? (
              <p className="px-1 py-4 text-center text-xs text-nx-muted">{de.projekte.spalteLeer}</p>
            ) : (
              inSpalte.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', a.id)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  className="grid cursor-grab gap-2 rounded-md border border-nx-line bg-nx-panel p-3 active:cursor-grabbing"
                >
                  <p className={`text-sm ${s === 'Erledigt' ? 'text-nx-muted line-through' : ''}`}>
                    {a.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className={knopf}
                        disabled={spaltenIndex === 0}
                        onClick={() =>
                          aufgabeStatusSetzen(projektId, a.id, aufgabenStati[spaltenIndex - 1])
                        }
                        aria-label={de.projekte.nachLinks}
                        title={de.projekte.nachLinks}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        type="button"
                        className={knopf}
                        disabled={spaltenIndex === aufgabenStati.length - 1}
                        onClick={() =>
                          aufgabeStatusSetzen(projektId, a.id, aufgabenStati[spaltenIndex + 1])
                        }
                        aria-label={de.projekte.nachRechts}
                        title={de.projekte.nachRechts}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className={knopf}
                      onClick={() => aufgabeLoeschen(projektId, a.id)}
                      aria-label={de.projekte.aufgabeLoeschen}
                      title={de.projekte.aufgabeLoeschen}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      })}
    </div>
  )
}