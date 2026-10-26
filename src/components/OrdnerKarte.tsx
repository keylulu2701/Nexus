import { useState } from 'react'
import { Code, File, Folder, FolderOpen, GitBranch, RefreshCw, Unlink } from 'lucide-react'
import { Badge } from './Badge'
import { Button } from './Button'
import { Card } from './Card'
import { StatusLabel } from './StatusLabel'
import { desktop, istFehler } from '../data/desktop'
import type { OrdnerZustand } from '../data/ordner'
import { projektOrdnerSetzen } from '../data/speicher'
import { vorZeit } from '../data/zeit'
import { ordnerTexte as t } from '../i18n/ordner'

const MAX_ZEILEN = 12

function formatGroesse(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace('.', ',')} KB`
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}

export function GitAnzeige({ zustand }: { zustand: OrdnerZustand }) {
  if (zustand.status === 'keineApp') {
    return (
      <div className="grid gap-2">
        <div>
          <StatusLabel art="nichtVerbunden" />
        </div>
        <p className="text-sm text-nx-muted">{t.nurApp}</p>
      </div>
    )
  }
  if (zustand.status === 'leer') {
    return (
      <div className="grid gap-2">
        <div>
          <StatusLabel art="nichtVerbunden" />
        </div>
        <p className="text-sm text-nx-muted">{t.leerHinweis}</p>
      </div>
    )
  }
  if (zustand.status === 'laedt') {
    return <p className="text-sm text-nx-muted">{t.laedt}</p>
  }
  if (zustand.status === 'fehler') {
    return <p className="text-sm text-nx-muted">{zustand.text}</p>
  }
  if (zustand.git) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 font-mono text-sm text-nx-cyan">
          <GitBranch size={16} />
          {zustand.git.branch}
        </span>
        <Badge farbe={zustand.git.sauber ? 'green' : 'neutral'}>
          {zustand.git.sauber ? t.sauber : t.aenderungen(zustand.git.geaendert)}
        </Badge>
      </div>
    )
  }
  return (
    <p className="text-sm text-nx-muted">{zustand.gitFehler ?? t.keinGit}</p>
  )
}

export function OrdnerKarte({
  projektId,
  ordnerPfad,
  zustand,
  neuLaden,
}: {
  projektId: string
  ordnerPfad?: string
  zustand: OrdnerZustand
  neuLaden: () => void
}) {
  const [meldung, setMeldung] = useState<string | null>(null)

  async function waehlen() {
    if (!desktop) return
    const pfad = await desktop.ordnerWaehlen()
    if (pfad) {
      setMeldung(null)
      projektOrdnerSetzen(projektId, pfad)
    }
  }

  async function oeffnen(wohin: 'explorer' | 'vscode') {
    if (!desktop || !ordnerPfad) return
    const antwort =
      wohin === 'explorer'
        ? await desktop.imExplorerOeffnen(ordnerPfad)
        : await desktop.inVSCodeOeffnen(ordnerPfad)
    setMeldung(istFehler(antwort) ? antwort.fehler : null)
  }

  return (
    <Card className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{t.titel}</h2>
        {desktop && ordnerPfad ? (
          <div className="flex flex-wrap items-center gap-1">
            <Button variante="ghost" onClick={() => oeffnen('explorer')} title={t.explorer}>
              <FolderOpen size={16} />
              {t.explorer}
            </Button>
            <Button variante="ghost" onClick={() => oeffnen('vscode')} title={t.vscode}>
              <Code size={16} />
              {t.vscode}
            </Button>
            <Button
              variante="ghost"
              onClick={neuLaden}
              aria-label={t.aktualisieren}
              title={t.aktualisieren}
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        ) : null}
      </div>

      {!desktop ? (
        <p className="text-sm text-nx-muted">{t.nurApp}</p>
      ) : !ordnerPfad ? (
        <div className="grid justify-items-start gap-3">
          <p className="text-sm text-nx-muted">{t.leerHinweis}</p>
          <Button onClick={waehlen}>
            <FolderOpen size={16} />
            {t.verknuepfen}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="min-w-0 truncate font-mono text-xs text-nx-muted" title={ordnerPfad}>
              {ordnerPfad}
            </p>
            <div className="flex items-center gap-1">
              <Button variante="ghost" onClick={waehlen}>
                {t.aendern}
              </Button>
              <Button variante="ghost" onClick={() => projektOrdnerSetzen(projektId, undefined)}>
                <Unlink size={16} />
                {t.loesen}
              </Button>
            </div>
          </div>

          {zustand.status === 'laedt' ? (
            <p className="text-sm text-nx-muted">{t.laedt}</p>
          ) : zustand.status === 'fehler' ? (
            <p className="text-sm text-nx-muted">{zustand.text}</p>
          ) : zustand.status === 'bereit' ? (
            <div className="grid gap-3">
              {zustand.info.istGodot || zustand.info.hatPackageJson ? (
                <div className="flex flex-wrap gap-2">
                  {zustand.info.istGodot ? <Badge farbe="cyan">{t.godot}</Badge> : null}
                  {zustand.info.hatPackageJson ? <Badge farbe="cyan">{t.node}</Badge> : null}
                </div>
              ) : null}

              {zustand.info.eintraege.length === 0 ? (
                <p className="text-sm text-nx-muted">{t.ordnerLeer}</p>
              ) : (
                <ul className="grid">
                  {zustand.info.eintraege.slice(0, MAX_ZEILEN).map((e) => (
                    <li
                      key={e.name}
                      className="flex items-center gap-3 rounded-md px-2 py-1 text-sm hover:bg-nx-text/10"
                    >
                      {e.istOrdner ? (
                        <Folder size={16} className="shrink-0 text-nx-cyan" />
                      ) : (
                        <File size={16} className="shrink-0 text-nx-muted" />
                      )}
                      <span className="min-w-0 flex-1 truncate font-mono">{e.name}</span>
                      <span className="shrink-0 text-xs text-nx-muted">
                        {e.istOrdner ? '' : formatGroesse(e.groesse)}
                      </span>
                      <span className="w-28 shrink-0 text-right text-xs text-nx-muted">
                        {vorZeit(e.geaendert)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {zustand.info.anzahlGesamt > MAX_ZEILEN ? (
                <p className="text-xs text-nx-muted">
                  {t.weitere(zustand.info.anzahlGesamt - MAX_ZEILEN)}
                </p>
              ) : null}
            </div>
          ) : null}

          {meldung ? <p className="text-sm text-nx-cyan">{meldung}</p> : null}
        </div>
      )}
    </Card>
  )
}