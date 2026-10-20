import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Archive, FolderKanban, Plus } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import {
  aufgabenStatus,
  projektAnlegen,
  stati,
  statusFarbe,
  typen,
  useProjekte,
} from '../data/speicher'
import type { Projekt, ProjektTyp } from '../data/speicher'
import { vorZeit } from '../data/zeit'
import { de } from '../i18n/de'

const auswahl =
  'h-9 rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25'

const typStil: Record<ProjektTyp, { kopf: string; balken: string; plural: string }> = {
  Spiel: { kopf: 'from-nx-violet/35 to-nx-violet/5', balken: 'bg-nx-violet', plural: 'Spiele' },
  Webseite: { kopf: 'from-nx-cyan/35 to-nx-cyan/5', balken: 'bg-nx-cyan', plural: 'Webseiten' },
  App: { kopf: 'from-nx-green/35 to-nx-green/5', balken: 'bg-nx-green', plural: 'Apps' },
  Experiment: { kopf: 'from-nx-text/20 to-nx-text/5', balken: 'bg-nx-muted', plural: 'Experimente' },
}

type Ansicht = 'regal' | 'galerie' | 'liste'
const ANSICHT_KEY = 'nexus.bibliothek.ansicht'

function ladeAnsicht(): Ansicht {
  try {
    const w = localStorage.getItem(ANSICHT_KEY)
    return w === 'galerie' || w === 'liste' ? w : 'regal'
  } catch {
    return 'regal'
  }
}

function fortschritt(p: Projekt) {
  const gesamt = p.aufgaben.length
  const erledigt = p.aufgaben.filter((a) => aufgabenStatus(a) === 'Erledigt').length
  return { gesamt, erledigt, prozent: gesamt === 0 ? 0 : Math.round((erledigt / gesamt) * 100) }
}

function Fortschritt({ p }: { p: Projekt }) {
  const f = fortschritt(p)
  if (f.gesamt === 0) {
    return <p className="text-xs text-nx-muted">{de.projekte.keineAufgabenKurz}</p>
  }
  return (
    <div className="grid gap-1">
      <div
        role="progressbar"
        aria-valuenow={f.prozent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={de.projekte.aufgabenZaehler(f.erledigt, f.gesamt)}
        className="h-1 overflow-hidden rounded-full bg-nx-text/10"
      >
        <div className={`h-full ${typStil[p.typ].balken}`} style={{ width: `${f.prozent}%` }} />
      </div>
      <p className="text-xs text-nx-muted">{de.projekte.aufgabenZaehler(f.erledigt, f.gesamt)}</p>
    </div>
  )
}

function Karte({ p, gross }: { p: Projekt; gross: boolean }) {
  return (
    <Link
      to={`/projekte/${p.id}`}
      className="grid overflow-hidden rounded-lg border border-nx-line bg-nx-panel transition-colors hover:border-nx-text/30"
    >
      <div className={`bg-gradient-to-br ${typStil[p.typ].kopf} ${gross ? 'h-24' : 'h-2'}`} />
      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate font-medium">{p.name}</p>
          <Badge farbe={statusFarbe[p.status]}>{p.status}</Badge>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-nx-muted">
          {p.beschreibung || de.projekte.keineBeschreibung}
        </p>
        <Fortschritt p={p} />
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap gap-1">
            {p.technologien.slice(0, 3).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <span className="shrink-0 text-xs text-nx-muted">{vorZeit(p.geaendertAm)}</span>
        </div>
      </div>
    </Link>
  )
}

export function Projekte() {
  const projekte = useProjekte()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const [ansicht, setAnsicht] = useState<Ansicht>(ladeAnsicht)
  const [archivModus, setArchivModus] = useState(false)
  const [suche, setSuche] = useState('')
  const [typFilter, setTypFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [formOffen, setFormOffen] = useState(() => params.get('neu') === '1')
  const [name, setName] = useState('')
  const [typ, setTyp] = useState<ProjektTyp>('Spiel')
  const [beschreibung, setBeschreibung] = useState('')
  const [technologien, setTechnologien] = useState('')

  const anzahlArchiv = projekte.filter((p) => p.archiviert).length
  const begriff = suche.trim().toLowerCase()
  const treffer = projekte.filter(
    (p) =>
      Boolean(p.archiviert) === archivModus &&
      (typFilter === '' || p.typ === typFilter) &&
      (statusFilter === '' || p.status === statusFilter) &&
      (begriff === '' ||
        p.name.toLowerCase().includes(begriff) ||
        p.beschreibung.toLowerCase().includes(begriff) ||
        p.technologien.some((t) => t.toLowerCase().includes(begriff))),
  )

  function ansichtWaehlen(a: Ansicht) {
    setAnsicht(a)
    try {
      localStorage.setItem(ANSICHT_KEY, a)
    } catch {
      // Speichern nicht möglich, egal
    }
  }

  function formSchliessen() {
    setFormOffen(false)
    setName('')
    setBeschreibung('')
    setTechnologien('')
    setTyp('Spiel')
    setParams({}, { replace: true })
  }

  function anlegen(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (n === '') return
    const id = projektAnlegen({
      name: n,
      typ,
      beschreibung: beschreibung.trim(),
      technologien: technologien
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    navigate(`/projekte/${id}`)
  }

  function filterZuruecksetzen() {
    setSuche('')
    setTypFilter('')
    setStatusFilter('')
  }

  const umschalter = (wert: Ansicht, text: string) => (
    <button
      type="button"
      onClick={() => ansichtWaehlen(wert)}
      aria-pressed={ansicht === wert}
      className={`rounded-md px-3 py-1 text-sm transition-colors ${
        ansicht === wert
          ? 'bg-nx-violet/15 text-nx-text'
          : 'text-nx-muted hover:bg-nx-text/10 hover:text-nx-text'
      }`}
    >
      {text}
    </button>
  )

  return (
    <div className="grid gap-6">
      <PageHeader
        titel={de.nav.projekte.titel}
        raum={de.nav.projekte.raum}
        aktion={
          <Button onClick={() => setFormOffen(true)} disabled={formOffen}>
            <Plus size={16} />
            {de.projekte.neu}
          </Button>
        }
      />

      {formOffen ? (
        <Card>
          <form onSubmit={anlegen} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-2 text-sm text-nx-muted">
                {de.projekte.name}
                <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm text-nx-muted">
                {de.projekte.typ}
                <select
                  value={typ}
                  onChange={(e) => setTyp(e.target.value as ProjektTyp)}
                  className={auswahl}
                >
                  {typen.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="col-span-2 grid gap-2 text-sm text-nx-muted">
                {de.projekte.beschreibung}
                <Input value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} />
              </label>
              <label className="col-span-2 grid gap-2 text-sm text-nx-muted">
                {de.projekte.technologien}
                <Input
                  value={technologien}
                  onChange={(e) => setTechnologien(e.target.value)}
                  placeholder={de.projekte.technologienHinweis}
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={name.trim() === ''}>
                {de.projekte.anlegen}
              </Button>
              <Button type="button" variante="ghost" onClick={formSchliessen}>
                {de.projekte.abbrechen}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {projekte.length === 0 ? (
        <Card className="grid justify-items-start gap-3">
          <FolderKanban size={16} className="text-nx-muted" />
          <div>
            <p className="text-sm font-medium">{de.projekte.leerTitel}</p>
            <p className="mt-1 text-sm text-nx-muted">{de.projekte.leerText}</p>
          </div>
          {formOffen ? null : (
            <Button onClick={() => setFormOffen(true)}>
              <Plus size={16} />
              {de.projekte.neu}
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-48 max-w-sm flex-1">
              <Input
                value={suche}
                onChange={(e) => setSuche(e.target.value)}
                placeholder={de.projekte.suchen}
                aria-label={de.projekte.suchen}
              />
            </div>
            <select
              value={typFilter}
              onChange={(e) => setTypFilter(e.target.value)}
              aria-label={de.projekte.typ}
              className={auswahl}
            >
              <option value="">{de.projekte.alleTypen}</option>
              {typen.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label={de.projekte.status}
              className={auswahl}
            >
              <option value="">{de.projekte.alleStatus}</option>
              {stati.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => setArchivModus((a) => !a)}
                aria-pressed={archivModus}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors ${
                  archivModus
                    ? 'bg-nx-cyan/15 text-nx-cyan'
                    : 'text-nx-muted hover:bg-nx-text/10 hover:text-nx-text'
                }`}
              >
                <Archive size={16} />
                {de.projekte.archiv}
                <span className="font-mono text-xs">{anzahlArchiv}</span>
              </button>
              <div className="flex gap-1">
                {umschalter('regal', de.projekte.ansichtRegal)}
                {umschalter('galerie', de.projekte.ansichtGalerie)}
                {umschalter('liste', de.projekte.ansichtListe)}
              </div>
            </div>
          </div>

          {treffer.length === 0 ? (
            <Card className="grid justify-items-start gap-3">
              <p className="text-sm text-nx-muted">
                {archivModus && anzahlArchiv === 0
                  ? de.projekte.archivLeer
                  : de.projekte.keineTreffer}
              </p>
              {suche || typFilter || statusFilter ? (
                <Button variante="sekundaer" onClick={filterZuruecksetzen}>
                  {de.projekte.zuruecksetzen}
                </Button>
              ) : null}
            </Card>
          ) : ansicht === 'regal' ? (
            <div className="grid gap-8">
              {typen
                .filter((t) => treffer.some((p) => p.typ === t))
                .map((t) => {
                  const gruppe = treffer.filter((p) => p.typ === t)
                  return (
                    <section key={t} className="grid gap-3">
                      <h2 className="flex items-center gap-2 text-sm font-semibold">
                        <span className={`h-2 w-2 rounded-full ${typStil[t].balken}`} />
                        {typStil[t].plural}
                        <span className="font-mono text-xs text-nx-muted">{gruppe.length}</span>
                      </h2>
                      <div className="grid grid-cols-3 gap-4">
                        {gruppe.map((p) => (
                          <Karte key={p.id} p={p} gross={false} />
                        ))}
                      </div>
                    </section>
                  )
                })}
            </div>
          ) : ansicht === 'galerie' ? (
            <div className="grid grid-cols-3 gap-4">
              {treffer.map((p) => (
                <Karte key={p.id} p={p} gross />
              ))}
            </div>
          ) : (
            <ul className="grid gap-3">
              {treffer.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/projekte/${p.id}`}
                    className="grid gap-3 rounded-lg border border-nx-line bg-nx-panel p-4 transition-colors hover:border-nx-text/25"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium">{p.name}</p>
                        <p className="mt-1 text-sm text-nx-muted">
                          {p.beschreibung || de.projekte.keineBeschreibung}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge farbe="violet">{p.typ}</Badge>
                        <Badge farbe={statusFarbe[p.status]}>{p.status}</Badge>
                      </div>
                    </div>
                    <Fortschritt p={p} />
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {p.technologien.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                      <span className="shrink-0 text-xs text-nx-muted">{vorZeit(p.geaendertAm)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}