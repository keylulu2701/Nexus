import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus, Trash2 } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import { notizAendern, notizAnlegen, notizLoeschen, useNotizen } from '../data/notizen'
import type { Notiz } from '../data/notizen'
import { useIdeen, useProjekte } from '../data/speicher'
import { vorZeit } from '../data/zeit'
import { de } from '../i18n/de'

const feld =
  'w-full rounded-md border border-nx-line bg-nx-bg px-3 py-2 text-sm text-nx-text placeholder:text-nx-muted hover:border-nx-text/25'

const auswahl =
  'h-9 w-full rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25'

function NotizEditor({ notiz, onGeloescht }: { notiz: Notiz; onGeloescht: () => void }) {
  const projekte = useProjekte()
  const ideen = useIdeen()
  const [tags, setTags] = useState(notiz.tags.join(', '))
  const projekt = projekte.find((p) => p.id === notiz.projektId)

  function tagsSpeichern() {
    notizAendern(notiz.id, {
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  function loeschen() {
    if (window.confirm(de.wissen.loeschenFrage(notiz.titel || de.wissen.ohneTitel))) {
      notizLoeschen(notiz.id)
      onGeloescht()
    }
  }

  return (
    <Card className="grid gap-4">
      <label className="grid gap-2 text-sm text-nx-muted">
        {de.wissen.titel}
        <Input value={notiz.titel} onChange={(e) => notizAendern(notiz.id, { titel: e.target.value })} />
      </label>

      <label className="grid gap-2 text-sm text-nx-muted">
        {de.wissen.inhalt}
        <textarea
          value={notiz.inhalt}
          onChange={(e) => notizAendern(notiz.id, { inhalt: e.target.value })}
          rows={12}
          className={`${feld} resize-y`}
        />
      </label>

      <label className="grid gap-2 text-sm text-nx-muted">
        {de.wissen.tags}
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onBlur={tagsSpeichern}
          placeholder={de.wissen.tagsHinweis}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="grid gap-2 text-sm text-nx-muted">
          {de.wissen.projekt}
          <select
            value={notiz.projektId ?? ''}
            onChange={(e) => notizAendern(notiz.id, { projektId: e.target.value || undefined })}
            className={auswahl}
          >
            <option value="">{de.wissen.keine}</option>
            {projekte.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-nx-muted">
          {de.wissen.idee}
          <select
            value={notiz.ideeId ?? ''}
            onChange={(e) => notizAendern(notiz.id, { ideeId: e.target.value || undefined })}
            className={auswahl}
          >
            <option value="">{de.wissen.keine}</option>
            {ideen.map((i) => (
              <option key={i.id} value={i.id}>
                {i.titel}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-xs text-nx-muted">
          {projekt ? (
            <Link to={`/projekte/${projekt.id}`} className="text-nx-cyan hover:underline">
              {projekt.name}
            </Link>
          ) : null}
          <span className="ml-2">
            {de.wissen.geaendert}: {vorZeit(notiz.geaendertAm)}
          </span>
        </div>
        <Button variante="ghost" onClick={loeschen}>
          <Trash2 size={16} />
          {de.wissen.loeschen}
        </Button>
      </div>
    </Card>
  )
}

export function Wissen() {
  const notizen = useNotizen()
  const [suche, setSuche] = useState('')
  const [gewaehlt, setGewaehlt] = useState<string | null>(null)

  const begriff = suche.trim().toLowerCase()
  const treffer = [...notizen]
    .sort((a, b) => b.geaendertAm - a.geaendertAm)
    .filter(
      (n) =>
        begriff === '' ||
        n.titel.toLowerCase().includes(begriff) ||
        n.inhalt.toLowerCase().includes(begriff) ||
        n.tags.some((t) => t.toLowerCase().includes(begriff)),
    )
  const aktiv = notizen.find((n) => n.id === gewaehlt)

  function neu() {
    setSuche('')
    setGewaehlt(notizAnlegen())
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        titel={de.nav.wissen.titel}
        raum={de.nav.wissen.raum}
        aktion={
          <Button onClick={neu}>
            <Plus size={16} />
            {de.wissen.neu}
          </Button>
        }
      />

      {notizen.length === 0 ? (
        <Card className="grid justify-items-start gap-3">
          <BookOpen size={16} className="text-nx-muted" />
          <div>
            <p className="text-sm font-medium">{de.wissen.leerTitel}</p>
            <p className="mt-1 text-sm text-nx-muted">{de.wissen.leerText}</p>
          </div>
          <Button onClick={neu}>
            <Plus size={16} />
            {de.wissen.neu}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="grid content-start gap-3">
            <Input
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder={de.wissen.suchen}
              aria-label={de.wissen.suchen}
            />
            {treffer.length === 0 ? (
              <p className="text-sm text-nx-muted">{de.wissen.keineTreffer}</p>
            ) : (
              <ul className="grid gap-2">
                {treffer.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setGewaehlt(n.id)}
                      aria-pressed={n.id === gewaehlt}
                      className={`grid w-full gap-2 rounded-lg border p-3 text-left transition-colors ${
                        n.id === gewaehlt
                          ? 'border-nx-violet/60 bg-nx-violet/10'
                          : 'border-nx-line bg-nx-panel hover:border-nx-text/25'
                      }`}
                    >
                      <span className="truncate text-sm font-medium">
                        {n.titel || de.wissen.ohneTitel}
                      </span>
                      <span className="truncate text-xs text-nx-muted">
                        {n.inhalt || '–'}
                      </span>
                      {n.tags.length > 0 ? (
                        <span className="flex flex-wrap gap-1">
                          {n.tags.map((t) => (
                            <Badge key={t} farbe="cyan">
                              {t}
                            </Badge>
                          ))}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-2">
            {aktiv ? (
              <NotizEditor key={aktiv.id} notiz={aktiv} onGeloescht={() => setGewaehlt(null)} />
            ) : (
              <Card>
                <p className="text-sm text-nx-muted">{de.wissen.keineAuswahl}</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}