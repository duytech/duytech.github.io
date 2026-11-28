// Bank loan repayment schedule. Monthly rate = annual rate / 12, interest on the remaining balance.

/** reducing: fixed principal, declining interest. annuity: equal total payment every month. */
export type LoanMethod = 'reducing' | 'annuity'

export interface LoanInput {
  principal: number
  /** Annual rate as a fraction, e.g. 0.12 for 12%. */
  annualRate: number
  months: number
  method: LoanMethod
}

export interface LoanRow {
  month: number
  interest: number
  principal: number
  payment: number
  balance: number
}

export interface LoanResult {
  rows: LoanRow[]
  firstPayment: number
  totalInterest: number
  totalPayment: number
}

export function calculateLoan({ principal, annualRate, months, method }: LoanInput): LoanResult {
  const monthlyRate = annualRate / 12
  const fixedPrincipal = Math.round(principal / months)
  const annuity = monthlyRate === 0 ? fixedPrincipal : Math.round((principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months))

  const rows: LoanRow[] = []
  let balance = principal
  for (let month = 1; month <= months; month++) {
    const interest = Math.round(balance * monthlyRate)
    // Last month clears whatever rounding left over, so the balance ends at exactly 0.
    const paid =
      month === months ? balance : Math.min(balance, method === 'reducing' ? fixedPrincipal : annuity - interest)
    balance -= paid
    rows.push({ month, interest, principal: paid, payment: paid + interest, balance })
  }

  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0)
  return { rows, firstPayment: rows[0].payment, totalInterest, totalPayment: principal + totalInterest }
}
