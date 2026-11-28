import { useId, useState } from 'react'
import { MoneyField } from '../components/MoneyField.tsx'
import { ResultRow } from '../components/ResultRow.tsx'
import { useText } from '../i18n.ts'
import { calculateLoan, type LoanMethod } from '../loan.ts'

const METHODS: LoanMethod[] = ['reducing', 'annuity']
const MAX_MONTHS = 600

export function LoanPage() {
  const text = useText()
  const rateId = useId()
  const termId = useId()
  const methodId = useId()
  const [principal, setPrincipal] = useState<number | undefined>()
  const [rate, setRate] = useState('')
  const [months, setMonths] = useState('')
  const [method, setMethod] = useState<LoanMethod>('reducing')

  const money = new Intl.NumberFormat(text.locale, { style: 'currency', currency: 'VND' })
  const ratePercent = Number(rate)
  const term = Number(months)
  const valid = principal && rate !== '' && ratePercent >= 0 && Number.isInteger(term) && term >= 1
  const result = valid ? calculateLoan({ principal, annualRate: ratePercent / 100, months: term, method }) : undefined

  return (
    <>
      <h1>{text.loanTitle}</h1>

      <form className="salary-form" onSubmit={(e) => e.preventDefault()}>
        <MoneyField label={text.loanAmountLabel} value={principal} onChange={setPrincipal} locale={text.locale} />
        <div className="field">
          <label htmlFor={rateId}>{text.rateLabel}</label>
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
          <label htmlFor={termId}>{text.termLabel}</label>
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
          <label htmlFor={methodId}>{text.methodLabel}</label>
          <select id={methodId} value={method} onChange={(e) => setMethod(e.target.value as LoanMethod)}>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {text.methodNames[m]}
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
                <ResultRow label={text.firstPayment} value={money.format(result.firstPayment)} />
                <ResultRow label={text.totalInterest} value={money.format(result.totalInterest)} />
                <ResultRow label={text.totalPayment} value={money.format(result.totalPayment)} total />
              </tbody>
            </table>
          </section>
          <section>
            <h2>{text.scheduleHeading}</h2>
            <div className="table-scroll">
              <table className="schedule">
                <thead>
                  <tr>
                    <th scope="col">{text.colMonth}</th>
                    <th scope="col">{text.colInterest}</th>
                    <th scope="col">{text.colPrincipal}</th>
                    <th scope="col">{text.colPayment}</th>
                    <th scope="col">{text.colBalance}</th>
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
          <p className="hint">{text.loanDisclaimer}</p>
        </div>
      ) : (
        <p className="hint">{text.enterLoan}</p>
      )}
    </>
  )
}
