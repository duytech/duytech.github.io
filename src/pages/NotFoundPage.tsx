import { Link } from 'react-router'
import { useText } from '../i18n.ts'

// GitHub Pages serves 404.html (a copy of index.html) for unknown paths, so this catch-all renders for them.
export function NotFoundPage() {
  const text = useText()
  return (
    <>
      <h1>{text.notFoundTitle}</h1>
      <Link to="/">{text.backHome}</Link>
    </>
  )
}
