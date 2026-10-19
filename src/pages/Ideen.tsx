import { PageHeader } from '../components/PageHeader'
import { de } from '../i18n/de'

export function Ideen() {
  return (
    <div>
      <PageHeader titel={de.nav.ideen.titel} raum={de.nav.ideen.raum} />
      <p className="mt-6 text-sm text-nx-muted">{de.platzhalter.seiteInArbeit}</p>
    </div>
  )
}
