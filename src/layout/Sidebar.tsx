import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Logo } from '../components/Logo'
import { de } from '../i18n/de'

const SPEICHER_KEY = 'nexus.seitenleiste.eingeklappt'

type Akzent = 'violet' | 'cyan' | 'magenta' | 'blue'

const akzentIcon: Record<Akzent, string> = {
  violet: 'text-nx-violet',
  cyan: 'text-nx-cyan',
  magenta: 'text-nx-magenta',
  blue: 'text-nx-blue',
}

const akzentBalken: Record<Akzent, string> = {
  violet: 'bg-nx-violet',
  cyan: 'bg-nx-cyan',
  magenta: 'bg-nx-magenta',
  blue: 'bg-nx-blue',
}

type Eintrag = {
  pfad: string
  titel: string
  icon: LucideIcon
  akzent: Akzent
  ende?: boolean
}

const eintraege: Eintrag[] = [
  { pfad: '/', titel: de.nav.uebersicht.titel, icon: LayoutDashboard, akzent: 'violet', ende: true },
  { pfad: '/projekte', titel: de.nav.projekte.titel, icon: FolderKanban, akzent: 'violet' },
  { pfad: '/ki', titel: de.nav.ki.titel, icon: Sparkles, akzent: 'cyan' },
  { pfad: '/ideen', titel: de.nav.ideen.titel, icon: Lightbulb, akzent: 'magenta' },
  { pfad: '/wissen', titel: de.nav.wissen.titel, icon: BookOpen, akzent: 'blue' },
]

function ladeZustand(): boolean {
  try {
    return localStorage.getItem(SPEICHER_KEY) === '1'
  } catch {
    return false
  }
}

const basis = 'flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors'

function NavEintrag({
  eintrag,
  eingeklappt,
  klasse = '',
}: {
  eintrag: Eintrag
  eingeklappt: boolean
  klasse?: string
}) {
  const { pfad, titel, icon: Icon, akzent, ende } = eintrag
  return (
    <NavLink
      to={pfad}
      end={ende}
      title={eingeklappt ? titel : undefined}
      aria-label={titel}
      className={({ isActive }) =>
        `${basis} relative ${klasse} ${
          isActive ? 'nx-aktiv text-nx-text' : 'text-nx-muted hover:bg-white/5 hover:text-nx-text'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden
            className={`absolute bottom-2 left-0 top-2 w-0.5 rounded-full transition-opacity ${akzentBalken[akzent]} ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <Icon size={16} className={`shrink-0 ${isActive ? akzentIcon[akzent] : ''}`} />
          {eingeklappt ? null : <span className="truncate">{titel}</span>}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const [eingeklappt, setEingeklappt] = useState(ladeZustand)

  function umschalten() {
    setEingeklappt((alt) => {
      try {
        localStorage.setItem(SPEICHER_KEY, alt ? '0' : '1')
      } catch {
        // Speichern nicht möglich, egal
      }
      return !alt
    })
  }

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-nx-line bg-nx-bg/60 p-2 backdrop-blur-md transition-[width] ${
        eingeklappt ? 'w-14' : 'w-60'
      }`}
    >
      <div className="nx-drag flex h-10 items-center gap-3 px-2">
        <Logo groesse={26} />
        {eingeklappt ? null : (
          <span className="nx-titel font-mono text-sm font-semibold tracking-[0.2em]">
            {de.app.name}
          </span>
        )}
      </div>

      <nav aria-label={de.shell.hauptnavigation} className="mt-4 flex flex-1 flex-col gap-1">
        {eintraege.map((e) => (
          <NavEintrag key={e.pfad} eintrag={e} eingeklappt={eingeklappt} />
        ))}

        <NavEintrag
          eintrag={{
            pfad: '/einstellungen',
            titel: de.nav.einstellungen.titel,
            icon: Settings,
            akzent: 'violet',
          }}
          eingeklappt={eingeklappt}
          klasse="mt-auto"
        />
      </nav>

      <button
        type="button"
        onClick={umschalten}
        aria-label={eingeklappt ? de.shell.seitenleisteAusklappen : de.shell.seitenleisteEinklappen}
        title={eingeklappt ? de.shell.seitenleisteAusklappen : de.shell.seitenleisteEinklappen}
        className={`${basis} mt-2 text-nx-muted hover:bg-white/5 hover:text-nx-text`}
      >
        {eingeklappt ? (
          <PanelLeftOpen size={16} className="shrink-0" />
        ) : (
          <>
            <PanelLeftClose size={16} className="shrink-0" />
            <span className="truncate">{de.shell.seitenleisteEinklappen}</span>
          </>
        )}
      </button>
    </aside>
  )
}