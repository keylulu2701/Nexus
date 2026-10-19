export type ProjektTyp = 'Spiel' | 'Webseite' | 'App' | 'Experiment'
export type ProjektStatus = 'Aktiv' | 'Pausiert' | 'Abgeschlossen'

export type Aufgabe = { id: string; text: string; erledigt: boolean }

export type Projekt = {
  id: string
  name: string
  typ: ProjektTyp
  beschreibung: string
  technologien: string[]
  status: ProjektStatus
  letzteAktivitaet: string
  aufgaben: Aufgabe[]
}

export const typen: ProjektTyp[] = ['Spiel', 'Webseite', 'App', 'Experiment']
export const stati: ProjektStatus[] = ['Aktiv', 'Pausiert', 'Abgeschlossen']

export const statusFarbe: Record<ProjektStatus, 'green' | 'neutral' | 'cyan'> = {
  Aktiv: 'green',
  Pausiert: 'neutral',
  Abgeschlossen: 'cyan',
}

// MOCK: Beispielprojekte, keine echten Daten
export const projekte: Projekt[] = [
  {
    id: 'dungeon-runner',
    name: 'Dungeon Runner',
    typ: 'Spiel',
    beschreibung: '2D-Roguelike mit zufälligen Räumen und einfachem Kampfsystem.',
    technologien: ['Godot', 'GDScript'],
    status: 'Aktiv',
    letzteAktivitaet: 'vor 2 Stunden',
    aufgaben: [
      { id: 't1', text: 'Raumgenerierung bauen', erledigt: true },
      { id: 't2', text: 'Gegner-Spawn', erledigt: true },
      { id: 't3', text: 'Kampfsystem verbessern', erledigt: false },
      { id: 't4', text: 'Speicherstand', erledigt: false },
    ],
  },
  {
    id: 'portfolio-seite',
    name: 'Portfolio-Seite',
    typ: 'Webseite',
    beschreibung: 'Persönliche Webseite mit Projektübersicht und Kontaktformular.',
    technologien: ['React', 'TypeScript', 'Tailwind'],
    status: 'Aktiv',
    letzteAktivitaet: 'gestern',
    aufgaben: [
      { id: 't1', text: 'Startseite gestalten', erledigt: true },
      { id: 't2', text: 'Kontaktformular', erledigt: false },
    ],
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    typ: 'App',
    beschreibung: 'Kleine App, um tägliche Gewohnheiten abzuhaken.',
    technologien: ['React', 'localStorage'],
    status: 'Pausiert',
    letzteAktivitaet: 'vor 5 Tagen',
    aufgaben: [
      { id: 't1', text: 'Gewohnheiten anlegen', erledigt: true },
      { id: 't2', text: 'Wochenansicht', erledigt: false },
    ],
  },
  {
    id: 'shader-labor',
    name: 'Shader-Labor',
    typ: 'Experiment',
    beschreibung: 'Sammlung kleiner Shader-Versuche für Effekte im Spiel.',
    technologien: ['Godot', 'GLSL'],
    status: 'Aktiv',
    letzteAktivitaet: 'vor 1 Woche',
    aufgaben: [],
  },
  {
    id: 'text-adventure',
    name: 'Text-Adventure',
    typ: 'Spiel',
    beschreibung: 'Kurzes Abenteuer, das komplett im Browser läuft.',
    technologien: ['TypeScript'],
    status: 'Abgeschlossen',
    letzteAktivitaet: 'vor 3 Wochen',
    aufgaben: [
      { id: 't1', text: 'Geschichte schreiben', erledigt: true },
      { id: 't2', text: 'Veröffentlichen', erledigt: true },
    ],
  },
]