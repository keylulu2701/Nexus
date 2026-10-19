import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Eye, Send, Sparkles, X } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import { StatusLabel } from '../components/StatusLabel'
import { de } from '../i18n/de'

// MOCK: Beispielcode und Beispiel-Diff, keine echte KI-Ausgabe
const beispielCode = `func spawn_enemy(room: Node2D) -> void:
    var pos := room.random_point()
    while room.is_blocked(pos):
        pos = room.random_point()
    var enemy := enemy_scene.instantiate()
    enemy.position = pos
    room.add_child(enemy)`

// MOCK
const diffZeilen = [
  { art: 'kontext', text: '  func spawn_enemy(room: Node2D) -> void:' },
  { art: 'entfernt', text: '-     var pos := room.random_point()' },
  { art: 'neu', text: '+     var pos := room.random_point()' },
  { art: 'neu', text: '+     while room.is_blocked(pos):' },
  { art: 'neu', text: '+         pos = room.random_point()' },
  { art: 'kontext', text: '      var enemy := enemy_scene.instantiate()' },
] as const

const diffStil = {
  kontext: 'text-nx-muted',
  entfernt: 'bg-red-400/10 text-red-300',
  neu: 'bg-nx-green/10 text-nx-green',
}

type Nachricht = { id: number; rolle: 'du' | 'ki'; text: string }
type Entscheidung = 'offen' | 'uebernommen' | 'abgelehnt'
type Kontext = 'aktuell' | 'allgemein'

function Sprecher({ rolle }: { rolle: 'du' | 'ki' }) {
  return (
    <p className="flex items-center gap-2 text-xs text-nx-muted">
      {rolle === 'ki' ? <Sparkles size={16} className="text-nx-violet" /> : null}
      {rolle === 'ki' ? de.ki.ki : de.ki.du}
    </p>
  )
}

export function KiArbeitsbereich() {
  const [kontext, setKontext] = useState<Kontext>('aktuell')
  const [eingabe, setEingabe] = useState('')
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([])
  const [diffOffen, setDiffOffen] = useState(false)
  const [entscheidung, setEntscheidung] = useState<Entscheidung>('offen')

  function senden(e: FormEvent) {
    e.preventDefault()
    const text = eingabe.trim()
    if (text === '') return
    setNachrichten((alt) => [
      ...alt,
      { id: alt.length * 2, rolle: 'du', text },
      { id: alt.length * 2 + 1, rolle: 'ki', text: de.ki.demoAntwort },
    ])
    setEingabe('')
  }

  const kontextKnopf = (wert: Kontext, text: string) => (
    <button
      type="button"
      onClick={() => setKontext(wert)}
      aria-pressed={kontext === wert}
      className={`rounded-md px-3 py-1 text-sm transition-colors ${
        kontext === wert
          ? 'bg-nx-violet/15 text-nx-text'
          : 'text-nx-muted hover:bg-nx-text/10 hover:text-nx-text'
      }`}
    >
      {text}
    </button>
  )

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <PageHeader
        titel={de.nav.ki.titel}
        raum={de.nav.ki.raum}
        aktion={<StatusLabel art="demo" />}
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-lg border border-nx-violet/40 bg-nx-violet/10 p-4"
      >
        <Sparkles size={16} className="mt-1 shrink-0 text-nx-violet" />
        <div>
          <p className="text-sm font-medium">{de.ki.hinweisTitel}</p>
          <p className="mt-1 text-sm text-nx-muted">{de.ki.hinweisText}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-nx-muted">{de.ki.kontext}</span>
        <div className="flex gap-1">
          {kontextKnopf('aktuell', de.ki.kontextAktuell)}
          {kontextKnopf('allgemein', de.ki.kontextAllgemein)}
        </div>
        <span className="text-xs text-nx-muted">{de.ki.kontextHinweis}</span>
      </div>

      <Card className="grid gap-6">
        <div className="grid gap-2">
          <Sprecher rolle="du" />
          <p className="text-sm">{de.ki.frage}</p>
        </div>

        <div className="grid gap-3">
          <Sprecher rolle="ki" />
          <p className="text-sm">{de.ki.antwort}</p>
          <pre className="overflow-x-auto rounded-md border border-nx-line bg-nx-bg p-3 font-mono text-xs text-nx-cyan">
            <code>{beispielCode}</code>
          </pre>

          <div className="grid gap-3 rounded-lg border border-nx-line bg-nx-bg p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{de.ki.vorschlag}</p>
                <p className="mt-1 font-mono text-xs text-nx-muted">{de.ki.vorschlagDatei}</p>
              </div>
              <StatusLabel art="demo" />
            </div>

            {diffOffen ? (
              <pre className="overflow-x-auto rounded-md border border-nx-line py-2 font-mono text-xs">
                {diffZeilen.map((z, i) => (
                  <code key={i} className={`block whitespace-pre px-3 ${diffStil[z.art]}`}>
                    {z.text}
                  </code>
                ))}
              </pre>
            ) : null}

            {entscheidung === 'offen' ? (
              <div className="flex items-center gap-2">
                <Button variante="sekundaer" onClick={() => setDiffOffen((o) => !o)}>
                  <Eye size={16} />
                  {diffOffen ? de.ki.ausblenden : de.ki.ansehen}
                </Button>
                <Button onClick={() => setEntscheidung('uebernommen')}>
                  <Check size={16} />
                  {de.ki.uebernehmen}
                </Button>
                <Button variante="ghost" onClick={() => setEntscheidung('abgelehnt')}>
                  <X size={16} />
                  {de.ki.ablehnen}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-nx-muted">
                {entscheidung === 'uebernommen' ? de.ki.uebernommenDemo : de.ki.abgelehnt}
              </p>
            )}

            <p className="text-xs text-nx-muted">{de.ki.freigabe}</p>
          </div>
        </div>

        {nachrichten.map((n) => (
          <div key={n.id} className="grid gap-2">
            <Sprecher rolle={n.rolle} />
            <p className={`text-sm ${n.rolle === 'ki' ? 'text-nx-muted' : ''}`}>{n.text}</p>
          </div>
        ))}
      </Card>

      <form onSubmit={senden} className="flex items-center gap-2">
        <Input
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          placeholder={de.ki.eingabe}
          aria-label={de.ki.eingabe}
        />
        <Button type="submit">
          <Send size={16} />
          {de.ki.senden}
        </Button>
      </form>
    </div>
  )
}