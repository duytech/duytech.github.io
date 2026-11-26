interface ResultRowProps {
  label: string
  value: string
  total?: boolean
  muted?: boolean
}

export function ResultRow({ label, value, total, muted }: ResultRowProps) {
  return (
    <tr className={total ? 'total' : muted ? 'muted' : undefined}>
      <th scope="row">{label}</th>
      <td>{value}</td>
    </tr>
  )
}
