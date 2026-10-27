import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Lightbulb, Pencil, Plus, Trash2, Undo2 } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import {
  ideeAnlegen,
  ideeBearbeiten,
  ideeLoeschen,
  ideeStatusWechseln,
  ideeWiederherstellen,
  ideenPrioritaeten,
  useIdeen,
} from '../data/speicher'
import type { Idee, IdeePrioritaet } from '../data/speicher'
import { bearbeitenTexte } from '../i18n/bearbeiten'
import { de } from '../i18n/de'

const prioFarbe = { Hoch: 'violet', Mittel: 'cyan', Niedrig: 'neutral' } as const
const statusFarbe = { Offen: 'neutral', 'In Arbeit': 'cyan', Erledigt: 'green' } as const

const auswahl =
  'h-9 rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25'

const RUECKGAENGIG_MS = 8000

function IdeeBearbeiten({ idee, onFertig }: { idee: Idee; onFertig: () => void }) {
  const [titel, setTitel] = useState(idee.titel)
  const [tag, setTag] = useState(idee.tag)
  const [prio, setPrio] = useState<IdeePrioritaet>(idee.prioritaet)

  function speichern(e: FormEvent) {
    e.preventDefault()
    const t = titel.trim()
    if (t === '') return
    ideeBearbeiten(idee.id, { titel: t, tag: tag.trim(), prioritaet: prio })
    onFertig()
  }

  return (
    <Card>
      <form
        onSubmit={speichern}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onFertig()
        }}
        className="grid gap-4"
      >
        <h2 className="text-sm font-semibold">{bearbeitenTexte.ideeTitel}</h2>
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
              onChange={(e) => setPrio(e.target.value as IdeePrioritaet)}
              className={auswahl}
            >
              {ideenPrioritaeten.map((p) => (
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
          <Button type="button" variante="ghost" onClick={onFertig}>
            {de.ideen.abbrechen}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export function Ideen() {
  const ideen = useIdeen()
  const [params, setParams] = useSearchParams()
  const [formOffen, setFormOffen] = useState(() => params.get('neu') === '1')
  const [titel, setTitel] = useState('')
  const [tag, setTag] = useState('')
  const [prio, setPrio] = useState<IdeePrioritaet>('Mittel')
  const [bearbeiteId, setBearbeiteId] = useState<string | null>(null)
  const [geloescht, setGeloescht] = useState<{ idee: Idee; index: number } | null>(null)

  useEffect(() => {
    if (!geloescht) return
    const timer = window.setTimeout(() => setGeloescht(null), RUECKGAENGIG_MS)
    return () => window.clearTimeout(timer)
  }, [geloescht])

  function formSchliessen() {
    setFormOffen(false)
    setTitel('')
    setTag('')
    setPrio('Mittel')
    setParams({}, { replace: true })
  }

  function speichern(e: FormEvent) {
    e.preventDefault()
    const t = titel.trim()
    if (t === '') return
    ideeAnlegen({ titel: t, tag: tag.trim(), prioritaet: prio })
    formSchliessen()
  }

  function loeschen(id: string) {
    const ergebnis = ideeLoeschen(id)
    if (ergebnis) setGeloescht(ergebnis)
    if (bearbeiteId === id) setBearbeiteId(null)
  }

  function rueckgaengig() {
    if (!geloescht) return
    ideeWiederherstellen(geloescht.idee, geloescht.index)
    setGeloescht(null)
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
                  onChange={(e) => setPrio(e.target.value as IdeePrioritaet)}
                  className={auswahl}
                >
                  {ideenPrioritaeten.map((p) => (
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

      <div role="status" aria-live="polite">
        {geloescht ? (
          <Card className="flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm text-nx-muted">
              {bearbeitenTexte.geloescht(geloescht.idee.titel)}
            </p>
            <Button variante="sekundaer" onClick={rueckgaengig}>
              <Undo2 size={16} />
              {bearbeitenTexte.rueckgaengig}
            </Button>
          </Card>
        ) : null}
      </div>

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
              {bearbeiteId === i.id ? (
                <IdeeBearbeiten idee={i} onFertig={() => setBearbeiteId(null)} />
              ) : (
                <Card className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.titel}</p>
                    {i.tag ? <p className="mt-1 text-xs text-nx-muted">{i.tag}</p> : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge farbe={prioFarbe[i.prioritaet]}>{i.prioritaet}</Badge>
                    <button
                      type="button"
                      onClick={() => ideeStatusWechseln(i.id)}
                      title={de.ideen.statusWechseln}
                      aria-label={`${de.ideen.statusWechseln}: ${i.status}`}
                      className="rounded-sm"
                    >
                      <Badge farbe={statusFarbe[i.status]}>{i.status}</Badge>
                    </button>
                    <Button
                      variante="ghost"
                      onClick={() => setBearbeiteId(i.id)}
                      aria-label={bearbeitenTexte.knopf}
                      title={bearbeitenTexte.knopf}
                    >
                      <Pencil size={16} />
                    </Button>
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
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-nx-muted">{de.ideen.gespeichertHinweis}</p>
    </div>
  )
}