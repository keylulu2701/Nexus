import { PageHeader } from '../components/PageHeader'
import { de } from '../i18n/de'

export function Einstellungen() {
  return (
    <div>
      <PageHeader titel={de.nav.einstellungen.titel} raum={de.nav.einstellungen.raum} />
      <p className="mt-6 text-sm text-nx-muted">{de.platzhalter.seiteInArbeit}</p>
    </div>
  )
}
