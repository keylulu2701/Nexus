import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Check, FolderKanban, Lightbulb, Plus, Sparkles } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { LinienChart } from '../components/Charts'
import { PageHeader } from '../components/PageHeader'
import {
  aufgabenStatus,
  berechneHinweise,
  statusFarbe,
  useEreignisse,
  useIdeen,
  useProjekte,
} from '../data/speicher'
import type { ProjektTyp } from '../data/speicher'
import { letzteMonate, vorZeit } from '../data/zeit'
import { de } from '../i18n/de'

const aktionsKarte =
  'flex items-center gap-3 rounded-lg border p-3 transition-colors hover:brightness-125'

const kachel = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-md'

const typPunkt: Record<ProjektTyp, string> = {
  Spiel: 'bg-nx-violet',
  Webseite: 'bg-nx-cyan',
  App: 'bg-nx-green',
  Experiment: 'bg-nx-magenta',
}

function Umlaufbahnen() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 360 160"
      className="pointer-events-none absolute right-4 top-2 hidden h-36 w-80 opacity-80 lg:block"
    >
      <defs>
        <radialGradient id="nx-kern" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#e9d5ff" />
          <stop offset="0.45" stopColor="#9d6bff" />
          <stop offset="1" stopColor="#4c2a9a" />
        </radialGradient>
      </defs>
      <g transform="rotate(-10 200 80)">
        <ellipse cx="200" cy="80" rx="170" ry="62" fill="none" stroke="rgb(157 107 255 / 0.28)" />
        <ellipse cx="200" cy="80" rx="120" ry="44" fill="none" stroke="rgb(34 229 255 / 0.25)" />
        <ellipse cx="200" cy="80" rx="72" ry="27" fill="none" stroke="rgb(232 121 249 / 0.3)" />
        <circle cx="200" cy="80" r="14" fill="url(#nx-kern)" />
        <circle cx="30" cy="80" r="5" fill="#9d6bff" />
        <circle cx="320" cy="62" r="4" fill="#22e5ff" />
        <circle cx="146" cy="112" r="4" fill="#e879f9" />
      </g>
    </svg>
  )
}

export function Uebersicht() {
  const alleProjekte = useProjekte()
  const projekte = alleProjekte.filter((p) => !p.archiviert)
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
      ziel: '/projekte',
      stil: 'bg-nx-violet/25 text-nx-violet shadow-[0_0_16px_rgb(157_107_255/0.6)]',
      linie: 'from-nx-violet',
    },
    {
      label: de.uebersicht.kennzahlen.aktiv,
      wert: aktive,
      info: de.uebersicht.info.aktiv,
      icon: Activity,
      ziel: '/projekte',
      stil: 'bg-nx-green/25 text-nx-green shadow-[0_0_16px_rgb(61_255_154/0.5)]',
      linie: 'from-nx-green',
    },
    {
      label: de.uebersicht.kennzahlen.ideen,
      wert: offeneIdeen,
      info: de.uebersicht.info.ideen,
      icon: Lightbulb,
      ziel: '/ideen',
      stil: 'bg-nx-cyan/25 text-nx-cyan shadow-[0_0_16px_rgb(34_229_255/0.55)]',
      linie: 'from-nx-cyan',
    },
    {
      label: de.uebersicht.kennzahlen.aufgaben,
      wert: offeneAufgaben,
      info: de.uebersicht.info.aufgaben,
      icon: Check,
      ziel: '/projekte',
      stil: 'bg-nx-magenta/25 text-nx-magenta shadow-[0_0_16px_rgb(232_121_249/0.55)]',
      linie: 'from-nx-magenta',
    },
  ]

  return (
    <div className="grid gap-6">
      <PageHeader titel={de.nav.uebersicht.titel} raum={de.nav.uebersicht.raum} />

      <div className="glow-violet relative grid gap-5 overflow-hidden rounded-lg border border-nx-violet/40 bg-gradient-to-br from-nx-violet/25 via-nx-bg/40 to-nx-cyan/15 p-6">
        <Umlaufbahnen />

        <div className="relative min-h-20 max-w-xl">
          <h2 className="bg-gradient-to-r from-nx-violet via-nx-magenta to-nx-cyan bg-clip-text text-3xl font-bold text-transparent">
            {de.uebersicht.willkommen}
          </h2>
          <p className="mt-2 text-sm text-nx-muted">
            {projekte.length === 0 && ideen.length === 0
              ? de.uebersicht.heroLeer
              : de.uebersicht.hero(aktive, offeneIdeen)}
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
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

          <Link to="/ideen?neu=1" className={`${aktionsKarte} border-nx-magenta/40 bg-nx-magenta/10`}>
            <span className={`${kachel} bg-nx-magenta/25 text-nx-magenta`}>
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
            <Link key={k.label} to={k.ziel} className="group block rounded-lg">
              <Card className="relative grid gap-3 overflow-hidden transition-colors group-hover:border-white/25">
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${k.linie} to-transparent`}
                />
                <span className={`${kachel} ${k.stil}`}>
                  <Icon size={16} />
                </span>
                <p className="font-mono text-4xl font-medium">{k.wert}</p>
                <div>
                  <p className="text-sm">{k.label}</p>
                  <p className="text-xs text-nx-muted">{k.info}</p>
                </div>
              </Card>
            </Link>
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
            <div className="grid justify-items-center gap-3 py-14">
              <span className={`${kachel} bg-nx-violet/15 text-nx-violet`}>
                <Activity size={16} />
              </span>
              <p className="max-w-sm text-center text-sm text-nx-muted">
                {de.uebersicht.chartLeer}
              </p>
            </div>
          )}
        </Card>

        <Card className="grid content-start gap-4">
          <h2 className="text-sm font-semibold">{de.uebersicht.feed}</h2>
          {ereignisse.length === 0 ? (
            <p className="text-sm text-nx-muted">{de.uebersicht.feedLeer}</p>
          ) : (
            <ul className="relative grid gap-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-nx-line">
              {ereignisse.slice(0, 6).map((e, i) => (
                <li key={e.id} className="relative pl-6">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-nx-bar ${
                      i === 0
                        ? 'bg-nx-cyan shadow-[0_0_10px_rgb(34_229_255/0.7)]'
                        : 'bg-nx-violet/70'
                    }`}
                  />
                  <span className="block text-sm">{e.text}</span>
                  <span className="block text-xs text-nx-muted">{vorZeit(e.zeit)}</span>
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
              {zuletzt.map((p) => {
                const gesamt = p.aufgaben.length
                const erledigt = p.aufgaben.filter((a) => aufgabenStatus(a) === 'Erledigt').length
                const prozent = gesamt === 0 ? 0 : Math.round((erledigt / gesamt) * 100)
                return (
                  <li key={p.id}>
                    <Link
                      to={`/projekte/${p.id}`}
                      className="flex items-center justify-between gap-4 rounded-md px-3 py-2 transition-colors hover:bg-white/5"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden
                          className={`h-2 w-2 shrink-0 rounded-full ${typPunkt[p.typ]}`}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{p.name}</span>
                          <span className="block truncate text-xs text-nx-muted">
                            {[p.typ, ...p.technologien].join(' · ')}
                          </span>
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-4">
                        {gesamt > 0 ? (
                          <span
                            role="progressbar"
                            aria-valuenow={prozent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={de.projekte.aufgabenZaehler(erledigt, gesamt)}
                            className="hidden h-1 w-20 overflow-hidden rounded-full bg-white/10 xl:block"
                          >
                            <span
                              className={`block h-full ${typPunkt[p.typ]}`}
                              style={{ width: `${prozent}%` }}
                            />
                          </span>
                        ) : null}
                        <Badge farbe={statusFarbe[p.status]}>{p.status}</Badge>
                        <span className="w-24 text-right text-xs text-nx-muted">
                          {vorZeit(p.geaendertAm)}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <div className="glow-violet grid content-start gap-3 rounded-lg border border-nx-violet/40 bg-gradient-to-br from-nx-violet/15 to-nx-magenta/5 p-4">
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