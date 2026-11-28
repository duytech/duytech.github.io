import { useId, useState } from 'react'
import { MoneyField } from '../components/MoneyField.tsx'
import { ResultRow } from '../components/ResultRow.tsx'
import { TaxBracketTable } from '../components/TaxBracketTable.tsx'
import { useText } from '../i18n.ts'
import {
  EFFECTIVE_FROM,
  EMPLOYEE_RATES,
  EMPLOYER_RATES,
  calculateNetSalary,
  type Region,
} from '../salary.ts'

const REGIONS: Region[] = [1, 2, 3, 4]
const MAX_DEPENDENTS = 20

export function SalaryPage() {
  const text = useText()
  const regionId = useId()
  const dependentsId = useId()
  const [gross, setGross] = useState<number | undefined>()
  const [insuranceBase, setInsuranceBase] = useState<number | undefined>()
  const [region, setRegion] = useState<Region>(1)
  const [dependents, setDependents] = useState(0)
  const [allInclusive, setAllInclusive] = useState(false)

  const money = new Intl.NumberFormat(text.locale, { style: 'currency', currency: 'VND' })
  const percent = new Intl.NumberFormat(text.locale, { style: 'percent', maximumFractionDigits: 1 })
  const date = new Intl.DateTimeFormat(text.locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${EFFECTIVE_FROM}T00:00:00`),
  )
  // All-inclusive: employer insurance is already inside gross, so it is not added on top.
  const plus = allInclusive ? '' : '+'
  const result = gross ? calculateNetSalary({ gross, insuranceBase, region, dependents, allInclusive }) : undefined

  return (
    <>
      <h1>{text.salaryTitle}</h1>
      <p className="hint">
        {text.effectiveFrom} {date}
      </p>

      <form className="salary-form" onSubmit={(e) => e.preventDefault()}>
        <MoneyField label={text.grossLabel} value={gross} onChange={setGross} locale={text.locale} />
        <div className="field">
          <label htmlFor={regionId}>{text.regionLabel}</label>
          <select
            id={regionId}
            value={region}
            onChange={(e) => setRegion(Number(e.target.value) as Region)}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {text.regionNames[r - 1]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={dependentsId}>{text.dependentsLabel}</label>
          <input
            id={dependentsId}
            type="number"
            min={0}
            max={MAX_DEPENDENTS}
            step={1}
            value={dependents}
            onChange={(e) =>
              setDependents(Math.min(MAX_DEPENDENTS, Math.max(0, Math.floor(Number(e.target.value) || 0))))
            }
          />
        </div>
        <MoneyField
          label={text.insuranceBaseLabel}
          hint={text.insuranceBaseHint}
          value={insuranceBase}
          onChange={setInsuranceBase}
          locale={text.locale}
        />
        <div className="field checkbox-field">
          <label>
            <input type="checkbox" checked={allInclusive} onChange={(e) => setAllInclusive(e.target.checked)} />
            {text.allInclusiveLabel}
          </label>
        </div>
      </form>

      {result ? (
        <div className="salary-results" aria-live="polite">
          <section>
            <h2>{text.employeeHeading}</h2>
            <table>
              <tbody>
                <ResultRow label={text.gross} value={money.format(result.gross)} />
                <ResultRow label={`${text.bhxh} (${percent.format(EMPLOYEE_RATES.bhxh)})`} value={`−${money.format(result.employee.bhxh)}`} />
                <ResultRow label={`${text.bhyt} (${percent.format(EMPLOYEE_RATES.bhyt)})`} value={`−${money.format(result.employee.bhyt)}`} />
                <ResultRow label={`${text.bhtn} (${percent.format(EMPLOYEE_RATES.bhtn)})`} value={`−${money.format(result.employee.bhtn)}`} />
                {allInclusive && (
                  <ResultRow
                    label={`${text.employerInsurance} (${percent.format(EMPLOYER_RATES.bhxh + EMPLOYER_RATES.bhyt + EMPLOYER_RATES.bhtn)})`}
                    value={`−${money.format(result.employer.total)}`}
                  />
                )}
                <ResultRow label={text.deduction}value={money.format(result.deduction)} muted />
                <ResultRow label={text.taxableIncome} value={money.format(result.taxableIncome)} muted />
                <ResultRow label={text.tax} value={`−${money.format(result.tax)}`} />
                <ResultRow label={text.net} value={money.format(result.net)} total />
              </tbody>
            </table>
          </section>
          <TaxBracketTable brackets={result.taxBrackets} money={money} percent={percent} />
          <section>
            <h2>{text.employerHeading}</h2>
            <table>
              <tbody>
                <ResultRow label={text.gross} value={money.format(result.gross)} />
                <ResultRow label={`${text.bhxh} (${percent.format(EMPLOYER_RATES.bhxh)})`} value={`${plus}${money.format(result.employer.bhxh)}`} />
                <ResultRow label={`${text.bhyt} (${percent.format(EMPLOYER_RATES.bhyt)})`} value={`${plus}${money.format(result.employer.bhyt)}`} />
                <ResultRow label={`${text.bhtn} (${percent.format(EMPLOYER_RATES.bhtn)})`} value={`${plus}${money.format(result.employer.bhtn)}`} />
                <ResultRow label={text.employerCost} value={money.format(result.employerCost)} total />
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <p className="hint">{text.enterGross}</p>
      )}
    </>
  )
}
