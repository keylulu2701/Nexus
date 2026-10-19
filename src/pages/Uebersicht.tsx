import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Check, FolderKanban, Lightbulb, Plus, Sparkles } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { LinienChart } from '../components/Charts'
import { PageHeader } from '../components/PageHeader'
import {
  berechneHinweise,
  statusFarbe,
  useEreignisse,
  useIdeen,
  useProjekte,
} from '../data/speicher'
import { letzteMonate, vorZeit } from '../data/zeit'
import { de } from '../i18n/de'

const aktionsKarte =
  'flex items-center gap-3 rounded-lg border p-3 transition-colors hover:brightness-125'

const kachel = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-md'

export function Uebersicht() {
  const projekte = useProjekte()
  const ideen = useIdeen()
  const ereignisse = useEreignisse()

  const aktive = projekte.filter((p) => p.status === 'Aktiv').length
  const offeneIdeen = ideen.filter((i) => i.status !== 'Erledigt').length
  const offeneAufgaben = projekte.reduce(
    (summe, p) => summe + p.aufgaben.filter((a) => !a.erledigt).length,
    0,
  )
  const hinweise = berechneHinweise(projekte, ideen)
  const zuletzt = [...projekte].sort((a, b) => b.geaendertAm - a.geaendertAm).slice(0, 5)

  const monate = letzteMonate(6)
  const monatsAufgaben = monate.map((m) =>
    projekte.reduce(
      (summe, p) =>
        summe +
        p.aufgaben.filter(
          (a) => a.erledigtAm !== undefined && a.erledigtAm >= m.start && a.erledigtAm < m.ende,
        ).length,
      0,
    ),
  )
  const monatsIdeen = monate.map(
    (m) => ideen.filter((i) => i.erstelltAm >= m.start && i.erstelltAm < m.ende).length,
  )
  const hatDaten = [...monatsAufgaben, ...monatsIdeen].some((w) => w > 0)

  const kennzahlen = [
    {
      label: de.uebersicht.kennzahlen.projekte,
      wert: projekte.length,
      info: de.uebersicht.info.projekte,
      icon: FolderKanban,
      stil: 'bg-nx-violet/25 text-nx-violet shadow-[0_0_16px_rgb(157_107_255/0.6)]',
    },
    {
      label: de.uebersicht.kennzahlen.aktiv,
      wert: aktive,
      info: de.uebersicht.info.aktiv,
      icon: Activity,
      stil: 'bg-nx-green/25 text-nx-green shadow-[0_0_16px_rgb(61_255_154/0.5)]',
    },
    {
      label: de.uebersicht.kennzahlen.ideen,
      wert: offeneIdeen,
      info: de.uebersicht.info.ideen,
      icon: Lightbulb,
      stil: 'bg-nx-cyan/25 text-nx-cyan shadow-[0_0_16px_rgb(34_229_255/0.55)]',
    },
    {
      label: de.uebersicht.kennzahlen.aufgaben,
      wert: offeneAufgaben,
      info: de.uebersicht.info.aufgaben,
      icon: Check,
      stil: 'bg-nx-violet/25 text-nx-violet shadow-[0_0_16px_rgb(157_107_255/0.6)]',
    },
  ]

  return (
    <div className="grid gap-4">
      <PageHeader titel={de.nav.uebersicht.titel} raum={de.nav.uebersicht.raum} />

      <div className="glow-violet grid gap-5 rounded-lg border border-nx-violet/50 bg-gradient-to-br from-nx-violet/25 via-nx-bg to-nx-cyan/15 p-6">
        <div>
          <h2 className="bg-gradient-to-r from-nx-violet to-nx-cyan bg-clip-text text-3xl font-bold text-transparent">
            {de.uebersicht.willkommen}
          </h2>
          <p className="mt-2 text-sm text-nx-muted">
            {projekte.length === 0 && ideen.length === 0
              ? de.uebersicht.heroLeer
              : de.uebersicht.hero(aktive, offeneIdeen)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Link
            to="/projekte?neu=1"
            className={`${aktionsKarte} border-nx-violet/40 bg-nx-violet/10`}
          >
            <span className={`${kachel} bg-nx-violet/25 text-nx-violet`}>
              <Plus size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{de.uebersicht.neuesProjekt}</span>
              <span className="block text-xs text-nx-muted">{de.uebersicht.neuesProjektText}</span>
            </span>
            <ArrowRight size={16} className="text-nx-muted" />
          </Link>

          <Link to="/ki" className={`${aktionsKarte} border-nx-cyan/40 bg-nx-cyan/10`}>
            <span className={`${kachel} bg-nx-cyan/25 text-nx-cyan`}>
              <Sparkles size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{de.uebersicht.kiFragen}</span>
              <span className="block text-xs text-nx-muted">{de.uebersicht.kiFragenText}</span>
            </span>
            <ArrowRight size={16} className="text-nx-muted" />
          </Link>

          <Link to="/ideen?neu=1" className={`${aktionsKarte} border-nx-green/40 bg-nx-green/10`}>
            <span className={`${kachel} bg-nx-green/25 text-nx-green`}>
              <Lightbulb size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{de.uebersicht.ideeErfassen}</span>
              <span className="block text-xs text-nx-muted">{de.uebersicht.ideeText}</span>
            </span>
            <ArrowRight size={16} className="text-nx-muted" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kennzahlen.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label} className="grid gap-3">
              <span className={`${kachel} ${k.stil}`}>
                <Icon size={16} />
              </span>
              <p className="font-mono text-3xl font-medium">{k.wert}</p>
              <div>
                <p className="text-sm">{k.label}</p>
                <p className="text-xs text-nx-muted">{k.info}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 grid content-start gap-4">
          <div>
            <h2 className="text-sm font-semibold">{de.uebersicht.chartTitel}</h2>
            <p className="mt-1 text-xs text-nx-muted">{de.uebersicht.chartUntertitel}</p>
          </div>
          {hatDaten ? (
            <LinienChart
              labels={monate.map((m) => m.label)}
              beschreibung={de.uebersicht.chartBeschreibung}
              reihen={[
                {
                  name: de.uebersicht.reiheAufgaben,
                  werte: monatsAufgaben,
                  klasse: 'text-nx-violet',
                  punkt: 'bg-nx-violet',
                },
                {
                  name: de.uebersicht.reiheIdeen,
                  werte: monatsIdeen,
                  klasse: 'text-nx-cyan',
                  punkt: 'bg-nx-cyan',
                },
              ]}
            />
          ) : (
            <p className="py-16 text-center text-sm text-nx-muted">{de.uebersicht.chartLeer}</p>
          )}
        </Card>

        <Card className="grid content-start gap-4">
          <h2 className="text-sm font-semibold">{de.uebersicht.feed}</h2>
          {ereignisse.length === 0 ? (
            <p className="text-sm text-nx-muted">{de.uebersicht.feedLeer}</p>
          ) : (
            <ul className="grid gap-4">
              {ereignisse.slice(0, 6).map((e) => (
                <li key={e.id} className="flex items-start gap-3">
                  <span className={`${kachel} bg-nx-text/10 text-nx-muted`}>
                    <Activity size={16} />
                  </span>
                  <span className="min-w-0 text-sm">
                    {e.text}
                    <span className="block text-xs text-nx-muted">{vorZeit(e.zeit)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 grid content-start gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{de.uebersicht.zuletztBearbeitet}</h2>
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
            <ul className="grid">
              {zuletzt.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/projekte/${p.id}`}
                    className="flex items-center justify-between gap-4 rounded-md px-3 py-2 transition-colors hover:bg-nx-text/10"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block truncate text-xs text-nx-muted">
                        {[p.typ, ...p.technologien].join(' · ')}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <Badge farbe={statusFarbe[p.status]}>{p.status}</Badge>
                      <span className="w-24 text-right text-xs text-nx-muted">
                        {vorZeit(p.geaendertAm)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="glow-violet grid content-start gap-3 rounded-lg border border-nx-violet/50 bg-nx-violet/10 p-4">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={16} className="text-nx-violet" />
              {de.uebersicht.hinweise}
            </h2>
            <p className="mt-1 text-xs text-nx-muted">{de.uebersicht.hinweiseText}</p>
          </div>
          {hinweise.length === 0 ? (
            <p className="text-sm text-nx-muted">{de.uebersicht.hinweiseLeer}</p>
          ) : (
            <ul className="grid gap-3">
              {hinweise.map((h) => (
                <li key={h.id} className="text-sm">
                  {h.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}