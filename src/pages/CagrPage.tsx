import { useId, useState } from 'react'
import { MoneyField } from '../components/MoneyField.tsx'
import { ResultRow } from '../components/ResultRow.tsx'
import { calculateCagr } from '../cagr.ts'
import { useText } from '../i18n.ts'

export function CagrPage() {
  const text = useText()
  const periodsId = useId()
  const [startValue, setStartValue] = useState<number | undefined>()
  const [endValue, setEndValue] = useState<number | undefined>()
  const [periods, setPeriods] = useState('')

  const percent = new Intl.NumberFormat(text.locale, { style: 'percent', maximumFractionDigits: 2 })
  const periodCount = Number(periods)
  const valid = startValue && endValue !== undefined && periods !== '' && periodCount > 0
  const result = valid ? calculateCagr(startValue, endValue, periodCount) : undefined

  return (
    <>
      <h1>{text.cagrTitle}</h1>

      <form className="salary-form" onSubmit={(e) => e.preventDefault()}>
        <MoneyField label={text.startValueLabel} value={startValue} onChange={setStartValue} locale={text.locale} />
        <MoneyField label={text.endValueLabel} value={endValue} onChange={setEndValue} locale={text.locale} />
        <div className="field">
          <label htmlFor={periodsId}>{text.periodsLabel}</label>
          <input
            id={periodsId}
            type="number"
            inputMode="decimal"
            min={0.1}
            step="any"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            aria-describedby={`${periodsId}-hint`}
          />
          <small id={`${periodsId}-hint`} className="hint">
            {text.periodsHint}
          </small>
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
