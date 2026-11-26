import type { ComponentType } from 'react'
import { Routes, Route, Link, NavLink } from 'react-router'
import { UsFlag, VietnamFlag } from './Flags.tsx'
import { useLang, useT, type Lang } from './i18n.ts'
import { SalaryPage } from './SalaryPage.tsx'

const LANGUAGES: { lang: Lang; label: string; Flag: ComponentType }[] = [
  // Labels stay in their own language so users can find theirs.
  { lang: 'vi', label: 'Tiếng Việt', Flag: VietnamFlag },
  { lang: 'en', label: 'English', Flag: UsFlag },
]

function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const t = useT()
  return (
    <div className="lang-switcher" role="group" aria-label={t.switchLanguage}>
      {LANGUAGES.map(({ lang: code, label, Flag }) => (
        <button
          key={code}
          type="button"
          className="flag-button"
          aria-label={label}
          title={label}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          <Flag />
        </button>
      ))}
    </div>
  )
}

function Header() {
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

function Home() {
  const t = useT()
  return (
    <>
      <h1>{t.homeTitle}</h1>
      <p>{t.homeIntro}</p>
    </>
  )
}

// GitHub Pages serves 404.html (a copy of index.html) for unknown paths, so this catch-all renders for them.
function NotFound() {
  const t = useT()
  return (
    <>
      <h1>{t.notFoundTitle}</h1>
      <Link to="/">{t.backHome}</Link>
    </>
  )
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/salary-calculator" element={<SalaryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
