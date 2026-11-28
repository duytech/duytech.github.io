import { describe, expect, test } from 'vitest'
import { calculateCagr } from './cagr'

describe('calculateCagr', () => {
  test('doubling in 5 years is ~14.87% per year', () => {
    const r = calculateCagr(100_000_000, 200_000_000, 5)
    expect(r.cagr).toBeCloseTo(0.148698, 6)
    expect(r.totalGrowth).toBeCloseTo(1, 10)
  })

  test('no change is 0%', () => {
    expect(calculateCagr(100_000_000, 100_000_000, 3)).toEqual({ cagr: 0, totalGrowth: 0 })
  })

  test('halving in 2 years is ~-29.29% per year', () => {
    const r = calculateCagr(100_000_000, 50_000_000, 2)
    expect(r.cagr).toBeCloseTo(-0.292893, 6)
    expect(r.totalGrowth).toBeCloseTo(-0.5, 10)
  })

  test('losing everything is -100%', () => {
    expect(calculateCagr(100_000_000, 0, 4)).toEqual({ cagr: -1, totalGrowth: -1 })
  })

  test('fractional years', () => {
    expect(calculateCagr(100, 121, 2).cagr).toBeCloseTo(0.1, 10)
    expect(calculateCagr(100, 110, 0.5).cagr).toBeCloseTo(0.21, 10)
  })
})
