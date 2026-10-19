import { useSyncExternalStore } from 'react'

export type Notiz = {
  id: string
  titel: string
  inhalt: string
  tags: string[]
  projektId?: string
  ideeId?: string
  erstelltAm: number
  geaendertAm: number
}

const KEY = 'nexus.notizen.v1'
let cache: Notiz[] | undefined
const hoerer = new Set<() => void>()

function lesen(): Notiz[] {
  if (cache === undefined) {
    try {
      const roh = localStorage.getItem(KEY)
      const daten: unknown = roh ? JSON.parse(roh) : null
      cache = Array.isArray(daten) ? (daten as Notiz[]) : []
    } catch {
      cache = []
    }
  }
  return cache
}

function schreiben(neu: Notiz[]) {
  cache = neu
  try {
    localStorage.setItem(KEY, JSON.stringify(neu))
  } catch {
    // Speichern nicht möglich, egal
  }
  hoerer.forEach((h) => h())
}

function abonnieren(h: () => void) {
  hoerer.add(h)
  return () => {
    hoerer.delete(h)
  }
}

export const useNotizen = () => useSyncExternalStore(abonnieren, lesen)

export function notizAnlegen(): string {
  const jetzt = Date.now()
  const n: Notiz = {
    id: jetzt.toString(36) + Math.random().toString(36).slice(2, 7),
    titel: '',
    inhalt: '',
    tags: [],
    erstelltAm: jetzt,
    geaendertAm: jetzt,
  }
  schreiben([n, ...lesen()])
  return n.id
}

export function notizAendern(
  id: string,
  teil: Partial<Pick<Notiz, 'titel' | 'inhalt' | 'tags' | 'projektId' | 'ideeId'>>,
) {
  schreiben(lesen().map((n) => (n.id === id ? { ...n, ...teil, geaendertAm: Date.now() } : n)))
}

export function notizLoeschen(id: string) {
  schreiben(lesen().filter((n) => n.id !== id))
}