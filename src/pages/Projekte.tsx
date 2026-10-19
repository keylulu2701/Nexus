import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import { StatusLabel } from '../components/StatusLabel'
import { projekte, stati, statusFarbe, typen } from '../data/projects'
import { de } from '../i18n/de'

const auswahl =
  'h-9 rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25'

export function Projekte() {
  const [suche, setSuche] = useState('')
  const [typ, setTyp] = useState('')
  const [status, setStatus] = useState('')

  const begriff = suche.trim().toLowerCase()
  const treffer = projekte.filter(
    (p) =>
      (typ === '' || p.typ === typ) &&
      (status === '' || p.status === status) &&
      (begriff === '' ||
        p.name.toLowerCase().includes(begriff) ||
        p.beschreibung.toLowerCase().includes(begriff) ||
        p.technologien.some((t) => t.toLowerCase().includes(begriff))),
  )

  function zuruecksetzen() {
    setSuche('')
    setTyp('')
    setStatus('')
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        titel={de.nav.projekte.titel}
        raum={de.nav.projekte.raum}
        aktion={<StatusLabel art="demo" />}
      />

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
          value={typ}
          onChange={(e) => setTyp(e.target.value)}
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
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
          <Button variante="sekundaer" onClick={zuruecksetzen}>
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
                    <p className="mt-1 text-sm text-nx-muted">{p.beschreibung}</p>
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
                  <span className="shrink-0 text-xs text-nx-muted">{p.letzteAktivitaet}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}