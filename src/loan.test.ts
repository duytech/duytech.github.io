import { describe, expect, test } from 'vitest'
import { calculateLoan } from './loan'

// Expected values are worked out by hand.

describe('calculateLoan', () => {
  test('reducing: 120M, 12%/year, 12 months', () => {
    const result = calculateLoan({ principal: 120_000_000, annualRate: 0.12, months: 12, method: 'reducing' })
    expect(result.rows).toHaveLength(12)
    expect(result.firstPayment).toBe(11_200_000)
    expect(result.rows[11].payment).toBe(10_100_000)
    expect(result.totalInterest).toBe(7_800_000)
    expect(result.totalPayment).toBe(127_800_000)
    expect(result.rows[11].balance).toBe(0)
  })

  test('annuity: 100M, 12%/year, 12 months', () => {
    const result = calculateLoan({ principal: 100_000_000, annualRate: 0.12, months: 12, method: 'annuity' })
    expect(result.firstPayment).toBe(8_884_879)
    expect(result.rows[0].interest).toBe(1_000_000)
    // Equal payments, give or take rounding in the last month.
    for (const row of result.rows) expect(Math.abs(row.payment - 8_884_879)).toBeLessThanOrEqual(12)
    expect(result.rows[11].balance).toBe(0)
    expect(result.rows.reduce((sum, row) => sum + row.principal, 0)).toBe(100_000_000)
  })

  test.each(['reducing', 'annuity'] as const)('%s at 0%% splits principal evenly', (method) => {
    const result = calculateLoan({ principal: 10_000_000, annualRate: 0, months: 3, method })
    expect(result.rows.map((row) => row.payment)).toEqual([3_333_333, 3_333_333, 3_333_334])
    expect(result.totalInterest).toBe(0)
  })

  test('single month pays everything at once', () => {
    const result = calculateLoan({ principal: 50_000_000, annualRate: 0.12, months: 1, method: 'annuity' })
    expect(result.rows).toEqual([{ month: 1, interest: 500_000, principal: 50_000_000, payment: 50_500_000, balance: 0 }])
  })
})
