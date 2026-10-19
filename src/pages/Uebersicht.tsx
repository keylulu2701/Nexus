import { Link } from 'react-router-dom'
import { Lightbulb, Plus, Sparkles } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { StatusLabel } from '../components/StatusLabel'
import { zaehleOffeneIdeen } from '../data/ideenSpeicher'
import { aktivitaeten, kiAktivitaet, kiHinweise } from '../data/uebersicht'
  const offeneIdeen = zaehleOffeneIdeen()
import { projekte } from '../data/projects'
import type { ProjektStatus } from '../data/projects'
import { de } from '../i18n/de'

const statusFarbe: Record<ProjektStatus, 'green' | 'neutral' | 'cyan'> = {
  Aktiv: 'green',
  Pausiert: 'neutral',
  Abgeschlossen: 'cyan',
}

const aktionLink =
  'inline-flex items-center gap-2 rounded-md border border-nx-line bg-nx-panel px-3 py-2 text-sm font-medium text-nx-text transition-colors hover:bg-nx-text/10'

export function Uebersicht() {
  const aktive = projekte.filter((p) => p.status === 'Aktiv').length
  const zuletzt = projekte.slice(0, 5)

  const kennzahlen = [
    { label: de.uebersicht.kennzahlen.projekte, wert: projekte.length, demo: false },
    { label: de.uebersicht.kennzahlen.aktiv, wert: aktive, demo: false },
    { label: de.uebersicht.kennzahlen.ideen, wert: offeneIdeen, demo: false },
    { label: de.uebersicht.kennzahlen.ki, wert: kiAktivitaet, demo: true },
  ]

  return (
    <div className="grid gap-6">
      <PageHeader titel={de.nav.uebersicht.titel} raum={de.nav.uebersicht.raum} />

      <div className="grid grid-cols-4 gap-4">
        {kennzahlen.map((k) => (
          <Card key={k.label} className="grid gap-2">
            <div className="flex h-6 items-center justify-between gap-2">
              <p className="text-sm text-nx-muted">{k.label}</p>
              {k.demo ? <StatusLabel art="demo" /> : null}
            </div>
            <p className="font-mono text-2xl font-medium">{k.wert}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid content-start gap-6">
          <Card className="grid gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{de.uebersicht.zuletzt}</h2>
              <Link
                to="/projekte"
                className="rounded-sm text-sm text-nx-muted transition-colors hover:text-nx-text"
              >
                {de.uebersicht.alleProjekte}
              </Link>
            </div>

            {zuletzt.length === 0 ? (
              <p className="text-sm text-nx-muted">{de.uebersicht.zuletztLeer}</p>
            ) : (
              <ul className="grid gap-1">
                {zuletzt.map((p) => (
                  <li key={p.id}>
                    <Link
                     to={`/projekte/${p.id}`}
                      className="flex items-center justify-between gap-4 rounded-md px-3 py-2 transition-colors hover:bg-nx-text/10"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{p.name}</span>
                        <span className="block truncate text-xs text-nx-muted">
                          {p.typ} · {p.technologien.join(', ')}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <Badge farbe={statusFarbe[p.status]}>{p.status}</Badge>
                        <span className="w-24 text-right text-xs text-nx-muted">
                          {p.letzteAktivitaet}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="grid gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{de.uebersicht.feed}</h2>
              <StatusLabel art="demo" />
            </div>
            <ul className="grid gap-3">
              {aktivitaeten.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 text-sm">
                  <span>{a.text}</span>
                  <span className="shrink-0 text-xs text-nx-muted">{a.zeit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.uebersicht.schnellaktionen}</h2>
            <div className="grid justify-items-start gap-2">
              <div className="flex items-center gap-2">
                <Button variante="sekundaer" disabled>
                  <Plus size={16} />
                  {de.uebersicht.neuesProjekt}
                </Button>
                <StatusLabel art="bald" />
              </div>
              <Link to="/ki" className={aktionLink}>
                <Sparkles size={16} className="text-nx-violet" />
                {de.uebersicht.kiFragen}
              </Link>
              <Link to="/ideen" className={aktionLink}>
                <Lightbulb size={16} />
                {de.uebersicht.ideeErfassen}
              </Link>
            </div>
          </Card>

          <Card className="grid gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{de.uebersicht.hinweise}</h2>
              <StatusLabel art="demo" />
            </div>
            <ul className="grid gap-3">
              {kiHinweise.map((h) => (
                <li key={h.id} className="flex gap-2 text-sm text-nx-muted">
                  <Sparkles size={16} className="mt-1 shrink-0 text-nx-violet" />
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}