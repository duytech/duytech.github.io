import { Routes, Route } from 'react-router'
import { Header } from './components/Header.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LoanPage } from './pages/LoanPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { SalaryPage } from './pages/SalaryPage.tsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/salary-calculator" element={<SalaryPage />} />
          <Route path="/loan-calculator" element={<LoanPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
