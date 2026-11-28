import type { ComponentType } from 'react'
import { useLang, useText, type Lang } from '../i18n.ts'
import { UsFlag, VietnamFlag } from './Flags.tsx'

const LANGUAGES: { lang: Lang; label: string; Flag: ComponentType }[] = [
  // Labels stay in their own language so users can find theirs.
  { lang: 'vi', label: 'Tiếng Việt', Flag: VietnamFlag },
  { lang: 'en', label: 'English', Flag: UsFlag },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const text = useText()
  return (
    <div className="lang-switcher" role="group" aria-label={text.switchLanguage}>
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
