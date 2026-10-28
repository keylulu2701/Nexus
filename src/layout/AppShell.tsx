import { useCallback, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { RueckgaengigLeiste } from '../components/RueckgaengigLeiste'
import { Header } from './Header'
import { KommandoPalette } from './KommandoPalette'
import { Sidebar } from './Sidebar'
import { useTastenkuerzel } from './useTastenkuerzel'

function sektorVon(pfad: string) {
  if (pfad.startsWith('/projekte')) return 'projekte'
  if (pfad.startsWith('/ki')) return 'ki'
  if (pfad.startsWith('/ideen')) return 'ideen'
  if (pfad.startsWith('/wissen')) return 'wissen'
  if (pfad.startsWith('/einstellungen')) return 'einstellungen'
  return 'uebersicht'
}

export function AppShell() {
  const [paletteOffen, setPaletteOffen] = useState(false)
  const umschalten = useCallback(() => setPaletteOffen((o) => !o), [])
  const { pathname } = useLocation()

  useTastenkuerzel(umschalten)

  return (
    <div data-sektor={sektorVon(pathname)} className="relative isolate flex h-screen">
      <div aria-hidden className="nx-nebel pointer-events-none absolute inset-0 -z-10" />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onSuchen={() => setPaletteOffen(true)} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
      <KommandoPalette offen={paletteOffen} onSchliessen={() => setPaletteOffen(false)} />
      <RueckgaengigLeiste />
    </div>
  )
}