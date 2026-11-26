import { NavLink } from 'react-router'
import { useT } from '../i18n.ts'
import { LanguageSwitcher } from './LanguageSwitcher.tsx'

export function Header() {
  const t = useT()
  return (
    <header className="site-header">
      <nav className="site-nav">
        <NavLink to="/" end>
          {t.navHome}
        </NavLink>
        <NavLink to="/salary-calculator">{t.navSalary}</NavLink>
      </nav>
      <LanguageSwitcher />
    </header>
  )
}
