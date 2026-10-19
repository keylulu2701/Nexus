export const de = {
  app: {
    name: 'NEXUS',
    workspace: 'Mein Workspace',
  },
  status: {
    demo: 'Demo',
    nichtVerbunden: 'Nicht verbunden',
    bald: 'Bald',
  },
  shell: {
    suchen: 'Suchen',
    suchenKuerzel: 'Strg K',
    seitenleisteEinklappen: 'Seitenleiste einklappen',
    seitenleisteAusklappen: 'Seitenleiste ausklappen',
    hauptnavigation: 'Hauptnavigation',
  },
  palette: {
    titel: 'Kommando-Palette',
    platzhalter: 'Seite suchen',
    keineTreffer: 'Keine Treffer',
    hinweis: 'Pfeiltasten wählen, Enter öffnet, Esc schließt',
  },
  kuerzel: {
    palette: { tasten: 'Strg K', text: 'Kommando-Palette öffnen' },
    uebersicht: { tasten: 'G dann U', text: 'Zur Übersicht' },
    projekte: { tasten: 'G dann P', text: 'Zu den Projekten' },
    ki: { tasten: 'G dann K', text: 'Zum KI-Arbeitsbereich' },
    ideen: { tasten: 'G dann I', text: 'Zu den Ideen' },
  },
  nav: {
    uebersicht: { titel: 'Übersicht', raum: 'Eingangshalle' },
    projekte: { titel: 'Projekte', raum: 'Werkstatt' },
    ki: { titel: 'KI-Arbeitsbereich', raum: 'Denkraum' },
    ideen: { titel: 'Ideen', raum: 'Labor' },
    wissen: { titel: 'Wissen', raum: 'Bibliothek' },
    suche: { titel: 'Suche', raum: '' },
    einstellungen: { titel: 'Einstellungen', raum: 'Technikraum' },
  },
  platzhalter: {
    seiteInArbeit: 'Diese Seite wird in einem der nächsten Schritte gebaut.',
  },
} as const