// Compound annual growth rate. Caller validates: startValue > 0, endValue >= 0, years > 0.

export interface CagrResult {
  /** Fraction, e.g. 0.1487 for 14.87% per year. */
  cagr: number
  /** Fraction, growth over the whole period. */
  totalGrowth: number
}

export function calculateCagr(startValue: number, endValue: number, years: number): CagrResult {
  const ratio = endValue / startValue
  return { cagr: ratio ** (1 / years) - 1, totalGrowth: ratio - 1 }
}
