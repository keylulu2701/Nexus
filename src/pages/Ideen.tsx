import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Lightbulb, Plus, Trash2 } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import { de } from '../i18n/de'

const SPEICHER_KEY = 'nexus.ideen'

const prioritaeten = ['Hoch', 'Mittel', 'Niedrig'] as const
const stati = ['Offen', 'In Arbeit', 'Erledigt'] as const

type Prioritaet = (typeof prioritaeten)[number]
type IdeenStatus = (typeof stati)[number]
type Idee = {
  id: string
  titel: string
  tag: string
  prioritaet: Prioritaet
  status: IdeenStatus
}

const prioFarbe = { Hoch: 'violet', Mittel: 'cyan', Niedrig: 'neutral' } as const
const statusFarbe = { Offen: 'neutral', 'In Arbeit': 'cyan', Erledigt: 'green' } as const

function laden(): Idee[] {
  try {
    const roh = localStorage.getItem(SPEICHER_KEY)
    const daten: unknown = roh ? JSON.parse(roh) : []
    return Array.isArray(daten) ? (daten as Idee[]) : []
  } catch {
    return []
  }
}

const auswahl =
  'h-9 rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25'

export function Ideen() {
  const [ideen, setIdeen] = useState<Idee[]>(laden)
  const [formOffen, setFormOffen] = useState(false)
  const [titel, setTitel] = useState('')
  const [tag, setTag] = useState('')
  const [prio, setPrio] = useState<Prioritaet>('Mittel')

  useEffect(() => {
    try {
      localStorage.setItem(SPEICHER_KEY, JSON.stringify(ideen))
    } catch {
      // Speichern nicht möglich, egal
    }
  }, [ideen])

  function formSchliessen() {
    setFormOffen(false)
    setTitel('')
    setTag('')
    setPrio('Mittel')
  }

  function speichern(e: FormEvent) {
    e.preventDefault()
    const t = titel.trim()
    if (t === '') return
    setIdeen((alt) => [
      { id: String(Date.now()), titel: t, tag: tag.trim(), prioritaet: prio, status: 'Offen' },
      ...alt,
    ])
    formSchliessen()
  }

  function statusWechseln(id: string) {
    setIdeen((alt) =>
      alt.map((i) =>
        i.id === id ? { ...i, status: stati[(stati.indexOf(i.status) + 1) % stati.length] } : i,
      ),
    )
  }

  function loeschen(id: string) {
    setIdeen((alt) => alt.filter((i) => i.id !== id))
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        titel={de.nav.ideen.titel}
        raum={de.nav.ideen.raum}
        aktion={
          <Button onClick={() => setFormOffen(true)} disabled={formOffen}>
            <Plus size={16} />
            {de.ideen.neu}
          </Button>
        }
      />

      {formOffen ? (
        <Card>
          <form onSubmit={speichern} className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <label className="col-span-3 grid gap-2 text-sm text-nx-muted">
                {de.ideen.titel}
                <Input autoFocus value={titel} onChange={(e) => setTitel(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm text-nx-muted">
                {de.ideen.tag}
                <Input value={tag} onChange={(e) => setTag(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm text-nx-muted">
                {de.ideen.prioritaet}
                <select
                  value={prio}
                  onChange={(e) => setPrio(e.target.value as Prioritaet)}
                  className={auswahl}
                >
                  {prioritaeten.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={titel.trim() === ''}>
                {de.ideen.speichern}
              </Button>
              <Button type="button" variante="ghost" onClick={formSchliessen}>
                {de.ideen.abbrechen}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {ideen.length === 0 ? (
        <Card className="grid justify-items-start gap-3">
          <Lightbulb size={16} className="text-nx-muted" />
          <div>
            <p className="text-sm font-medium">{de.ideen.leerTitel}</p>
            <p className="mt-1 text-sm text-nx-muted">{de.ideen.leerText}</p>
          </div>
          {formOffen ? null : (
            <Button onClick={() => setFormOffen(true)}>
              <Plus size={16} />
              {de.ideen.neu}
            </Button>
          )}
        </Card>
      ) : (
        <ul className="grid gap-3">
          {ideen.map((i) => (
            <li key={i.id}>
              <Card className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{i.titel}</p>
                  {i.tag ? <p className="mt-1 text-xs text-nx-muted">{i.tag}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge farbe={prioFarbe[i.prioritaet]}>{i.prioritaet}</Badge>
                  <button
                    type="button"
                    onClick={() => statusWechseln(i.id)}
                    title={de.ideen.statusWechseln}
                    aria-label={`${de.ideen.statusWechseln}: ${i.status}`}
                    className="rounded-sm"
                  >
                    <Badge farbe={statusFarbe[i.status]}>{i.status}</Badge>
                  </button>
                  <Button
                    variante="ghost"
                    onClick={() => loeschen(i.id)}
                    aria-label={de.ideen.loeschen}
                    title={de.ideen.loeschen}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-nx-muted">{de.ideen.gespeichertHinweis}</p>
    </div>
  )
}