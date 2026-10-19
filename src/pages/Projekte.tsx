import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FolderKanban, Plus } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import { projektAnlegen, stati, statusFarbe, typen, useProjekte } from '../data/speicher'
import type { ProjektTyp } from '../data/speicher'
import { vorZeit } from '../data/zeit'
import { de } from '../i18n/de'

const auswahl =
  'h-9 rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25'

export function Projekte() {
  const projekte = useProjekte()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const [suche, setSuche] = useState('')
  const [typFilter, setTypFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [formOffen, setFormOffen] = useState(() => params.get('neu') === '1')
  const [name, setName] = useState('')
  const [typ, setTyp] = useState<ProjektTyp>('Spiel')
  const [beschreibung, setBeschreibung] = useState('')
  const [technologien, setTechnologien] = useState('')

  const begriff = suche.trim().toLowerCase()
  const treffer = projekte.filter(
    (p) =>
      (typFilter === '' || p.typ === typFilter) &&
      (statusFilter === '' || p.status === statusFilter) &&
      (begriff === '' ||
        p.name.toLowerCase().includes(begriff) ||
        p.beschreibung.toLowerCase().includes(begriff) ||
        p.technologien.some((t) => t.toLowerCase().includes(begriff))),
  )

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
          <div className="flex items-center gap-3">
            <div className="max-w-sm flex-1">
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
          </div>

          {treffer.length === 0 ? (
            <Card className="grid justify-items-start gap-3">
              <p className="text-sm text-nx-muted">{de.projekte.keineTreffer}</p>
              <Button variante="sekundaer" onClick={filterZuruecksetzen}>
                {de.projekte.zuruecksetzen}
              </Button>
            </Card>
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