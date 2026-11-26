import { useId } from 'react'
import { formatMoneyInput, parseMoney } from '../money.ts'

interface MoneyFieldProps {
  label: string
  hint?: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  locale: string
}

export function MoneyField({ label, hint, value, onChange, locale }: MoneyFieldProps) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={formatMoneyInput(value, locale)}
        onChange={(e) => onChange(parseMoney(e.target.value))}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <small id={`${id}-hint`} className="hint">
          {hint}
        </small>
      )}
    </div>
  )
}
