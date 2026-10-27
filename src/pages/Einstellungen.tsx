import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Download, Upload } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { StatusLabel } from '../components/StatusLabel'
import { UpdateKarte } from '../components/UpdateKarte'
import { backupEinspielen, backupErstellen } from '../data/backup'
import { de } from '../i18n/de'

const kuerzel = [
  de.kuerzel.palette,
  de.kuerzel.uebersicht,
  de.kuerzel.projekte,
  de.kuerzel.ki,
  de.kuerzel.ideen,
  de.wissen.kuerzel,
]

export function Einstellungen() {
  const dateiRef = useRef<HTMLInputElement>(null)
  const [meldung, setMeldung] = useState('')

  async function einspielen(e: ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0]
    e.target.value = ''
    if (!datei) return
    if (!window.confirm(de.einstellungen.importFrage)) return
    if (await backupEinspielen(datei)) {
      setMeldung(de.einstellungen.importErfolg)
      window.setTimeout(() => window.location.reload(), 1200)
    } else {
      setMeldung(de.einstellungen.importFehler)
    }
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <PageHeader titel={de.nav.einstellungen.titel} raum={de.nav.einstellungen.raum} />

      <UpdateKarte />

      <Card className="grid gap-3">
        <h2 className="text-sm font-semibold">{de.einstellungen.backup}</h2>
        <p className="text-sm text-nx-muted">{de.einstellungen.backupText}</p>
        <div className="flex items-center gap-2">
          <Button onClick={backupErstellen}>
            <Download size={16} />
            {de.einstellungen.exportieren}
          </Button>
          <Button variante="sekundaer" onClick={() => dateiRef.current?.click()}>
            <Upload size={16} />
            {de.einstellungen.importieren}
          </Button>
          <input
            ref={dateiRef}
            type="file"
            accept="application/json,.json"
            onChange={einspielen}
            className="hidden"
          />
        </div>
        {meldung ? <p role="status" className="text-sm text-nx-cyan">{meldung}</p> : null}
      </Card>

      <Card className="grid gap-3">
        <h2 className="text-sm font-semibold">{de.einstellungen.kuerzel}</h2>
        <ul className="grid gap-2">
          {kuerzel.map((k) => (
            <li key={k.tasten} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-nx-muted">{k.text}</span>
              <span className="rounded-sm border border-nx-line bg-nx-bg px-2 py-1 font-mono text-xs">
                {k.tasten}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{de.einstellungen.integrationen}</h2>
          <StatusLabel art="nichtVerbunden" />
        </div>
        <p className="text-sm text-nx-muted">{de.einstellungen.integrationenText}</p>
      </Card>

      <Card className="grid gap-3">
        <h2 className="text-sm font-semibold">{de.einstellungen.speicher}</h2>
        <p className="text-sm text-nx-muted">{de.einstellungen.speicherText}</p>
      </Card>
    </div>
  )
}