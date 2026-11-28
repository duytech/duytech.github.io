import { useId, useState } from 'react'
import { MoneyField } from '../components/MoneyField.tsx'
import { ResultRow } from '../components/ResultRow.tsx'
import { calculateCagr } from '../cagr.ts'
import { useText } from '../i18n.ts'

export function CagrPage() {
  const text = useText()
  const yearsId = useId()
  const [startValue, setStartValue] = useState<number | undefined>()
  const [endValue, setEndValue] = useState<number | undefined>()
  const [years, setYears] = useState('')

  const percent = new Intl.NumberFormat(text.locale, { style: 'percent', maximumFractionDigits: 2 })
  const period = Number(years)
  const valid = startValue && endValue !== undefined && years !== '' && period > 0
  const result = valid ? calculateCagr(startValue, endValue, period) : undefined

  return (
    <>
      <h1>{text.cagrTitle}</h1>

      <form className="salary-form" onSubmit={(e) => e.preventDefault()}>
        <MoneyField label={text.startValueLabel} value={startValue} onChange={setStartValue} locale={text.locale} />
        <MoneyField label={text.endValueLabel} value={endValue} onChange={setEndValue} locale={text.locale} />
        <div className="field">
          <label htmlFor={yearsId}>{text.yearsLabel}</label>
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
                <ResultRow label={text.totalGrowth} value={percent.format(result.totalGrowth)} />
                <ResultRow label={text.cagrResult} value={percent.format(result.cagr)} total />
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <p className="hint">{text.enterCagr}</p>
      )}
    </>
  )
}
