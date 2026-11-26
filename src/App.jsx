import { Routes, Route, Link } from 'react-router'

function Home() {
  return (
    <>
      <h1>Duy Pham homepage</h1>
      <p>Bookmark this to keep an eye on my project updates!</p>
    </>
  )
}

// GitHub Pages serves 404.html (a copy of index.html) for unknown paths, so this catch-all renders for them.
function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <Link to="/">Back to home</Link>
    </>
  )
}

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
