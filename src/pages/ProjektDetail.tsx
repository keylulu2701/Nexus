import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Circle } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { StatusLabel } from '../components/StatusLabel'
import { projekte, statusFarbe } from '../data/projects'
import { de } from '../i18n/de'

const zurueck =
  'inline-flex items-center gap-2 rounded-sm text-sm text-nx-muted transition-colors hover:text-nx-text'

export function ProjektDetail() {
  const { id } = useParams()
  const projekt = projekte.find((p) => p.id === id)

  if (!projekt) {
    return (
      <div className="grid justify-items-start gap-4">
        <Link to="/projekte" className={zurueck}>
          <ArrowLeft size={16} />
          {de.projekte.zurueck}
        </Link>
        <p className="text-sm text-nx-muted">{de.projekte.nichtGefunden}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Link to="/projekte" className={`${zurueck} justify-self-start`}>
        <ArrowLeft size={16} />
        {de.projekte.zurueck}
      </Link>

      <PageHeader
        titel={projekt.name}
        raum={`${projekt.typ} · ${de.projekte.letzteAktivitaet}: ${projekt.letzteAktivitaet}`}
        aktion={
          <div className="flex items-center gap-2">
            <StatusLabel art="demo" />
            <Badge farbe={statusFarbe[projekt.status]}>{projekt.status}</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid content-start gap-6">
          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.projekte.beschreibung}</h2>
            <p className="text-sm text-nx-muted">{projekt.beschreibung}</p>
          </Card>

          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.projekte.aufgaben}</h2>
            {projekt.aufgaben.length === 0 ? (
              <p className="text-sm text-nx-muted">{de.projekte.keineAufgaben}</p>
            ) : (
              <ul className="grid gap-2">
                {projekt.aufgaben.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 text-sm">
                    {a.erledigt ? (
                      <Check size={16} className="shrink-0 text-nx-green" />
                    ) : (
                      <Circle size={16} className="shrink-0 text-nx-muted" />
                    )}
                    <span className={a.erledigt ? 'text-nx-muted line-through' : ''}>{a.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.projekte.technologien}</h2>
            <div className="flex flex-wrap gap-2">
              {projekt.technologien.map((t) => (
                <Badge key={t} farbe="cyan">
                  {t}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="grid gap-3">
            <h2 className="text-sm font-semibold">{de.projekte.gitStatus}</h2>
            <div className="flex items-center gap-2">
              <StatusLabel art="nichtVerbunden" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}