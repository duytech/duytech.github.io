import { describe, expect, test } from 'vitest'
import { calcNet, calcPit } from './salary'

// Expected values are worked out by hand from the rules in salary.ts (effective 01/07/2026).

describe('calcPit', () => {
  test.each([
    [0, 0],
    [-1, 0],
    [10_000_000, 500_000],
    [11_350_000, 635_000],
    [30_000_000, 2_500_000],
    [100_000_000, 20_500_000],
    [101_000_000, 20_850_000],
  ])('taxable %i → %i', (taxable, tax) => {
    expect(calcPit(taxable)).toBe(tax)
  })
})

describe('calcNet', () => {
  test('15M, no dependents: below deduction, no tax', () => {
    const r = calcNet({ gross: 15_000_000, region: 1, dependents: 0 })
    expect(r.employee.total).toBe(1_575_000)
    expect(r.taxableIncome).toBe(0)
    expect(r.tax).toBe(0)
    expect(r.net).toBe(13_425_000)
  })

  test('30M, no dependents', () => {
    const r = calcNet({ gross: 30_000_000, region: 1, dependents: 0 })
    expect(r.employee).toEqual({ bhxh: 2_400_000, bhyt: 450_000, bhtn: 300_000, total: 3_150_000 })
    expect(r.deduction).toBe(15_500_000)
    expect(r.taxableIncome).toBe(11_350_000)
    expect(r.tax).toBe(635_000)
    expect(r.net).toBe(26_215_000)
  })

  test('30M, 1 dependent', () => {
    const r = calcNet({ gross: 30_000_000, region: 1, dependents: 1 })
    expect(r.deduction).toBe(21_700_000)
    expect(r.tax).toBe(257_500)
    expect(r.net).toBe(26_592_500)
  })

  test('120M: insurance capped', () => {
    const r = calcNet({ gross: 120_000_000, region: 1, dependents: 0 })
    // BHXH + BHYT on 50.6M cap, BHTN on 20 × 5.31M = 106.2M cap
    expect(r.employee).toEqual({ bhxh: 4_048_000, bhyt: 759_000, bhtn: 1_062_000, total: 5_869_000 })
    expect(r.taxableIncome).toBe(98_631_000)
    expect(r.tax).toBe(20_089_300)
    expect(r.net).toBe(94_041_700)
  })

  test('30M: employer contributions 21.5%', () => {
    const r = calcNet({ gross: 30_000_000, region: 1, dependents: 0 })
    expect(r.employer).toEqual({ bhxh: 5_250_000, bhyt: 900_000, bhtn: 300_000, total: 6_450_000 })
    expect(r.employerCost).toBe(36_450_000)
  })

  test('120M: employer contributions capped', () => {
    const r = calcNet({ gross: 120_000_000, region: 1, dependents: 0 })
    expect(r.employer.total).toBe(11_435_000)
    expect(r.employerCost).toBe(131_435_000)
  })

  test('separate insurance base lower than gross', () => {
    const r = calcNet({ gross: 30_000_000, insuranceBase: 10_000_000, region: 1, dependents: 0 })
    expect(r.employee.total).toBe(1_050_000)
    expect(r.taxableIncome).toBe(13_450_000)
    expect(r.tax).toBe(845_000)
    expect(r.net).toBe(28_105_000)
    expect(r.employer.total).toBe(2_150_000)
  })

  test('unemployment insurance cap depends on region', () => {
    const bhtn = (region: 1 | 2 | 3 | 4) =>
      calcNet({ gross: 120_000_000, region, dependents: 0 }).employee.bhtn
    expect(bhtn(1)).toBe(1_062_000)
    expect(bhtn(2)).toBe(946_000)
    expect(bhtn(3)).toBe(828_000)
    expect(bhtn(4)).toBe(740_000)
  })

  test('gross 0', () => {
    const r = calcNet({ gross: 0, region: 1, dependents: 0 })
    expect(r.employee.total).toBe(0)
    expect(r.tax).toBe(0)
    expect(r.net).toBe(0)
    expect(r.employerCost).toBe(0)
  })

  test('negative inputs treated as 0', () => {
    const r = calcNet({ gross: -5, insuranceBase: -1, region: 1, dependents: -2 })
    expect(r.net).toBe(0)
    expect(r.deduction).toBe(15_500_000)
  })

  test('amounts are whole dong', () => {
    const r = calcNet({ gross: 12_345_678, region: 2, dependents: 0 })
    for (const v of [r.employee.bhxh, r.employee.bhyt, r.employee.bhtn, r.tax, r.net, r.employerCost]) {
      expect(Number.isInteger(v)).toBe(true)
    }
  })
})
