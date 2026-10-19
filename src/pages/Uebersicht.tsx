import { PageHeader } from '../components/PageHeader'
import { de } from '../i18n/de'

export function Uebersicht() {
  return (
    <div>
      <PageHeader titel={de.nav.uebersicht.titel} raum={de.nav.uebersicht.raum} />
      <p className="mt-6 text-sm text-nx-muted">{de.platzhalter.seiteInArbeit}</p>
    </div>
  )
}
