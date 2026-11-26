import { Link } from 'react-router'
import { useT } from '../i18n.ts'

// GitHub Pages serves 404.html (a copy of index.html) for unknown paths, so this catch-all renders for them.
export function NotFoundPage() {
  const t = useT()
  return (
    <>
      <h1>{t.notFoundTitle}</h1>
      <Link to="/">{t.backHome}</Link>
    </>
  )
}
