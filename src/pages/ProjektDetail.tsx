import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Circle, Plus, Trash2 } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import { StatusLabel } from '../components/StatusLabel'
import {
  aufgabeHinzufuegen,
  aufgabeLoeschen,
  aufgabeUmschalten,
  projektLoeschen,
  projektStatusSetzen,
  stati,
  useProjekte,
} from '../data/speicher'
import type { ProjektStatus } from '../data/speicher'
import { vorZeit } from '../data/zeit'
import { de } from '../i18n/de'

const zurueck =
  'inline-flex items-center gap-2 rounded-sm text-sm text-nx-muted transition-colors hover:text-nx-text'

const auswahl =
  'h-9 rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25'

export function ProjektDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const projekte = useProjekte()
  const projekt = projekte.find((p) => p.id === id)
  const [neueAufgabe, setNeueAufgabe] = useState('')

  if (!projekt) {
    return (
      <div className="grid justify-items-start gap-4">
        <Link to="/projekte" className={zurueck}>
          <ArrowLeft size={16} />
          {de.projekte.zurueck}
        </Link>
        <p className="text-sm text-nx-muted">{de.projekte.nichtGefunden}</p>
      </div>
    )
  }

  function hinzufuegen(e: FormEvent) {
    e.preventDefault()
    const t = neueAufgabe.trim()
    if (t === '' || !projekt) return
    aufgabeHinzufuegen(projekt.id, t)
    setNeueAufgabe('')
  }

  function loeschen() {
    if (!projekt) return
    if (window.confirm(de.projekte.loeschenFrage(projekt.name))) {
      projektLoeschen(projekt.id)
      navigate('/projekte')
    }
  }

  return (
    <div className="grid gap-6">
      <Link to="/projekte" className={`${zurueck} justify-self-start`}>
        <ArrowLeft size={16} />
        {de.projekte.zurueck}
      </Link>

      <PageHeader
        titel={projekt.name}
        raum={`${projekt.typ} · ${de.projekte.letzteAktivitaet}: ${vorZeit(projekt.geaendertAm)}`}
        aktion={
          <select
            value={projekt.status}
            onChange={(e) => projektStatusSetzen(projekt.id, e.target.value as ProjektStatus)}
            aria-label={de.projekte.status}
            className={auswahl}
          >
            {stati.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid content-start gap-6">
          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.projekte.beschreibung}</h2>
            <p className="text-sm text-nx-muted">
              {projekt.beschreibung || de.projekte.keineBeschreibung}
            </p>
          </Card>

          <Card className="grid gap-4">
            <h2 className="text-sm font-semibold">{de.projekte.aufgaben}</h2>

            <form onSubmit={hinzufuegen} className="flex items-center gap-2">
              <Input
                value={neueAufgabe}
                onChange={(e) => setNeueAufgabe(e.target.value)}
                placeholder={de.projekte.aufgabeNeu}
                aria-label={de.projekte.aufgabeNeu}
              />
              <Button type="submit" disabled={neueAufgabe.trim() === ''}>
                <Plus size={16} />
                {de.projekte.hinzufuegen}
              </Button>
            </form>

            {projekt.aufgaben.length === 0 ? (
              <p className="text-sm text-nx-muted">{de.projekte.keineAufgaben}</p>
            ) : (
              <ul className="grid gap-1">
                {projekt.aufgaben.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => aufgabeUmschalten(projekt.id, a.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-nx-text/10"
                    >
                      {a.erledigt ? (
                        <Check size={16} className="shrink-0 text-nx-green" />
                      ) : (
                        <Circle size={16} className="shrink-0 text-nx-muted" />
                      )}
                      <span className={a.erledigt ? 'text-nx-muted line-through' : ''}>
                        {a.text}
                      </span>
                    </button>
                    <Button
                      variante="ghost"
                      onClick={() => aufgabeLoeschen(projekt.id, a.id)}
                      aria-label={de.projekte.aufgabeLoeschen}
                      title={de.projekte.aufgabeLoeschen}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.projekte.technologien}</h2>
            <div className="flex flex-wrap gap-2">
              {projekt.technologien.length === 0 ? (
                <p className="text-sm text-nx-muted">–</p>
              ) : (
                projekt.technologien.map((t) => (
                  <Badge key={t} farbe="cyan">
                    {t}
                  </Badge>
                ))
              )}
            </div>
          </Card>

          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.projekte.gitStatus}</h2>
            <div>
              <StatusLabel art="nichtVerbunden" />
            </div>
          </Card>

          <Button variante="ghost" onClick={loeschen} className="justify-self-start">
            <Trash2 size={16} />
            {de.projekte.loeschen}
          </Button>
        </div>
      </div>
    </div>
  )
}