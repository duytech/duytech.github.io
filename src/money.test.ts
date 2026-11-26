import { describe, expect, test } from 'vitest'
import { formatMoneyInput, parseMoney } from './money'

describe('parseMoney', () => {
  test.each([
    ['', undefined],
    ['abc', undefined],
    ['30000000', 30_000_000],
    ['30.000.000', 30_000_000],
    ['30,000,000', 30_000_000],
    ['-5', 5],
    ['0', 0],
    ['12345678901234567', 1_234_567_890_123],
  ])('%j → %j', (text, value) => {
    expect(parseMoney(text)).toBe(value)
  })
})

describe('formatMoneyInput', () => {
  test('uses locale separators', () => {
    expect(formatMoneyInput(30_000_000, 'vi-VN')).toBe('30.000.000')
    expect(formatMoneyInput(30_000_000, 'en-US')).toBe('30,000,000')
  })

  test('empty for undefined', () => {
    expect(formatMoneyInput(undefined, 'vi-VN')).toBe('')
  })

  test('round-trips through parseMoney', () => {
    expect(parseMoney(formatMoneyInput(1_234_567, 'vi-VN'))).toBe(1_234_567)
  })
})
