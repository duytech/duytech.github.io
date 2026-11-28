import { useId, useState } from 'react'
import { MoneyField } from '../components/MoneyField.tsx'
import { ResultRow } from '../components/ResultRow.tsx'
import { calculateCagr } from '../cagr.ts'
import { useT } from '../i18n.ts'

export function CagrPage() {
  const t = useT()
  const yearsId = useId()
  const [startValue, setStartValue] = useState<number | undefined>()
  const [endValue, setEndValue] = useState<number | undefined>()
  const [years, setYears] = useState('')

  const percent = new Intl.NumberFormat(t.locale, { style: 'percent', maximumFractionDigits: 2 })
  const period = Number(years)
  const valid = startValue && endValue !== undefined && years !== '' && period > 0
  const result = valid ? calculateCagr(startValue, endValue, period) : undefined

  return (
    <>
      <h1>{t.cagrTitle}</h1>

      <form className="salary-form" onSubmit={(e) => e.preventDefault()}>
        <MoneyField label={t.startValueLabel} value={startValue} onChange={setStartValue} locale={t.locale} />
        <MoneyField label={t.endValueLabel} value={endValue} onChange={setEndValue} locale={t.locale} />
        <div className="field">
          <label htmlFor={yearsId}>{t.yearsLabel}</label>
          <input
            id={yearsId}
            type="number"
            inputMode="decimal"
            min={0.1}
            step="any"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
      </form>

      {result ? (
        <div className="salary-results" aria-live="polite">
          <section>
            <table>
              <tbody>
                <ResultRow label={t.totalGrowth} value={percent.format(result.totalGrowth)} />
                <ResultRow label={t.cagrResult} value={percent.format(result.cagr)} total />
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <p className="hint">{t.enterCagr}</p>
      )}
    </>
  )
}
