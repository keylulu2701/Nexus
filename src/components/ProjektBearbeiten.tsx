import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { projektBearbeiten, typen } from '../data/speicher'
import type { Projekt, ProjektTyp } from '../data/speicher'
import { bearbeitenTexte as t } from '../i18n/bearbeiten'

const fokus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nx-violet'

const auswahl = `h-9 rounded-md border border-nx-line bg-nx-bg px-3 text-sm text-nx-text [color-scheme:dark] hover:border-nx-text/25 ${fokus}`

const textbereich = `min-h-24 w-full resize-y rounded-md border border-nx-line bg-nx-bg px-3 py-2 text-sm text-nx-text placeholder:text-nx-muted hover:border-nx-text/25 ${fokus}`

export function ProjektBearbeiten({
  projekt,
  onFertig,
}: {
  projekt: Projekt
  onFertig: () => void
}) {
  const [name, setName] = useState(projekt.name)
  const [typ, setTyp] = useState<ProjektTyp>(projekt.typ)
  const [beschreibung, setBeschreibung] = useState(projekt.beschreibung)
  const [technologien, setTechnologien] = useState(projekt.technologien.join(', '))

  function speichern(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (n === '') return
    const liste = Array.from(
      new Set(
        technologien
          .split(',')
          .map((x) => x.trim())
          .filter((x) => x !== ''),
      ),
    )
    projektBearbeiten(projekt.id, {
      name: n,
      typ,
      beschreibung: beschreibung.trim(),
      technologien: liste,
    })
    onFertig()
  }

  function taste(e: KeyboardEvent) {
    if (e.key === 'Escape') onFertig()
  }

  return (
    <Card className="grid content-start gap-4">
      <h2 className="text-sm font-semibold">{t.titel}</h2>
      <form onSubmit={speichern} onKeyDown={taste} className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-xs text-nx-muted">{t.name}</span>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label={t.name}
            autoFocus
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-nx-muted">{t.typ}</span>
          <select
            value={typ}
            onChange={(e) => setTyp(e.target.value as ProjektTyp)}
            aria-label={t.typ}
            className={auswahl}
          >
            {typen.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-nx-muted">{t.beschreibung}</span>
          <textarea
            value={beschreibung}
            onChange={(e) => setBeschreibung(e.target.value)}
            aria-label={t.beschreibung}
            className={textbereich}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-nx-muted">{t.technologien}</span>
          <Input
            value={technologien}
            onChange={(e) => setTechnologien(e.target.value)}
            aria-label={t.technologien}
          />
          <span className="text-xs text-nx-muted">{t.technologienHinweis}</span>
        </label>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={name.trim() === ''}>
            {t.speichern}
          </Button>
          <Button type="button" variante="ghost" onClick={onFertig}>
            {t.abbrechen}
          </Button>
        </div>
      </form>
    </Card>
  )
}