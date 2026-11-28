import { NavLink } from 'react-router'
import { useText } from '../i18n.ts'
import { LanguageSwitcher } from './LanguageSwitcher.tsx'

export function Header() {
  const text = useText()
  return (
    <header className="site-header">
      <nav className="site-nav">
        <NavLink to="/" end>
          {text.navHome}
        </NavLink>
        <NavLink to="/salary-calculator">{text.navSalary}</NavLink>
        <NavLink to="/loan-calculator">{text.navLoan}</NavLink>
        <NavLink to="/cagr-calculator">{text.navCagr}</NavLink>
      </nav>
      <LanguageSwitcher />
    </header>
  )
}
