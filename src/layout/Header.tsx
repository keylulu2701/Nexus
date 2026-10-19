import { Search } from 'lucide-react'
import { StatusLabel } from '../components/StatusLabel'
import { de } from '../i18n/de'

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-nx-line px-6">
      <p className="text-sm text-nx-muted">{de.app.workspace}</p>

      <button
        type="button"
        disabled
        aria-label={de.shell.suchen}
        className="flex h-8 w-80 items-center gap-2 rounded-md border border-nx-line bg-nx-panel px-3 text-sm text-nx-muted disabled:cursor-not-allowed"
      >
        <Search size={16} className="shrink-0" />
        <span className="flex-1 text-left">{de.shell.suchen}</span>
        <StatusLabel art="bald" />
      </button>
    </header>
  )
}