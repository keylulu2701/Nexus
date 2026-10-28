import { Search } from 'lucide-react'
import { de } from '../i18n/de'

export function Header({ onSuchen }: { onSuchen: () => void }) {
  return (
    <header className="nx-drag nx-kopf flex h-14 shrink-0 items-center justify-between gap-4 border-b border-nx-line bg-nx-bar pl-6">
      <p className="text-sm text-nx-muted">{de.app.workspace}</p>

      <button
        type="button"
        onClick={onSuchen}
        aria-label={de.shell.suchen}
        className="nx-no-drag flex h-8 w-80 items-center gap-2 rounded-md border border-nx-line bg-white/5 px-3 text-sm text-nx-muted transition-colors hover:border-nx-violet/40 hover:text-nx-text"
      >
        <Search size={16} className="shrink-0" />
        <span className="flex-1 text-left">{de.shell.suchen}</span>
        <span className="font-mono text-xs">{de.shell.suchenKuerzel}</span>
      </button>
    </header>
  )
}