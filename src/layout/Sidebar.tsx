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
import { StatusLabel } from '../components/StatusLabel'
import { de } from '../i18n/de'

const SPEICHER_KEY = 'nexus.seitenleiste.eingeklappt'

const eintraege: { pfad: string; titel: string; icon: LucideIcon; ende?: boolean }[] = [
  { pfad: '/', titel: de.nav.uebersicht.titel, icon: LayoutDashboard, ende: true },
  { pfad: '/projekte', titel: de.nav.projekte.titel, icon: FolderKanban },
  { pfad: '/ki', titel: de.nav.ki.titel, icon: Sparkles },
  { pfad: '/ideen', titel: de.nav.ideen.titel, icon: Lightbulb },
]

function ladeZustand(): boolean {
  try {
    return localStorage.getItem(SPEICHER_KEY) === '1'
  } catch {
    return false
  }
}

const basis =
  'flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors'

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

  function linkKlasse({ isActive }: { isActive: boolean }) {
    return `${basis} ${
      isActive
        ? 'bg-nx-violet/15 text-nx-text'
        : 'text-nx-muted hover:bg-nx-text/10 hover:text-nx-text'
    }`
  }

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-nx-line bg-nx-bg p-2 transition-[width] ${
        eingeklappt ? 'w-14' : 'w-60'
      }`}
    >
      <div className="flex h-10 items-center px-3">
        <span className="font-mono text-sm font-medium tracking-wide text-nx-violet">
          {eingeklappt ? 'N' : de.app.name}
        </span>
      </div>

      <nav aria-label={de.shell.hauptnavigation} className="mt-4 flex flex-1 flex-col gap-1">
        {eintraege.map(({ pfad, titel, icon: Icon, ende }) => (
          <NavLink
            key={pfad}
            to={pfad}
            end={ende}
            title={eingeklappt ? titel : undefined}
            aria-label={titel}
            className={linkKlasse}
          >
            <Icon size={16} className="shrink-0" />
            {eingeklappt ? null : <span className="truncate">{titel}</span>}
          </NavLink>
        ))}

        <div
          aria-disabled="true"
          title={eingeklappt ? `${de.nav.wissen.titel} (${de.status.bald})` : undefined}
          className={`${basis} cursor-not-allowed text-nx-muted/60`}
        >
          <BookOpen size={16} className="shrink-0" />
          {eingeklappt ? null : (
            <>
              <span className="flex-1 truncate">{de.nav.wissen.titel}</span>
              <StatusLabel art="bald" />
            </>
          )}
        </div>

        <NavLink
          to="/einstellungen"
          title={eingeklappt ? de.nav.einstellungen.titel : undefined}
          aria-label={de.nav.einstellungen.titel}
          className={(s) => `${linkKlasse(s)} mt-auto`}
        >
          <Settings size={16} className="shrink-0" />
          {eingeklappt ? null : <span className="truncate">{de.nav.einstellungen.titel}</span>}
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={umschalten}
        aria-label={eingeklappt ? de.shell.seitenleisteAusklappen : de.shell.seitenleisteEinklappen}
        title={eingeklappt ? de.shell.seitenleisteAusklappen : de.shell.seitenleisteEinklappen}
        className={`${basis} mt-2 text-nx-muted hover:bg-nx-text/10 hover:text-nx-text`}
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