export const updateTexte = {
  titel: 'Version und Updates',
  version: (v: string) => `NEXUS ${v}`,
  nurApp: 'Updates gibt es nur in der Desktop-App.',
  entwicklung: 'Entwicklungsmodus: Updates werden nur in der installierten App geprüft.',
  leer: 'Noch nicht geprüft.',
  sucht: 'Suche nach Updates …',
  aktuell: 'Du hast die neueste Version.',
  laedt: (v?: string, p?: number) =>
    `${v ? `Version ${v}` : 'Update'} wird geladen${p !== undefined ? ` (${p} %)` : ''} …`,
  bereit: (v: string) => `Version ${v} ist heruntergeladen und bereit.`,
  fehler: 'Update-Suche fehlgeschlagen. Prüfe deine Internetverbindung.',
  pruefen: 'Nach Updates suchen',
  neustart: 'Jetzt neu starten',
}