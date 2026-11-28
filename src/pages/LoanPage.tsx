import { useId, useState } from 'react'
import { MoneyField } from '../components/MoneyField.tsx'
import { ResultRow } from '../components/ResultRow.tsx'
import { useT } from '../i18n.ts'
import { calculateLoan, type LoanMethod } from '../loan.ts'

const METHODS: LoanMethod[] = ['reducing', 'annuity']
const MAX_MONTHS = 600

export function LoanPage() {
  const t = useT()
  const rateId = useId()
  const termId = useId()
  const methodId = useId()
  const [principal, setPrincipal] = useState<number | undefined>()
  const [rate, setRate] = useState('')
  const [months, setMonths] = useState('')
  const [method, setMethod] = useState<LoanMethod>('reducing')

  const money = new Intl.NumberFormat(t.locale, { style: 'currency', currency: 'VND' })
  const ratePercent = Number(rate)
  const term = Number(months)
  const valid = principal && rate !== '' && ratePercent >= 0 && Number.isInteger(term) && term >= 1
  const result = valid ? calculateLoan({ principal, annualRate: ratePercent / 100, months: term, method }) : undefined

  return (
    <>
      <h1>{t.loanTitle}</h1>

      <form className="salary-form" onSubmit={(e) => e.preventDefault()}>
        <MoneyField label={t.loanAmountLabel} value={principal} onChange={setPrincipal} locale={t.locale} />
        <div className="field">
          <label htmlFor={rateId}>{t.rateLabel}</label>
          <input
            id={rateId}
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={0.01}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={termId}>{t.termLabel}</label>
          <input
            id={termId}
            type="number"
            min={1}
            max={MAX_MONTHS}
            step={1}
            value={months}
            onChange={(e) =>
              setMonths(e.target.value === '' ? '' : String(Math.min(MAX_MONTHS, Math.max(1, Math.floor(Number(e.target.value) || 1)))))
            }
          />
        </div>
        <div className="field">
          <label htmlFor={methodId}>{t.methodLabel}</label>
          <select id={methodId} value={method} onChange={(e) => setMethod(e.target.value as LoanMethod)}>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {t.methodNames[m]}
              </option>
            ))}
          </select>
        </div>
      </form>

      {result ? (
        <div className="salary-results" aria-live="polite">
          <section>
            <table>
              <tbody>
                <ResultRow label={t.firstPayment} value={money.format(result.firstPayment)} />
                <ResultRow label={t.totalInterest} value={money.format(result.totalInterest)} />
                <ResultRow label={t.totalPayment} value={money.format(result.totalPayment)} total />
              </tbody>
            </table>
          </section>
          <section>
            <h2>{t.scheduleHeading}</h2>
            <div className="table-scroll">
              <table className="schedule">
                <thead>
                  <tr>
                    <th scope="col">{t.colMonth}</th>
                    <th scope="col">{t.colInterest}</th>
                    <th scope="col">{t.colPrincipal}</th>
                    <th scope="col">{t.colPayment}</th>
                    <th scope="col">{t.colBalance}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.month}>
                      <th scope="row">{row.month}</th>
                      <td>{money.format(row.interest)}</td>
                      <td>{money.format(row.principal)}</td>
                      <td>{money.format(row.payment)}</td>
                      <td>{money.format(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <p className="hint">{t.loanDisclaimer}</p>
        </div>
      ) : (
        <p className="hint">{t.enterLoan}</p>
      )}
    </>
  )
}
