import { useEffect, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { desktop } from '../data/desktop'
import type { AppInfo, UpdateStatus } from '../data/desktop'
import { updateTexte as t } from '../i18n/update'

function statusText(s: UpdateStatus): string {
  switch (s.status) {
    case 'leer':
      return t.leer
    case 'nurInstalliert':
      return t.entwicklung
    case 'sucht':
      return t.sucht
    case 'aktuell':
      return t.aktuell
    case 'laedt':
      return t.laedt(s.version, s.prozent)
    case 'bereit':
      return t.bereit(s.version)
    case 'fehler':
      return t.fehler
  }
}

export function UpdateKarte() {
  const [info, setInfo] = useState<AppInfo | null>(null)
  const [status, setStatus] = useState<UpdateStatus>({ status: 'leer' })

  useEffect(() => {
    if (!desktop) return
    desktop.appInfo().then(setInfo)
    desktop.updateStatus().then(setStatus)
    return desktop.beiUpdateStatus(setStatus)
  }, [])

  const beschaeftigt = status.status === 'sucht' || status.status === 'laedt'

  return (
    <Card className="grid gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold">{t.titel}</h2>
        {info ? <span className="font-mono text-sm text-nx-cyan">{t.version(info.version)}</span> : null}
      </div>

      {!desktop ? (
        <p className="text-sm text-nx-muted">{t.nurApp}</p>
      ) : (
        <>
          <p role="status" aria-live="polite" className="text-sm text-nx-muted">
            {info && !info.installiert ? t.entwicklung : statusText(status)}
          </p>
          <div className="flex items-center gap-2">
            {status.status === 'bereit' ? (
              <Button onClick={() => desktop?.updateInstallieren()}>
                <Download size={16} />
                {t.neustart}
              </Button>
            ) : (
              <Button
                variante="sekundaer"
                onClick={() => desktop?.updatePruefen()}
                disabled={!info?.installiert || beschaeftigt}
              >
                <RefreshCw size={16} />
                {t.pruefen}
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  )
}