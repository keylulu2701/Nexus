import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { RueckgaengigLeiste } from '../components/RueckgaengigLeiste'
import { Header } from './Header'
import { KommandoPalette } from './KommandoPalette'
import { Sidebar } from './Sidebar'
import { useTastenkuerzel } from './useTastenkuerzel'

export function AppShell() {
  const [paletteOffen, setPaletteOffen] = useState(false)
  const umschalten = useCallback(() => setPaletteOffen((o) => !o), [])

  useTastenkuerzel(umschalten)

  return (
    <div className="flex h-screen">
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