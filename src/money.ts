// Max 13 digits keeps values far below Number.MAX_SAFE_INTEGER.
const MAX_DIGITS = 13

/** Reads a money amount typed by the user, ignoring separators and other characters. Empty → undefined. */
export function parseMoney(text: string): number | undefined {
  const digits = text.replace(/\D/g, '').slice(0, MAX_DIGITS)
  return digits ? Number(digits) : undefined
}

/** Formats an amount with the locale's thousands separator, for input fields. */
export function formatMoneyInput(value: number | undefined, locale: string): string {
  return value === undefined ? '' : new Intl.NumberFormat(locale).format(value)
}
