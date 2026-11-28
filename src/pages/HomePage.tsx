import { Link } from 'react-router'
import { useT } from '../i18n.ts'

export function HomePage() {
  const t = useT()
  return (
    <>
      <h1>{t.homeTitle}</h1>
      <p>{t.homeIntro}</p>
      <h2>{t.toolsHeading}</h2>
      <ul>
        <li>
          <Link to="/salary-calculator">{t.navSalary}</Link>: {t.salaryToolDesc}
        </li>
        <li>
          <Link to="/loan-calculator">{t.navLoan}</Link>: {t.loanToolDesc}
        </li>
      </ul>
    </>
  )
}
