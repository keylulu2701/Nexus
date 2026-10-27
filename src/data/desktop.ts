export type OrdnerEintrag = {
  name: string
  istOrdner: boolean
  groesse: number
  geaendert: number
}

export type OrdnerInfo = {
  name: string
  pfad: string
  eintraege: OrdnerEintrag[]
  anzahlGesamt: number
  istGodot: boolean
  hatPackageJson: boolean
  hatGit: boolean
}

export type OrdnerErkennung = {
  name: string
  typ: string
  beschreibung: string
  technologien: string[]
}

export type GitInfo = {
  branch: string
  geaendert: number
  sauber: boolean
}

export type AppInfo = {
  version: string
  installiert: boolean
}

export type UpdateStatus =
  | { status: 'leer' }
  | { status: 'nurInstalliert' }
  | { status: 'sucht' }
  | { status: 'aktuell' }
  | { status: 'laedt'; version?: string; prozent?: number }
  | { status: 'bereit'; version: string }
  | { status: 'fehler' }

type Fehler = { fehler: string }

type NexusDesktop = {
  ordnerWaehlen: () => Promise<string | null>
  ordnerLesen: (pfad: string) => Promise<OrdnerInfo | Fehler>
  ordnerErkennen: (pfad: string) => Promise<OrdnerErkennung | Fehler>
  gitStatus: (pfad: string) => Promise<GitInfo | Fehler>
  imExplorerOeffnen: (pfad: string) => Promise<{ ok: true } | Fehler>
  inVSCodeOeffnen: (pfad: string) => Promise<{ ok: true } | Fehler>
  appInfo: () => Promise<AppInfo>
  updateStatus: () => Promise<UpdateStatus>
  updatePruefen: () => Promise<void>
  updateInstallieren: () => Promise<void>
  beiUpdateStatus: (rueckruf: (status: UpdateStatus) => void) => () => void
}

declare global {
  interface Window {
    nexusDesktop?: NexusDesktop
  }
}

// Im Browser gibt es die Brücke nicht, nur in der Desktop-App.
export const desktop: NexusDesktop | null =
  typeof window !== 'undefined' && window.nexusDesktop ? window.nexusDesktop : null

export const istDesktopApp = desktop !== null

export function istFehler<T extends object>(wert: T | Fehler): wert is Fehler {
  return 'fehler' in wert
}