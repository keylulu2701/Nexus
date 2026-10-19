import { Plus } from 'lucide-react'
import { Badge } from './components/Badge'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { Input } from './components/Input'
import { StatusLabel } from './components/StatusLabel'

function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-xl font-semibold">NEXUS Designsystem</h1>
      <p className="mt-1 text-sm text-nx-muted">Basis-Bausteine</p>

      <div className="mt-6 grid max-w-2xl gap-4">
        <Card className="grid gap-3">
          <p className="text-xs text-nx-muted">Buttons</p>
          <div className="flex gap-3">
            <Button>
              <Plus size={16} />
              Neue Idee
            </Button>
            <Button variante="sekundaer">Sekundär</Button>
            <Button variante="ghost">Ghost</Button>
            <Button disabled>Deaktiviert</Button>
          </div>
        </Card>

        <Card className="grid gap-3">
          <p className="text-xs text-nx-muted">Badges</p>
          <div className="flex gap-2">
            <Badge>Neutral</Badge>
            <Badge farbe="violet">KI</Badge>
            <Badge farbe="cyan">GDScript</Badge>
            <Badge farbe="green">Aktiv</Badge>
          </div>
        </Card>

        <Card className="grid gap-3">
          <p className="text-xs text-nx-muted">Status-Labels</p>
          <div className="flex gap-2">
            <StatusLabel art="demo" />
            <StatusLabel art="nichtVerbunden" />
            <StatusLabel art="bald" />
          </div>
        </Card>

        <Card className="grid gap-3">
          <p className="text-xs text-nx-muted">Eingabefeld</p>
          <Input placeholder="Projekte durchsuchen" />
        </Card>
      </div>
    </div>
  )
}

export default App