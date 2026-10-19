export type ProjektTyp = 'Spiel' | 'Webseite' | 'App' | 'Experiment'
export type ProjektStatus = 'Aktiv' | 'Pausiert' | 'Abgeschlossen'

export type Projekt = {
  id: string
  name: string
  typ: ProjektTyp
  beschreibung: string
  technologien: string[]
  status: ProjektStatus
  letzteAktivitaet: string
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
  },
  {
    id: 'portfolio-seite',
    name: 'Portfolio-Seite',
    typ: 'Webseite',
    beschreibung: 'Persönliche Webseite mit Projektübersicht und Kontaktformular.',
    technologien: ['React', 'TypeScript', 'Tailwind'],
    status: 'Aktiv',
    letzteAktivitaet: 'gestern',
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    typ: 'App',
    beschreibung: 'Kleine App, um tägliche Gewohnheiten abzuhaken.',
    technologien: ['React', 'localStorage'],
    status: 'Pausiert',
    letzteAktivitaet: 'vor 5 Tagen',
  },
  {
    id: 'shader-labor',
    name: 'Shader-Labor',
    typ: 'Experiment',
    beschreibung: 'Sammlung kleiner Shader-Versuche für Effekte im Spiel.',
    technologien: ['Godot', 'GLSL'],
    status: 'Aktiv',
    letzteAktivitaet: 'vor 1 Woche',
  },
  {
    id: 'text-adventure',
    name: 'Text-Adventure',
    typ: 'Spiel',
    beschreibung: 'Kurzes Abenteuer, das komplett im Browser läuft.',
    technologien: ['TypeScript'],
    status: 'Abgeschlossen',
    letzteAktivitaet: 'vor 3 Wochen',
  },
]