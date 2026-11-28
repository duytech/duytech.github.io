import { Link } from 'react-router'
import { useText } from '../i18n.ts'

export function HomePage() {
  const text = useText()
  return (
    <>
      <h1>{text.homeTitle}</h1>
      <p>{text.homeIntro}</p>
      <h2>{text.toolsHeading}</h2>
      <ul>
        <li>
          <Link to="/salary-calculator">{text.navSalary}</Link>: {text.salaryToolDesc}
        </li>
        <li>
          <Link to="/loan-calculator">{text.navLoan}</Link>: {text.loanToolDesc}
        </li>
        <li>
          <Link to="/cagr-calculator">{text.navCagr}</Link>: {text.cagrToolDesc}
        </li>
      </ul>
    </>
  )
}
