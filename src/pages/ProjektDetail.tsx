import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Circle,
  FlaskConical,
  Gamepad2,
  Globe,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { KanbanBoard } from '../components/KanbanBoard'
import { GitAnzeige, OrdnerKarte } from '../components/OrdnerKarte'
import { PageHeader } from '../components/PageHeader'
import { ProjektBearbeiten } from '../components/ProjektBearbeiten'
import { useOrdner } from '../data/ordner'
import {
  aufgabeHinzufuegen,
  aufgabeLoeschen,
  aufgabeUmschalten,
  aufgabenStatus,
  projektArchivieren,
  projektLoeschen,
  projektStatusSetzen,
  stati,
  statusFarbe,
  useProjekte,
} from '../data/speicher'
import type { ProjektStatus, ProjektTyp } from '../data/speicher'
import { vorZeit } from '../data/zeit'
import { de } from '../i18n/de'
import { bearbeitenTexte } from '../i18n/bearbeiten'

const zurueck =
  'inline-flex items-center gap-2 rounded-sm text-sm text-nx-muted transition-colors hover:text-nx-text'

const auswahl =
  'h-9 rounded-md border border-nx-line bg-nx-bg/70 px-3 text-sm text-nx-text [color-scheme:dark] transition-colors hover:border-nx-violet/40'

const typStil: Record<ProjektTyp, { icon: LucideIcon; kachel: string; balken: string }> = {
  Spiel: { icon: Gamepad2, kachel: 'bg-nx-violet/15 text-nx-violet', balken: 'bg-nx-violet' },
  Webseite: { icon: Globe, kachel: 'bg-nx-cyan/15 text-nx-cyan', balken: 'bg-nx-cyan' },
  App: { icon: Smartphone, kachel: 'bg-nx-green/15 text-nx-green', balken: 'bg-nx-green' },
  Experiment: {
    icon: FlaskConical,
    kachel: 'bg-nx-magenta/15 text-nx-magenta',
    balken: 'bg-nx-magenta',
  },
}

type Ansicht = 'liste' | 'board'
const ANSICHT_KEY = 'nexus.aufgabenansicht'

function ladeAnsicht(): Ansicht {
  try {
    return localStorage.getItem(ANSICHT_KEY) === 'liste' ? 'liste' : 'board'
  } catch {
    return 'board'
  }
}

export function ProjektDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const projekte = useProjekte()
  const projekt = projekte.find((p) => p.id === id)
  const [neueAufgabe, setNeueAufgabe] = useState('')
  const [ansicht, setAnsicht] = useState<Ansicht>(ladeAnsicht)
  const [bearbeiten, setBearbeiten] = useState(false)
  const { zustand: ordnerZustand, neuLaden } = useOrdner(projekt?.ordnerPfad)

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

  const stil = typStil[projekt.typ]
  const TypIcon = stil.icon
  const gesamt = projekt.aufgaben.length
  const erledigt = projekt.aufgaben.filter((a) => aufgabenStatus(a) === 'Erledigt').length
  const prozent = gesamt === 0 ? 0 : Math.round((erledigt / gesamt) * 100)

  function ansichtWaehlen(a: Ansicht) {
    setAnsicht(a)
    try {
      localStorage.setItem(ANSICHT_KEY, a)
    } catch {
      // Speichern nicht möglich, egal
    }
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

  const umschalter = (wert: Ansicht, text: string) => (
    <button
      type="button"
      onClick={() => ansichtWaehlen(wert)}
      aria-pressed={ansicht === wert}
      className={`rounded-md px-3 py-1 text-sm transition-colors ${
        ansicht === wert
          ? 'bg-nx-violet/20 text-nx-text'
          : 'text-nx-muted hover:bg-white/5 hover:text-nx-text'
      }`}
    >
      {text}
    </button>
  )

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
          <div className="flex items-center gap-2">
            <Button variante="sekundaer" onClick={() => setBearbeiten(true)} disabled={bearbeiten}>
              <Pencil size={16} />
              {bearbeitenTexte.knopf}
            </Button>
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
          </div>
        }
      />

      {projekt.archiviert ? (
        <p className="text-sm text-nx-cyan">{de.projekte.archiviertHinweis}</p>
      ) : null}

      <Card className="flex items-center gap-4">
        <span
          aria-hidden
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${stil.kachel}`}
        >
          <TypIcon size={24} />
        </span>
        <div className="grid min-w-0 flex-1 gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge farbe={statusFarbe[projekt.status]}>{projekt.status}</Badge>
              <span className="text-sm text-nx-muted">{projekt.typ}</span>
            </div>
            <span className="text-xs text-nx-muted">
              {gesamt === 0
                ? de.projekte.keineAufgabenKurz
                : de.projekte.aufgabenZaehler(erledigt, gesamt)}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={prozent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={de.projekte.aufgaben}
            className="h-1.5 overflow-hidden rounded-full bg-white/10"
          >
            <div className={`h-full rounded-full ${stil.balken}`} style={{ width: `${prozent}%` }} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid content-start">
          {bearbeiten ? (
            <ProjektBearbeiten projekt={projekt} onFertig={() => setBearbeiten(false)} />
          ) : (
            <Card className="grid content-start gap-3">
              <h2 className="text-sm font-semibold">{de.projekte.beschreibung}</h2>
              <p className="text-sm text-nx-muted">
                {projekt.beschreibung || de.projekte.keineBeschreibung}
              </p>
            </Card>
          )}
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
            <GitAnzeige zustand={ordnerZustand} />
          </Card>
        </div>
      </div>

      <OrdnerKarte
        projektId={projekt.id}
        ordnerPfad={projekt.ordnerPfad}
        zustand={ordnerZustand}
        neuLaden={neuLaden}
      />

      <Card className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">{de.projekte.aufgaben}</h2>
          <div className="flex gap-1 rounded-lg border border-nx-line bg-white/5 p-1">
            {umschalter('board', de.projekte.ansichtBoard)}
            {umschalter('liste', de.projekte.ansichtListe)}
          </div>
        </div>

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
        ) : ansicht === 'board' ? (
          <KanbanBoard projektId={projekt.id} aufgaben={projekt.aufgaben} />
        ) : (
          <ul className="grid gap-1">
            {projekt.aufgaben.map((a) => {
              const fertig = aufgabenStatus(a) === 'Erledigt'
              return (
                <li key={a.id} className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => aufgabeUmschalten(projekt.id, a.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/5"
                  >
                    {fertig ? (
                      <Check size={16} className="shrink-0 text-nx-green" />
                    ) : (
                      <Circle size={16} className="shrink-0 text-nx-muted" />
                    )}
                    <span className={fertig ? 'text-nx-muted line-through' : ''}>{a.text}</span>
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
              )
            })}
          </ul>
        )}
      </Card>

      <div className="flex items-center gap-2">
        <Button
          variante="sekundaer"
          onClick={() => projektArchivieren(projekt.id, !projekt.archiviert)}
        >
          {projekt.archiviert ? de.projekte.wiederherstellen : de.projekte.archivieren}
        </Button>
        <Button variante="ghost" onClick={loeschen}>
          <Trash2 size={16} />
          {de.projekte.loeschen}
        </Button>
      </div>
    </div>
  )
}