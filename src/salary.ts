// Vietnam monthly salary Gross → Net. Rules effective from 01/07/2026.
// Update the constants below when the law changes.

export const EFFECTIVE_FROM = '2026-07-01'

/** Lương cơ sở (Decree 161/2026). Social and health insurance are capped at 20× this. */
export const BASE_SALARY = 2_530_000

export type Region = 1 | 2 | 3 | 4

/** Regional minimum wage (Decree 293/2025). Unemployment insurance is capped at 20× this. */
export const REGION_MIN_WAGE: Record<Region, number> = {
  1: 5_310_000,
  2: 4_730_000,
  3: 4_140_000,
  4: 3_700_000,
}

export const INSURANCE_CAP_MULTIPLIER = 20

/** Family deductions (Resolution 110/2025). */
export const SELF_DEDUCTION = 15_500_000
export const DEPENDENT_DEDUCTION = 6_200_000

export const EMPLOYEE_RATES = { bhxh: 0.08, bhyt: 0.015, bhtn: 0.01 }
/** BHXH 17.5% = retirement/survivorship 14% + sickness/maternity 3% + occupational accident 0.5%. */
export const EMPLOYER_RATES = { bhxh: 0.175, bhyt: 0.03, bhtn: 0.01 }

/** Monthly PIT brackets: [upper bound of taxable income, rate]. */
export const TAX_BRACKETS: ReadonlyArray<readonly [number, number]> = [
  [10_000_000, 0.05],
  [30_000_000, 0.1],
  [60_000_000, 0.2],
  [100_000_000, 0.3],
  [Infinity, 0.35],
]

export interface SalaryInput {
  gross: number
  /** Salary used for insurance contributions; defaults to gross. */
  insuranceBase?: number
  region: Region
  dependents: number
}

export interface Insurance {
  bhxh: number
  bhyt: number
  bhtn: number
  total: number
}

export interface SalaryResult {
  gross: number
  employee: Insurance
  deduction: number
  taxableIncome: number
  tax: number
  net: number
  employer: Insurance
  employerCost: number
}

/** Progressive PIT on monthly taxable income. */
export function calcPit(taxableIncome: number): number {
  let tax = 0
  let lower = 0
  for (const [upper, rate] of TAX_BRACKETS) {
    if (taxableIncome <= lower) break
    tax += (Math.min(taxableIncome, upper) - lower) * rate
    lower = upper
  }
  return Math.round(tax)
}

function insurance(base: number, region: Region, rates: typeof EMPLOYEE_RATES): Insurance {
  const socialBase = Math.min(base, INSURANCE_CAP_MULTIPLIER * BASE_SALARY)
  const unemploymentBase = Math.min(base, INSURANCE_CAP_MULTIPLIER * REGION_MIN_WAGE[region])
  const bhxh = Math.round(socialBase * rates.bhxh)
  const bhyt = Math.round(socialBase * rates.bhyt)
  const bhtn = Math.round(unemploymentBase * rates.bhtn)
  return { bhxh, bhyt, bhtn, total: bhxh + bhyt + bhtn }
}

export function calcNet({ gross, insuranceBase, region, dependents }: SalaryInput): SalaryResult {
  // Inputs come from a form: treat negatives as 0 and dependents as a whole number.
  gross = Math.max(0, gross)
  const base = Math.max(0, insuranceBase ?? gross)
  const deps = Math.max(0, Math.floor(dependents))

  const employee = insurance(base, region, EMPLOYEE_RATES)
  const deduction = SELF_DEDUCTION + deps * DEPENDENT_DEDUCTION
  const taxableIncome = Math.max(0, gross - employee.total - deduction)
  const tax = calcPit(taxableIncome)
  const employer = insurance(base, region, EMPLOYER_RATES)

  return {
    gross,
    employee,
    deduction,
    taxableIncome,
    tax,
    net: gross - employee.total - tax,
    employer,
    employerCost: gross + employer.total,
  }
}
