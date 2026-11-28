import { useText } from '../i18n.ts'
import type { TaxBracketRow } from '../salary.ts'

interface TaxBracketTableProps {
  brackets: TaxBracketRow[]
  money: Intl.NumberFormat
  percent: Intl.NumberFormat
}

export function TaxBracketTable({ brackets, money, percent }: TaxBracketTableProps) {
  const text = useText()
  if (brackets.length === 0) return null

  return (
    <section>
      <h2>{text.taxBracketsHeading}</h2>
      <div className="table-scroll">
        <table className="schedule">
          <thead>
            <tr>
              <th scope="col">{text.colLevel}</th>
              <th scope="col">{text.colBracketRange}</th>
              <th scope="col">{text.colRate}</th>
              <th scope="col">{text.colTaxedAmount}</th>
              <th scope="col">{text.colBracketTax}</th>
            </tr>
          </thead>
          <tbody>
            {brackets.map((bracket) => (
              <tr key={bracket.level}>
                <th scope="row">{bracket.level}</th>
                <td>
                  {bracket.lower === 0
                    ? `${text.upTo} ${money.format(bracket.upper)}`
                    : bracket.upper === Infinity
                      ? `${text.above} ${money.format(bracket.lower)}`
                      : `${money.format(bracket.lower)} – ${money.format(bracket.upper)}`}
                </td>
                <td>{percent.format(bracket.rate)}</td>
                <td>{money.format(bracket.taxedAmount)}</td>
                <td>{money.format(bracket.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
