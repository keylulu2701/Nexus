import { PageHeader } from '../components/PageHeader'
import { de } from '../i18n/de'

export function KiArbeitsbereich() {
  return (
    <div>
      <PageHeader titel={de.nav.ki.titel} raum={de.nav.ki.raum} />
      <p className="mt-6 text-sm text-nx-muted">{de.platzhalter.seiteInArbeit}</p>
    </div>
  )
}
