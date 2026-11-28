// Compound growth rate per period (year, month, week, ...). Caller validates: startValue > 0, endValue >= 0, periods > 0.

export interface CagrResult {
  /** Fraction, e.g. 0.1487 for 14.87% per period. */
  cagr: number
  /** Fraction, growth over all periods. */
  totalGrowth: number
}

export function calculateCagr(startValue: number, endValue: number, periods: number): CagrResult {
  const ratio = endValue / startValue
  return { cagr: ratio ** (1 / periods) - 1, totalGrowth: ratio - 1 }
}
