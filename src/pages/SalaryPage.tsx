import { useId, useState } from 'react'
import { MoneyField } from '../components/MoneyField.tsx'
import { ResultRow } from '../components/ResultRow.tsx'
import { useT } from '../i18n.ts'
import {
  EFFECTIVE_FROM,
  EMPLOYEE_RATES,
  EMPLOYER_RATES,
  calcNet,
  type Region,
} from '../salary.ts'

const REGIONS: Region[] = [1, 2, 3, 4]
const MAX_DEPENDENTS = 20

export function SalaryPage() {
  const t = useT()
  const regionId = useId()
  const dependentsId = useId()
  const [gross, setGross] = useState<number | undefined>()
  const [insuranceBase, setInsuranceBase] = useState<number | undefined>()
  const [region, setRegion] = useState<Region>(1)
  const [dependents, setDependents] = useState(0)

  const money = new Intl.NumberFormat(t.locale, { style: 'currency', currency: 'VND' })
  const percent = new Intl.NumberFormat(t.locale, { style: 'percent', maximumFractionDigits: 1 })
  const date = new Intl.DateTimeFormat(t.locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${EFFECTIVE_FROM}T00:00:00`),
  )
  const result = gross ? calcNet({ gross, insuranceBase, region, dependents }) : undefined

  return (
    <>
      <h1>{t.salaryTitle}</h1>
      <p className="hint">
        {t.effectiveFrom} {date}
      </p>

      <form className="salary-form" onSubmit={(e) => e.preventDefault()}>
        <MoneyField label={t.grossLabel} value={gross} onChange={setGross} locale={t.locale} />
        <div className="field">
          <label htmlFor={regionId}>{t.regionLabel}</label>
          <select
            id={regionId}
            value={region}
            onChange={(e) => setRegion(Number(e.target.value) as Region)}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {t.regionNames[r - 1]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={dependentsId}>{t.dependentsLabel}</label>
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
          label={t.insuranceBaseLabel}
          hint={t.insuranceBaseHint}
          value={insuranceBase}
          onChange={setInsuranceBase}
          locale={t.locale}
        />
      </form>

      {result ? (
        <div className="salary-results" aria-live="polite">
          <section>
            <h2>{t.employeeHeading}</h2>
            <table>
              <tbody>
                <ResultRow label={t.gross} value={money.format(result.gross)} />
                <ResultRow label={`${t.bhxh} (${percent.format(EMPLOYEE_RATES.bhxh)})`} value={`−${money.format(result.employee.bhxh)}`} />
                <ResultRow label={`${t.bhyt} (${percent.format(EMPLOYEE_RATES.bhyt)})`} value={`−${money.format(result.employee.bhyt)}`} />
                <ResultRow label={`${t.bhtn} (${percent.format(EMPLOYEE_RATES.bhtn)})`} value={`−${money.format(result.employee.bhtn)}`} />
                <ResultRow label={t.deduction} value={money.format(result.deduction)} muted />
                <ResultRow label={t.taxableIncome} value={money.format(result.taxableIncome)} muted />
                <ResultRow label={t.tax} value={`−${money.format(result.tax)}`} />
                <ResultRow label={t.net} value={money.format(result.net)} total />
              </tbody>
            </table>
          </section>
          <section>
            <h2>{t.employerHeading}</h2>
            <table>
              <tbody>
                <ResultRow label={t.gross} value={money.format(result.gross)} />
                <ResultRow label={`${t.bhxh} (${percent.format(EMPLOYER_RATES.bhxh)})`} value={`+${money.format(result.employer.bhxh)}`} />
                <ResultRow label={`${t.bhyt} (${percent.format(EMPLOYER_RATES.bhyt)})`} value={`+${money.format(result.employer.bhyt)}`} />
                <ResultRow label={`${t.bhtn} (${percent.format(EMPLOYER_RATES.bhtn)})`} value={`+${money.format(result.employer.bhtn)}`} />
                <ResultRow label={t.employerCost} value={money.format(result.employerCost)} total />
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <p className="hint">{t.enterGross}</p>
      )}
    </>
  )
}
