import { useSyncExternalStore } from 'react'
import { tageSeit } from './zeit'

export type ProjektTyp = 'Spiel' | 'Webseite' | 'App' | 'Experiment'
export type ProjektStatus = 'Aktiv' | 'Pausiert' | 'Abgeschlossen'

export const typen: ProjektTyp[] = ['Spiel', 'Webseite', 'App', 'Experiment']
export const stati: ProjektStatus[] = ['Aktiv', 'Pausiert', 'Abgeschlossen']
export const statusFarbe: Record<ProjektStatus, 'green' | 'neutral' | 'cyan'> = {
  Aktiv: 'green',
  Pausiert: 'neutral',
  Abgeschlossen: 'cyan',
}

export const ideenPrioritaeten = ['Hoch', 'Mittel', 'Niedrig'] as const
export const ideenStati = ['Offen', 'In Arbeit', 'Erledigt'] as const
export type IdeePrioritaet = (typeof ideenPrioritaeten)[number]
export type IdeeStatus = (typeof ideenStati)[number]

export type Aufgabe = {
  id: string
  text: string
  erledigt: boolean
  erstelltAm: number
  erledigtAm?: number
}

export type Projekt = {
  id: string
  name: string
  typ: ProjektTyp
  beschreibung: string
  technologien: string[]
  status: ProjektStatus
  erstelltAm: number
  geaendertAm: number
  aufgaben: Aufgabe[]
}

export type Idee = {
  id: string
  titel: string
  tag: string
  prioritaet: IdeePrioritaet
  status: IdeeStatus
  erstelltAm: number
}

export type Ereignis = { id: string; text: string; zeit: number }
export type Hinweis = { id: string; text: string }

function erstelleStore<T extends unknown[]>(key: string, leer: T) {
  let cache: T | undefined
  const hoerer = new Set<() => void>()

  function lesen(): T {
    if (cache === undefined) {
      try {
        const roh = localStorage.getItem(key)
        const daten: unknown = roh ? JSON.parse(roh) : null
        cache = Array.isArray(daten) ? (daten as T) : leer
      } catch {
        cache = leer
      }
    }
    return cache as T
  }

  function schreiben(neu: T) {
    cache = neu
    try {
      localStorage.setItem(key, JSON.stringify(neu))
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

  return { lesen, schreiben, abonnieren }
}

const projektStore = erstelleStore<Projekt[]>('nexus.projekte.v1', [])
const ideenStore = erstelleStore<Idee[]>('nexus.ideen.v2', [])
const ereignisStore = erstelleStore<Ereignis[]>('nexus.ereignisse.v1', [])

export const useProjekte = () =>
  useSyncExternalStore(projektStore.abonnieren, projektStore.lesen)
export const useIdeen = () => useSyncExternalStore(ideenStore.abonnieren, ideenStore.lesen)
export const useEreignisse = () =>
  useSyncExternalStore(ereignisStore.abonnieren, ereignisStore.lesen)

const neueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

function protokoll(text: string) {
  const alt = ereignisStore.lesen()
  ereignisStore.schreiben([{ id: neueId(), text, zeit: Date.now() }, ...alt].slice(0, 50))
}

function projektAendern(id: string, f: (p: Projekt) => Projekt) {
  projektStore.schreiben(
    projektStore.lesen().map((p) => (p.id === id ? { ...f(p), geaendertAm: Date.now() } : p)),
  )
}

export function projektAnlegen(eingabe: {
  name: string
  typ: ProjektTyp
  beschreibung: string
  technologien: string[]
}): string {
  const jetzt = Date.now()
  const p: Projekt = {
    id: neueId(),
    ...eingabe,
    status: 'Aktiv',
    erstelltAm: jetzt,
    geaendertAm: jetzt,
    aufgaben: [],
  }
  projektStore.schreiben([p, ...projektStore.lesen()])
  protokoll(`Projekt „${p.name}“ angelegt`)
  return p.id
}

export function projektStatusSetzen(id: string, status: ProjektStatus) {
  const p = projektStore.lesen().find((x) => x.id === id)
  if (!p || p.status === status) return
  projektAendern(id, (x) => ({ ...x, status }))
  protokoll(`${p.name}: Status auf „${status}“ gesetzt`)
}

export function projektLoeschen(id: string) {
  const p = projektStore.lesen().find((x) => x.id === id)
  if (!p) return
  projektStore.schreiben(projektStore.lesen().filter((x) => x.id !== id))
  protokoll(`Projekt „${p.name}“ gelöscht`)
}

export function aufgabeHinzufuegen(projektId: string, text: string) {
  const p = projektStore.lesen().find((x) => x.id === projektId)
  if (!p) return
  const a: Aufgabe = { id: neueId(), text, erledigt: false, erstelltAm: Date.now() }
  projektAendern(projektId, (x) => ({ ...x, aufgaben: [...x.aufgaben, a] }))
  protokoll(`${p.name}: Aufgabe „${text}“ hinzugefügt`)
}

export function aufgabeUmschalten(projektId: string, aufgabeId: string) {
  const p = projektStore.lesen().find((x) => x.id === projektId)
  const a = p?.aufgaben.find((x) => x.id === aufgabeId)
  if (!p || !a) return
  const jetztErledigt = !a.erledigt
  projektAendern(projektId, (x) => ({
    ...x,
    aufgaben: x.aufgaben.map((t) =>
      t.id === aufgabeId
        ? { ...t, erledigt: jetztErledigt, erledigtAm: jetztErledigt ? Date.now() : undefined }
        : t,
    ),
  }))
  if (jetztErledigt) protokoll(`${p.name}: Aufgabe „${a.text}“ erledigt`)
}

export function aufgabeLoeschen(projektId: string, aufgabeId: string) {
  projektAendern(projektId, (x) => ({
    ...x,
    aufgaben: x.aufgaben.filter((t) => t.id !== aufgabeId),
  }))
}

export function ideeAnlegen(eingabe: { titel: string; tag: string; prioritaet: IdeePrioritaet }) {
  const i: Idee = { id: neueId(), ...eingabe, status: 'Offen', erstelltAm: Date.now() }
  ideenStore.schreiben([i, ...ideenStore.lesen()])
  protokoll(`Neue Idee erfasst: „${i.titel}“`)
}

export function ideeStatusWechseln(id: string) {
  const i = ideenStore.lesen().find((x) => x.id === id)
  if (!i) return
  const neu = ideenStati[(ideenStati.indexOf(i.status) + 1) % ideenStati.length]
  ideenStore.schreiben(ideenStore.lesen().map((x) => (x.id === id ? { ...x, status: neu } : x)))
  if (neu === 'Erledigt') protokoll(`Idee „${i.titel}“ erledigt`)
}

export function ideeLoeschen(id: string) {
  ideenStore.schreiben(ideenStore.lesen().filter((x) => x.id !== id))
}

export function berechneHinweise(projekte: Projekt[], ideen: Idee[]): Hinweis[] {
  const h: Hinweis[] = []
  for (const p of projekte) {
    if (p.status === 'Aktiv') {
      if (p.aufgaben.length === 0) {
        h.push({ id: `${p.id}-leer`, text: `${p.name}: Es gibt noch keine Aufgabenliste.` })
      } else if (p.aufgaben.every((a) => a.erledigt)) {
        h.push({
          id: `${p.id}-fertig`,
          text: `${p.name}: Alle Aufgaben sind erledigt. Zeit, das Projekt abzuschließen?`,
        })
      }
      const tage = tageSeit(p.geaendertAm)
      if (tage >= 7) {
        h.push({ id: `${p.id}-ruhe`, text: `${p.name}: Seit ${tage} Tagen keine Änderung.` })
      }
    }
    if (p.status === 'Pausiert') {
      h.push({ id: `${p.id}-pause`, text: `${p.name} ist pausiert.` })
    }
  }
  const hoch = ideen.filter((i) => i.prioritaet === 'Hoch' && i.status !== 'Erledigt').length
  if (hoch > 0) {
    h.push({
      id: 'ideen-hoch',
      text: hoch === 1 ? '1 Idee mit hoher Priorität ist noch offen.' : `${hoch} Ideen mit hoher Priorität sind noch offen.`,
    })
  }
  return h.slice(0, 5)
}